# Project Context — ToolsAulia

> **Last updated:** August 18, 2026 (Video Studio /editor — produksi di-fix: COI headers + worker files + SW allowlist)
> **Stack:** Astro 5 · Tailwind CSS · TypeScript · 100% client-side (zero server processing)
> **PWA:** Service Worker + Workbox precache · offline-first
> **i18n:** Indonesian-first + English toggle (localStorage)

---

## Tool Categories (168 tools + PDF hub, 12 kategori)

| Category | Tools | Key tools |
|----------|-------|-----------|
| **PDF** | 28+hub | compress, merge, split, sign, watermark, to-word, form-filler, redact, thumbnails, compare, booklet, to-excel, optimizer, repair |
| **Dev** | 24 | base64, json, markdown, diff, timestamp, url, proxy, my-ip, cron, css-shadow, regex, json-yaml, sql, subnet, gradient, html-minifier, chmod, jwt, json-to-ts, color-harmony, contrast, grid, json-schema |
| **Calc** | 18 | age, bmi, currency, number, percentage, unit, case, emi, compound-interest, timezone, scientific, date-diff, fraction, number-words, matrix, work-hours, bmr, random |
| **Image** | 18 | color, compressor, converter, editor, html-to-img, remove-bg, watermark, cropper, batch-resizer, exif, ascii, meme, palette, collage, gif-maker, favicon, to-pdf, color-convert |
| **Security** | 12 | password, hash, uuid, bcrypt, file-encrypt, cipher, totp, steganography, luhn, password-strength, hmac, token |
| **Utils** | 20 | wa-builder, qr, jokes, brainstorm, pomodoro, todo, word-counter, prabowo-countdown, paste-to-md, stopwatch, lorem, motivation, sinonim, notes-md, decision-wheel, expense-tracker, wordle-id, habit-tracker, qr-scanner, nama-generator |
| **Text** | 13 | typing-test, text-to-speech, summarizer, readability, fancy, emoji, speech-to-text, lang-detect, anagram, morse, rot13, random-text, to-pdf |
| **Data** | 10 | csv-editor, xlsx-viewer, yaml-json, ical, fake-data, xml-formatter, vcard, barcode, geojson, barcode-reader |
| **Media** | 17 | audio-recorder, waveform, audio-trimmer, metronome, tone-generator, white-noise, screen-recorder, scale-ref, video-to-gif, beat-maker, media-info, audio-viz, video-thumb, audio-eq, audio-convert, video-editor, **video-studio** |
| **Network** | 11 | http-builder, rest-client, dns-lookup, speed-test, latency, websocket, http-headers, ua-parser, port-ref, whois, ssl |
| **File** | 2 | csv-json, pdf-to-md |
| **Life** | 4 | mood-tracker, certificate, snake, magic-8ball |

---

## Architecture

### Key Files
- `src/data/tools.ts` — Tool registry (170 entries: 168 tools + PDF hub + 1 index)
- `src/i18n/translations.ts` — All i18n keys (tool, header, UI) — ~2300+ lines
- `src/layouts/BaseLayout.astro` — Global layout + nav + footer + i18n toggle
- `src/pages/og/[slug].png.ts` — Build-time OG image generator (231 PNG statis via resvg-js, font TTF di `src/assets/fonts/`)
- `scripts/woff-to-ttf.mjs` — Converter WOFF → TTF (resvg-js tidak bisa load WOFF)
- `src/styles/global.css` — Tailwind + custom CSS (card-grid, hover-lift, content-visibility)
- `vercel.json` — CSP headers + Permissions-Policy
- `src/data/new-tools.ts` — New tools list (110 entries, homepage shows 6 newest)
- `scripts/check-client-side.mjs` — Guardrail: ensures no server-side processing
- `scripts/check-inline-scripts.mjs` — Guardrail: blocks TS/bare-import in attributed `<script>` (emitted raw) — runs in `prebuild`

### Composables (17)
- `useClipboard.ts` — Copy to clipboard
- `useDebounce.ts` — Input debouncing
- `useLoading.ts` — Loading state management
- `useLocalHistory.ts` — LocalStorage history
- `useShare.ts` — Web Share API
- `useToast.ts` — Toast notifications
- `useCdnLib.ts` — Dynamic CDN library loader
- `usePdfDropZone.ts` — PDF drag-and-drop zone
- `usePdfRenderer.ts` — PDF page rendering
- `usePdfDownload.ts` — PDF download helper
- `useAudioWav.ts` — Audio decode/encode WAV

