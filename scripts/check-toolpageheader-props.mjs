#!/usr/bin/env node
/**
 * check-toolpageheader-props
 * Guardrail: cegah regresi prop ToolPageHeader.
 *
 * Latar belakang (Oct 7, 2026): 49 halaman memakai `<ToolPageHeader description="…">`
 * — padahal interface Props komponen hanya punya `desc`. Prop asing diabaikan Astro
 * tanpa error → deskripsi tool TIDAK PERNAH tampil di HTML hasil build (hilang untuk
 * pengguna + meta description kosong). Sama kelasnya dengan bug `BaseLayout title=`
 * (lihat check-baselayout-props.mjs). Tidak ketangkap build karena Astro hanya
 * mengecek tipe saat `astro check` (dan TS 7 belum mendukungnya).
 *
 * Parser quote-aware: nilai atribut (mis. icon='<path d="M12 2>4"/>') boleh
 * mengandung karakter `>`, jadi tag tidak dipotong di `>` sembarangan.
 *
 * Usage: node scripts/check-toolpageheader-props.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SRC = join(root, 'src', 'pages');

// interface Props ToolPageHeader (src/components/ToolPageHeader.astro)
const ALLOWED = new Set(['title', 'desc', 'icon', 'gradient', 'titleKey', 'descKey']);

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.astro')) files.push(p);
  }
})(SRC);

function toolPageHeaderTags(src) {
  const tags = [];
  let idx = 0;
  while ((idx = src.indexOf('<ToolPageHeader', idx)) !== -1) {
    let i = idx + '<ToolPageHeader'.length;
    let quote = null;
    for (; i < src.length; i++) {
      const c = src[i];
      if (quote) { if (c === quote) quote = null; }
      else if (c === '"' || c === "'") quote = c;
      else if (c === '>') break;
    }
    tags.push(src.slice(idx, i + 1));
    idx = i + 1;
  }
  return tags;
}

let issues = 0;

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const rel = relative(root, file);

  for (const tag of toolPageHeaderTags(src)) {
    // Buang nilai atribut berkuot dulu supaya `x=`/`d=` di dalam nilai (mis. icon='<path d="…"/>')
    // tidak ikut terbaca sebagai nama prop.
    const clean = tag.replace(/"[^"]*"|'[^']*'/g, '""');
    const props = [...clean.matchAll(/(?:^|\s)([A-Za-z][A-Za-z0-9-]*)=/g)].map(m => m[1]);
    for (const prop of props) {
      if (ALLOWED.has(prop)) continue;
      const hint = prop === 'description' ? ' — pakai `desc=`' : ' — prop tidak ada di Props';
      console.error(`❌ ${rel} — <ToolPageHeader ${prop}=…>${hint}`);
      issues++;
    }
  }
}

if (issues > 0) {
  console.error(`\n${issues} masalah prop ToolPageHeader ditemukan.`);
  console.error('ToolPageHeader hanya menerima: title, desc, icon, gradient, titleKey, descKey.');
  process.exit(1);
}

console.log(`✅ ToolPageHeader props OK — ${files.length} halaman dicek, tidak ada prop tidak dikenal.`);
