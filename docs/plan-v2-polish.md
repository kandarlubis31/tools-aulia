# Plan: v2 Polish — Performance + Analytics + Growth

> Created: August 12, 2026
> Status: 🚀 **Batch C + D + E1 + E2 + E3 + Guardrail SELESAI** — semua batch complete 🎉
> Scope: 227 tools existing, 331 precache, 12 kategori

---

## ✅ Execution Log — Batch E3 (Feedback Widget)

**Status:** DONE · Build ✅ 76s · Tests 62/62 · Browser-verified ✅

### E3. Feedback Widget ✅
- **Tombol "🐛 Lapor Bug"** di `BaseLayout.astro` — floating pill button di pojok kiri bawah (z-85, di bawah back-to-top), muncul di SEMUA halaman.
- **Modal form:** judul "Lapor Bug", subtitle, textarea Deskripsi Bug (required) + Langkah Reproduksi (opsional) + input Kontak (opsional).
- **Flow:** Klik tombol → modal fade-in + scale → isi form → klik "Buka di GitHub" → konstruksi URL GitHub Issues pre-filled (`title`, `body` berisi deskripsi, langkah, halaman, user agent, timestamp) + label `bug` → buka tab baru → toast "Terima kasih!" → modal tertutup.
- **Validasi:** deskripsi kosong → toast warning "Mohon isi deskripsi bug terlebih dahulu." + fokus textarea.
- **UX:** Escape key, klik luar modal, tombol ✕, dan Batal → semua menutup modal.
- **Tracking:** `umami.track('feedback', { tool: pathname })`.
- **i18n:** 10 keys baru (`feedback.*`) + 2 phrases baru.
- **A11y:** `for` attribute di semua label → asosiasi form field.
- **Browser-verified:** button visible → modal open → fill + submit → GitHub tab terbuka dengan pre-filled data → toast → modal close, 0 JS errors.

## ✅ Execution Log — Batch D (Architecture)

**Commit:** `8d8246c` · Build ✅ 25s · 331 precache · Tests 62/62

### D1. Lazy Load Tool Pages ✅ (VERIFIED — sudah complete)
- **Audit: 0 static npm imports** di semua 227 halaman tool — semua library berat (pdf-lib, mammoth, js-tiktoken, marked, qrcode, fflate, html2canvas, html2pdf, imgly) sudah dynamic import / CDN (useCdnLib)
- Astro code-split per halaman sudah aktif sejak migrasi PDF composables
- Tidak ada perubahan yang diperlukan

### D2. Analytics Umami ✅ **AKTIF**
- Website ID ToolsAulia: `e52b94c6-d2fc-41bd-a258-d6f9db81a9ec` (Umami Cloud) — di-set sebagai default di BaseLayout, override via env var `PUBLIC_UMAMI_WEBSITE_ID` kapan pun
- Script `cloud.umami.is/script.js` di `<head>` — terverifikasi ada di built HTML
- `umami.track('tool_use', { tool: href })` di klik tool card — dashboard bisa lihat tool paling laris
- Verifikasi: buka dashboard Umami Cloud setelah deploy → live events mulai masuk

### D3. Changelog + RSS ✅
- Halaman **`/changelog`**: timeline 9 entri (v1.0 Launch → v2.6 Batch C), version badge, tag chips warna, tombol Subscribe RSS
- **`/rss.xml`**: auto-generated dari `src/data/changelog.ts` (satu sumber data, zero duplikasi), valid XML, anchor `#v2-6` nyambung ke artikel
- Footer: link 📋 Changelog + 📡 RSS Feed
- 14 i18n keys baru (`changelog.*` + `footer.changelog` + `footer.rss`)

---

## ✅ Execution Log — Batch E2 (Tool Share Button)

**Status:** DONE · Build ✅ 71s · Tests 62/62 · Browser-verified ✅

### E2. Tool Share Button ✅
- **Tombol "Bagikan"** di `ToolPageHeader.astro` (muncul otomatis di SEMUA tool page — 1 komponen, ~230 halaman). Pill button + ikon share di bawah deskripsi tool.
- **Flow:** `navigator.share({ title, text, url })` → kalau tidak tersedia/gagal → fallback copy URL ke clipboard + toast "Link berhasil disalin!".
- **`useShare.ts`** — `shareContent()` di-extend dengan param opsional `url` (sebelumnya cuma title+text; sekarang ikut di-share & di-copy). Backward compatible untuk jokes/brainstorm/motivation.
- **Tracking:** `umami.track('share', { tool: pathname })` — dashboard bisa lihat tool mana yang paling sering di-share.
- **i18n:** reuse key `common.share` (Bagikan/Share) — sudah ada, zero key baru. Toast pakai phrase yang sudah ada di i18n-phrases.js.
- **Browser-verified:** button visible, klik → fallback clipboard → toast "Link berhasil disalin!", 0 console errors.

