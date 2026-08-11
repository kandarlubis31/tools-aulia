# ToolsAulia — Project Context

> Last updated: August 11, 2026
> Maintained by: Aulia Iskandar Lubis

## Domain Language

| Term | Definition |
|------|------------|
| **Client-Side** | Semua pemrosesan terjadi 100% di browser. Tidak ada data yang dikirim ke server. |
| **PWA** | Progressive Web App — bisa diinstall sebagai aplikasi di HP/laptop, mendukung offline. |
| **Tool** | Halaman/fitur individual dalam koleksi (misal: Merge PDF, QR Generator, BMI Calculator). |
| **Category** | Grouping tools (PDF, Image, Calc, Dev, Security, File, Utils, Text, Data, Media). |
| **i18n** | Internasionalisasi — semua teks UI disimpan di `translations.ts` dengan kunci ID dan EN. |
| **Indonesian-first** | Bahasa Indonesia adalah bahasa utama; Inggris adalah bahasa sekunder. |
| **Hub** | Halaman koleksi per kategori (misal `/pdf`) yang juga terdaftar sebagai entry di `tools.ts`. |

## Project Overview

ToolsAulia adalah koleksi **78+ tools** developer & produktivitas yang berjalan 100% di browser (Client-Side). Dibangun dengan Astro 5 + Tailwind CSS + TypeScript. PWA-enabled untuk offline use. Aman, cepat, dan tanpa upload data ke server.

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
| **Testing** | Vitest (43 tests / 6 files, semua hijau), Playwright (dikonfigurasi) |
| **Package Manager** | pnpm (packageManager `pnpm@10.33.0`, corepack-ready) |
| **Icons** | Custom inline SVGs (Lucide-style) |
| **AI/ML** | @imgly/background-removal (ONNX + WASM, client-side) |

## Architecture

```
src/
├── pages/          # Astro pages — satu per tool + index (per kategori: pdf/, image/, calc/, dev/, security/, utils/, file/, text/, data/, media/)
├── layouts/        # BaseLayout.astro (header, nav, footer, search, i18n, PWA, theme, offline badge)
├── components/     # ToolCard, ToolPageHeader, DropZone, LoadingSpinner
├── composables/    # useClipboard, useDebounce, useLoading, useLocalHistory, useShare, useToast,
│                   # usePdfDropZone, usePdfRenderer, usePdfDownload, useCdnLib, useAudioWav
├── styles/         # global.css (Tailwind + CSS variables + reusable classes)
├── data/           # tools.ts (single source of truth), new-tools.ts (Baru Ditambahkan)
├── i18n/           # translations.ts (all UI strings, ID + EN)
├── public/         # Static assets (workers, PWA icons, word lists)
└── docs/           # agents/ (agent configs), adr/ (architectural decisions), archive/ (plan selesai)
```

### Key Design Principles

1. **Privacy First** — All data processing happens client-side. No server uploads.
2. **Single Source of Truth** — Tool definitions live in `src/data/tools.ts`, used by index page, search, nav & footer.
3. **Indonesian-first i18n** — All UI strings in `src/i18n/translations.ts` with fallback to Indonesian.
4. **Minimal Dependencies** — Prefer native browser APIs; heavy libraries loaded dynamically (pdf-lib, pdf.js) or via CDN `is:inline` (exif-js, bcryptjs, marked, DOMPurify, html2canvas).
5. **Monochrome + Accent Design** — Matte color palette with blue accent; hover reveals color.

## Tool Categories & Count

Total **79 entries** di `tools.ts` = **78 tools + 1 hub** (`/pdf`).

| Category | Count | Route Prefix | Example Tools |
|----------|-------|-------------|---------------|
| **PDF** | 20 (+hub) | `/pdf/` | Merge, Split, Compress, Sign, Watermark, Password, to-Word, Form Filler |
| **Image** | 10 | `/image/` | Studio Editor, Compressor, Cropper, Batch Resizer, EXIF, Watermark, Remove BG |
| **Developer** | 12 | `/dev/` | JSON, Base64, JWT Decoder, JSON↔TS, Cron, URL, Markdown, Diff, Timestamp, My IP |
| **Calculator** | 9 | `/calc/` | Age, BMI, Currency, Unit, Percentage, Number Base, Case, EMI, Compound Interest |
| **Utility** | 14 | `/utils/` | QR, WA Builder, Pomodoro, Todo, Word Counter, Sinonim, Notes MD, Lorem, Jokes |
| **Security** | 5 | `/security/` | Password, Hash, UUID, Bcrypt, File Encrypt |
| **File** | 2 | `/file/` | CSV-to-JSON, PDF-to-Markdown |
| **Media** | 3 | `/media/` | Audio Recorder, Waveform, Audio Trimmer |
| **Text** | 2 | `/text/` | Typing Test, Text to Speech |
| **Data** | 1 | `/data/` | Fake Data Generator |
| **Total** | **78 tools** | — | — |

