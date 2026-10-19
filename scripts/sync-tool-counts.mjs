/**
 * sync-tool-counts.mjs — Sinkronkan angka jumlah tool di dokumentasi dari sumber kebenaran
 * tunggal `src/data/tools.ts`.
 *
 * Dijalankan otomatis di `prebuild` — tambah/hapus tool → angka di README.md,
 * docs/CONTEXT.md, dan komentar performa ikut naik/turun tiap `pnpm build`.
 * Exit 1 kalau ada pola yang TIDAK ditemukan (biar kegagalan sinkron ketahuan,
 * bukan diam-diam basi).
 *
 * Catatan angka:
 *   - "N+ Tools" (marketing)  = publicTools.length (hero homepage juga pakai ini)
 *   - "N entries metadata"    = tools.length (baris di src/data/tools.ts)
 *   - "N tool pages"          = entries (1 entry = 1 halaman tool, termasuk hub)
 *   - "N halaman/N pages"     = entries + 4 (home + offline + showcase + changelog)
 *   - offline.astro           = dinamis langsung di template ({publicTools.length})
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tools, publicTools, categoryIds } from '../src/data/tools.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const entries = tools.length;
const pub = publicTools.length;
const cats = categoryIds.length;
const pages = entries + 4; // + home, offline, showcase, changelog (404 → 404.html, tak kehitung); cek: find dist/client -name index.html
const hasHub = tools.some((t) => t.href === '/pdf');
const hubTools = hasHub ? entries - 1 : entries;

const rules = [
  // README — hero/tagline (ID & EN)
  { file: 'README.md', re: /\b\d+\+ Tools Developer/g, to: `${pub}+ Tools Developer` },
  { file: 'README.md', re: /koleksi \d+\+ tools developer/g, to: `koleksi ${pub}+ tools developer` },
  { file: 'README.md', re: /collection of \d+\+ developer/g, to: `collection of ${pub}+ developer` },
  // README — struktur repo
  { file: 'README.md', re: /# \d+\+ tool pages/g, to: `# ${entries}+ tool pages` },
  { file: 'README.md', re: /tools\.ts \(\d+ entries metadata\)/g, to: `tools.ts (${entries} entries metadata)` },
  // docs/CONTEXT.md — heading kategori
  {
    file: 'docs/CONTEXT.md',
    re: /## Tool Categories \(\d+ entries: \d+ tools \+ PDF hub, \d+ kategori\)/,
    to: `## Tool Categories (${entries} entries: ${hubTools} tools + PDF hub, ${cats} kategori)`,
  },
  // Komentar performa (jumlah halaman build)
  { file: 'src/layouts/BaseLayout.astro', re: /build output \d+ halaman/, to: `build output ${pages} halaman` },
  { file: 'src/pages/search-tools.json.ts', re: /across \d+ pages in the build/, to: `across ${pages} pages in the build` },
];

const missing = [];
const changed = [];

for (const { file, re, to } of rules) {
  const path = join(root, file);
  const before = readFileSync(path, 'utf8');
  if (!re.test(before)) {
    missing.push(`${file}  ←  pola tidak ditemukan: ${re}`);
    continue;
  }
  re.lastIndex = 0;
  const after = before.replace(re, to);
  if (after !== before) {
    writeFileSync(path, after);
    changed.push(file);
  }
}

if (missing.length) {
  console.error('❌ sync-tool-counts: pola angka tidak ditemukan (dokumentasi berubah strukturnya?):');
  for (const m of missing) console.error('   ' + m);
  process.exit(1);
}

if (changed.length) {
  console.log(`✅ sync-tool-counts: angka disinkronkan → ${[...new Set(changed)].join(', ')}`);
  console.log(`   tools=${entries} public=${pub} entries=${entries} pages=${pages} kategori=${cats}`);
} else {
  console.log(`✅ sync-tool-counts: angka sudah sinkron (tools=${entries}, public=${pub}, pages=${pages})`);
}
