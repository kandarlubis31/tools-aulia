# Project Context — ToolsAulia

> **Last updated:** August 12, 2026 (Batch 11: +10 tools, 168 total)
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
| **Utils** | 19 | wa-builder, qr, jokes, brainstorm, pomodoro, todo, word-counter, prabowo-countdown, paste-to-md, stopwatch, lorem, motivation, sinonim, notes-md, decision-wheel, expense-tracker, wordle-id, habit-tracker, qr-scanner |
| **Text** | 13 | typing-test, text-to-speech, summarizer, readability, fancy, emoji, speech-to-text, lang-detect, anagram, morse, rot13, random-text, to-pdf |
| **Data** | 10 | csv-editor, xlsx-viewer, yaml-json, ical, fake-data, xml-formatter, vcard, barcode, geojson, barcode-reader |
| **Media** | 10 | audio-recorder, waveform, audio-trimmer, metronome, tone-generator, white-noise, screen-recorder, scale-ref, video-to-gif, beat-maker |
| **Network** | 11 | http-builder, rest-client, dns-lookup, speed-test, latency, websocket, http-headers, ua-parser, port-ref, whois, ssl |
| **File** | 2 | csv-json, pdf-to-md |
| **Life** | 4 | mood-tracker, certificate, snake, magic-8ball |

---

## Architecture

### Key Files
- `src/data/tools.ts` — Tool registry (170 entries: 168 tools + PDF hub + 1 index)
- `src/i18n/translations.ts` — All i18n keys (tool, header, UI) — ~2300+ lines
- `src/layouts/BaseLayout.astro` — Global layout + nav + footer + i18n toggle
- `src/styles/global.css` — Tailwind + custom CSS (card-grid, hover-lift, content-visibility)
- `vercel.json` — CSP headers + Permissions-Policy
- `src/data/new-tools.ts` — New tools list (110 entries, homepage shows 6 newest)
- `scripts/check-client-side.mjs` — Guardrail: ensures no server-side processing

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

---

## Testing

- **Unit tests:** 43 tests (6 files) — vitest
- **Guardrail:** `scripts/check-client-side.mjs` — verifies client-side processing
- **Build:** `pnpm astro build` → Vercel adapter (~28-55s, 330 precache entries, ~33.2MB; was 32.9MB + 6.4MB dead gif removed)
- **CI:** Vercel auto-deploy on push to main

---

## Plan Status

- **Plan 100 Tools:** `docs/plan-new-tools.md` — ✅ COMPLETE (110 tools, 58 → 168)
- **Plan 100 Tools:** `docs/plan-new-tools.md` — ✅ COMPLETE (110 tools, 58 → 168)
- **Plan 59 Tools:** `docs/plan-59-tools.md` — 🎉 COMPLETE (59/59, 168 → 227)
- **Plan Improve:** `docs/plan-improve.md` — ✅ COMPLETE (Batch A: UX, Batch B: Quality)
- **Plan v2 Polish:** `docs/plan-v2-polish.md` — 🚀 **Batch C DONE** (showcase /top-20, size audit, tests 62). Next: Batch D (lazy load, analytics, changelog)
- **B12-B17:** ✅ SELESAI (59 tools added)
- **227 tools** — 12 kategori, 330 precache entries, `/showcase` (Top 20) page
- **Pagination:** 36 tools per page — smooth UX untuk 227 tools
- **UI/UX Optimization:** ✅ SELESAI (Aug 2026) — compact hero, dense grid, hover lift, no tilt JS

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

# Add new tool
# 1. Add entry to src/data/tools.ts
# 2. Add i18n keys to src/i18n/translations.ts
# 3. Create page in src/pages/<category>/<slug>.astro
# 4. Import BaseLayout + ToolPageHeader
# 5. Add href to TOP of src/data/new-tools.ts
# 6. Add <script> with astro:page-load event listener
```
