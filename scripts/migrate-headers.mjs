#!/usr/bin/env node
/**
 * migrate-headers — migrasi header tool page ke <ToolPageHeader> component.
 * Idempotent: skip file yang sudah pakai ToolPageHeader.
 *
 * - Ambil color + icon per tool dari src/data/tools.ts (single source of truth)
 * - Parse header asli tiap page (pertahankan title/desc/i18n keys spesifik page)
 * - Replace blok header standar `<div class="text-center mb-* pt-8 animate-on-scroll">`
 * - File dengan layout header non-standar → dilaporkan SKIP untuk ditangani manual
 *
 * Usage: node scripts/migrate-headers.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const SRC = join(root, 'src');

const GRADIENTS = {
  rose: 'from-rose-500 to-orange-500',
  orange: 'from-orange-500 to-amber-600',
  emerald: 'from-emerald-500 to-teal-600',
  violet: 'from-violet-500 to-purple-600',
  sky: 'from-sky-500 to-blue-600',
  slate: 'from-slate-500 to-slate-700',
  yellow: 'from-yellow-400 to-amber-600',
  cyan: 'from-cyan-500 to-blue-600',
  indigo: 'from-indigo-500 to-violet-600',
  blue: 'from-blue-500 to-indigo-600',
  amber: 'from-amber-500 to-orange-600',
  purple: 'from-purple-500 to-violet-600',
  green: 'from-green-500 to-emerald-600',
  teal: 'from-teal-500 to-cyan-600',
  pink: 'from-pink-500 to-rose-600',
  lime: 'from-lime-500 to-green-600',
  gray: 'from-slate-500 to-slate-600',
  red: 'from-red-500 to-rose-600',
};

// Parse tools.ts (format stabil) → { href: { color, icon } }
const toolsSrc = readFileSync(join(SRC, 'data', 'tools.ts'), 'utf8');
const toolMeta = {};
for (const e of toolsSrc.match(/\{[^{}]*\}/g) || []) {
  const href = e.match(/href: "([^"]+)"/);
  const color = e.match(/color: "([^"]+)"/);
  const icon = e.match(/icon: '([^']+)'/);
  if (href && color && icon) toolMeta[href[1]] = { color: color[1], icon: icon[1] };
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (entry.endsWith('.astro')) out.push(p);
  }
  return out;
}

const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

let migrated = 0;
const skipped = [];

for (const file of walk(join(SRC, 'pages'))) {
  let src = readFileSync(file, 'utf8');
  if (src.includes('<ToolPageHeader')) continue; // sudah dimigrasi

  const rel = file.slice(root.length + 1).replace(/\\/g, '/');
  const route = rel.replace('src/pages/', '').replace(/\.astro$/, '').replace(/\\/g, '/');
  const href = '/' + (route === 'pdf/index' ? 'pdf' : route);
  const meta = toolMeta[href];
  if (!meta) { skipped.push(`${rel} (tidak ada meta tools.ts untuk ${href})`); continue; }

  // 1) Tambah import ToolPageHeader
  if (!src.includes('import ToolPageHeader')) {
    const imp = src.match(/^import BaseLayout from '[^']+';\n/m);
    if (imp) {
      src = src.replace(imp[0], imp[0] + "import ToolPageHeader from '../../components/ToolPageHeader.astro';\n");
    } else {
      const anyImp = src.match(/^import [^\n]+;\n/m);
      if (anyImp) src = src.replace(anyImp[0], anyImp[0] + "import ToolPageHeader from '../../components/ToolPageHeader.astro';\n");
      else { skipped.push(`${rel} (tidak ada import)`); continue; }
    }
  }

  // 2) Blok header standar (varian div/header + animate-*), berakhir setelah </p> + </div>
  const headerRe = /<(?:div|header) class="text-center mb-\d+[^"]*animate-[a-z-]+">[\s\S]*?<\/p>\n\s*<\/(?:div|header)>/;
  const hm = src.match(headerRe);
  if (!hm) { skipped.push(`${rel} (header non-standar)`); continue; }

  const h1 = hm[0].match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const p = hm[0].match(/<p[^>]*>([\s\S]*?)<\/p>/);
  if (!h1) { skipped.push(`${rel} (tidak ada h1)`); continue; }

  const title = stripTags(h1[1]);
  const titleKey = h1[0].match(/data-i18n="([^"]+)"/)?.[1];
  const desc = p ? stripTags(p[1]) : '';
  const descKey = p ? p[0].match(/data-i18n="([^"]+)"/)?.[1] : undefined;

  const gradient = GRADIENTS[meta.color] || 'from-sky-500 to-indigo-500';
  const props = [
    `title=${JSON.stringify(title)}`,
    titleKey ? `titleKey=${JSON.stringify(titleKey)}` : '',
    desc ? `desc=${JSON.stringify(desc)}` : '',
    descKey ? `descKey=${JSON.stringify(descKey)}` : '',
    `icon='${meta.icon}'`,
    `gradient="${gradient}"`,
  ].filter(Boolean).join('\n      ');

  const replacement = `    <ToolPageHeader\n      ${props}\n    />`;
  src = src.replace(hm[0], replacement);
  writeFileSync(file, src);
  console.log(`✅ ${rel}`);
  migrated++;
}

console.log(`\n✅ Migrated: ${migrated}`);
if (skipped.length) {
  console.log('\n⚠️ SKIPPED (handle manual):');
  skipped.forEach((s) => console.log('  ' + s));
}