> Kategori `text`, `data`, `media` ditambahkan bersama Batch 1 & 2 `plan-new-tools.md` (20 tool baru). Semua ter-registrasi penuh: tools.ts, nav dropdown, mobile menu, footer, index pills, breadcrumb, search & i18n.

## Notable Tools

- **Remove Background** (`/image/remove-bg`) — AI-powered background removal using @imgly/background-removal (ONNX + WASM). Supports background replace with solid colors or custom images. 100% client-side.
- **HTML to Image** (`/image/html-to-img`) — Live HTML/CSS editor with instant image export. Templates for cards, quotes, buttons, social posts.
- **HTML to PDF** (`/pdf/html-to-pdf`) — Live HTML editor with A4 preview and PDF export (html2pdf.js CDN).
- **Studio Editor** (`/image/editor`) — Photo editor with filters, brightness/contrast/saturation, rotation, flip, zoom, before/after, undo/redo.
- **PDF Mas Aul** (`/pdf`) — PDF hub page dengan filter kategori + badge populer.
- **PDF to Word** (`/pdf/to-word`) — Ekstraksi teks via pdf.js + DOCX builder store-only ZIP **inline tanpa dependency** (CRC32 + local/central dir + EOCD).
- **PDF Form Filler** (`/pdf/form-filler`) — Deteksi field AcroForm via pdf-lib (text/checkbox/radio/dropdown), preview halaman pdf.js, opsi flatten.
- **PDF Password** (`/pdf/password`) — Tambah/hapus password via pdf-lib `setEncryption()`.
- **File Encrypt** (`/security/file-encrypt`) — AES-256-GCM + PBKDF2 (100k iterasi), format `.taenc` dengan restore nama file.
- **Bcrypt** (`/security/bcrypt`) — bcryptjs via CDN, cost 4–14, hash + verify.
- **Image Cropper** (`/image/cropper`) — Drag + 8 handle, preset rasio 1:1/16:9/4:5, rotate 90°, rule of thirds.
- **Audio Recorder** (`/media/audio-recorder`) — MediaRecorder + level meter live + timer, export WAV (via `useAudioWav`) atau WebM.
- **Audio Trimmer** (`/media/audio-trimmer`) — Drag marker 🟢🔴 di waveform, preview, export WAV (composable `useAudioWav`).
- **Waveform Visualizer** (`/media/waveform`) — Decode WebAudio, waveform 240 bar, seek klik, speed & volume.
- **Fake Data Generator** (`/data/fake-data`) — Dataset Indonesia built-in (tanpa CDN), 10 field, export JSON/CSV.
- **Typing Test** (`/text/typing-test`) — Timer 15/30/60s, WPM/CPM/akurasi live, teks ID/EN, rating.
- **Notes (Markdown)** (`/utils/notes-md`) — marked + DOMPurify preview, autosave + history localStorage, export .md.
- **My IP & Network** (`/dev/my-ip`) — Public IP, speed test, network info, IP history.
- **Persamaan Kata** (`/utils/sinonim`) — Synonym finder using Wiktionary API + KBBI offline fallback (195k+ Indonesian words).
- **Paste to Markdown** (`/utils/paste-to-md`) — Clean Markdown converter for AI prompts (mammoth untuk DOCX).
- **Countdown 2029** (`/utils/prabowo-countdown`) — Satirical countdown timer with leaderboard and rage meter.

## Design System

### Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `matte-50` → `matte-950` | Slate-inspired | Dark slate | Primary neutral palette |
| `surface` / `surface-hover` / `surface-elevated` / `surface-border` | White-based | Dark-based | Card surfaces |
| `accent-blue` | `#0284c7` (sky-600, WCAG AA 4.6:1) | `#38bdf8` (8:1) | Primary accent (hover, links) |
| `accent-blue-rgb` | RGB triplet (dual-var) | RGB triplet | Tailwind opacity modifiers (`bg-accent-blue/10`) |
| `accent-mint`, `accent-amber`, `accent-sky` | Various | Various | Category accents |

> **Dual-var accent**: `--accent-blue` (hex, untuk `var()` langsung) + `--accent-blue-rgb` (triplet, untuk Tailwind `/alpha`). Ganti ke `var()` polos tanpa triplet akan **menghilangkan 26 class opacity** dari build — sudah diverifikasi & difix.

### Reusable CSS Classes (in `global.css`)

- `card-base` — Rounded card with border, hover shadow, active scale
- `badge-accent` / `badge-muted` / `badge-popular` — Small label/tag (badge-popular = amber pill)
- `icon-mono` — Gray icon that turns accent-blue on group hover
- `stat-pill-default` — Stat display pill
- `section-title` — Uppercase, tracking-wide section heading
- `nav-item` / `nav-item-active` / `nav-item-inactive` — Navigation buttons
- `checkerboard` — Transparent background pattern (used in image tools)
- **Aksesibilitas**: dark text rescue `.dark .text-matte-300/400/500` (≥4.5:1) · `@media (pointer: coarse)` min-height 44px untuk semua kontrol

### Components

- **ToolPageHeader** (`components/ToolPageHeader.astro`) — Header tool page seragam: icon gradient + title (i18n) + desc. Dipakai 50+ halaman.
- **DropZone** (`components/DropZone.astro`) — Drop zone seragam dengan label/sub-label i18n, opsi `overlay`, multiple, hint, extra input.
- **ToolCard** (`components/ToolCard.astro`) — Card tool dengan badge populer + guard isSoon.
- **Breadcrumb** — Navigasi Home / Kategori / Tool (ganti back button).

### Animations

- `animate-fade-in` — 0.5s ease-out, +10px → 0
- `animate-fade-in-down` — 0.25s, -6px → 0
- `animate-fade-in-up` — 0.25s, +10px → 0
- `animate-slide-up` — 0.3s, bottom slide
- Scroll reveal (`animate-on-scroll`) di index
- Astro view transitions: 0.15s fade-out + 0.2s fade-in

## Key Conventions

### Tool Data Structure (`src/data/tools.ts`)

```typescript
interface ToolDefinition {
  cat: string;        // Category id (pdf|image|calc|dev|security|utils|file|text|data|media)
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
  seoTitle?: string;  // SEO title
  seoDesc?: string;   // SEO description
}
```

### New Tools Tracking (`src/data/new-tools.ts`)

Array of hrefs ordered newest-first. Index page shows up to 5 from this list. Setiap tool baru wajib masuk sini biar muncul di "Baru Ditambahkan".

### i18n System (`src/i18n/translations.ts`)

- All UI strings stored in `translations` Record with `{ id: string, en: string }`
- Language stored in `localStorage.getItem('lang')` — 'id' or 'en'
- `data-i18n` attribute on elements for automatic translation
- `data-i18n-attr` for placeholder translation
- i18n scripts loaded async from `/i18n-phrases.js`
- Auto-translation via `walkAndTranslate()` DOM walker + `processI18n()` untuk node dinamis
- **Aturan baru**: JS toast/string pakai wrapper `window._tToast(msg)` biar EN toggle jalan; key UI baru wajib diregistrasi di `translations.ts` (ID + EN)

### File Naming

- Tool pages: kebab-case matching the slug (e.g., `paste-to-md.astro`, `remove-bg.astro`)
- Components: PascalCase (e.g., `ToolPageHeader.astro`, `DropZone.astro`)
- Data files: camelCase (e.g., `tools.ts`, `new-tools.ts`)
- Composables: camelCase with `use` prefix (e.g., `useToast.ts`, `usePdfDropZone.ts`)

## Page Patterns

