# Plan: v2 Polish — Performance + Analytics + Growth

> Created: August 12, 2026
> Status: 🚀 **Batch C + D SELESAI** — menunggu Batch E (Growth)
> Scope: 227 tools existing, 328 precache, 12 kategori

---

## ✅ Execution Log — Batch D (Architecture)

**Commit:** `8d8246c` · Build ✅ 25s · 331 precache · Tests 62/62

### D1. Lazy Load Tool Pages ✅ (VERIFIED — sudah complete)
- **Audit: 0 static npm imports** di semua 227 halaman tool — semua library berat (pdf-lib, mammoth, js-tiktoken, marked, qrcode, fflate, html2canvas, html2pdf, imgly) sudah dynamic import / CDN (useCdnLib)
- Astro code-split per halaman sudah aktif sejak migrasi PDF composables
- Tidak ada perubahan yang diperlukan

### D2. Analytics Umami ✅ (env-gated)
- Script Umami di `<head>` BaseLayout — **hanya render kalau env var diset**: `PUBLIC_UMAMI_WEBSITE_ID` (required) + `PUBLIC_UMAMI_SRC` (opsional, default cloud.umami.is)
- `umami.track('tool_use', { tool: href })` di klik tool card (index.astro) — data tool paling laris!
- ⏳ **Menunggu user**: daftar Umami Cloud → set 2 env var di Vercel → analytics langsung jalan

### D3. Changelog + RSS ✅
- Halaman **`/changelog`**: timeline 9 entri (v1.0 Launch → v2.6 Batch C), version badge, tag chips warna, tombol Subscribe RSS
- **`/rss.xml`**: auto-generated dari `src/data/changelog.ts` (satu sumber data, zero duplikasi), valid XML, anchor `#v2-6` nyambung ke artikel
- Footer: link 📋 Changelog + 📡 RSS Feed
- 14 i18n keys baru (`changelog.*` + `footer.changelog` + `footer.rss`)

---

## ✅ Execution Log — Batch C (Quick Wins)

**Commit:** `b592342` · Build ✅ 28.7s · 330 precache · Tests 62/62 (+19)

### C1. Top 20 Showcase ✅
- Halaman `/showcase` baru — hero star icon + 2 section:
  - **🔥 Paling Sering Dipakai**: per-user, di-render dari localStorage `toolUsage` (hidden kalau belum ada data)
  - **⭐ Pilihan Editor**: 20 tools kurasi server-rendered (SEO-friendly) + rank badge + category chip
- CTA "⭐ Top 20 Tools" di hero homepage → `/showcase`
- 10 i18n keys baru (`showcase.*` + `index.top20`)
- Browser-verified: 0 console errors, cards clickable

### C2. Build Size Audit ✅
| Temuan | Ukuran | Tindakan |
|--------|--------|----------|
| `public/img/ngamuk.gif` — DEAD asset (0 referensi) | 6.4MB | 🗑️ Dihapus (recoverable via git) |
| `kbbi-sinonim.json` + `id-words.json` (sinonim only) | 12MB | ✅ Sudah lazy-fetch + runtime-cache, tidak di-precache |
| imgly ort-wasm (remove-bg only) | 23.9MB | ✅ Sudah dynamic import → code-split, hanya ke-load di halaman remove-bg |
| sounds/*.mp3 (prabowo-countdown) | 3.6MB | ✅ Tidak di-precache (mp3), on-demand |
| vendor/pdfjs | 1.4MB | ✅ Di-precache (fitur offline PDF), disengaja |

### C3. Unit Tests Composables ✅
- `useCdnLib.test.ts` (5 tests) — fake timers, retry/interval/never-loads
- `usePdfDownload.test.ts` (4 tests) — blob/bytes/dataURL download, URL revoke
- `usePdfDropZone.test.ts` (10 tests) — click/drag/invalid/oversize/multiple/cleanup
- **43 → 62 tests**, 9/9 files pass

---

## Batch C — Quick Wins (3 items, ~5 jam)

### C1. Top 20 Tools Showcase
**Problem:** 227 tools overwhelming buat first-time visitor.
**Solution:** Halaman `/showcase` atau section di index: kurasi 20 tools terbaik (by usage counter), tampilan card besar + screenshot.
**Files:** `src/pages/showcase.astro`, `index.astro`

### C2. Build Size Audit
**Problem:** 32.9MB precache — lumayan berat.
**Solution:** Audit `public/` files, cek duplicate CDN libs, unused CSS, bundle analysis.
**Files:** `astro.config.mjs`, `public/`, `package.json`

### C3. Unit Tests for Composables
**Problem:** Cuma 43 tests — composables core gak ke-cover.
**Solution:** Tambah test: `useCdnLib.test.ts`, `useLocalHistory.test.ts`, `useClipboard.test.ts`.
**Files:** `src/composables/useCdnLib.test.ts` (new), etc.

---

## Batch D — Architecture (3 items, ~6 jam)

### D1. Lazy Load Tool Pages
**Problem:** Build 76s, semua JS inline di tiap page.
**Solution:** Dynamic import `<script>` di tiap tool page → `astro:page-load` pattern.
**Files:** All `.astro` tool pages, `BaseLayout.astro`

### D2. Self-hosted Analytics (Umami)
**Problem:** Gak tahu tool mana yang dipake user.
**Solution:** Tambah Umami (self-hosted, privacy-first, ringan). Track page views + tool usage.
**Files:** `BaseLayout.astro` (script tag), `vercel.json` (env vars)

### D3. Changelog / RSS Feed
**Problem:** User gak tahu ada tools baru.
**Solution:** Halaman `/changelog` static + RSS feed buat subscribe.
**Files:** `src/pages/changelog.astro` (new), `public/rss.xml`

---

## Batch E — Polish + Growth (3 items, ~4 jam)

### E1. OG Image Generator
**Problem:** Share link gak ada preview di Twitter/WA.
**Solution:** Auto-generate OG card dari tool title + icon. Static generation at build.
**Files:** `astro.config.mjs`, `BaseLayout.astro`

### E2. Tool Share Button
**Problem:** User susah share tool ke temen.
**Solution:** Tombol share di tiap tool page: copy link + Web Share API.
**Files:** `ToolPageHeader.astro`, `useShare.ts`

### E3. Feedback Widget
**Problem:** Gak ada channel buat user lapor bug.
**Solution:** Tombol kecil "🐛 Lapor Bug" di pojok — buka form simple atau redirect ke GitHub Issues.
**Files:** `BaseLayout.astro`

---

## Roadmap

| Batch | Item | Estimasi |
|-------|------|----------|
| **C1** | Top 20 Showcase | ~2 jam |
| **C2** | Build Size Audit | ~1 jam |
| **C3** | Unit Tests | ~2 jam |
| **D1** | Lazy Load | ~3 jam |
| **D2** | Analytics Umami | ~2 jam |
| **D3** | Changelog | ~1 jam |
| **E1** | OG Images | ~2 jam |
| **E2** | Share Button | ~1 jam |
| **E3** | Feedback Widget | ~1 jam |

**Total: ~15 jam (2-3 hari)**
