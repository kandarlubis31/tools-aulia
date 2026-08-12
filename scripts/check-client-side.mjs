#!/usr/bin/env node
/**
 * check-client-side
 * Pastikan ToolsAulia tetap 100% client-side (garansi inti project).
 *
 * - Scan seluruh src/ + astro.config.mjs untuk pola server-side.
 * - Gagal (exit 1) kalau ada pelanggaran — bisa dijalankan manual atau di CI.
 * - Satu-satunya pengecualian yang diizinkan: src/pages/api/proxy.ts
 *   (CORS forwarding-only, allowlist 6 domain, tidak menyentuh data user).
 *
 * Usage: node scripts/check-client-side.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SRC = join(root, 'src');

// Pattern per-line (tanpa flag g — aman dipakai berulang)
const PATTERNS = [
  { re: /import\.meta\.env\.SSR/, label: 'import.meta.env.SSR (server-only code)' },
  { re: /Astro\.locals/, label: 'Astro.locals (server runtime API)' },
  { re: /export const prerender\s*=\s*false/, label: 'prerender = false (serverless/SSR endpoint)' },
  { re: /['"]node:[a-z@/]/, label: "import 'node:*' (server-only module)" },
  { re: /Bun\.file|Deno\./, label: 'Bun/Deno runtime API (server-side)' },
  { re: /output\s*:\s*['"]server['"]/, label: 'output: "server" (SSR mode)' },
];

// File yang boleh punya pola server-side:
// 1. src/pages/api/proxy.ts — CORS forwarding-only (allowlist 6 domain, tidak menyentuh data user)
// 2. src/pages/og/[slug].png.ts — OG image generator: BUILD-TIME ONLY (prerender=true +
//    getStaticPaths). Merender PNG statis dari metadata tool, tidak pernah menyentuh data user.
const ALLOWED = [
  join(SRC, 'pages', 'api', 'proxy.ts'),
  join(SRC, 'pages', 'og', '[slug].png.ts'),
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) {
      walk(p, out);
    } else if (/\.(ts|mjs|js|astro)$/.test(entry)) {
      out.push(p);
    }
  }
  return out;
}

// 1) Config: output wajib static
const configPath = join(root, 'astro.config.mjs');
const configSrc = readFileSync(configPath, 'utf8');
if (!/output\s*:\s*["']static["']/.test(configSrc)) {
  console.error('❌ astro.config.mjs — output harus "static". Client-side guarantee dilanggar!');
  process.exit(1);
}

// 2) Scan source files
let violations = 0;
const files = walk(SRC).concat([configPath]);

for (const file of files) {
  if (ALLOWED.includes(file)) continue;
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    for (const { re, label } of PATTERNS) {
      if (re.test(lines[i])) {
        console.error(`❌ ${relative(root, file)}:${i + 1} — ${label}`);
        violations++;
      }
    }
  }
}

if (violations > 0) {
  console.error(`\n${violations} pelanggaran client-side guarantee ditemukan.`);
  process.exit(1);
}

console.log('✅ Client-side guarantee OK — semua pemrosesan tetap di browser.');
