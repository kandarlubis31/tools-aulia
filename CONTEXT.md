# ToolsAulia — Project Context

> Last updated: July 2, 2026
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

ToolsAulia adalah koleksi tools developer & produktivitas yang berjalan 100% di browser (Client-Side). Dibangun dengan Astro 5 + Tailwind CSS + TypeScript. PWA-enabled untuk offline use. Aman, cepat, dan tanpa upload data ke server.

- **Website**: [paklubis.my.id](https://paklubis.my.id)
- **GitHub**: [kandarlubis31/tools-aulia](https://github.com/kandarlubis31/tools-aulia)
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
| **AI/ML** | @imgly/background-removal (ONNX + WASM, client-side) |

## Architecture

```
src/
├── pages/          # Astro pages — one per tool + index
├── layouts/        # BaseLayout.astro (header, nav, footer, search, i18n, PWA, theme)
├── components/     # LoadingSpinner.astro, ToolCard.astro
├── composables/    # useToast, useClipboard, useDebounce, useLoading, useLocalHistory
├── styles/         # global.css (Tailwind + CSS variables + reusable classes)
├── data/           # tools.ts, new-tools.ts (single source of truth for tool definitions)
├── i18n/           # translations.ts (all UI strings, ID + EN)
├── public/         # Static assets (workers, PWA icons, word lists)
└── docs/           # agents/ (agent configs), adr/ (architectural decisions)
```

### Key Design Principles

1. **Privacy First** — All data processing happens client-side. No server uploads.
2. **Single Source of Truth** — Tool definitions live in `src/data/tools.ts`, used by both index page and search.
3. **Indonesian-first i18n** — All UI strings in `src/i18n/translations.ts` with fallback to Indonesian.
4. **Minimal Dependencies** — Prefer native browser APIs; heavy libraries loaded dynamically only on pages that need them.
5. **Monochrome + Accent Design** — Matte color palette with blue accent; hover reveals color.

## Tool Categories & Count

| Category | Count | Route Prefix | Example Tools |
|----------|-------|-------------|---------------|
| **PDF** | 16 | `/pdf/` | Merge, Split, Compress, Sign, Watermark, HTML-to-PDF |
| **Image** | 6 | `/image/` | Studio Editor, Compressor, Converter, Color Picker, HTML-to-Image, **Remove Background** |
| **Calculator** | 7 | `/calc/` | Age, BMI, Currency, Unit, Percentage, Number Base, Case |
| **Developer** | 10 | `/dev/` | JSON, Base64, Cron, URL, Markdown, Diff, Timestamp, CSS Shadow, Proxy, My IP |
| **Security** | 3 | `/security/` | Password, Hash, UUID |
| **File** | 2 | `/file/` | CSV-to-JSON, PDF-to-Markdown |
| **Utility** | 14 | `/utils/` | QR, WA Builder, Pomodoro, Todo, Word Counter, Sinonim, Paste-to-MD, Countdown 2029, Lorem, Jokes, Brainstorm, Motivation, Stopwatch |
| **Total** | **58 tools** | — | — |

## Notable Tools

- **Remove Background** (`/image/remove-bg`) — AI-powered background removal using @imgly/background-removal (ONNX + WASM). Supports background replace with solid colors or custom images. 100% client-side.
- **HTML to Image** (`/image/html-to-img`) — Live HTML/CSS editor with instant image export. Templates for cards, quotes, buttons, social posts. Background options (transparent/white/custom).
- **HTML to PDF** (`/pdf/html-to-pdf`) — Live HTML editor with A4 preview and PDF export. Paper sizes (A4/Letter/Legal), portrait/landscape, page break support.
- **Studio Editor** (`/image/editor`) — Photo editor with filters, brightness/contrast/saturation, rotation, flip, zoom, before/after comparison, undo/redo history.
- **PDF Mas Aul** (`/pdf`) — PDF hub page with category filters
- **My IP & Network** (`/dev/my-ip`) — Public IP, speed test, network info, IP history
- **Persamaan Kata** (`/utils/sinonim`) — Synonym finder using Wiktionary API + KBBI offline fallback (195k+ Indonesian words)
- **Paste to Markdown** (`/utils/paste-to-md`) — Clean Markdown converter for AI prompts with compression modes
- **Countdown 2029** (`/utils/prabowo-countdown`) — Satirical countdown timer with leaderboard and rage meter

## Design System

### Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `matte-50` → `matte-950` | Slate-inspired | Dark slate | Primary neutral palette |
| `surface` / `surface-hover` / `surface-elevated` / `surface-border` | White-based | Dark-based | Card surfaces |
| `accent-blue` | `#2563eb` | `#3b82f6` | Primary accent (hover, links) |
| `accent-mint`, `accent-amber`, `accent-sky` | Various | Various | Category accents |

### Reusable CSS Classes (in `global.css`)

- `card-base` — Rounded card with border, hover shadow, active scale
- `badge-accent` / `badge-muted` — Small label/tag
- `icon-mono` — Gray icon that turns accent-blue on group hover
- `stat-pill-default` — Stat display pill
- `section-title` — Uppercase, tracking-wide section heading
- `nav-item` / `nav-item-active` / `nav-item-inactive` — Navigation buttons
- `checkerboard` — Transparent background pattern (used in image tools)

### Animations

- `animate-fade-in` — 0.5s ease-out, +10px → 0
- `animate-fade-in-down` — 0.25s, -6px → 0
- `animate-fade-in-up` — 0.25s, +10px → 0
- `animate-slide-up` — 0.3s, bottom slide
- Astro view transitions: 0.15s fade-out + 0.2s fade-in

## Key Conventions

### Tool Data Structure (`src/data/tools.ts`)

```typescript
interface ToolDefinition {
  cat: string;        // Category id
  popular: boolean;   // Show in "Popular" section
  titleKey: string;   // i18n key
  title: string;      // ID fallback
  descKey: string;    // i18n key
  desc: string;       // ID fallback
  href: string;       // URL path
  color: string;      // Theme color hint
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
- Auto-translation via `walkAndTranslate()` DOM walker with phrase dictionary

### File Naming

- Tool pages: kebab-case matching the slug (e.g., `paste-to-md.astro`, `wa-builder.astro`, `remove-bg.astro`)
- Components: PascalCase (e.g., `ToolCard.astro`, `LoadingSpinner.astro`)
- Data files: camelCase (e.g., `tools.ts`, `new-tools.ts`)
- Composables: camelCase with `use` prefix (e.g., `useToast.ts`, `useLoading.ts`)

## Page Patterns

### Tool Page Structure
Each tool follows a consistent pattern:
1. Frontmatter imports `BaseLayout` with `pageTitle`
2. Header with gradient icon, title, description
3. Drop zone / input area (for upload-based tools)
4. Workspace area (hidden until file loaded)
5. Controls + download button
6. Inline `<style>` for page-specific CSS
7. `<script>` for client-side logic (TypeScript supported)

### Loading States
- `showToast()` from composables for success/error feedback
- `showButtonSpinner()` from `useLoading.ts` for button loading states
- Custom loading overlays with spinner + progress text for long operations

### Error Handling
- Try/catch with toast notifications
- File validation (type, size) before processing
- Graceful fallbacks (e.g., retry buttons)

## Known Decisions / Technical Notes

1. **No SSR** — Astro configured as `output: "static"`. All dynamic behavior is client-side JS.
2. **No React** — All UI is vanilla Astro + inline `<script>` tags.
3. **i18n approach** is custom-built (not astro-i18n). Uses data attributes + DOM walking with phrase dictionary.
4. **Search modal** uses debounced client-side filtering on `searchTools` array (passed as JSON script).
5. **Dynamic imports** used for heavy libraries (`@imgly/background-removal`, `html2canvas`, `html2pdf.js`) — only loaded when the tool page is used.
6. **CDN dependencies** (html2canvas, html2pdf.js) loaded via `is:inline` scripts with retry logic.
7. **@imgly/background-removal** — ONNX + WASM AI model, ~5-15MB download on first use, cached by browser + PWA.
8. **`src/data/id-words.ts`** — auto-generated word list (195,193 words from Sastrawi + KBBI Edisi VI). Do not edit manually.
9. **`scripts/`** — build/dev tools, gitignored. Contains `build-words.mjs` and `check-typos.mjs`.

## Known Bugs / Limitations

- [ ] My IP page uses deprecated Battery API (may stop working in some browsers)
- [ ] WebRTC local IP detection often returns "Diproteksi" in modern browsers
- [ ] Speed test upload uses httpbin.org which may rate-limit
- [ ] Some tools lack responsive design on very small mobile screens
- [ ] No error boundaries — JS errors on tool pages may break SPA navigation
- [ ] `id-words.ts` has pre-existing TypeScript syntax errors (unterminated strings)

## Recommended Next Steps

### High Priority
1. **Chunk size optimization** — Build warning: one chunk is 5.6 MB (2.5 MB gzipped). This is the word list (`id-words.ts`). Consider dynamic import only on the sinonim page.
2. **Add smoke tests** — Vitest & Playwright configured but 0 tests exist. At minimum: homepage loads, key tools render.
3. **Fix id-words.ts syntax errors** — Unterminated string literals prevent `npx tsc --noEmit` from passing.

### Medium Priority
4. **Responsive audit** — Review remaining tools for very small mobile screens (<360px).
5. **PDF tool cleanup** — Many PDF tools use old i18n toast pattern instead of composables pattern (`useToast`).
6. **Offline cache indicator** — Show toast or badge when results are served from cache.

### Nice to Have
7. **Autocomplete for multiple tools** — The autocomplete + binary search pattern from sinonim could be reused.
8. **Keyboard shortcut docs** — Add tooltip overlay showing available keyboard shortcuts.
9. **Unit tests for composables** — `useClipboard.test.ts`, `useDebounce.test.ts`, `useToast.test.ts` already exist; add more coverage.
