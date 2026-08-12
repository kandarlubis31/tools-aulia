export const prerender = true;

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import type { APIRoute, GetStaticPaths } from 'astro';
import { tools } from '../../data/tools';

/**
 * Open Graph image generator (Batch E1).
 * Renders a branded 1200×630 PNG card for every tool, hub, the homepage, and
 * informational pages.
 *
 * Build-time static generation: `prerender = true` + `getStaticPaths()` emits
 * one real PNG file per slug into `dist/og/<slug>.png`. Keeps the site 100%
 * static (ADR-003) — no serverless functions, no Vercel compute, zero user
 * data involved. Unknown slugs 404 (never referenced by BaseLayout).
 */

const W = 1200;
const H = 630;

// Resolve from process.cwd() (project root) — reliable during `astro build` and `astro dev`,
// unlike import.meta.url which points into the bundled output at build time.
// NB: resvg-js cannot load WOFF — fonts must be TTF (see scripts/woff-to-ttf.mjs).
const REGULAR_FONT = resolve(process.cwd(), 'src/assets/fonts/Inter-Regular.ttf');
const BOLD_FONT = resolve(process.cwd(), 'src/assets/fonts/Inter-Bold.ttf');

// Fail loudly at build start — jangan sampai font hilang/salah format jadi OG card kosong diam-diam.
for (const f of [REGULAR_FONT, BOLD_FONT]) {
  if (!existsSync(f)) {
    throw new Error(`[og] Font tidak ditemukan: ${f} — regenerate via 'node scripts/woff-to-ttf.mjs'`);
  }
}

const BRAND_ICON =
  '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>';

const STAR_ICON =
  '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>';

const LIST_ICON =
  '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>';

// Non-tool pages (homepage, hubs, informational pages)
const PAGE_OVERRIDES: Record<string, { title: string; category: string; icon: string }> = {
  showcase: { title: 'Top 20 Tools Terbaik', category: 'ToolsAulia', icon: STAR_ICON },
  changelog: { title: 'Changelog', category: 'ToolsAulia', icon: LIST_ICON },
  '404': { title: 'Halaman Tidak Ditemukan', category: 'ToolsAulia', icon: BRAND_ICON },
};

// href → og key (e.g. '/pdf/merge' → 'pdf-merge', '/pdf' → 'pdf')
const byKey = new Map<string, (typeof tools)[number]>();
for (const t of tools) {
  const key = t.href.replace(/^\//, '').replace(/\//g, '-');
  if (!key) continue; // href '/' (index entry) tidak punya og card sendiri
  if (byKey.has(key)) console.warn(`[og] Duplicate og key "${key}" (${t.href}) — entry terakhir yang menang`);
  byKey.set(key, t);
}

export const getStaticPaths: GetStaticPaths = () => {
  const slugs = new Set<string>(['home', ...Object.keys(PAGE_OVERRIDES)]);
  for (const t of tools) {
    const key = t.href.replace(/^\//, '').replace(/\//g, '-');
    if (key) slugs.add(key);
  }
  return [...slugs].map((slug) => ({ params: { slug } }));
};

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s;
}

function buildSvg(opts: { title: string; category: string; icon: string }): string {
  const title = esc(truncate(opts.title, 40));
  const category = esc(opts.category.toUpperCase());
  const titleSize = opts.title.length > 28 ? 46 : 56;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1220"/>
      <stop offset="55%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#3730a3"/>
    </linearGradient>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05"/>
    </linearGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M60 0H0V60" fill="none" stroke="#94a3b8" stroke-opacity="0.06"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <circle cx="1080" cy="60" r="240" fill="#38bdf8" opacity="0.12"/>
  <circle cx="120" cy="620" r="280" fill="#a78bfa" opacity="0.10"/>
  <circle cx="600" cy="315" r="420" fill="#6366f1" opacity="0.05"/>

  <!-- Brand -->
  <g transform="translate(80 72)">
    <rect width="52" height="52" rx="14" fill="url(#tile)"/>
    <g transform="translate(15 15)" fill="none" stroke="url(#brand)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
      ${BRAND_ICON}
    </g>
    <text x="66" y="33" font-family="Inter" font-weight="700" font-size="28" fill="#ffffff">Tools</text>
    <text x="140" y="33" font-family="Inter" font-weight="700" font-size="28" fill="url(#brand)">Aulia</text>
    <text x="66" y="62" font-family="Inter" font-weight="400" font-size="13" fill="#94a3b8" letter-spacing="3">100% DI BROWSER</text>
  </g>

  <!-- Tool icon tile -->
  <g transform="translate(880 200)">
    <rect width="240" height="240" rx="44" fill="url(#tile)"/>
    <g transform="translate(52 52)" fill="none" stroke="#e2e8f0" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
      ${opts.icon}
    </g>
  </g>

  <!-- Category chip + title -->
  <g>
    <rect x="80" y="300" width="${Math.max(120, category.length * 17 + 40)}" height="34" rx="17" fill="#38bdf8" fill-opacity="0.12"/>
    <text x="${80 + Math.max(120, category.length * 17 + 40) / 2}" y="324" font-family="Inter" font-weight="700" font-size="17" fill="#7dd3fc" text-anchor="middle">${category}</text>

    <text x="80" y="428" font-family="Inter" font-weight="700" font-size="${titleSize}" fill="#ffffff">${title}</text>

    <line x1="80" y1="486" x2="1120" y2="486" stroke="#64748b" stroke-opacity="0.3"/>

    <text x="80" y="542" font-family="Inter" font-weight="400" font-size="22" fill="#94a3b8">tools.paklubis.my.id</text>
    <text x="1120" y="542" font-family="Inter" font-weight="400" font-size="20" fill="#94a3b8" text-anchor="end">Gratis • Tanpa Upload • Aman</text>
  </g>
</svg>`;
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug ?? 'home';

  let title: string;
  let category: string;
  let icon: string;

  const override = PAGE_OVERRIDES[slug];

  if (slug === 'home') {
    title = `Koleksi ${tools.length}+ Tools Gratis`;
    category = 'ToolsAulia';
    icon = BRAND_ICON;
  } else if (override) {
    title = override.title;
    category = override.category;
    icon = override.icon;
  } else {
    const tool = byKey.get(slug);
    if (tool) {
      title = tool.title;
      category = tool.category;
      icon = tool.icon;
    } else {
      // Unknown slug → branded fallback (dev-mode safety; not emitted at build)
      title = 'ToolsAulia';
      category = 'Tools Gratis';
      icon = BRAND_ICON;
    }
  }

  const svg = buildSvg({ title, category, icon });

  try {
    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: W },
      font: {
        fontFiles: [REGULAR_FONT, BOLD_FONT],
        loadSystemFonts: false,
        defaultFontFamily: 'Inter',
      },
    });
    const png = resvg.render().asPng();

    return new Response(png, {
      headers: {
        'Content-Type': 'image/png',
        // Crawlers + shares re-fetch rarely; CDN cache for a week
        'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      },
    });
  } catch (err) {
    // Fail loud: static build tidak punya runtime untuk redirect — error harus terlihat di build.
    console.error(`[og] Gagal render PNG untuk slug "${slug}" (${title}):`, err);
    throw err;
  }
};
