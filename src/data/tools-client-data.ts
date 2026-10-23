import { tools, hiddenToolHrefs } from './tools';

/**
 * Client-side tool data for lazy-rendering the homepage grid.
 *
 * Loaded via dynamic `import()` (async, non-blocking) instead of an inline
 * `<script type="application/json">` blob — keeps the homepage HTML lean
 * (~75KB smaller) for faster TTFB/LCP. Vite emits this as a separate chunk
 * that the service worker precaches (`**\/*.js`), so offline stays intact.
 */

// Catatan (Oct 2026): colorTile + DEFAULT_TILE dihapus — tile kartu homepage kini
// netral (border hairline + ikon line-art muted via .icon-mono) per brief premium.
// Lihat ToolCard.astro & renderCardHTML() di index.astro.

// Subset of tool fields needed for client-side card rendering
// (keeps the chunk lean — no seoTitle/seoDesc/category metadata).
// ⚠️ WAJIB sejajar 1:1 dengan publicTools (src/data/tools.ts) — index toolsData
// dipakai homepage via placeholder `data-tool-index`. Tanpa filter ini, sejak
// index tersembunyi semua kartu lazy-render off-by-one (judul/kategori vs
// isi beda) DAN /utils/hrd-dashboard bocor ke grid landing — ke-catch screenshot
// smoke CDP Okt 23 2026. (publicTools = tools.filter(hiddenToolHrefs) — predikat
// identik, urutan identik.)
export const toolsData = tools
  .filter((t) => hiddenToolHrefs.indexOf(t.href) === -1)
  .map((t) => ({
    cat: t.cat,
    title: t.title,
    titleKey: t.titleKey,
    desc: t.desc,
    descKey: t.descKey,
    href: t.href,
    icon: t.icon,
  }));
