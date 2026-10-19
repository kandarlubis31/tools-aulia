#!/usr/bin/env node
/**
 * audit-i18n
 * Audit progres W6 i18n per tool — hitung berapa halaman yang FULL
 * (guard autoBound + konvensi toast + ≥8 kunci i18n) vs total, plus
 * kandidat tool berikutnya (LOC terkecil yang belum FULL).
 *
 * Kriteria FULL mengikuti konvensi batch W6:
 *   - guard    : punya autoBound / `const __page = ` (anti double-bind SPA)
 *   - toastConv: helper `const toast = (msg…)` / pola direct _tToast
 *                (tanpa pola bare `showToast?.(`)
 *   - i18n     : ≥8 pemakaian (data-i18n + t('key'))
 *
 * Dulu bernama scripts/tmp-audit-baseline.mjs (harness lokal) — dipromosikan
 * biar bisa dipakai lintas sesi buat milih batch berikutnya.
 *
 * Usage: node scripts/audit-i18n.mjs
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const tools = [];
for (const dir of readdirSync('src/pages')) {
  const p = join('src/pages', dir);
  if (!statSync(p).isDirectory()) continue;
  for (const f of readdirSync(p)) {
    if (!f.endsWith('.astro')) continue;
    const src = readFileSync(join(p, f), 'utf8');
    const lines = src.split('\n').length;
    const guard = /dataset\.autoBound/.test(src) || /const __page = /.test(src);
    const helper = /const toast = \(msg|const toast = \(m[,:)]/.test(src);
    const direct = /_tToast \? window\._tToast/.test(src);
    const bare = /[^.\w]showToast\?\.\([^w]/.test(src) || /_tToast\?\.\(/.test(src);
    const toastConv = (helper || direct) && !bare;
    const i18nKeys = (src.match(/data-i18n/g) || []).length + (src.match(/(?<![\w-])t\('[a-z0-9_.]+'/g) || []).length;
    const hist = /useLocalHistory/.test(src);
    const full = guard && toastConv && i18nKeys >= 8;
    tools.push({ path: `${dir}/${f.replace('.astro', '')}`, lines, guard, toastConv, bare, i18nKeys, hist, full });
  }
}
const n = tools.length;
const full = tools.filter((t) => t.full).length;
console.log(`TOTAL ${n} | FULL ${full} (${Math.round((full / n) * 100)}%) | guard ${tools.filter((t) => t.guard).length} | toast ${tools.filter((t) => t.toastConv).length} | i18n>=8 ${tools.filter((t) => t.i18nKeys >= 8).length} | hist ${tools.filter((t) => t.hist).length}`);
const notFull = tools.filter((t) => !t.full).sort((a, b) => a.lines - b.lines);
console.log('\n--- Top 20 LOC terkecil belum full (kandidat batch) ---');
for (const t of notFull.slice(0, 20)) {
  console.log(`${String(t.lines).padStart(4)} ${t.path.padEnd(34)} guard=${t.guard ? 'Y' : 'N'} toast=${t.toastConv ? 'Y' : 'N'}${t.bare ? '(bare)' : ''} i18n=${t.i18nKeys} hist=${t.hist ? 'Y' : 'N'}`);
}
console.log(`\nGap: missing i18n ${tools.filter((t) => t.i18nKeys < 8).length}, missing toast ${tools.filter((t) => !t.toastConv).length}, missing guard ${tools.filter((t) => !t.guard).length}`);
