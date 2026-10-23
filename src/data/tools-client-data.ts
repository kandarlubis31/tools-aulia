import { tools } from './tools';

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
export const toolsData = tools.map((t) => ({
  cat: t.cat,
  title: t.title,
  titleKey: t.titleKey,
  desc: t.desc,
  descKey: t.descKey,
  href: t.href,
  icon: t.icon,
}));
