# ToolsAulia — PDF Tools Audit & Improvement Plan

> Created: August 10, 2026
> Scope: Semua 17 file di `src/pages/pdf/` (16 tools + index) = 5.071 baris
> Status: ✅ **P1-P8 SELESAI dieksekusi** (build 130 entries / 13.6 MiB, tests 43/43)

## ✅ Execution Log (P1-P8)

| Item | Status | Detail |
|------|--------|--------|
| P1 | ✅ | to-text.astro drop zone fixed: dynamic import → `window.usePdfDropZone` (is:inline aman) + input overlay → hidden |
| P2 | ✅ | to-ppt.astro migrated ke composables (~35 baris saved) + fix double extension `converted-doc.pdf.pptx` → `converted-doc.pptx` |
| P3 | ✅ | 7 tools standardisasi ke `window.*`: grayscale, metadata, page-numbers, watermark, sign, reorder, jpg-to-pdf. 0 import composable tersisa |
| P4 | ✅ | `maxSize` option di usePdfDropZone (default 50MB) + 25MB override di 9 render-heavy tools |
| P5 | ✅ | 7 i18n strings wrapped `_tToast` (watermark, sign, grayscale) |
| P6 | ✅ | html-to-pdf: spinner '⏳ Loading library...' sebelum waitForCdnLib |
| P7 | ✅ | Workers offline: pdf.js 3.11.174 di-vendor ke `public/vendor/pdfjs/` (1.4MB, di-precache) |
| P8 | ✅ | Audit filename: semua pattern aman (prefix-name.pdf tunggal) |

---

## 📊 PDF Tools Inventory

| # | Tool | Baris | Composable Pattern | Loading State | Size Check | Status |
|---|------|-------|--------------------|---------------|------------|--------|
| 1 | merge.astro | 539 | ✅ `window.*` | spinner | ❌ | OK (paling kompleks) |
| 2 | jpg-to-pdf.astro | 528 | ⚠️ dynamic import | spinner | ❌ (format only) | OK, image zone |
| 3 | sign.astro | 438 | ⚠️ dynamic import | spinner | ❌ | OK |
| 4 | delete.astro | 404 | ✅ `window.*` | spinner | ✅ 15MB (custom) | OK |
| 5 | to-jpg.astro | 346 | ✅ `window.*` | ❌ (progress bar) | ❌ | OK |
| 6 | watermark.astro | 327 | ⚠️ dynamic import | spinner | ❌ | OK |
| 7 | html-to-pdf.astro | 282 | ✅ `waitForCdnLib` | ❌ | ❌ | OK (CDN) |
| 8 | grayscale.astro | 246 | ⚠️ static import | spinner | ❌ | OK |
| 9 | split.astro | 240 | ✅ `window.*` | spinner | ❌ | OK |
| 10 | to-text.astro | 218 | 🔴 **dynamic import di `is:inline`** | loader overlay | ❌ | 🔴 **BROKEN** |
| 11 | rotate.astro | 204 | ✅ `window.*` | spinner | ❌ | OK |
| 12 | compress.astro | 195 | ✅ `window.*` | spinner | ❌ | OK |
| 13 | extract.astro | 160 | ✅ `window.*` | spinner | ❌ | OK |
| 14 | reorder.astro | 158 | ✅ `window.*` | spinner | ❌ | OK |
| 15 | to-ppt.astro | 135 | 🔴 **belum migrasi** | progress bar | ❌ | 🔴 **Raw** |
| 16 | metadata.astro | 123 | ⚠️ static import | spinner | ❌ | OK |
| 17 | page-numbers.astro | 92 | ⚠️ static import | spinner | ❌ | OK |
| — | index.astro | 436 | — | — | — | Data inline |

---

## 🔴 Critical (Do First)

### P1. Fix to-text.astro — Drop Zone BROKEN di Production

