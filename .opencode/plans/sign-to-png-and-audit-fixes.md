# Plan: Tool Baru "Sign to PNG" + Fix Bug Hasil Audit

> Status: MENUNGGU PERSETUJUAN
> Checkpoint rollback yang akan dibuat: `checkpoint/pre-sign-to-png`

## Ringkasan

1. Tool baru **Sign to PNG** di `/image/sign-to-png` — gambar/upload tanda tangan → PNG transparan.
2. Fix bug hasil audit: double-init (`diagram-to-img`, `qr`) + riwayat dataURL besar (`qr`).
3. `wa-builder` diverifikasi aman (`toDataURL()` hanya untuk link unduhan, tidak masuk localStorage) → skip.

---

## Phase 0 — Checkpoint

```
git tag -a checkpoint/pre-sign-to-png -m "Checkpoint sebelum tambah tool sign-to-png + fix double-init diagram-to-img/qr + riwayat thumbnail qr"
```
Working tree saat ini bersih (0 changed files vs HEAD? — verifikasi ulang saat eksekusi; 3 file perubahan UI-smooth sebelumnya mungkin masih uncommitted).

## Phase 1 — Fix bug audit (2 file)

### 1a. `src/pages/utils/qr.astro` (line ~999)
**Ganti:**
```js
  document.addEventListener('astro:page-load', init);
  init();
```
**Menjadi:** guard `__qrPage` pattern (init hanya via astro:page-load dengan cek path) — hapus bare `init()`.

### 1b. `src/pages/utils/qr.astro` addToHistory (line ~942)
- Tambah helper `makeQrThumb(maxDim)` (downscale canvas → PNG).
- `dataUrl: canvas.toDataURL()` → `dataUrl: makeQrThumb(400)` (400px agar tetap scannable saat diunduh dari riwayat).
- Bungkus `qrHistoryManager.add(...)` dengan try/catch → toast error bila kuota penuh.

### 1c. `src/pages/text/diagram-to-img.astro` (line ~1382)
**Hapus** bare `init();`, jadikan listener astro:page-load dengan guard path `__dgPage`.

## Phase 2 — Tool baru `/image/sign-to-png`

### 2a. Registry — `src/data/tools.ts`
Tambah entry format standar kategori image (dekat entry image lain):
```ts
{ cat: "image", popular: false, titleKey: "tool.sign_to_png", title: "Sign to PNG",
  descKey: "tool.sign_to_png_desc", desc: "Tanda tangan jadi PNG transparan.",
  href: "/image/sign-to-png", color: "rose", category: "Image",
  descFallback: "Tanda tangan digital ke PNG transparan",
  seoTitle: "Tanda Tangan Online ke PNG Transparan Gratis | ToolsAulia",
  seoDesc: "Gambar atau upload tanda tangan, hasilkan PNG transparan siap pakai...",
  icon: '<path ...pen-tool...' }
```

### 2b. i18n — `src/i18n/translations.ts`
- `tool.sign_to_png`, `tool.sign_to_png_desc` (untuk registry/search).
- Blok `stp.*` (~22 key): tab labels (draw/upload), ink color, pen size, undo, clear,
  tolerance slider + hint, background transparent/white, download, copy, placeholder,
  checkerboard caption, dsb. Format `{ id: '...', en: '...' }`.

### 2c. `src/data/new-tools.ts`
Push `'/image/sign-to-png'` ke index paling atas array `newToolHrefs`.

### 2d. Page — `src/pages/image/sign-to-png.astro` (file baru)

**Struktur UI** (BaseLayout + ToolPageHeader, gradient rose, icon pen):
- Tab switcher: ✍️ Gambar | 📷 Upload Foto
- Panel Gambar: `<canvas id="sig-pad">` (pointer events; DPR-aware resize),
  warna tinta (hitam #000 / biru #1e40af), ketebalan slider 2–10px default 4,
  Undo (stack snapshot dataURL maks 20), Clear
- Panel Upload: drop zone + input file, preview asli, slider "Toleransi Background" 0–100
  default 35 + hint
- Preview hasil: container checkerboard CSS (conic-gradient), canvas hasil
- Kontrol umum: toggle background transparan/putih, tombol ⬇️ Download PNG,
  📋 Salin, badge ukuran output (WxH px)
- Semua label statis `data-i18n="stp.*"` (i18n dari awal)

**Logika script** (pattern bersih, tanpa bug lama):
- Guard `__stpPage` + init hanya via `astro:page-load` (TANPA bare init — pelajaran double-init)
- Gambar:
  - Pointer Events (`pointerdown/move/up` + `setPointerCapture`), koordinat dikali scale DPR
  - Smoothing: quadratic curve antara midpoint (moveTo p0, quadraticCurveTo(prev, mid))
  - Undo: push `getImageData` snapshot per stroke (batas 20, memory-safe)
- Upload → remove background putih:
  - Sample luminance rata-rata 4 tepi gambar sebagai baseline bg
  - Pixel dengan luminance > baseline*(1+tol%) DAN saturasi rendah → alpha=0;
    feather tepi 1 pass (alpha parsial untuk near-threshold) biar gak bergerigi kasar
- Auto-trim: scan bounding box alpha>8 → crop + padding 12px
- Compose final: trim → draw ke canvas output (bg transparan atau putih)
- Export: `toBlob('image/png')` download / ClipboardItem copy
- Toast via `_tToast`

## Phase 3 — Verifikasi

1. `pnpm build` (prebuild guardrails otomatis: client-side + inline-scripts + critical-css)
2. `pnpm test` (62 tests harus tetap hijau)
3. Sanity manual dev server: gambar TTD → download PNG transparan;
   upload foto TTD → toleransi naik-turun → background hilang; undo jalan;
   navigasi SPA keluar-masuk halaman tidak dobel-bind

## Rollback

```
git checkout checkpoint/pre-sign-to-png -- src/pages/utils/qr.astro src/pages/text/diagram-to-img.astro src/data/tools.ts src/data/new-tools.ts src/i18n/translations.ts
git tag -d checkpoint/pre-sign-to-png  # opsional
Remove-Item src/pages/image/sign-to-png.astro
```
