# Plan: v2 Polish — Performance + Analytics + Growth

> Created: August 12, 2026
> Status: 📋 **Plan dibuat — 3 batch, 9 item**
> Scope: 227 tools existing, 328 precache, 12 kategori

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
