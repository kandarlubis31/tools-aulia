#!/usr/bin/env node
/**
 * woff-to-ttf
 * Konversi font WOFF → TTF (unpack sfnt tables + inflate).
 *
 * Kenapa: @resvg/resvg-js (OG image generator) tidak bisa memuat font WOFF,
 * hanya TTF/OTF. Font Inter di src/assets/fonts/ disimpan sebagai .woff untuk
 * website, tapi OG generator butuh versi .ttf.
 *
 * Usage: node scripts/woff-to-ttf.mjs <input.woff> <output.ttf> [<input2.woff> <output2.ttf> ...]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

function tableChecksum(data) {
  const padded = Buffer.alloc(Math.ceil(data.length / 4) * 4);
  data.copy(padded);
  let sum = 0;
  for (let i = 0; i < padded.length; i += 4) sum = (sum + padded.readUInt32BE(i)) >>> 0;
  return sum;
}

function woffToTtf(woffPath, ttfPath) {
  const buf = readFileSync(woffPath);
  if (buf.toString('ascii', 0, 4) !== 'wOFF') throw new Error(`${woffPath} bukan file WOFF`);
  const flavor = buf.readUInt32BE(4);
  const numTables = buf.readUInt16BE(12);

  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const off = 44 + i * 20;
    const tag = buf.toString('ascii', off, off + 4);
    const offset = buf.readUInt32BE(off + 4);
    const compLength = buf.readUInt32BE(off + 8);
    const origLength = buf.readUInt32BE(off + 12);
    const data =
      compLength === origLength
        ? Buffer.from(buf.subarray(offset, offset + compLength))
        : inflateSync(buf.subarray(offset, offset + compLength));
    tables.push({ tag, data });
  }

  // TTF mewajibkan tabel terurut berdasarkan tag
  tables.sort((a, b) => (a.tag < b.tag ? -1 : 1));

  const num = tables.length;
  const entrySelector = Math.floor(Math.log2(num));
  const searchRange = 2 ** entrySelector * 16;
  const rangeShift = num * 16 - searchRange;

  let offset = 12 + num * 16;
  const records = tables.map((t) => {
    const rec = { tag: t.tag, checksum: tableChecksum(t.data), offset, length: t.data.length };
    offset += Math.ceil(t.data.length / 4) * 4;
    return rec;
  });

  const out = Buffer.alloc(offset);
  out.writeUInt32BE(flavor, 0);
  out.writeUInt16BE(num, 4);
  out.writeUInt16BE(searchRange, 6);
  out.writeUInt16BE(entrySelector, 8);
  out.writeUInt16BE(rangeShift, 10);
  for (let i = 0; i < num; i++) {
    const r = 12 + i * 16;
    out.write(tables[i].tag, r, 'ascii');
    out.writeUInt32BE(records[i].checksum, r + 4);
    out.writeUInt32BE(records[i].offset, r + 8);
    out.writeUInt32BE(records[i].length, r + 12);
    tables[i].data.copy(out, records[i].offset);
  }

  writeFileSync(ttfPath, out);
  console.log(`✅ ${woffPath} → ${ttfPath} (${out.length} bytes)`);
}

const pairs = process.argv.slice(2);
if (pairs.length === 0 || pairs.length % 2 !== 0) {
  console.error('Usage: node scripts/woff-to-ttf.mjs <input.woff> <output.ttf> [...]');
  process.exit(1);
}
for (let i = 0; i < pairs.length; i += 2) woffToTtf(pairs[i], pairs[i + 1]);