### Tool Page Structure
Each tool follows a consistent pattern:
1. Frontmatter imports `BaseLayout` + `ToolPageHeader` (+ `DropZone` untuk upload tools)
2. `ToolPageHeader` dengan icon gradient + title (titleKey) + desc (descKey)
3. `DropZone` seragam / input area
4. Workspace area (hidden until file loaded)
5. Controls + download button
6. `<script>` untuk client-side logic (TypeScript supported), dibungkus `astro:page-load`
7. Toast via `window.showToast?.(window._tToast ? window._tToast(msg) : msg, type)`

### PDF Tools Composables (`src/composables/`)

Mayoritas 16 PDF tools sudah dimigrasi ke 3 composable (hemat ~2-3× baris duplikat):
- `usePdfDropZone(id, inputId, opts)` — wiring drop zone + validasi file + ukuran maks
- `usePdfRenderer()` — render halaman pdf.js ke canvas
- `usePdfDownload(bytes, filename)` — download blob
- Satu-satunya yang belum dimigrasi: `html-to-pdf.astro` (pola html2pdf CDN berbeda)

### Loading States
- `showToast()` from composables for success/error feedback
- `showButtonSpinner()` from `useLoading.ts` for button loading states
- Custom loading overlays with spinner + progress text for long operations

### Error Handling
- Try/catch with toast notifications
- File validation (type, size) before processing
- Graceful fallbacks (e.g., retry buttons)

## Known Decisions / Technical Notes

1. **No SSR** — Astro configured as `output: "static"`. All dynamic behavior is client-side JS. **Enforced** by `scripts/check-client-side.mjs` (prebuild) — fails on any server-side pattern in `src/`.
2. **No React** — All UI is vanilla Astro + inline `<script>` tags.
3. **i18n approach** is custom-built (not astro-i18n). Uses data attributes + DOM walking with phrase dictionary.
4. **Search modal** uses debounced client-side filtering on `searchTools` array (passed as JSON script).
5. **Dynamic imports** used for heavy libraries (`pdf-lib`, `pdf.js` global, `@imgly/background-removal`, `useAudioWav`) — only loaded when needed.
6. **CDN dependencies** (whitelist CSP: `cdnjs.cloudflare.com`, `cdn.jsdelivr.net`, `unpkg.com`) — html2canvas, html2pdf.js, pdf.js 3.11.174 (global `window.pdfjsLib` dari BaseLayout), exif-js, bcryptjs (`dcodeIO.bcrypt`), marked + DOMPurify. Dimuat via `is:inline` scripts; `waitForCdnLib()` retry untuk yang async.
7. **@imgly/background-removal** — ONNX + WASM AI model, ~5-15MB download on first use, cached by browser + PWA.
8. **`public/id-words.json`** — auto-generated word list (195,193 words). Do not edit manually. Dynamic `fetch()` hanya di halaman sinonim (anti-bloat bundle).
9. **`scripts/`** — build/dev tools, gitignored: `build-words.mjs`, `check-typos.mjs`, `generate-assets.mjs`, `new-tool.mjs`, `check-client-side.mjs` (garansi client-side).
10. **`mammoth` npm dep** — used by `paste-to-md.astro` for DOCX conversion via dynamic `import()`.
11. **`global.d.ts`** — window type declarations (`showToast`, `_tToast`, `showButtonSpinner`, `pdfjsLib`, `waitForCdnLib`, dll).
12. **Minimal ZIP builder** — `pdf/to-word.astro` punya store-only ZIP writer inline (CRC32 table + local file header + central directory + EOCD) tanpa dependency baru — pattern reusable untuk export DOCX/ZIP.
13. **`useAudioWav.ts`** — composable media: `decodeAudioFile` (Web Audio), `encodeWav` (PCM 16-bit), `computePeaks` (downsample), `drawWaveform` (bar + progress highlight). Dipakai audio-recorder, waveform, audio-trimmer.
14. **Permissions-Policy** — `vercel.json` mengizinkan mikrofon (`microphone=*`) untuk media tools; `connect-src` https-only (fix mixed-content ip-api).
15. **Offline UX** — BaseLayout punya cache-aware toast + offline-ready badge; PWA precache 145+ entries.

## Client-Side Guarantee (Enforced)

> **Prinsip inti project: SEMUA pemrosesan terjadi di browser. Data user tidak pernah dikirim ke server.**

