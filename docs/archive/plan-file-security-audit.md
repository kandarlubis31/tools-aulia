# File & Security Tools Audit — Plan

> Created: August 11, 2026
> Scope: 5 tools di `src/pages/file/` (csv-json 290, pdf-to-md 230) + `src/pages/security/` (uuid 206, password 149, hash 91) = 966 baris
> Status: 🔍 **Audit selesai — menunggu persetujuan eksekusi**

---

## 🔴 High (1 — security nyata)

### SE1. Password Generator pakai `Math.random()` — BUKAN CSPRNG
**Location:** `src/pages/security/password.astro` line 81-86, 113

```js
lower: () => String.fromCharCode(Math.floor(Math.random() * 26) + 97),   // Math.random()!
...
.split('').sort(() => 0.5 - Math.random()).join('');  // shuffle bias + bukan Fisher-Yates
```

Ironi: tool **security** yang generate password lemah. `Math.random()`:
- Bukan cryptographic random — bisa diprediksi/di-influence
- Shuffle `.sort(() => 0.5 - Math.random())` tidak seragam (bias) — distribusi karakter timpang

**Fix (20 menit):** `crypto.getRandomValues()` (Uint32Array → rejection sampling per charset) + Fisher-Yates shuffle berbasis getRandomValues.

---

## 🟠 Medium (5)

| # | Temuan | Detail |
|---|--------|--------|
| **SE2** | **hash.astro infinite retry loop** — `setTimeout(updateHash, 100)` jalan **selamanya** kalau CDN crypto-js gagal load (first visit offline) → CPU leak 10 tick/detik | Fix: cap retry (mis. 20×) atau clear interval saat berhasil |
| **FL1** | **csv-json + pdf-to-md tanpa MAX_FILE_SIZE** — file raksasa → browser hang (FileReader/Worker) | Fix: limit 10-20MB + toast, konsisten dengan kategori lain |
| **FL2** | **csv-json auto-cast agresif** — `Number("0x10")` → 16, `"1e3"` → 1000, `"001"` → 1 (leading zero hilang). Data user berubah tanpa konfirmasi | Fix: opsi toggle "auto-detect number" atau cast konservatif |
| **FL3** | **csv-json hardcoded EN di JS** — `'Converting...'`/`'Convert'`/`'✅ Copied!'` (line 158, 164, 262) → mode ID campur Inggris | Fix: `_tToast` / phrase i18n |
| **FL4** | **pdf-to-md progress hardcoded ID** — `'Memproses Halaman X dari Y...'` (line 147) → mode EN tetap Indonesia (sebagian string lain sudah _tToast — mixed) | Fix: `_tToast` |

## 🟢 Low (3)

- **FL5** `URL.revokeObjectURL` langsung setelah `click()` di csv-json + pdf-to-md — pola yang sama dengan bug Firefox yang sudah difix di base64 (DV6). Fix: delay 1s
- **SE3** hash.astro copy: `navigator.clipboard.writeText` tanpa await/catch → unhandled rejection kalau gagal
- **SE4** uuid.astro: `generate()` di-init otomatis tiap page load → 5 UUID masuk history tanpa aksi user (history terisi sampah)
- **SE5** password strength meter `length * types` — tidak hitung charset aktual (fine, note only)

## ✅ Verified Bagus (no action)

- **uuid**: `crypto.randomUUID()` (CSPRNG) ✅ · getHistory try/catch (safeJSON pattern) ✅ · clamp count 1-100 ✅ · restore history ✅
- **pdf-to-md**: Web Worker + terminate di semua path (done/error/onerror) ✅ · validasi tipe file ✅ · 100% client-side ✅
- **hash**: CDN crypto-js **pinned 4.1.1** + async + di-cover SW cdnjs-cache ✅ · retry hingga lib load (minus SE2) ✅
- **csv-json**: parsing quoted-field regex solid ✅ · auto delimiter detect ✅ · stats bar + sample data + Ctrl+Enter ✅ · toast semua _tToast (minus FL3) ✅
- **Offline**: cdnjs (crypto-js) di-cover SW ✅ · worker file statis ✅

---

## 🗓️ Usulan Eksekusi

```
SE1  Fix CSPRNG password generator        20m  🔴 security
SE2  Fix infinite retry hash               10m  🟠
FL1  MAX_FILE_SIZE csv-json + pdf-to-md    10m  🟠
FL2  Auto-cast konservatif csv-json        10m  🟠
FL3  i18n button/feedback csv-json          5m  🟠
FL4  i18n progress pdf-to-md                5m  🟠
FL5+SE3+SE4  revoke delay, copy catch, uuid init  10m  🟢
```

Total: ~70 menit · 1 security 🔴 + 4 improve 🟠 + 3 polish 🟢

**Menunggu persetujuan untuk eksekusi.**