### Components (4)
- `BaseLayout.astro` — Global layout with nav, footer, i18n, offline badge
- `ToolPageHeader.astro` — Standardized tool page header with gradient, icon, breadcrumb
- `DropZone.astro` — Reusable file drop zone (used across PDF + image tools)
- `ToolCard.astro` — Compact tool card (p-3, icon 28px, line-clamp-1 desc, hover lift)

---

## Homepage Architecture

### Layout Flow
```
Hero (compact: 8px padding, inline stats, no buttons)
  → Bento Category Grid (6 tiles, 2→6 cols responsive)
  → New Tools Chips (6 newest, compact inline)
  → Sticky Filter Bar (categories + search + sort)
  → Card Grid (2→6 cols, content-visibility: auto lazy render)
  → Empty State (shown when filter/search has 0 results)
```

### Performance Optimizations (Aug 2026)
- **No 3D tilt JS** — Removed `mousemove` + `requestAnimationFrame` on 139 cards
- **CSS hover lift** — Simple `translateY(-2px)` + shadow transition (GPU-friendly)
- **No animated blobs** — Static grid background only (zero GPU cost)
- **content-visibility: auto** — Below-fold cards skip paint until scrolled into view
- **Compact cards** — `p-3`, icon `w-7 h-7`, description `line-clamp-1`
- **Dense grid** — 6 columns at 1440px, 5 at 1024px, 4 at 768px (gap 8px)
- **Popular badge** — Emoji `🔥` + "Populer" text with i18n support

### Color System (Matte Palette)
- **Icon tiles** — 3 families: Blue (PDF/Dev), Emerald (Calc/Image), Slate (Security/Utils/Text)
- **Light mode** — All icons matte gray, unified look
- **Dark mode** — Accent-colored icons per family

---

## Design System

- **Primary:** `#0284c7` (sky-600) + `#38bdf8` (sky-400) with RGB triplet for CSS variables
- **Dark mode:** `dark:` prefix, surface colors via Tailwind config
- **Typography:** Plus Jakarta Sans (headings) + Inter (body) + JetBrains Mono (code)
- **Touch targets:** Minimum 44px for mobile accessibility (`@media (pointer: coarse)`)
- **Accent colors:** Dual CSS variables (`--accent-blue` + `--accent-blue-rgb`)
- **Card grid:** Responsive `2 → 3 → 4 → 5 → 6` columns, `gap: 0.5rem`
- **Card hover:** `translateY(-2px)` + shadow lift (no 3D perspective)
- **WCAG contrast:** Dark mode text-matte overrides for AA compliance

---

## Known Decisions

1. **100% client-side** — No server processing. All file ops in browser via Web APIs
2. **PDF processing** — pdf.js for reading, pdf-lib for writing (CDN loaded)
3. **Image processing** — Canvas API exclusively
4. **Audio processing** — Web Audio API + MediaRecorder
5. **CSP policy** — Strict Content-Security-Policy in vercel.json
6. **i18n pattern** — `data-i18n` attributes + `_tToast()` wrapper for JS strings
7. **Minimal ZIP builder** — Inline ZIP for PDF-to-Word (no JSZip dependency)
8. **Permissions-Policy** — Microphone access granted for audio tools
9. **Performance-first homepage** — No JS-driven animations on card grid, CSS-only hover effects
10. **Video editing (FFmpeg)** — `@ffmpeg/ffmpeg` + `@ffmpeg/core` 0.12.9 self-hosted at `public/vendor/ffmpeg/` (ESM core + 32MB wasm + `font.ttf` buat drawtext). Wasm & font TIDAK di-precache — runtime-cached (`ffmpeg-core`) setelah pemakaian pertama. CSP `media-src 'self' blob: data:` untuk preview playback. Single-threaded core, re-encode ke H.264/AAC (maks 720p) biar concat-safe. Filter per-klip: `transpose` (rotasi), `crop` (center aspect), `scale/pad`, `drawtext` (watermark), `setpts`+`atempo` (speed), `volume`/`-an` (volume/mute). Transisi antar klip via `xfade` (video) + `acrossfade` (audio) chain di `filter_complex`. Sekarang berperan sebagai **fallback export** (audio akurat + codec edge-case).
11. **Video editing (real-time engine)** — Preview pakai Canvas 2D compositor (`useVideoCompositor.ts`, `computeTimelineLayout` shared video+audio) + WebCodecs sequential decode (`createSequentialFrameSource`, Mediabunny `VideoSampleSink.samples`) + Web Audio (`useAudioEngine.ts`: `decodeAudioData` per klip, preview via `AudioBufferSourceNode` + gain envelope crossfade, export render via `OfflineAudioContext`). Export utama = WebCodecs GPU (`exportTimeline` → `CanvasSource` + `AudioBufferSource` AAC → MP4), fallback FFmpeg. Semua 100% client-side, file tak di-upload.

