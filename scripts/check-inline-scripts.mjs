#!/usr/bin/env node
/**
 * check-inline-scripts
 * Guardrail: pastikan TIDAK ada TypeScript / syntax invalid di <script> yang dikirim
 * MENTAH ke browser. Gagal (exit 1) kalau ada — dijalankan otomatis di `prebuild`.
 *
 * Latar belakang: Astro HANYA memproses (bundle + strip TS via esbuild) <script> yang
 * TANPA atribut. Script dengan atribut apa pun (is:inline, type="module", id, dst.)
 * di-emit mentah ke HTML — kalau isinya TS syntax (`as`-cast, non-null `!`, param type,
 * dst.) → SyntaxError di browser → tool mati diam-diam.
 *
 * Regresi Aug 2026 yang ditangkap guardrail ini: html-to-img, certificate, 7 halaman PDF
 * (`<script type="module">` + `await import('pdf-lib')`), prabowo-countdown.
 *
 * Usage: node scripts/check-inline-scripts.mjs [dir]   (default: src/)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const TARGET = process.argv[2] ? join(root, process.argv[2]) : join(root, 'src');

// esbuild tersedia (via vite) — parser JS akurat dengan posisi error. Fallback ke vm.Script.
let transformSync = null;
try {
  ({ transformSync } = await import('esbuild'));
} catch {
  transformSync = (code, { format }) => {
    if (format === 'esm') {
      // vm tidak support top-level await/import untuk module — validasi manual TS-ism
      const TS_PATTERNS = [
        { re: /\bas (any|unknown|never|string|number|boolean|[A-Z][A-Za-z0-9_]*)\b/, label: 'as-cast' },
        { re: /![;\),\\.]/, label: 'non-null assertion (!)' },
        { re: /\([a-zA-Z_$]+: [A-Za-z][A-Za-z0-9_]*[,)]/, label: 'parameter type annotation' },
        { re: /const [a-zA-Z_$]+: [A-Za-z][A-Za-z0-9_]*\b/, label: 'variable type annotation' },
      ];
      for (const { re, label } of TS_PATTERNS) {
        if (re.test(code)) throw new Error(`TS syntax terdeteksi: ${label}`);
      }
    } else {
      new Script(code); // throw SyntaxError untuk TS/JS invalid
    }
  };
}

const SKIP_TYPES = new Set([
  'text/template', 'text/x-template', 'text/html', 'text/plain', 'application/json',
  'application/ld+json', 'importmap', 'speculationrules',
]);

const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;

// Kumpulkan range [start, end) dari string literal & komentar. Dipakai untuk melewati
// match regex yang kebetulan jatuh di dalam teks/string, bukan kode nyata.
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

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.astro')) out.push(p);
  }
  return out;
}

let checked = 0;
let issues = 0;

for (const file of walk(TARGET)) {
  const src = readFileSync(file, 'utf8');
  SCRIPT_RE.lastIndex = 0;
  let m;
  while ((m = SCRIPT_RE.exec(src)) !== null) {
    const attrs = m[1] || '';
    const content = m[2];

    // External script (src=...) → bukan inline, tidak dicek
    if (/\bsrc\s*=/.test(attrs)) continue;

    const typeMatch = /type\s*=\s*["']([^"']*)["']/.exec(attrs);
    const type = typeMatch ? typeMatch[1].toLowerCase() : '';
    if (SKIP_TYPES.has(type)) continue; // template/data blok, bukan JS

    // Tanpa atribut → diproses Astro + esbuild → TS aman di-strip
    if (attrs.trim() === '') continue;

    // Script beratribut → dikirim MENTAH ke browser → harus murni JS
    checked++;
    const isModule = type === 'module';
    const blockLine = src.slice(0, m.index).split('\n').length;

    // Bare specifier (import('pdf-lib')) → browser inline script tidak bisa resolve
    // (regresi 7 halaman PDF). Remote URL / relative path aman.
    // Match dijalankan di kode asli; match yang jatuh di dalam string/komentar
    // dilewati → hindari false positive ("copy from 'x'" dst) tanpa kehilangan specifier.
    const zones = deadZones(content);
    const BARE_IMPORT_RE = /\bimport\s*\(\s*["']([^"']+)["']/g;
    let im;
    while ((im = BARE_IMPORT_RE.exec(content)) !== null) {
      if (zones.some(([s, e]) => im.index >= s && im.index < e)) continue;
      const spec = im[1];
      if (/^[./]/.test(spec) || /^\//.test(spec) || /^[a-z]+:\/\//i.test(spec)) continue;
      issues++;
      const blockLineNo = src.slice(0, m.index).split('\n').length + content.slice(0, im.index).split('\n').length - 1;
      console.error(`❌ ${relative(root, file)}:${blockLineNo} [${attrs.trim()}]`);
      console.error(`   Bare import specifier "${spec}" — browser inline script tidak bisa resolve. Pakai <script> polos (biar dibundle) atau URL/relative path.`);
    }

    try {
      transformSync(content, { loader: 'js', format: isModule ? 'esm' : 'iife' });
    } catch (err) {
      // esbuild bisa kumpulkan semua parse error sekaligus → lapor semuanya
      const errors = Array.isArray(err?.errors) && err.errors.length ? err.errors : [{ message: err?.message }];
      for (const e of errors) {
        issues++;
        const loc = e?.location;
        const line = blockLine + (loc?.line ? loc.line - 1 : 0);
        const msg = (loc?.lineText || e?.message || String(err)).split('\n')[0];
        console.error(`❌ ${relative(root, file)}:${line} [${attrs.trim()}]`);
        console.error(`   ${msg.trim()}`);
      }
    }
  }
}

if (issues > 0) {
  console.error(`\n${issues} masalah di script non-processed (syntax invalid/TypeScript/bare import).`);
  console.error('Aturan: Astro hanya bundle <script> TANPA atribut. Hapus atribut (biar diproses)');
  console.error('atau tulis murni JavaScript di script is:inline.');
  process.exit(1);
}

console.log(`✅ Inline scripts OK — ${checked} blok non-processed dicek, 0 TS/invalid syntax.`);
