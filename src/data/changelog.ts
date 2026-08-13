/**
 * Changelog entries — shared source of truth for:
 *  - /changelog page (timeline UI)
 *  - /rss.xml feed (auto-generated at build)
 * Add a new entry at the TOP whenever a feature lands.
 */

export interface ChangelogEntry {
  /** ISO date, e.g. '2026-08-12' */
  date: string;
  /** Version-ish label, e.g. 'v2.6' */
  version: string;
  /** Title (Indonesian) */
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  items: string[];
  itemsEn: string[];
  /** Tailwind-friendly tag colors resolved in the page */
  tags: string[];
}

export const changelogEntries: ChangelogEntry[] = [
  {
    date: '2026-08-13',
    version: 'v2.10',
    title: 'Anti Stale Cache — SW Auto-Reload + QR Reliability',
    titleEn: 'Anti Stale Cache — SW Auto-Reload + QR Reliability',
    desc: 'Service worker langsung aktif & auto-reload saat ada deploy baru — user tidak pernah terjebak cache lama lagi.',
    descEn: 'Service worker claims & auto-reloads on new deploys — users never get stuck on stale cache again.',
    items: [
      '🧹 SW skipWaiting + clientsClaim eksplisit: versi baru langsung aktif & menguasai halaman yang sudah terbuka (sebelumnya cuma berlaku saat navigasi baru — biang keladi "bug hantu" dari cache lama)',
      '🔄 Listener controllerchange: toast "Versi baru tersedia" + auto-reload 1× (aman di install pertama, tab background tidak ikut reload)',
      '📱 QR Generator: fix bug SPA navigation — tombol tipe/color/download mati setelah navigasi balik (binding elemen dipindah ke astro:page-load)',
      '🔧 QR Generator: fix logo bolong putih saat diperkecil / logo nyangkut saat dihapus + qrious di-vendor self-hosted (offline-first, tanpa CDN)',
    ],
    itemsEn: [
      '🧹 Explicit SW skipWaiting + clientsClaim: new versions activate & claim already-open pages (previously only applied on fresh navigation — the root of "ghost bugs" from stale cache)',
      '🔄 controllerchange listener: "New version available" toast + auto-reload once (safe on first install, background tabs skip reload)',
      '📱 QR Generator: fixed SPA navigation bug — type/color/download buttons dead after navigating back (element binding moved to astro:page-load)',
      '🔧 QR Generator: fixed white-hole logo when shrinking / stale logo when removed + qrious vendored self-hosted (offline-first, no CDN)',
    ],
    tags: ['fix', 'perf', 'ux'],
  },
  {
    date: '2026-08-13',
    version: 'v2.9',
    title: 'Performa & LCP — Critical CSS, Lazy-Render, Self-Host Font',
    titleEn: 'Performance & LCP — Critical CSS, Lazy-Render, Self-Host Font',
    desc: 'Hapus render-blocking CSS, lazy-render card tools, dan font self-hosted — LCP jauh lebih cepat.',
    descEn: 'Removed render-blocking CSS, lazy-rendered tool cards, and self-hosted fonts — much faster LCP.',
    items: [
      '⚡ Critical CSS: 17KB above-the-fold CSS di-inline di <head>; bundle Tailwind 185KB load async (media=print onload)',
      '🧹 Hapus duplikat bundle Tailwind (applyBaseStyles:false) — 2×~175KB jadi 1×185KB',
      '👁️ Lazy-render IntersectionObserver: SSR 227→36 card, HTML 639KB→289KB (-55%), sisanya placeholder aktif saat mendekati viewport',
      '🔤 Self-host font: Inter + Plus Jakarta Sans jadi woff2 variable (75KB) — dependency Google Fonts dihapus total',
      '📦 PWA: exclude Vite shared chunks dari precache (~6.4MB) — tiktoken cuma di-download saat pakai paste-to-md',
      '🛡️ Guardrail check-critical-css: deteksi drift palette/breakpoint critical.css vs global.css + tailwind.config.mjs di prebuild',
      '🔍 Lighthouse: CSP Umami, dimensi og:image (1200×630), font non-blocking',
    ],
    itemsEn: [
      '⚡ Critical CSS: 17KB above-the-fold CSS inlined in <head>; 185KB Tailwind bundle loads async (media=print onload)',
      '🧹 Removed duplicate Tailwind bundle (applyBaseStyles:false) — 2×~175KB → 1×185KB',
      '👁️ IntersectionObserver lazy-render: SSR 227→36 cards, HTML 639KB→289KB (-55%), rest are placeholders activated on approach',
      '🔤 Self-hosted fonts: Inter + Plus Jakarta Sans as variable woff2 (75KB) — Google Fonts dependency fully removed',
      '📦 PWA: excluded Vite shared chunks from precache (~6.4MB) — tiktoken only downloads when using paste-to-md',
      '🛡️ Guardrail check-critical-css: detects palette/breakpoint drift between critical.css, global.css and tailwind.config.mjs at prebuild',
      '🔍 Lighthouse: Umami CSP, og:image dimensions (1200×630), non-blocking fonts',
    ],
    tags: ['perf', 'feat', 'fix'],
  },
  {
    date: '2026-08-13',
    version: 'v2.8',
    title: 'Mobile & UX Polish',
    titleEn: 'Mobile & UX Polish',
    desc: 'Fix scroll horizontal, GPU acceleration, ganti bahasa instan, dan touch feedback.',
    descEn: 'Horizontal scroll fixes, GPU acceleration, instant language switch, and touch feedback.',
    items: [
      '📱 Fix horizontal scroll di mobile view + card grid tidak lagi overflow viewport (min-width:0 + overflow:hidden)',
      '🚀 GPU acceleration: header friendly-GPU, touch feedback instan, rAF batching',
      '🌐 Ganti bahasa instan — tanpa reload halaman lagi',
      '🔢 Stat pill "227 tools" sekarang clickable → langsung scroll ke grid tools',
      '📌 Fix filter bar tertutup header (sticky top-0 → top-14) + spacing grid',
      '🧩 Consolidate wrapper toast + bersihkan @ts-ignore',
    ],
    itemsEn: [
      '📱 Fixed horizontal scroll on mobile + tool card grid no longer overflows the viewport (min-width:0 + overflow:hidden)',
      '🚀 GPU acceleration: GPU-friendly header, instant touch feedback, rAF batching',
      '🌐 Instant language switch — no more page reload',
      '🔢 "227 tools" stat pill is now clickable → scrolls straight to the tool grid',
      '📌 Fixed filter bar hidden behind header (sticky top-0 → top-14) + grid spacing',
      '🧩 Consolidated toast wrappers + cleaned up @ts-ignore',
    ],
    tags: ['ux', 'fix', 'perf'],
  },
  {
    date: '2026-08-12',
    version: 'v2.7',
    title: 'Batch E — OG, Share, Feedback + Guardrail',
    titleEn: 'Batch E — OG, Share, Feedback + Guardrail',
    desc: 'OG image generator, tombol share, widget lapor bug, dan guardrail anti-regresi.',
    descEn: 'OG image generator, share button, bug report widget, and anti-regression guardrail.',
    items: [
      '🎨 OG Image Generator: 231 PNG statis per-tool di-build time, auto og:image di semua halaman',
      '🔗 Tombol "Bagikan" di tiap tool: Web Share API + fallback copy link',
      '🐛 Feedback Widget: tombol "Lapor Bug" → modal form → GitHub Issues pre-filled',
      '🛡️ Guardrail check-inline-scripts.mjs: deteksi TS/bare-import di inline script, gated di prebuild',
      '🔧 Hotfix: TS syntax bocor di 10+ inline script (html-to-img, certificate, 7 PDF, BaseLayout, prabowo-countdown)',
      '📡 Analytics Umami Cloud aktif + RSS feed + halaman /changelog',
    ],
    itemsEn: [
      '🎨 OG Image Generator: 231 static PNGs per tool at build time, auto og:image on all pages',
      '🔗 Share button on every tool: Web Share API + clipboard fallback',
      '🐛 Feedback Widget: "Report Bug" floating button → modal form → GitHub Issues pre-filled',
      '🛡️ Guardrail check-inline-scripts.mjs: detects TS/bare-import in inline scripts, gated at prebuild',
      '🔧 Hotfix: TS syntax leaked in 10+ inline scripts (html-to-img, certificate, 7 PDF, BaseLayout, prabowo-countdown)',
      '📡 Umami Cloud analytics active + RSS feed + /changelog page',
    ],
    tags: ['feat', 'fix', 'ux'],
  },
  {
    date: '2026-08-12',
    version: 'v2.6',
    title: 'Batch C — Polish & Performance',
    titleEn: 'Batch C — Polish & Performance',
    desc: 'Top 20 showcase, build size audit, dan unit test baru.',
    descEn: 'Top 20 showcase, build size audit, and new unit tests.',
    items: [
      'Halaman baru /showcase — Top 20 Tools: peringkat per-user + pilihan editor',
      'Audit build: hapus 6.4MB dead asset, verifikasi lazy-load semua library berat',
      '+19 unit tests (useCdnLib, usePdfDownload, usePdfDropZone) — total 62',
    ],
    itemsEn: [
      'New /showcase page — Top 20 Tools: per-user ranking + editor picks',
      'Build audit: removed a 6.4MB dead asset, verified all heavy libs are lazy-loaded',
      '+19 unit tests (useCdnLib, usePdfDownload, usePdfDropZone) — 62 total',
    ],
    tags: ['feat', 'perf', 'test'],
  },
  {
    date: '2026-08-12',
    version: 'v2.5',
    title: 'Batch A & B — UX + Quality',
    titleEn: 'Batch A & B — UX + Quality',
    desc: 'Quick wins UX dan audit kualitas menyeluruh.',
    descEn: 'UX quick wins and a full quality audit.',
    items: [
      '⭐ Favorit: pin tools ke atas grid (localStorage, max 20)',
      '🔥 Usage counter: track tool yang paling sering dipakai',
      'Audit SEO/sitemap/i18n — semua bersih',
    ],
    itemsEn: [
      '⭐ Favorites: pin tools to the top of the grid (localStorage, max 20)',
      '🔥 Usage counter: track your most-used tools',
      'SEO/sitemap/i18n audit — all clean',
    ],
    tags: ['feat', 'ux', 'audit'],
  },
  {
    date: '2026-08-12',
    version: 'v2.4',
    title: 'Pagination — 36 Tools per Halaman',
    titleEn: 'Pagination — 36 Tools per Page',
    desc: 'Homepage gak lagi ngescroll panjang.',
    descEn: 'The homepage no longer scrolls forever.',
    items: [
      'Grid tools dipecah jadi 7 halaman (36 per halaman)',
      'Navigasi angka + Prev/Next, auto-reset saat filter/search',
    ],
    itemsEn: [
      'Tool grid split into 7 pages (36 per page)',
      'Numbered nav + Prev/Next, auto-resets on filter/search',
    ],
    tags: ['ux'],
  },
  {
    date: '2026-08-12',
    version: 'v2.3',
    title: '59 Tools Complete — 227 Total! 🎉',
    titleEn: '59 Tools Complete — 227 Total! 🎉',
    desc: 'Plan 59 tools selesai. Koleksi ToolsAulia resmi 227 tools.',
    descEn: 'The 59-tool plan is done. ToolsAulia now has 227 tools.',
    items: [
      'Batch 17: media-info, wake-on-lan, sql-to-json, md-table, handwriting, receipt, grocery-list, bucket-list, audio-convert',
      'Milestone: 58 → 227 tools dalam 12 kategori',
    ],
    itemsEn: [
      'Batch 17: media-info, wake-on-lan, sql-to-json, md-table, handwriting, receipt, grocery-list, bucket-list, audio-convert',
      'Milestone: 58 → 227 tools across 12 categories',
    ],
    tags: ['feat'],
  },
  {
    date: '2026-08-12',
    version: 'v2.2',
    title: 'Batch 12–16 — 50 Tools Baru',
    titleEn: 'Batch 12–16 — 50 New Tools',
    desc: 'Gelombang tools dev, network, media, life & data.',
    descEn: 'A wave of dev, network, media, life & data tools.',
    items: [
      'Dev/data: bates, text-search, code2image, api-mock, pdf-annotate, json-to-csv, json-path, zip-extractor',
      'Network/media: nginx-config, subnet-viz, qr-wifi, audio-viz, audio-eq, video-thumb',
      'Life/calc: fuel-cost, gpa, split-bill, sleep-calc, water-tracker',
    ],
    itemsEn: [
      'Dev/data: bates, text-search, code2image, api-mock, pdf-annotate, json-to-csv, json-path, zip-extractor',
      'Network/media: nginx-config, subnet-viz, qr-wifi, audio-viz, audio-eq, video-thumb',
      'Life/calc: fuel-cost, gpa, split-bill, sleep-calc, water-tracker',
    ],
    tags: ['feat'],
  },
  {
    date: '2026-08-11',
    version: 'v2.1',
    title: 'Typing Test Overhaul',
    titleEn: 'Typing Test Overhaul',
    desc: 'Rewrite ala Monkeytype: akurasi per-karakter, spasi dihitung.',
    descEn: 'Monkeytype-style rewrite: per-character accuracy, spaces counted.',
    items: [
      'Live WPM + akurasi, per-karakter tracking, ghost text',
      'Sparkline WPM 10 detik + sound toggle mekanikal (Web Audio)',
      'Personal best tersimpan di localStorage',
    ],
    itemsEn: [
      'Live WPM + accuracy, per-character tracking, ghost text',
      '10s WPM sparkline + mechanical sound toggle (Web Audio)',
      'Personal best saved to localStorage',
    ],
    tags: ['feat', 'ux'],
  },
  {
    date: '2026-08-10',
    version: 'v2.0',
    title: 'UI/UX Phase 1–3',
    titleEn: 'UI/UX Phase 1–3',
    desc: 'Wajah baru ToolsAulia: matte palette, header seragam, footer redesign.',
    descEn: 'A fresh look: matte palette, unified headers, redesigned footer.',
    items: [
      'Palet matte profesional + display font + ikon duotone',
      '53 halaman tool pakai ToolPageHeader seragam',
      'Footer redesign, drop zone seragam, scroll reveal animation',
    ],
    itemsEn: [
      'Professional matte palette + display font + duotone icons',
      '53 tool pages using a unified ToolPageHeader',
      'Redesigned footer, uniform drop zones, scroll reveal animation',
    ],
    tags: ['ui'],
  },
  {
    date: '2026-08-09',
    version: 'v1.9',
    title: 'PDF Migration + Remove Background AI',
    titleEn: 'PDF Migration + Remove Background AI',
    desc: 'Refactor besar PDF tools + tool AI baru.',
    descEn: 'A big PDF tools refactor + a new AI tool.',
    items: [
      'usePdfDropZone / usePdfRenderer / usePdfDownload — hilangkan duplikasi di 16 halaman PDF',
      'Remove Background: AI onnx di browser, 100% offline',
      'Offline UX: cache-aware toast + offline-ready badge',
    ],
    itemsEn: [
      'usePdfDropZone / usePdfRenderer / usePdfDownload — removed duplication across 16 PDF pages',
      'Remove Background: onnx AI in-browser, 100% offline',
      'Offline UX: cache-aware toast + offline-ready badge',
    ],
    tags: ['refactor', 'feat'],
  },
  {
    date: '2026-08-01',
    version: 'v1.0',
    title: 'Launch 🚀',
    titleEn: 'Launch 🚀',
    desc: 'ToolsAulia lahir dengan 58 tools pertama.',
    descEn: 'ToolsAulia launched with its first 58 tools.',
    items: [
      'PDF, Image, Dev, Calc, Security, Utils, File tools',
      'PWA offline-first, i18n ID/EN, dark mode',
    ],
    itemsEn: [
      'PDF, Image, Dev, Calc, Security, Utils, File tools',
      'PWA offline-first, ID/EN i18n, dark mode',
    ],
    tags: ['feat', 'docs'],
  },
];

/** Slugify a version string into a stable URL anchor, e.g. 'v2.6' → 'v2-6' */
export function changelogSlug(version: string): string {
  return version.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

/** Tag → i18n key + color mapping (shared with the page) */
export const changelogTagMeta: Record<string, { key: string; cls: string }> = {
  feat: { key: 'changelog.tag_feat', cls: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
  ui: { key: 'changelog.tag_ui', cls: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' },
  perf: { key: 'changelog.tag_perf', cls: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
  refactor: { key: 'changelog.tag_refactor', cls: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400' },
  test: { key: 'changelog.tag_test', cls: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' },
  fix: { key: 'changelog.tag_fix', cls: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' },
  ux: { key: 'changelog.tag_ux', cls: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' },
  audit: { key: 'changelog.tag_audit', cls: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' },
  docs: { key: 'changelog.tag_docs', cls: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400' },
};
