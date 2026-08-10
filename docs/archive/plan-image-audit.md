# Image Tools Audit — Plan

> Created: August 11, 2026
> Scope: 6 tools di `src/pages/image/` (color, compressor, converter, editor, html-to-img, remove-bg) = 3.191 baris
> Status: ✅ **IM1-IM8 SELESAI dieksekusi** (build ✅ 130 entries, tests ✅ 43/43, review 2 saran diterapkan)

## ✅ Execution Log (IM1-IM8)

| Item | Perubahan | Files |
|------|-----------|-------|
| **IM1** 🔴 | `bgBmp` dideklarasi via `createImageBitmap(bgImageFile)` + null-guarded close di finally → mode "🖼️ Gambar" jalan lagi | remove-bg.astro |
| **IM2** 🔴 | runtimeCaching `staticimgly.com` (StaleWhileRevalidate, 1yr, maxEntries 10) → klaim "offline-ready" jadi benar | astro.config.mjs |
| **IM3** | `buildTransform()` sentral — zoom & rotate/flip compose, tidak saling overwrite; compare pakai `isPreview=false` | editor.astro |
| **IM4** | MAX_FILE_SIZE 20MB + toast di editor, color, converter (+ validasi tipe di editor) | 3 files |
| **IM5** | Escape key tutup fullscreen modal (WCAG 2.1.1) | html-to-img.astro |
| **IM6** | Toast error di catch/ctx/toBlob (tidak silent fail), validasi tipe di drop, revokeObjectURL delay 1s | compressor.astro |
| **IM7** | Magnifier posisi relatif containerRect (bukan canvasRect) → presisi saat canvas di-center | color.astro |
| **IM8** | 5 string user-facing diwrap `_tToast` (loading/progress/Ganti Background); canvas errors tetap as-is | remove-bg.astro |
| **Review** | 2 saran diterapkan: `.catch()` toast di mode-switch + max size 20MB untuk bg-image input | remove-bg.astro |

### 📊 Hasil Verifikasi
- **Build:** ✅ 130 entries, 13.6 MiB precache
- **Tests:** ✅ 43/43 pass (6 files)
- **Verifikasi grep:** `bgBmp` declared ✅ · staticimgly cached ✅ · 0 string user-facing non-i18n sisa di remove-bg ✅

---

## 🔴 Critical (Do First)

### IM1. remove-bg.astro — `bgBmp` undefined → mode "🖼️ Gambar" 100% broken
**Location:** `src/pages/image/remove-bg.astro` line 242-249 (`compositeResult()`)

```js
} else if (bgMode === 'image' && bgImageFile) {
    try {
      const scale = Math.max(canvas.width / bgBmp.width, canvas.height / bgBmp.height); // 💥 bgBmp ga pernah dideklarasi
```

`bgBmp` direferensikan 4× tapi **tidak pernah dideklarasi** (tidak ada `createImageBitmap(bgImageFile)`). Saat user pilih mode "🖼️ Gambar":
- `ReferenceError: bgBmp is not defined` → unhandled rejection (click handler ga ada catch)
- Preview gagal, **user diam-diam dapat PNG transparan** pas download (bukan gambar dengan background)
- Tidak ada toast error sama sekali

**Fix (30 menit):** Tambah `const bgBmp = await createImageBitmap(bgImageFile);` sebelum penggunaannya + `bgBmp.close()` di finally (mirip `resultBmp`).

### IM2. remove-bg.astro — Klaim "offline-ready" SALAH (model AI ga di-cache SW)
**Location:** UI line 35-37 (`Proses pertama kali perlu download model AI (~5-15MB). Setelah itu offline-ready.`) vs `astro.config.mjs`

- Model AI di-fetch dari `https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/` (default publicPath lib)
- **`globPatterns`** SW = `{css,js,html,svg,png,ico,txt}` → wasm/onnx/bin **tidak di-precache**
- **`runtimeCaching`** cuma cover cdnjs/jsdelivr/unpkg + kbbi-sinonim + id-words + API → **staticimgly.com TIDAK ada**
- Konsekuensi: setelah "proses pertama" pun, offline → remove-bg **gagal total** (model ga ada di cache mana pun, browser HTTP cache tidak reliable untuk PWA offline mode)

**Fix (30 menit):** Tambah runtimeCaching di `astro.config.mjs`:
```js
{
  urlPattern: /^https:\/\/staticimgly\.com\/.*/i,
  handler: 'StaleWhileRevalidate',
  options: {
    cacheName: 'imgly-model-cache',
    expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
    cacheableResponse: { statuses: [0, 200] }
  }
}
```
Setelah itu klaim "offline-ready" jadi **benar** (model di-cache SW setelah pemakaian pertama).

---

## 🟠 High Priority

### IM3. editor.astro — Konflik transform: zoom vs rotate/flip (last-wins)
**Location:** `updateZoom()` (line ~695) vs `applyFilterStyles()` (line ~640)

Kedua-duanya nulis ke `element.style.transform`:
- `updateZoom` → `previewImg.style.transform = scale(${zoomScale})`
- `applyFilterStyles` → `previewImg.style.transform = rotate(...) scale(flipX, flipY)`

**Efek:** Zoom, lalu rotate → zoom hilang. Rotate, lalu zoom → rotate/flip hilang visual. Setting state-nya tetap, tapi tampilan salah.

**Fix (20 menit):** Gabung keduanya — `updateZoom` harus compose dengan settings rotate/flip:
```js
function updateZoom() {
  previewImg.style.transform = `rotate(${settings.rotate}deg) scale(${settings.flipX * zoomScale}, ${settings.flipY * zoomScale})`;
}
```
(dan `applyFilterStyles` jangan nulis ulang transform kalau zoom aktif — atau selalu compose dari `zoomScale`).

