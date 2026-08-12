#!/usr/bin/env node
/**
 * check-critical-css
 * Guardrail: pastikan src/styles/critical.css (inline above-the-fold CSS) tetap
 * sinkron dengan src/styles/global.css + tailwind.config.mjs. Drift di sini =
 * FOUC / layout shift yang justru mau dihilangkan oleh critical CSS.
 *
 * Checks:
 * 1. CSS variables (:root + .dark) — global.css vs critical.css harus identik.
 * 2. .card-grid breakpoints (base + @media min-width) — harus identik.
 * 3. Nilai warna matte/surface yang di-hardcode di utility critical.css
 *    (.text/.bg/.border-matte-N, .bg/.border-surface-K) harus sama dengan
 *    var --matte-N / --surface-K di global.css. (Override .dark yang disengaja
 *    dilewati karena diawali `.dark ` — bukan selector utilitas murni.)
 * 4. Palette tailwind.config.mjs (matte.*, surface.*) harus sinkron dengan
 *    var global.css (:root).
 *
 * Usage: node scripts/check-critical-css.mjs
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const GLOBAL = join(root, 'src', 'styles', 'global.css');
const CRITICAL = join(root, 'src', 'styles', 'critical.css');
const CONFIG = join(root, 'tailwind.config.mjs');

// Normalisasi CRLF → LF + konsisten lowercase/whitespace
const read = (p) => readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const globalCss = read(GLOBAL);
const criticalCss = read(CRITICAL);

let issues = 0;
const fail = (msg) => { console.error(`❌ ${msg}`); issues++; };
const norm = (v) => String(v).trim().replace(/\s+/g, ' ').toLowerCase();

// ---- helpers ----

// Ekstrak `selector { --a: v; ... }` (hanya blok variabel: tanpa nested brace)
function extractVars(css, selector) {
  const sel = selector === '.dark' ? '\\.dark' : ':root';
  const re = new RegExp(sel + '\\s*\\{([^{}]*)\\}');
  const m = re.exec(css);
  if (!m) return {};
  const out = {};
  const pairRe = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let p;
  while ((p = pairRe.exec(m[1])) !== null) out[p[1]] = norm(p[2]);
  return out;
}

// Pecah css jadi daftar { px, body } untuk tiap `@media (min-width: Npx) { ... }`
// (brace-matching → aman untuk media block yang isinya banyak rule)
function mediaBlocks(css) {
  const results = [];
  const re = /@media\s*\(min-width:\s*(\d+)px\)\s*\{/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const openIdx = css.indexOf('{', m.index);
    let depth = 0;
    let closeIdx = -1;
    for (let i = openIdx; i < css.length; i++) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') { depth--; if (depth === 0) { closeIdx = i; break; } }
    }
    if (closeIdx > 0) results.push({ px: m[1], body: css.slice(openIdx + 1, closeIdx) });
  }
  return results;
}

// Map breakpoint -> jumlah kolom untuk `.card-grid` (base = tanpa media query)
function cardGridBreakpoints(css) {
  const map = {};
  const ruleRe = /\.card-grid\s*\{([^}]*)\}/g;
  let rm;
  while ((rm = ruleRe.exec(css)) !== null) {
    if (/display\s*:\s*grid/.test(rm[1])) {
      const c = /repeat\((\d+),\s*1fr\)/.exec(rm[1]);
      if (c) map.base = +c[1];
    }
  }
  for (const { px, body } of mediaBlocks(css)) {
    const gr = /\.card-grid\s*\{([^}]*)\}/.exec(body);
    if (!gr) continue;
    const c = /repeat\((\d+),\s*1fr\)/.exec(gr[1]);
    if (c) map[px] = +c[1];
  }
  return map;
}

// ---- Check 1: CSS variables sync ----
for (const sel of [':root', '.dark']) {
  const g = extractVars(globalCss, sel);
  const c = extractVars(criticalCss, sel);
  for (const k of new Set([...Object.keys(g), ...Object.keys(c)])) {
    if (!(k in c)) fail(`${sel} — var ${k} ada di global.css tapi HILANG di critical.css`);
    else if (!(k in g)) fail(`${sel} — var ${k} ada di critical.css tapi tidak ada di global.css`);
    else if (g[k] !== c[k]) fail(`${sel} — ${k}: global.css=${g[k]} vs critical.css=${c[k]}`);
  }
}

// ---- Check 2: .card-grid breakpoints ----
const bpGlobal = cardGridBreakpoints(globalCss);
const bpCritical = cardGridBreakpoints(criticalCss);
for (const k of new Set([...Object.keys(bpGlobal), ...Object.keys(bpCritical)])) {
  if (!(k in bpCritical)) fail(`.card-grid — breakpoint "${k}" (${bpGlobal[k]} kolom) ada di global.css tapi HILANG di critical.css`);
  else if (!(k in bpGlobal)) fail(`.card-grid — breakpoint "${k}" ada di critical.css tapi tidak di global.css`);
  else if (bpGlobal[k] !== bpCritical[k]) fail(`.card-grid — breakpoint "${k}": global.css=${bpGlobal[k]} kolom vs critical.css=${bpCritical[k]} kolom`);
}

// ---- Check 3: matte/surface utility hardcoded values vs var ----
const gRoot = extractVars(globalCss, ':root');
// `.text-matte-400 { color: #.. }`, `.bg-surface-elevated { ... }` — anchor ke awal baris
// supaya `.dark .text-matte-400` (override disengaja) tidak ikut terdeteksi.
const utilRe = /(?:^|\n)\s*(\.(?:text|bg|border)-((?:matte|surface)-[\w-]+))\s*\{([^}]*)\}/g;
let um;
while ((um = utilRe.exec(criticalCss)) !== null) {
  const cls = um[1];
  const token = um[2];
  const varName = `--${token}`;
  const expected = gRoot[varName];
  if (!expected) { fail(`${cls} — tidak ada var ${varName} di global.css :root`); continue; }
  const hex = /:\s*(#[0-9a-fA-F]{3,8})\b/.exec(um[3]);
  if (!hex) { fail(`${cls} — warna bukan hex (${um[3].trim()}) — tidak bisa diverifikasi`); continue; }
  if (norm(hex[1]) !== expected) fail(`${cls} — warna ${hex[1]} tidak cocok dengan ${varName} (${expected})`);
}

// ---- Check 4: tailwind.config.mjs palette -> global.css vars ----
let twColors = null;
try {
  const mod = await import(pathToFileURL(CONFIG).href);
  twColors = mod.default?.theme?.extend?.colors ?? {};
} catch (err) {
  fail(`tailwind.config.mjs gagal di-import: ${err.message}`);
}
if (twColors) {
  if (twColors.matte) {
    for (const [n, v] of Object.entries(twColors.matte)) {
      const expected = gRoot[`--matte-${n}`];
      if (!expected) fail(`--matte-${n} — ada di tailwind.config.mjs (${v}) tapi tidak di global.css :root`);
      else if (expected !== norm(v)) fail(`--matte-${n} — tailwind.config.mjs=${v} vs global.css=${expected}`);
    }
  }
  if (twColors.surface) {
    for (const [n, v] of Object.entries(twColors.surface)) {
      if (n === 'DEFAULT') continue; // global.css tidak punya var --surface (tanpa suffix)
      const expected = gRoot[`--surface-${n}`];
      if (!expected) fail(`--surface-${n} — ada di tailwind.config.mjs (${v}) tapi tidak di global.css :root`);
      else if (expected !== norm(v)) fail(`--surface-${n} — tailwind.config.mjs=${v} vs global.css=${expected}`);
    }
  }
}

if (issues > 0) {
  console.error(`\n${issues} drift ditemukan antara critical.css dan global.css / tailwind.config.mjs.`);
  console.error('Aturan: critical.css menyalin palette & breakpoint dari global.css + tailwind.config.mjs.');
  console.error('Kalau ganti warna/breakpoint di sumber, update critical.css juga (atau sebaliknya).');
  process.exit(1);
}
console.log('✅ Critical CSS sync OK — palette (:root/.dark), breakpoint .card-grid, matte/surface utilities, dan tailwind config sinkron.');