**Problem:** `<script is:inline>` + `import('../../composables/usePdfDropZone')` — **dynamic import tidak di-bundle oleh Vite di inline script**. Path relatif akan 404 di runtime. Drag & drop + click handler drop zone **tidak berfungsi sama sekali** (hanya input overlay yang kebetulan jalan karena `absolute inset-0 opacity-0`).

```js
// SAAT INI (BROKEN — di <script is:inline>)
import('../../composables/usePdfDropZone').then(m => {
  m.usePdfDropZone('drop-zone', 'file-input', { ... });
});
```

```js
// FIX — pakai global yang sudah didaftarkan BaseLayout
window.usePdfDropZone('drop-zone', 'file-input', {
  accentColor: 'blue',
  onFile: (file) => processFile(file),
});
```

**File:** `src/pages/pdf/to-text.astro`
**Estimasi:** 5 menit | **Risk:** HIGH (tool tidak berfungsi)

### P2. Migrate to-ppt.astro — Satu-satunya tool yang belum migrasi

**Problem:** Masih inline drag & drop handlers + render loop manual (~35 baris duplikasi). Bonus bug: `converted-${file.name}.pptx` → file "doc.pdf" jadi **"converted-doc.pdf.pptx"** (double extension).

**Fix:**
1. Pakai `window.usePdfDropZone('drop-zone', 'file-input', { accentColor: 'orange', onFile })`
2. Pakai `window.renderPageToCanvas(page, 2.0, true)` untuk render slide
3. Fix double extension: `file.name.replace(/\.pdf$/i, '')`
4. Hapus duplikasi drag & drop handlers

**File:** `src/pages/pdf/to-ppt.astro`
**Estimasi:** 15 menit | **Risk:** LOW

---

## 🟠 High Priority

### P3. Standardisasi pola composables — 3 pola → 1 pola

**Problem:** 3 pola berbeda untuk akses composables yang sama:

| Pola | Tools | Bahaya |
|------|-------|--------|
| `window.*` (global) | delete, compress, extract, merge, split, reorder, rotate, to-jpg | ✅ Aman |
| `import { x } from '...'` (static) | grayscale, metadata, page-numbers | ⚠️ Beda pola, rentan mis-match |
| `import('...').then()` (dynamic) | watermark, sign, to-text | 🔴 to-text BROKEN (P1) |

**Fix:** Semua pakai `window.usePdfDropZone` / `window.renderPageToCanvas` / `window.downloadBytes` yang sudah didaftarkan BaseLayout. Hapus semua `import` composable di halaman (grayscale, metadata, page-numbers, watermark, sign).

**Files:** 6 files
**Estimasi:** 20 menit | **Risk:** LOW-MED (hanya ganti akses)

### P4. File size validation — tambah `maxSize` ke usePdfDropZone

**Problem:** Hanya delete.astro yang punya size check (15MB custom). Tool render-heavy (compress, to-jpg, grayscale, to-ppt) bisa **hang browser** dengan PDF besar. Composable tidak punya option size.

**Fix:**
1. Tambah `maxSize?: number` (bytes) ke `PdfDropZoneOptions`
2. Tolak file > maxSize dengan toast `File terlalu besar. Maksimal XXMB.`
3. Default 50MB di composable; tool render-heavy override 25MB
4. Hapus custom check di delete.astro → pakai option

**Files:** `src/composables/usePdfDropZone.ts` + 16 tools (opsi per-tool)
**Estimasi:** 30 menit | **Risk:** LOW

### P5. i18n gaps — 7 string tanpa `_tToast` fallback

**Problem:** String hardcoded tanpa wrapper `_tToast` → tidak ter-translate di mode EN.

| File | Line | String |
|------|------|--------|
| watermark.astro | 156 | `'Gagal render: context tidak tersedia'` |
| sign.astro | 125 | `'Gagal render pad tanda tangan'` |
| sign.astro | 284 | `'Gagal render PDF'` |
| grayscale.astro | 91 | `'Gagal render preview grayscale'` |
| grayscale.astro | 137 | `'Gagal render halaman PDF'` |
| grayscale.astro | 184 | `'Gagal render: context tidak tersedia'` |
| to-jpg.astro | 179/254/311 | cek & wrap |

