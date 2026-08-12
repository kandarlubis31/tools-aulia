import { tools } from './tools';

/**
 * Client-side tool data for lazy-rendering the homepage grid.
 *
 * Loaded via dynamic `import()` (async, non-blocking) instead of an inline
 * `<script type="application/json">` blob — keeps the homepage HTML lean
 * (~75KB smaller) for faster TTFB/LCP. Vite emits this as a separate chunk
 * that the service worker precaches (`**\/*.js`), so offline stays intact.
 */

// Icon tile duotone per kategori — single source of truth shared by the
// server (SSR cards) and the client (lazy-rendered cards).
export const colorTile: Record<string, string> = {
  // Blue family → PDF, Dev, Network
  rose: 'from-matte-200 to-matte-100 text-slate-600 dark:from-blue-500/15 dark:to-blue-500/5 dark:text-blue-300',
  orange: 'from-matte-200 to-matte-100 text-slate-600 dark:from-blue-500/15 dark:to-blue-500/5 dark:text-blue-300',
  blue: 'from-matte-200 to-matte-100 text-slate-600 dark:from-blue-500/15 dark:to-blue-500/5 dark:text-blue-300',
  indigo: 'from-matte-200 to-matte-100 text-slate-600 dark:from-blue-500/15 dark:to-blue-500/5 dark:text-blue-300',
  sky: 'from-matte-200 to-matte-100 text-slate-600 dark:from-blue-500/15 dark:to-blue-500/5 dark:text-blue-300',
  cyan: 'from-matte-200 to-matte-100 text-slate-600 dark:from-blue-500/15 dark:to-blue-500/5 dark:text-blue-300',
  // Emerald family → Calc, Image, Media
  emerald: 'from-matte-200 to-matte-100 text-slate-600 dark:from-emerald-500/15 dark:to-emerald-500/5 dark:text-emerald-300',
  teal: 'from-matte-200 to-matte-100 text-slate-600 dark:from-emerald-500/15 dark:to-emerald-500/5 dark:text-emerald-300',
  green: 'from-matte-200 to-matte-100 text-slate-600 dark:from-emerald-500/15 dark:to-emerald-500/5 dark:text-emerald-300',
  lime: 'from-matte-200 to-matte-100 text-slate-600 dark:from-emerald-500/15 dark:to-emerald-500/5 dark:text-emerald-300',
  // Slate family → Security, Utils, Text, Data, File
  amber: 'from-matte-200 to-matte-100 text-slate-600 dark:from-slate-500/15 dark:to-slate-500/5 dark:text-slate-300',
  yellow: 'from-matte-200 to-matte-100 text-slate-600 dark:from-slate-500/15 dark:to-slate-500/5 dark:text-slate-300',
  violet: 'from-matte-200 to-matte-100 text-slate-600 dark:from-slate-500/15 dark:to-slate-500/5 dark:text-slate-300',
  purple: 'from-matte-200 to-matte-100 text-slate-600 dark:from-slate-500/15 dark:to-slate-500/5 dark:text-slate-300',
  pink: 'from-matte-200 to-matte-100 text-slate-600 dark:from-slate-500/15 dark:to-slate-500/5 dark:text-slate-300',
  slate: 'from-matte-200 to-matte-100 text-slate-600 dark:from-slate-500/15 dark:to-slate-500/5 dark:text-slate-300',
  gray: 'from-matte-200 to-matte-100 text-slate-600 dark:from-slate-500/15 dark:to-slate-500/5 dark:text-slate-300',
};

export const DEFAULT_TILE = 'from-matte-200 to-matte-100 text-slate-600 dark:from-slate-500/15 dark:to-slate-500/5 dark:text-slate-300';

// Subset of tool fields needed for client-side card rendering
// (keeps the chunk lean — no seoTitle/seoDesc/category metadata).
export const toolsData = tools.map((t) => ({
  cat: t.cat,
  title: t.title,
  titleKey: t.titleKey,
  desc: t.desc,
  descKey: t.descKey,
  href: t.href,
  color: t.color,
  icon: t.icon,
}));
