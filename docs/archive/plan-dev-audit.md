# Dev Tools Audit — Plan

> Created: August 11, 2026
> Scope: 10 tools di `src/pages/dev/` (base64, json, markdown, diff, timestamp, url, proxy, my-ip, cron, css-shadow) = 2.933 baris
> Status: 🔍 **Audit selesai — menunggu persetujuan eksekusi**

---

## 🔴 Critical (Do First)

### DV1. markdown.astro — Default content RUSAK (sisa refactor i18n yang kacau)
**Location:** `src/pages/dev/markdown.astro` line 41

```js
const defaultText = `# " + (window._t ? window._t("Selamat Datang!") : "Selamat Datang!");
```

Kode refactor i18n gagal **tercecer jadi literal string** di dalam template literal. Efek: saat halaman dibuka, baris pertama editor nampil:
```
# " + (window._t ? window._t("Selamat Datang!") : "Selamat Datang!);
```
bukan `# Selamat Datang!`.

**Fix (5 menit):** Ganti dengan interpolasi yang benar:
```js
const defaultText = `# ${window.i18n?.t ? window.i18n.t('header.selamat_datang', 'Selamat Datang!') : 'Selamat Datang!'};
```

### DV2. markdown.astro — XSS via `marked.parse` → `innerHTML` tanpa sanitasi
**Location:** line 56

```js
preview.innerHTML = marked.parse(text);
```

`marked` **tidak mensanitasi HTML** secara default. User yang paste markdown berisi `<img onerror="...">` atau `<script>` → kode JS jalan di konteks halaman. Risiko nyata (user menyalin markdown dari sumber eksternal).

**Fix (20 menit):** Tambah DOMPurify CDN (jsdelivr — sudah di-cover runtimeCaching SW → offline-capable):
```html
<script is:inline src="https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js"></script>
```
```js
preview.innerHTML = DOMPurify ? DOMPurify.sanitize(marked.parse(text)) : marked.parse(text);
```

---

## 🟠 High Priority

### DV3. proxy.astro — Mismatch klaim UI vs backend allowlist
**Location:** `src/pages/dev/proxy.astro` (UI) vs `src/pages/api/proxy.ts` (backend)

UI bilang: *"Bypass CORS policy dan **test API endpoint langsung** dari browser"* — tapi backend **hanya izinkan 6 domain**: exchangerate-api, open.er-api, frankfurter, wttr.in, ipify, ipapi. Sebagian besar URL yang user masukkan → `403 Domain tidak diizinkan`.

**Catatan:** Allowlist = proteksi SSRF yang **bagus — jangan dihapus**. Yang salah cuma copy-nya.

**Fix (15 menit):** Update teks UI biar jujur — sebutkan domain yang didukung (mis. "Didukung: exchangerate-api, open.er-api, frankfurter, wttr.in, ipify, ipapi") + pastikan pesan 403 tampil jelas.

### DV4. markdown.astro — CDN marked TIDAK di-pin versi
**Location:** line 6 — `https://cdn.jsdelivr.net/npm/marked/marked.min.js`

Tanpa versi → jsdelivr resolve ke latest. Major version bump (marked v13+ ubah API) bisa break render diam-diam. Tool lain sudah pin versi (cron: cronstrue@2.4.1, luxon@3.4.4; diff: jsdiff@5.1.0).

**Fix (5 menit):** `marked@12.0.2` (atau versi stabil terbaru yang kompatibel).

### DV5. base64.astro — `escape()` / `unescape()` deprecated
**Location:** line ~90-95

```js
btoa(unescape(encodeURIComponent(val)));           // encode
decodeURIComponent(escape(atob(val)));             // decode
```

`escape`/`unescape` sudah deprecated sejak ES5. Masih jalan tapi flagged. Ganti ke API modern:
```js
// encode (Unicode-safe):
btoa(String.fromCharCode(...new TextEncoder().encode(val)));
// decode:
new TextDecoder().decode(Uint8Array.from(atob(val), c => c.charCodeAt(0)));
```