---

## Testing

- **Unit tests:** 43 tests (6 files) — vitest
- **Guardrail:** `scripts/check-client-side.mjs` (client-side only) + `scripts/check-inline-scripts.mjs` (inline scripts murni JS) — keduanya jalan di `prebuild`
- **Build:** `pnpm astro build` → Vercel adapter (~28-55s, 330 precache entries, ~33.2MB; was 32.9MB + 6.4MB dead gif removed)
- **CI:** Vercel auto-deploy on push to main

---

## Plan Status

- **Plan 100 Tools:** `docs/plan-new-tools.md` — ✅ COMPLETE (110 tools, 58 → 168)
- **Plan 100 Tools:** `docs/plan-new-tools.md` — ✅ COMPLETE (110 tools, 58 → 168)
- **Plan 59 Tools:** `docs/plan-59-tools.md` — 🎉 COMPLETE (59/59, 168 → 227)
- **Plan Improve:** `docs/plan-improve.md` — ✅ COMPLETE (Batch A: UX, Batch B: Quality)
- **Plan v2 Polish:** `docs/plan-v2-polish.md` — 🎉 **ALL BATCHES COMPLETE** (C: showcase+audit+tests, D: lazy-load+analytics+changelog+RSS, E1: OG images, E2: share button, E3: feedback widget). 62 tests, Umami AKTIF, guardrail inline-script.
- **OG Images (E1):** ✅ SELESAI — 231 PNG statis per-tool di-generate saat build, `og:image` otomatis per halaman, sitemap & precache bersih
- **Bugfix JS-inline (Aug 2026):** ✅ SELESAI — TS syntax yang bocor ke `<script is:inline>` mematikan tool. Fix: html-to-img, certificate, BaseLayout (search modal + shortcut + scroll-reveal + error boundary), 7 halaman PDF (`<script type="module">` raw → `<script>` + static import pdf-lib), prabowo-countdown. **Aturan: Astro cuma bundle `<script>` TANPA atribut** — jangan pakai `type="module"`/`id`/`is:inline` kalau mau diproses esbuild
- **Share Button (E2):** ✅ SELESAI — tombol "Bagikan" di ToolPageHeader (semua tool page): Web Share API + fallback copy URL, track event `share` via Umami
- **Feedback Widget (E3):** ✅ SELESAI — tombol "🐛 Lapor Bug" floating di pojok kiri bawah → modal form → GitHub Issues pre-filled (deskripsi, halaman, user agent, timestamp), semua halaman via BaseLayout
- **Analytics:** Umami Cloud aktif (website ID `e52b94c6...`) — page views + event `tool_use`
- **B12-B17:** ✅ SELESAI (59 tools added)
- **227 tools** — 12 kategori, 331 precache entries, `/showcase` (Top 20) + `/changelog` + `/rss.xml` pages
- **Pagination:** 36 tools per page — smooth UX untuk 227 tools
- **UI/UX Optimization:** ✅ SELESAI (Aug 2026) — compact hero, dense grid, hover lift, no tilt JS
- **Video Editor (Phase 1):** ✅ — `/edit-video` (FFmpeg.wasm client-side): import multi-klip, trim/split, reorder, merge, export MP4. Self-hosted core di `public/vendor/ffmpeg/` + runtime-cache SW.
- **Video Editor (Phase 2):** ✅ — efek per-klip: speed (0.25–4×), volume/mute, rotasi (0/90/180/270), crop (center aspect preset), + watermark teks global (drawtext, font self-host).
- **Video Editor (Phase 3):** ✅ — timeline horizontal (single track): blok ∝ durasi, drag-reorder, edge-trim, playhead + click-to-seek; transisi antar klip (fade/fadeblack/slide/wipe) via `xfade`+`acrossfade`. Full multi-track NLE (layer video/audio/teks + keyframes + preview real-time) masih di luar scope ffmpeg.wasm batch-encode.
- **Video Editor (Engine v2, real-time):** ✅ — preview real-time (Canvas compositor + transisi/efek) + **audio preview** (Web Audio, suara saat play) + **export WebCodecs GPU** (Mediabunny `CanvasSource`+`AudioBufferSource` → MP4) dengan fallback FFmpeg. 3 modul fondasi: `useVideoCompositor.ts` (compositor), `useAudioEngine.ts` (Web Audio preview+render), `useWebCodecsExporter.ts` (WebCodecs decode/encode/mux + `createSequentialFrameSource` streaming 60fps).
- **Video Studio (`/editor`, OmniClip):** ✅ — editor video lengkap ala CapCut (multi-track timeline, trim/split, efek & filter, teks, audio, transisi, export hingga 4K) via **OmniClip** (MIT, opensource) yang di-vendor ke `omniclip/` + di-serve statis di `/editor`. PostHog analytics di-strip, ffmpeg core diarahkan ke self-host `/vendor/ffmpeg/`. Build Windows: `patch-turtle.mjs` + `editor/build-dist.mjs` → `public/editor/`. SW ToolsAulia tidak precache `/editor` (app standalone).
  - **⚠️ COI (Cross-Origin Isolation) WAJIB:** ffprobe-wasm worker bikin `WebAssembly.Memory({shared:true})` tanpa fallback → butuh `SharedArrayBuffer`. Header di `vercel.json` source `/editor(.*)`: `COOP: same-origin` + `COEP: credentialless` (bukan require-corp — biar CDN jsdelivr/fonts tetap jalan). **Pattern source harus `/editor(.*)`** — format `/editor(?:/(.*))?` TIDAK di-support matcher Vercel (header diam-diam gak ke-apply). CSP global juga butuh `blob:` di `connect-src` (worker fetch wasm via blob URL).
  - **Worker files wajib ada:** bundle (`main.bundle.min.js`) spawn module workers via `new URL(...)` relatif ke bundle → resolve 404. `build-dist.mjs` copy worker subtree dari `omniclip/x/` (mirror layout biar relative imports valid: `context/controllers/video-export/parts/{decode,encode}_worker.js` + `tools/BinaryAccumulator/tool.js`, `context/controllers/collaboration/parts/{opfs-worker,opfs-manager}.js` — opfs-manager import opfs-tools dari jsdelivr CDN — dan `utils/wait.js`) + rewrite 5 URL worker di bundle ke path absolut `/editor/...`.
  - **`public/editor/node_modules/` WAJIB di-commit:** closure runtime (43 file) ke-ignore `.gitignore` global (`node_modules/` + `dist/`) → 404 produksi → stuck loading. Kedua pattern di-scope ke root (`/node_modules/`, `/dist/`). Kalau rebuild dist, jangan lupa commit ulang isi `public/editor/`.
  - **SW jangan intercept `/editor`:** `navigateFallbackAllowlist: [/^(?!\/editor(?:$|\/))/]` di `astro.config.mjs` — kalau SW serve `/offline/` (tanpa header COI) + self-heal, malah nge-hapus semua cache PWA tiap kunjungan.
- **Nama Generator Indonesia (`/utils/nama-generator`):** ✅ — generate nama khas 11 suku (Jawa, Sunda, Batak, Minang, Betawi, Bali, Melayu, Tionghoa, Arab, Ambon, Papua) dengan marga (Batak/Tionghoa/Ambon/Papua), gelar (Sutan/Datuk, I Gusti/Dewa), patronimik bin/binti (Melayu/Arab), urutan lahir (Wayan/Made/Nyoman/Ketut), format 1–3 kata, filter gender, toggle budaya. Data kurasi di `src/data/indonesian-names.ts` (100% lokal, offline).

---

## Quick Commands

```bash
# Dev server
pnpm dev

# Build
pnpm build

# Test
pnpm test

# Guardrail check
node scripts/check-client-side.mjs
node scripts/check-inline-scripts.mjs   # inline scripts (is:inline/type=module) harus murni JS

# Add new tool
# 1. Add entry to src/data/tools.ts
# 2. Add i18n keys to src/i18n/translations.ts
# 3. Create page in src/pages/<category>/<slug>.astro
# 4. Import BaseLayout + ToolPageHeader
# 5. Add href to TOP of src/data/new-tools.ts
# 6. Add <script> with astro:page-load event listener
```
