# Plan: Improve — UX + Quality Polish

> Created: August 12, 2026
> Status: 📋 **Plan dibuat — 2 batch, 8 item**
> Scope: 227 tools existing

---

## Batch A — Quick UX Wins (4 items, ~2 hari)

### A1. Favorites / Bookmark Tools
**Problem:** 227 tools susah nyari yang sering dipakai.
**Solution:** Tombol bintang di tiap tool card + section "Favorit" di atas grid. Simpan di localStorage. Bisa di-pin permanen.
**Files:** `index.astro`, `ToolCard.astro`, `useLocalHistory.ts`

### A2. Scroll to Top Button
**Problem:** Scroll jauh ke bawah, susah balik ke atas.
**Solution:** Tombol ↑ floating di pojok kanan bawah, muncul pas scroll > 500px. Smooth scroll to top.
**Files:** `BaseLayout.astro` (global)

### A3. Tool Usage Counter
**Problem:** Gak tahu tool mana paling berguna buat user.
**Solution:** Track click per tool di localStorage. Tampilkan "🔥 Paling Sering Dipakai" section (top 5).
**Files:** `index.astro`, `useLocalHistory.ts`

### A4. Dark Mode per-tool Persist
**Problem:** Toggle dark mode selalu reset ke default.
**Solution:** Simpan preferensi di localStorage + apply on load.
**Files:** `BaseLayout.astro`

---

## Batch B — Quality + SEO (4 items, ~2 hari)

### B1. Lighthouse Audit + Fix
**Problem:** 227 halaman perlu scoring.
**Solution:** Jalankan Lighthouse di 10 halaman key (homepage, PDF merge, image editor, typing test). Fix semua yang merah: LCP, CLS, aria-label, contrast.
**Files:** `BaseLayout.astro`, `global.css`, individual pages

### B2. SEO Meta Audit
**Problem:** Gak semua 227 tools punya `seoTitle` + `seoDesc` optimal.
**Solution:** Grep semua entry tools.ts, pastiin semua punya seoTitle + seoDesc. Yang kosong auto-generate dari title + desc.
**Files:** `tools.ts`, `BaseLayout.astro`

### B3. Sitemap Split + Check
**Problem:** 328 entries di sitemap, bisa kegedean.
**Solution:** Verifikasi `@astrojs/sitemap` handle >300 entries dengan baik. Cek `sitemap-index.xml` udah split benar.
**Files:** `astro.config.mjs`

### B4. i18n Completion Check
**Problem:** Masih mungkin ada hardcoded Indonesian string di JS.
**Solution:** Audit semua `<script>` di 227 tools. Flag yang gak pakai `_tToast()` wrapper. Fix top offenders.
**Files:** All `.astro` files with `<script>`

---

## Roadmap

| Batch | Item | Estimasi | Prioritas |
|-------|------|----------|-----------|
| **A1** | Favorites/Bookmark | ~3 jam | P0 |
| **A2** | Scroll to Top | ~30 menit | P0 |
| **A3** | Usage Counter | ~2 jam | P1 |
| **A4** | Dark Mode Persist | ~1 jam | P1 |
| **B1** | Lighthouse Fix | ~3 jam | P0 | ⬜ Need deployed site |
| **B2** | SEO Meta Audit | ~2 jam | P1 | ✅ BaseLayout auto-fallback |
| **B3** | Sitemap Check | ~30 menit | P2 | ✅ Perfect |
| **B4** | i18n Completion | ~3 jam | P2 | ✅ 95% covered |

**Total: ~15 jam (2-3 hari)**

---

## ✅ Batch B Audit Results (Aug 12, 2026)

- **B1:** Skipped — requires deployed site for runtime Lighthouse
- **B2:** 121/228 tools have explicit seoTitle. BaseLayout auto-generates: `pageTitle — ToolsAulia`. All pages have proper tag.
- **B3:** sitemap-index.xml references sitemap-0.xml with all 227+ URLs. Perfect split.
- **B4:** All `showToast` files import `_tToast`. Local `toast()` wrappers use `_tToast` internally. ~5% edge cases with single-arg calls (minor).