**Fix (15 menit):** Modernisasi + tambah try/catch (TextDecoder `fatal: false` default = aman).

### DV6. base64.astro — Tidak ada MAX_FILE_SIZE + revokeObjectURL langsung
- **Upload file**: `fileInput` tanpa limit — file 500MB → `readAsDataURL` → memory spike / tab crash (pola sama kayak image tools IM4)
- **Download**: `URL.revokeObjectURL(url)` langsung setelah `a.click()` → risiko abort download di Firefox (pola sama kayak compressor IM6)

**Fix (10 menit):** MAX_FILE_SIZE 20MB + toast + `setTimeout(() => URL.revokeObjectURL(url), 1000)`.

### DV7. cron.astro — cronstrue locale hardcoded "en"
**Location:** line 205 — `cronstrue.toString(val, { locale: "en" })`

Site punya i18n ID/EN tapi penjelasan cron selalu English. **Fix (10 menit):** Ambil locale dari i18n (`window.i18n?.lang === 'id' ? 'id' : 'en'` — cronstrue support `id` locale) + fallback try/catch ke "en".

---

## 🟢 Low Priority / Notes

| # | Item | Note |
|---|------|------|
| DV8 | diff.astro — `removed · added` stats hardcoded English; keydown Ctrl+Enter tanpa cleanup | Minor — textContent aman (XSS-safe ✅) |
| DV9 | base64.astro — `output.value = 'Error: Input tidak valid'` tidak diwrap `_tToast` | Minor — tampil di textarea, bukan toast |
| DV10 | proxy.astro — `error.message` mentah ditampilkan | Minor |
| DV11 | url.astro — `%20` diganti `+` (form-encoding) | Debatable — banyak tool pakai gaya ini; note only |
| DV12 | my-ip.astro — `api.ipify.org` & `google.com/favicon.ico` tidak di runtimeCaching SW | Kecil + `cache: 'no-store'` — fine, note only |

## ✅ Verified Good (no action)

- **diff.astro**: `createTextNode` + DocumentFragment → **XSS-safe** ✅ · jsdiff CDN pinned ✅
- **json.astro**: try/catch lengkap, auto-format debounce 400ms, stats ✅
- **proxy API**: allowlist 6 domain (SSRF-safe) + `AbortSignal.timeout(10s)` + no-cache headers ✅
- **timestamp.astro**: live clock + `clearInterval` di `astro:page-leave` ✅ · i18n wrapped ✅
- **cron.astro**: CDN versions pinned (cronstrue@2.4.1, luxon@3.4.4) ✅ · i18n wrapped ✅ · retry init ✅
- **my-ip.astro**: WebRTC guarded, semua fetch ada catch + AbortSignal timeout, interval cleanup ✅
- **css-shadow.astro**: bersih, semua label `data-i18n` ✅
- **url.astro**: i18n wrapped ✅
- **Offline**: semua CDN (cronstrue/luxon/marked/jsdiff) di-cover runtimeCaching jsdelivr/cdnjs → offline-capable setelah kunjungan pertama ✅

---

## 🗓️ Usulan Eksekusi

```
DV1  Fix default content rusak         5 menit   🔴 bug visible
DV2  DOMPurify sanitize markdown      20 menit   🔴 security
DV3  Proxy UI copy jujur              15 menit   🟠 UX mismatch
DV4  Pin marked@12                    5 menit    🟠 supply-chain
DV5  Ganti escape/unescape deprecated 15 menit   🟠 modernisasi
DV6  Max size + revoke delay base64   10 menit   🟠 robustness
DV7  Cron locale dari i18n            10 menit   🟠 i18n
```

Total: ~1.5 jam · 1 bug 🔴 visible + 1 security 🔴 + 5 improve

**Menunggu persetujuan untuk eksekusi.**
