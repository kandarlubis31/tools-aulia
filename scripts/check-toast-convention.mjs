#!/usr/bin/env node
/**
 * check-toast-convention
 * Guardrail: `window._tToast(...)` hanya menerima SATU argumen.
 *
 * Latar belakang: pola legacy `showToast?.(_tToast?.('TEKS ID', 'EN fallback'), type)`
 * memakai `_tToast` dengan DUA argumen. Padahal `_tToast` = lookup phrase map
 * (public/i18n-phrases.js) yang cuma ID->EN exact-match — argumen kedua
 * DIBUANG diam-diam, jadi string EN yang ditulis manual tidak pernah dipakai.
 * Pola ini sering juga tanpa prefix `window.` (langgar Keputusan #17).
 *
 * Konvensi bener:
 *   window.showToast?.(window._tToast ? window._tToast('TEKS ID') : 'EN fallback', type)
 * atau lewat helper lokal `toast(msg, type)`.
 *
 * Deteksi: pola regresi selalu berbentuk dua literal string berturut-turut,
 * `_tToast?.( 'ID' , 'EN' )`. Dicek lewat regex sempit (bukan hitung comma manual)
 * supaya call satu-argumen yang argumennya template literal bersarang — mis.
 *   _tToast(`${n} file${m > 0 ? `, ${m} gagal` : ''}!`)
 * — tidak ikut ke-flag sebagai false positive.
 *
 * Usage: node scripts/check-toast-convention.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SRC = join(root, 'src');

// `_tToast(` (_or_ `_tToast?.(`) diikuti literal string, koma, lalu literal string lagi.
const BAD_CALL_RE = /_tToast\s*(?:\?\.)?\s*\(\s*['"`][^'"`]*['"`]\s*,\s*['"`]/g;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(astro|ts|js|mjs)$/.test(entry) && !/\.test\./.test(entry)) out.push(p);
  }
  return out;
}

// Range [start, end) string & komentar — match di dalamnya bukan kode nyata.
function deadZones(code) {
  const zones = [];
  let i = 0;
  while (i < code.length) {
    const c = code[i];
    const n = code[i + 1];
    if (c === '/' && n === '/') {
      const start = i;
      while (i < code.length && code[i] !== '\n') i++;
      zones.push([start, i]);
    } else if (c === '/' && n === '*') {
      const start = i;
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i += 2;
      zones.push([start, i]);
    } else if (c === '"' || c === "'" || c === '`') {
      const start = i;
      const q = c;
      i++;
      while (i < code.length) {
        if (code[i] === '\\') i += 2;
        else if (code[i] === q) { i++; break; }
        else i++;
      }
      zones.push([start, i]);
    } else {
      i++;
    }
  }
  return zones;
}

let issues = 0;
const files = walk(SRC);

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const zones = deadZones(src);
  const isDead = (idx) => zones.some(([s, e]) => idx >= s && idx < e);
  const rel = relative(root, file);

  BAD_CALL_RE.lastIndex = 0;
  let m;
  while ((m = BAD_CALL_RE.exec(src)) !== null) {
    if (isDead(m.index)) continue;
    const line = src.slice(0, m.index).split('\n').length;
    console.error(`❌ ${rel}:${line} — _tToast(...) dipanggil dengan 2 argumen string.`);
    console.error("   _tToast HANYA terima 1 argumen; argumen EN kedua dibuang. Pakai: window.showToast?.(window._tToast ? window._tToast('TEKS ID') : 'EN fallback', type).");
    issues++;
  }
}

if (issues > 0) {
  console.error(`\n${issues} pelanggaran konvensi toast ditemukan.`);
  process.exit(1);
}

console.log(`✅ Toast convention OK — ${files.length} file dicek, 0 pola _tToast 2-argumen.`);
