# ToolsAulia — Project Context

> Last updated: June 20, 2026
> Maintained by: Aulia Iskandar Lubis

## Domain Language

| Term | Definition |
|------|------------|
| **Client-Side** | Semua pemrosesan terjadi 100% di browser. Tidak ada data yang dikirim ke server. |
| **PWA** | Progressive Web App — bisa diinstall sebagai aplikasi di HP/laptop, mendukung offline. |
| **Tool** | Halaman/fitur individual dalam koleksi (misal: Merge PDF, QR Generator, BMI Calculator). |
| **Category** | Grouping tools (PDF, Image, Calc, Dev, Security, File, Utils). |
| **i18n** | Internasionalisasi — semua teks UI disimpan di `translations.ts` dengan kunci ID dan EN. |
| **Indonesian-first** | Bahasa Indonesia adalah bahasa utama; Inggris adalah bahasa sekunder. |

## Project Overview

ToolsAulia adalah koleksi tools developer & produktivitas yang berjalan 100% di browser (Client-Side). Aman, cepat, dan tanpa upload data ke server.

- **Website**: [paklubis.my.id](https://paklubis.my.id)
- **GitHub**: [kandarlubis31](https://github.com/kandarlubis31/tools-aulia)
- **Lisensi**: MIT

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Astro 5.x |
| **Styling** | Tailwind CSS 3.4.x + CSS custom properties |
| **Language** | TypeScript (strict) |
| **PWA** | @vite-pwa/astro + Workbox |
| **Deployment** | Vercel (static adapter) |
| **Testing** | Vitest, Playwright |
| **Package Manager** | pnpm (recommended) |
| **Icons** | Custom inline SVGs (Lucide-style) |

## Architecture

```
src/
├── pages/          # Astro pages — one per tool + index
├── layouts/        # BaseLayout.astro (header, nav, footer, search, i18n, PWA, theme)
├── components/     # ToolCard.astro (+ PWAHead, if exists)
├── styles/         # global.css (Tailwind + CSS variables + reusable classes)
├── data/           # tools.ts, new-tools.ts (single source of truth for tool definitions)
├── i18n/           # translations.ts (all UI strings, ID + EN)
└── ...composables/ # (planned: useToast, useFileHandler, useClipboard, useProgress)
```

### Key Design Principles

1. **Privacy First** — All data processing happens client-side. No server uploads.
2. **Single Source of Truth** — Tool definitions live in `src/data/tools.ts`, used by both index page and search.
3. **Indonesian-first i18n** — All UI strings in `src/i18n/translations.ts` with fallback to Indonesian.
4. **Minimal Dependencies** — Prefer native browser APIs; heavy libraries loaded only on pages that need them.
5. **Monochrome + Accent Design** — Matte color palette with blue accent; hover reveals color.

## Tool Categories & Count

| Category | Count | Route Prefix |
|----------|-------|-------------|
| **PDF** | 16 tools | `/pdf/` |
| **Image** | 5 tools | `/image/` |
| **Calculator** | 7 tools | `/calc/` |
| **Developer** | 10 tools | `/dev/` |
| **Security** | 3 tools | `/security/` |
| **File** | 2 tools | `/file/` |
| **Utility** | 14 tools | `/utils/` |
| **Total** | ~57 tools | — |

### Notable Tools

- **PDF Mas Aul** (`/pdf`) — PDF hub page with category filters
- **Studio Editor** (`/image/editor`) — Photo editor with filters, crop, grading
- **My IP & Network** (`/dev/my-ip`) — Public IP, speed test, network info, IP history
- **Persamaan Kata** (`/utils/sinonim`) — Synonym finder using Wiktionary API (newest tool)
- **Paste to Markdown** (`/utils/paste-to-md`) — Clean Markdown converter for AI prompts
- **WA Link Builder** (`/utils/wa-builder`) — WhatsApp link generator with QR code
- **Countdown 2029** (`/utils/prabowo-countdown`) — Satirical countdown timer
- **Pomodoro Timer** (`/utils/pomodoro`) — Focus timer with sessions
- **Speed Test** (in `/dev/my-ip`) — Real download/upload measurement via CDN files

## Current State (Uncommitted Changes)

The following significant changes are in progress (unstaged):

### Dependency Cleanup ✅
- Removed unused packages: `@astrojs/react`, `react`, `react-dom`, `@types/react`, `@types/react-dom`, `@imgly/background-removal`
- Removed orphaned root file: `add-phrases.cjs` (manual utility, unused)
- Reduced node_modules size and production bundle

### Design System Refresh ✅
- **New color palette**: `matte-*` (slate-inspired neutral) and `accent-*` (blue, mint, amber, sky)
- **ToolCard redesigned**: Monochrome icons → blue accent on hover, 3D tilt effect, gloss overlay, bottom accent line
- **Global styles**: CSS variables for theming, card-base, badge, icon-mono, stat-pill, nav-item, section-title classes
- **Tailwind config**: Updated with matte & accent colors, custom fonts (Inter, JetBrains Mono)
- **Back to Top button**, scroll progress bar, view transitions

### Matte Palette Migration ✅
All tool pages migrated from old `slate-*` / `indigo-*` / `emerald-*` palette to `matte-*` / `surface-*` / `accent-*` system:
- **QR Generator**, **Todo List**, **Password Generator** — 3 reference pages migrated first
- **Pomodoro Timer** — Fixed dynamic Tailwind JIT bug (string concatenation → `THEMES` mapping)
- **Calculator tools** (age, bmi, case, currency, number, percentage, unit) — cards, inputs, buttons
- **Security tools** (hash, uuid) — input fields, buttons
- **Image tools** (html-to-img, editor, compressor, converter, color) — UI panels, controls
- **Utility tools** (brainstorm, jokes, lorem, motivation, paste-to-md, sinonim, stopwatch, wa-builder, word-counter, prabowo-countdown) — cards, buttons, modals
- **File tools** (csv-json, pdf-to-md) — drop zones, result containers, loaders

### Composables Refactoring ✅
- `src/composables/useToast.ts`, `useClipboard.ts`, `useDebounce.ts`, `useLocalHistory.ts` — shared utilities extracted from inline scripts
- Used in QR Generator, Todo List, PDF tools

### Homepage Enhancement ✅
- New "Newly Added" section with `new-tools.ts` data source
- Stats display (total tools, categories, 100% client-side)
- Sticky filter bar with mobile dropdown + search input
- Category filter tabs (Popular, All, PDF, Image, etc.)
- Sort by Popular / A-Z
- Recently Used section (localStorage-based)
- 3D card tilt effect on tool grid
- Hero parallax effect

### New Tools Added
- **Persamaan Kata / Synonym Finder** (`/utils/sinonim`) — Uses free dictionary API (freedictionaryapi.dev) via Wiktionary data with **KBBI Edisi VI offline fallback**. Supports ID & EN word lookup, shows synonyms, antonyms, definitions, phonetic. Clickable chips to search related words, autocomplete with **195k+ Indonesian word list**, recent searches in localStorage. **Offline cache**: results saved to localStorage (max 50), shown with badge when offline. **KBBI thesaurus**: 48,925 entries (17,477 main + 31,448 reverse mappings for derived words like "hematan" → "hemat"), lazy-loaded on API failure, rendered as Definisi + Persamaan Kata + Kata Gabungan sections. Amber "KBBI" badge for fallback results.

### Word List & Autocomplete ✅
- `src/data/id-words.ts` — **195,193 Indonesian words** (Sastrawi kata-dasar + KBBI Edisi VI from Definisi/kbbi)
- `scripts/build-words.mjs` — generates id-words.ts from Sastrawi base + additional vocabulary
- `scripts/check-typos.mjs` — analysis tool to detect typos in the word list
- Autocomplete on sinonim page with binary search, keyboard navigation (Tab/Arrow/Enter), debounced input
- Typo fixes applied: `paliative→paliatif`, `akutansi→akuntansi`, `litoster→litosfer`, `mamalogi→mamologi`, removed `intidal` & `defrontasi` (non-words)
- **KBBI Edisi VI Expansion**: Downloaded 194,692 entries from [Definisi/kbbi](https://github.com/Definisi/kbbi) GitHub repo, merged with existing Sastrawi words → 195,193 unique words total (2.6MB JSON, lazy-loaded on first keystroke)
- **KBBI Thesaurus**: Built `public/kbbi-sinonim.json` (9.3MB, 48,925 entries) from KBBI dataset — entries with turunan/gabungan as thesaurus data plus reverse mappings for derived words (e.g., "hematan" → root "hemat"). Used as fallback when Wiktionary API fails. Served with Vercel auto-brotli (~1MB over wire). Runtime-cached in PWA (CacheFirst, 30-day expiry) via `astro.config.mjs`.

### My IP Enhancement ✅
- Speed test modal with animated gauge needle, real download measurement via CDN files, upload via httpbin
- Connection quality rating (5-star) + activity recommendations (streaming/gaming/browsing)
- IP history with timestamps, click-to-copy
- JSON export, save report
- LocalStorage caching (30 min TTL)

### PWA Configuration ✅
- `maximumFileSizeToCacheInBytes` increased to 10 MB
- CDN runtime caching rules (cdnjs, jsdelivr, unpkg)

### Navigation Enhancement ✅
- Tools dropdown in desktop nav with category quick links
- Mobile sidebar with search, categories, theme toggle, lang toggle
- Category translation keys for nav items

### Cleanup ✅
- Removed unused `currentColor` variable from pomodoro.astro (dead code)
- Removed `nul` garbage file from root
- Removed redundant `package-lock.json` (project uses pnpm)
- Removed `bun.lock` (redundant, using pnpm)
- Removed `scripts/build-words.js` (old version, `.mjs` is current)
- `.gitignore` updated: scripts/, dev-dist/, nul, bun.lock added
- `dev-dist/` excluded from version control (auto-generated PWA dev output, removed from git tracking)

## Design System

### Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--bg-card` | `#ffffff` | `#161b22` | Card backgrounds |
| `--bg-page` | `#fafafa` | `#010409` | Page background |
| `--accent-blue` | `#38bdf8` | `#38bdf8` | Primary accent (hover, links) |
| `--text-primary` | `#0d1117` | `#ffffff` | Main text |
| `--text-secondary` | `#6e7681` | `#8b949e` | Secondary text |

### Reusable CSS Classes (in `global.css`)

- `card-base` — Rounded card with border, hover shadow, active scale
- `badge-accent` / `badge-muted` — Small label/tag
- `icon-mono` — Gray icon that turns accent-blue on group hover
- `stat-pill-default` — Stat display pill
- `section-title` — Uppercase, tracking-wide section heading
- `nav-item` / `nav-item-active` / `nav-item-inactive` — Navigation buttons
- `tilt-card` / `tilt-card-gloss` — 3D perspective tilt card
- `card-grid` — Responsive grid (1→2→3→4 columns)

### Animations

- `animate-fade-in-down` — 0.25s, -6px → 0
- `animate-fade-in-up` — 0.25s, +10px → 0
- `animate-slide-up` — 0.3s, bottom slide
- Astro view transitions: 0.15s fade-out + 0.2s fade-in

## Key Conventions

### Tool Data Structure (`src/data/tools.ts`)

```typescript
interface ToolDefinition {
  cat: string;        // Category id
  popular: boolean;   // Show in "Favorites" section
  titleKey: string;   // i18n key
  title: string;      // ID fallback
  descKey: string;    // i18n key
  desc: string;       // ID fallback
  href: string;       // URL path
  color: string;      // (legacy, currently unused)
  icon: string;       // SVG path data
  category: string;   // Display category name
  descFallback: string; // Search fallback
}
```

### New Tools Tracking (`src/data/new-tools.ts`)

Array of hrefs ordered newest-first. Index page shows up to 5 from this list.

### i18n System (`src/i18n/translations.ts`)

- All UI strings stored in `translations` Record with `{ id: string, en: string }`
- Language stored in `localStorage.getItem('lang')` — 'id' or 'en'
- `data-i18n` attribute on elements for automatic translation
- `data-i18n-attr` for placeholder translation
- i18n scripts loaded async from `/i18n-phrases.js`

### File Naming

- Tool pages: kebab-case matching the slug (e.g., `paste-to-md.astro`, `wa-builder.astro`)
- Components: PascalCase (e.g., `ToolCard.astro`)
- Data files: camelCase (e.g., `tools.ts`, `new-tools.ts`)

## Known Decisions / Technical Notes

1. **No SSR** — Astro configured as `output: "static"`. All dynamic behavior is client-side JS.
2. **No React** — `@astrojs/react`, `react`, `react-dom` and `@types/*` removed (unused). All UI is vanilla Astro + inline `<script>` tags.
3. **i18n approach** is custom-built (not astro-i18n). Uses data attributes + DOM walking with phrase dictionary.
4. **Search modal** uses debounced client-side filtering on `searchTools` array (passed as JSON script).
5. **Composables exist** — `src/composables/useToast.ts`, `useClipboard.ts`, `useDebounce.ts`, `useLocalHistory.ts` are created and used in QR, Todo, and PDF tools.
6. **No tests exist** despite `vitest.config.ts` and `playwright.config.ts` being configured.
7. **`add-phrases.cjs`** ~~exists at root — used to generate `/public/i18n-phrases.js` from translations.ts.~~ ✅ **Removed** — unused manual utility.
8. ~~`@imgly/background-removal` is in package.json but not used — candidate for removal.~~ ✅ **Removed**
9. ~~`@astrojs/react` + react/react-dom installed but not used — candidate for removal.~~ ✅ **Removed**
10. **`src/data/id-words.ts`** — auto-generated word list (195,193 words from Sastrawi + KBBI Edisi VI). Do not edit manually; regenerate via `node scripts/build-words.mjs <path-to-kata-dasar>`.
11. **`scripts/`** — build/dev tools, gitignored. Contains `build-words.mjs` (word list generator) and `check-typos.mjs` (typo analyzer).

## Architecture Decisions

- **ADRs**: See `docs/adr/` for architectural decision records.
- **Issue tracking**: Issues tracked as local markdown under `.scratch/<feature>/`.
- **Triage labels**: Default five-role set (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`).

## Known Bugs / Limitations

- [ ] My IP page uses deprecated Battery API (may stop working in some browsers)
- [ ] WebRTC local IP detection often returns "Diproteksi" in modern browsers
- [ ] Speed test upload uses httpbin.org which may rate-limit
- [ ] Some tools lack responsive design on very small mobile screens
- [ ] No error boundaries — JS errors on tool pages may break navigation

## Recommended Next Steps

### 🔴 High Priority
1. **Remove unused deps** — `@astrojs/react`, `react`, `react-dom`, `@imgly/background-removal` in package.json but unused. Reduces build size and install time. Run `pnpm remove @astrojs/react react react-dom @imgly/background-removal`.
2. **Chunk size optimization** — Build warning: one chunk is 5.6 MB (2.5 MB gzipped). This is the word list (`id-words.ts`). Consider dynamic import or lazy-loading the word list only on the sinonim page instead of bundling it globally.
3. **Add smoke tests** — Vitest & Playwright configured but 0 tests exist. At minimum: homepage loads, sinonim page loads, autocomplete renders.

### 🟡 Medium Priority
4. **Cleanup JS slate references** — Many migrated files still have old `text-slate-*` / `bg-slate-*` in JavaScript template literals & `classList` operations (jokes, brainstorm, wa-builder, prabowo-countdown, editor). Doesn't affect functionality but inconsistent with new palette.
5. **Offline cache indicator** — Sinonim page already caches results. Add a small toast or ripple animation when a result is served from cache so user knows it's offline data.
6. **Responsive audit** — Review remaining tools for very small mobile screens (<360px).

### 🟢 Nice to Have
7. **PDF tool cleanup** — Many PDF tools still use old i18n toast pattern (`String.fromCharCode` with icons) instead of the composables pattern (`useToast`). Refactor for consistency.
8. ~~**More word list sources** — Add KBBI technical terms, regional words, and scientific neologisms.~~ ✅ **Done** — Merged 175,600 new words from KBBI Edisi VI (Definisi/kbbi), bringing total to 195,193 words.
9. **Autocomplete for multiple tools** — The autocomplete + binary search pattern from sinonim could be reused in other search-heavy tools (word-counter, paste-to-md).
10. **Keyboard shortcut docs** — Add a `/shortcuts` or tooltip overlay showing available keyboard shortcuts (Tab for autocomplete, etc.).
11. **Paste to MD — Copy AI button** — Added "Copy AI" button that wraps markdown content in XML `<uploaded_file>` tags + prompt engineering instructions. When pasted into LLMs (Gemini, ChatGPT, Claude), the AI treats it as an uploaded file attachment. Amber-colored button with brain icon.