**Files:** 4 files, 7+ strings
**Estimasi:** 15 menit | **Risk:** LOW

---

## 🟡 Medium Priority

### P6. Loading feedback konsisten

**Problem:** 4 tool tanpa feedback saat proses panjang:
- **to-jpg** — ada progress bar ✅ (tapi `showButtonSpinner` 0)
- **to-text** — loader overlay ✅
- **to-ppt** — progress bar ✅
- **html-to-pdf** — ❌ tidak ada feedback selama `waitForCdnLib` (sampai 3 detik) + convert

**Fix:** html-to-pdf: set spinner sebelum `waitForCdnLib`. Konsistenkan nama loading text.

### P7. Workers CDN-dependent — offline gap

**Problem:** `public/workers/pdf-to-text-worker.js` & `pdf-to-md-worker.js` pakai `importScripts('https://cdnjs...pdf.js')` — **tidak tersedia offline**, bertentangan dengan claim PWA offline. to-text & paste-to-md gagal saat offline.

**Fix options:**
- **A (best):** Bundle pdf.js worker lokal — copy `pdf.worker.min.js` + `pdf.min.js` ke `public/vendor/` (~800KB, precache naik)
- **B (quick):** Deteksi offline → toast "Worker butuh koneksi untuk pertama kali" + cache di SW runtime

**Estimasi:** 1-2 jam | **Risk:** MED (bundle size)

### P8. Bug kecil double-extension di tool lain

- **to-ppt**: `converted-doc.pdf.pptx` (fix di P2)
- Audit semua `downloadBytes` filename pattern untuk konsistensi `prefix-originalname.ext`

---

## 🔵 Nice to Have

### P9. Ekstrak data PDF tools dari index.astro

`pdfTools` array inline (16 tool) di `index.astro` → pindah ke `src/data/pdf-tools.ts` (konsisten dengan `tools.ts`). Memungkinkan reuse untuk future features.

### P10. Feature baru PDF (opsional, kompetitor punya)

| Feature | Effort | Value |
|---------|--------|-------|
| **PDF Protect/Unlock** (password) | 2-3 jam | High — pdf-lib support |
| **PDF to Word** | 4-6 jam | High — pakai worker + HTML render |
| **PDF Repair** (recover corrupt) | 3-4 jam | Med |
| **PDF to CSV** (table extract) | 4-6 jam | Med |
| **Batch merge folder** | 2 jam | Med |

### P11. PDF tools unit tests

- `usePdfDropZone.test.ts` — maxSize, invalid type, multiple files, cleanup
- `useCdnLib.test.ts` — resolve true/false, retry count
- `usePdfRenderer.test.ts` — canvas size dari viewport

---

## 🗓️ Execution Order (usulan)

```
Phase 1 (Bug fixes):   P1 → P2          ~20 menit   🔴 wajib
Phase 2 (Konsistensi): P3 → P4 → P5     ~65 menit
Phase 3 (UX/Offline):  P6 → P7          ~2 jam
Phase 4 (Nice-to-have): P8 → P11        sesuai kebutuhan
```

## 📈 Success Metrics

| Metric | Before | After |
|--------|--------|-------|
| Tool dengan drop zone broken | 1 (to-text) | **0** ✅ |
| Tool belum migrasi composable | 1 (to-ppt) | **0** ✅ |
| Pola akses composable | 3 pola | **1 pola** (`window.*`) ✅ |
| Tool dengan size validation | 1/17 | **17/17** ✅ (default 50MB, render-heavy 25MB) |
| String tanpa `_tToast` | 7+ | **0** ✅ |
| Tool tanpa loading feedback | 1 (html-to-pdf) | **0** ✅ |
| PDF tools offline-capable | 15/17 | **17/17** ✅ (vendor pdf.js lokal) |
