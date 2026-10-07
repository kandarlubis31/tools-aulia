#!/usr/bin/env node
/**
 * check-baselayout-props
 * Guardrail: cegah regresi prop BaseLayout.
 *
 * Latar belakang (Oct 4, 2026): 49 halaman memakai `<BaseLayout title="...">`
 * — padahal interface Props BaseLayout hanya punya `pageTitle`. Akibatnya
 * `pageTitle` undefined → `<title>undefined — Gratis & Offline | MasAul Tools</title>`
 * (rusak untuk SEO + tab browser), `meta[name="original-title"]` ikut undefined,
 * dan nama BreadcrumbList JSON-LD hilang. Tidak ketangkap build karena Astro
 * hanya mengecek tipe saat `astro check` (dan TS 7 belum mendukungnya).
 *
 * Juga mendeteksi prop mati `category=` / `toolHref=` (sisa API BaseLayout lama).
 *
 * Usage: node scripts/check-baselayout-props.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SRC = join(root, 'src', 'pages');

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.astro')) files.push(p);
  }
})(SRC);

let issues = 0;

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const rel = relative(root, file);

  // `<BaseLayout title=` → prop tidak dikenal, pageTitle jadi undefined
  if (/<BaseLayout\s+title=/.test(src)) {
    console.error(`❌ ${rel} — <BaseLayout title=…> (prop tidak ada). Pakai \`pageTitle=\`.`);
    issues++;
  }

  // Prop mati sisa API lama (tidak ada di interface Props BaseLayout)
  for (const prop of ['category', 'toolHref']) {
    if (new RegExp(`<BaseLayout[^>]*\\s${prop}=`).test(src)) {
      console.error(`❌ ${rel} — <BaseLayout ${prop}=…> (prop tidak ada, hapus).`);
      issues++;
    }
  }
}

if (issues > 0) {
  console.error(`\n${issues} masalah prop BaseLayout ditemukan.`);
  console.error('BaseLayout hanya menerima: pageTitle, description, ogImage, canonicalUrl, noIndex, pdfJs.');
  process.exit(1);
}

console.log(`✅ BaseLayout props OK — ${files.length} halaman dicek, tidak ada prop tidak dikenal.`);