- ✅ **Bukti arsitektur** — `output: "static"` (tidak ada SSR); semua library pemrosesan (pdf.js, pdf-lib, @imgly/background-removal, mammoth, js-tiktoken, html2canvas, Web Crypto, Web Audio, MediaRecorder) jalan client-side; Web Workers (`public/workers/*.js`) dieksekusi di browser.
- ✅ **Guard otomatis** — `scripts/check-client-side.mjs` memindai `src/` + `astro.config.mjs` untuk pola server-side (`import.meta.env.SSR`, `Astro.locals`, `prerender = false`, `node:*` imports, `output: "server"`) dan **exit 1** kalau ada pelanggaran. **Otomatis jalan di `npm run build`** (via `prebuild`) — build gagal kalau garansi dilanggar. Semua 20 tool baru Batch 1-2 lolos guard.
- ⚠️ **Satu-satunya pengecualian** — `src/pages/api/proxy.ts`: CORS forwarding proxy untuk tool `dev/proxy` & `calc/currency`. Bukan pemrosesan — hanya forward request ke allowlist 6 domain (anti-SSRF), tanpa upload/storage data user.
- **Rule untuk developer**: jangan tambah endpoint server, jangan pindah processing ke server, jangan set `output: "server"`. Kalau butuh fitur baru → proses di browser.

## Known Bugs / Limitations

- [ ] My IP page uses deprecated Battery API (may stop working in some browsers) — partially mitigated: replaced with connection type
- [ ] WebRTC local IP detection often returns "Diproteksi" in modern browsers
- [ ] Speed test upload uses httpbin.org which may rate-limit
- [ ] No error boundaries — JS errors on tool pages may break SPA navigation (error boundary di BaseLayout masih open)
- [ ] `html-to-pdf.astro` belum dimigrasi ke PDF composables (pola html2pdf CDN beda)
- [ ] Audio tools: re-encode penuh ke WAV untuk playback = 2× memori — limit file 60MB agresif untuk mobile
- [x] ~~`id-words.ts` 5.6MB chunk~~ → Fixed: deleted, replaced by `public/id-words.json` via dynamic fetch
- [x] ~~8 `@ts-ignore` in prabowo-countdown~~ → Fixed: global.d.ts declarations + `_staleIntervals`
- [x] ~~Editor crop & compare listener leaks~~ → Fixed: 8 handlers converted to named functions with `astro:page-leave` cleanup
- [x] ~~22× getContext('2d') without null guards~~ → Fixed: null checks added to all canvas contexts
- [x] ~~JPG to PDF bare minimum~~ → Upgraded: preview grid, drag-to-reorder, page size, fit mode, output mode toggle, WEBP support
- [x] ~~Responsive <360px bermasalah~~ → Fixed: audit 10 tool, patch 3 critical (cron, wa-builder, html-to-img) + touch target 44px global (pointer:coarse)
- [x] ~~Kontras sub-AA~~ → Fixed: accent dual-var + dark text rescue matte-300/400/500 (semua ≥4.5:1) + sisa matte-300 light (word-counter, split, rotate, my-ip)

## Recommended Next Steps

### Segera
1. **Commit Batch 1 + 2** (`plan-new-tools.md`) — 20 tool baru + aksesibilitas matte-300 belum di-commit (numpuk di working tree).
2. **Lanjut Batch 3 (B3: Dev & Data)** — Regex Tester, JSON↔YAML, SQL Formatter, CSV Editor, YAML↔JSON, dsb (10 tools, lihat `docs/plan-new-tools.md`).
3. **Error boundary di BaseLayout** — JS error pada tool page jangan bikin SPA blank (sudah ada di rencana, belum dieksekusi).

### Medium Priority
4. **PWA cache optimization** — `kbbi-sinonim.json` (9.8MB) + `id-words.json` (2.7MB) runtime-cached saat sinonim page; pertimbangkan loading indicator.
5. **HTML-to-PDF migrasi** — satu-satunya PDF tool yang belum pakai composables.
6. **Audio memory guard** — turunkan limit file / peringatan untuk media tools.

### Nice to Have
7. **Autocomplete reuse** — pola autocomplete + binary search sinonim bisa dipakai tool lain.
8. **Keyboard shortcut docs** — tooltip overlay shortcut yang tersedia.
9. **More unit tests** — 43 tests hijau; tambah coverage untuk usePdf*, useAudioWav.