### IM4. Validasi ukuran file — editor (0 limit!), color (0 limit), converter (0 limit)
- **compressor**: 5MB ✅ · **remove-bg**: 10MB ✅
- **editor**: **tidak ada limit sama sekali** — image 50-100MB → `toDataURL` pas download bisa OOM/blank
- **color**: tidak ada limit — `readAsDataURL` image raksasa → memory spike (walaupun canvas di-resize ke 800px)
- **converter**: tidak ada limit

**Fix (20 menit):** Tambah `MAX_FILE_SIZE = 20 * 1024 * 1024` + toast error di 3 file (pola sama kayak compressor/remove-bg).

### IM5. html-to-img.astro — Fullscreen modal tanpa Escape key (a11y gap tersisa)
**Location:** `#fullscreen-modal` — punya `role="dialog" aria-modal="true"` (✅ fixed di audit #8) tapi **0 handler Escape** (verified: 0 match `escape|keydown`).

**Fix (10 menit):**
```js
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fullscreenModal.classList.add('hidden');
});
```

### IM6. compressor.astro — 3 issue kecil
1. **Silent fail**: `catch (e) { _compressPending = false; }` — kalau `createImageBitmap` gagal (file corrupt/terlalu besar), user gak dapat feedback apa pun
2. **`URL.revokeObjectURL(link.href)` langsung setelah `link.click()`** (line 211) — di Firefox bisa abort download; perlu `setTimeout(..., 100)`
3. **Tidak ada validasi tipe di drop**: drag-drop file non-gambar (PDF misalnya) → `createImageBitmap` gagal silent

**Fix (15 menit):** toast error di catch + validasi `file.type.startsWith('image/')` di drop handler + delay revoke.

### IM7. color.astro — Magnifier tidak presisi saat canvas di-center
**Location:** line ~250-285

`magnifier.style.left/top` di-set pakai `e.clientX - rect.left` (relatif ke **canvas**), tapi magnifier `position: absolute` relatif ke **container** (yang flex-center). Saat canvas lebih kecil dari container (mis. gambar tingginya < 400px → di-center), magnifier melenceng sebesar offset centering.

**Fix (15 menit):** Hitung offset pakai `containerRect` bukan `canvasRect`, atau posisikan magnifier relatif ke canvas wrapper.

### IM8. i18n — 7 string JS tanpa `_tToast` (remove-bg loading texts paling user-facing)
| File | String | Severity |
|------|--------|----------|
| remove-bg.astro | `'Mendownload model AI...'` (line 347) | 🟠 user-facing loading |
| remove-bg.astro | `'Menghapus background...'` (line 350) | 🟠 user-facing loading |
| remove-bg.astro | `'Download model... %'` (line 359) | 🟠 user-facing progress |
| remove-bg.astro | `'Memproses... %'` (line 361) | 🟠 user-facing progress |
| remove-bg.astro | `'Ganti Background'` (line 492) | 🟢 minor |
| color.astro | `'Gagal render magnifier'` + `'Gagal render: context tidak tersedia'` | 🟢 canvas error (audit #5: left as-is) |
| editor/converter.astro | `'Gagal render: context tidak tersedia'` | 🟢 canvas error (left as-is) |

**Fix (15 menit):** wrap 5 string remove-bg (yang user-facing). Canvas errors tetap as-is sesuai keputusan audit #5.

---

## 🟢 Low Priority / Notes

| # | Item | Note |
|---|------|------|
| IM9 | converter.astro — judul "PNG/JPG/WebP" tapi cuma bisa output JPG | Pertimbangkan rename jadi "PNG → JPG Converter" atau tambah pilihan format |
| IM10 | remove-bg — `updatePreview()` fire-and-forget di mode switch | Klik mode cepat bisa race; minor |
| IM11 | editor.astro — custom size negatif/0 tidak divalidasi | `parseInt("-500")` → canvas.width negatif → error toast; minor |
| IM12 | html-to-img — `scale: 2` fixed di html2canvas options | Bisa ditambah kontrol kualitas (pola to-jpg), nice-to-have |
| IM13 | editor.astro — zero `data-i18n` di static labels | Beda kategori (static i18n), scope besar — diluar item ini |

## ✅ Verified Good (no action)

- **editor**: cleanup lengkap (`astro:page-leave` remove semua listener), `revokeObjectURL`, history cap 20, keyboard shortcuts, guard clause download
- **remove-bg**: cap 10MB, `createImageBitmap` di-close di finally, blob URL revoked
- **compressor**: debounce quality 300ms, `_compressPending` guard concurrency
- **color**: canvas resize 800px (perf), EyeDropper guarded
- **html-to-img**: `waitForCdnLib` + retry, button disabled saat render, share API fallback, html2canvas **sudah di-cache** via `cdnjs-cache` runtimeCaching → offline-capable ✅

---

## 🗓️ Usulan Eksekusi

```
IM1  Fix bgBmp undefined (mode Gambar)        30 menit  🔴 bug
IM2  runtimeCaching staticimgly.com            30 menit  🔴 offline claim
IM3  Fix konflik transform zoom vs rotate      20 menit  🟠 bug visual
IM4  Tambah max size 3 tools                   20 menit  🟠 robustness
IM5  Escape key fullscreen modal                10 menit  🟠 a11y
IM6  compressor silent fail + revoke + type     15 menit  🟠 UX
IM7  Magnifier offset fix                       15 menit  🟠 UX
IM8  i18n 5 string remove-bg                    15 menit  🟠 i18n
```

Total: ~2.5 jam · 2 bug 🔴 nyata (IM1 broken feature, IM2 false claim) + 6 improve

**Menunggu persetujuan untuk eksekusi.**