---

## ✅ Execution Log — Guardrail: Inline Script Check (post-regresi hotfix)

**Status:** DONE · Build ✅ 93s · Tests 62/62 · prebuild-gated

**Latar:** Regresi Aug 2026 — TS syntax + bare import bocor ke browser lewat `<script>` yang Astro kirim mentah (html-to-img, certificate, 7 halaman PDF, prabowo-countdown, BaseLayout). Root cause: **Astro HANYA bundle `<script>` TANPA atribut**; yang beratribut (`is:inline`, `type="module"`, `id`) di-emit mentah → SyntaxError di browser → tool mati diam-diam.

### G1. `scripts/check-inline-scripts.mjs` (guardrail baru) ✅
- **Scan semua `.astro`**: untuk tiap `<script>` beratribut (dikirim mentah) → cek isinya HARUS murni JS via esbuild (`transformSync`, loader `js`). TS syntax (`as`-cast, non-null `!`, param/var type, dst.) & syntax invalid → **fail build** dengan lokasi baris persis.
- **Bare import specifier** (`await import('pdf-lib')` tanpa path/URL di inline script) → ikut terdeteksi (browser tidak bisa resolve). URL (`https://…`) & relative path (`./` `/`) di-exempt.
- **Anti false-positive:** match regex dilewatkan kalau jatuh di dalam string/komentar (`deadZones()` — scanner string/comment sederhana), jadi prose seperti `"copied from 'x'"` atau `!==` tidak pernah diflag. `SKIP_TYPES` mencakup `text/plain`, `importmap`, `speculationrules`, JSON-LD, dst.
- **Fallback `node:vm`** dipakai hanya kalau esbuild tidak tersedia (nyaris tidak pernah — esbuild via vite).
- **Wiring:** `prebuild` hook (`node scripts/check-client-side.mjs && node scripts/check-inline-scripts.mjs`) → build & CI (`pnpm build`) gagal duluan kalau ada pelanggaran. Script manual: `pnpm check:inline`.
- **Diuji:** (a) codebase bersih → pass 10 blok; (b) injeksi bare import + cast → fail, 2 issue dilaporkan dengan baris persis; (c) prose string + `!==` → pass (no false positive); (d) URL/relative import → pass; (e) build penuh + tests 62/62 hijau.

---

## ✅ Execution Log — Batch E1 (OG Image Generator)

**Status:** DONE · Build ✅ 137s · 231 OG PNG statis · Tests 62/62 · Guardrail ✅

### E1. OG Image Generator ✅
- **`src/pages/og/[slug].png.ts`** — endpoint prerender (`prerender = true` + `getStaticPaths()`): **build-time static generation** sesuai plan (bukan serverless — versi awal `prerender = false` melanggar ADR-003 + guardrail `check-client-side.mjs`, makanya build gagal). 231 PNG 1200×630 di-emit ke `dist/client/og/` saat build.
- **Slug coverage:** semua 228 tool (`/pdf/merge` → `/og/pdf-merge.png`), hub `/pdf`, homepage, `showcase`, `changelog`, `404`. Slug tak dikenal → 404 (tidak pernah direferensikan BaseLayout).
- **BaseLayout.astro** — `og:image` + `twitter:image` otomatis ke `/og/<slug>.png` per halaman (override via prop `ogImage` tetap didukung).
- **⚠️ Gotcha font:** `@resvg/resvg-js` **tidak bisa memuat WOFF** (teks render kosong, silent fail). Font Inter di-convert WOFF → TTF via script baru `scripts/woff-to-ttf.mjs` (WOFF = wrapper sfnt + zlib, konversi ~50 baris).
- **Verifikasi:** PNG valid (magic bytes), pixel-level check teks judul ter-render (5.3k–9.9k pixel putih di title band), sitemap bersih dari `/og/`, `globIgnores: **/og/*.png` (OG cuma untuk social crawler → skip precache, tetap 331 entries).
- **vercel.json** — rule `Cache-Control: public, max-age=86400, s-maxage=604800` untuk `/og/(.*)`.
- **Guardrail** — `check-client-side.mjs` allowlist `src/pages/og/[slug].png.ts` (build-time only, tidak menyentuh data user — sama seperti `proxy.ts`).
- **Bonus fix:** hapus duplikat entry `/security/totp` di `tools.ts` (2 entry → 1, yang sesuai halaman asli "2FA Code (TOTP)" dipertahankan). Duplikat ini ketahuan pas validasi 231-vs-232 slug.
- **Robustness:** `existsSync` guard font di module load (fail-fast kalau font hilang), `console.warn` untuk duplicate og key, dan catch error re-throw (fail loud, bukan redirect senyap).

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
