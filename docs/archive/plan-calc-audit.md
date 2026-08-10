# Calc Tools Audit — Plan

> Created: August 11, 2026
> Scope: 7 tools di `src/pages/calc/` (age, bmi, currency, number, percentage, unit, case) = 2.677 baris
> Status: 🔍 **Audit selesai — menunggu persetujuan eksekusi**

---

## 🔴 Critical (Do First)

### CM1. currency.astro — `parsed` di luar scope → crash saat cache valid, refresh rate mati
**Location:** `src/pages/calc/currency.astro` ~line 175-205

```js
if (cached) {
    try {
        const parsed = JSON.parse(cached);   // ← const di-scope ke try block
        if (Date.now() - parsed.timestamp < 24h) {
            rates = parsed.rates; calculate(); usedCache = true; ...
        }
    } catch (e) { ... }
}
...
if (usedCache) {
    const cachedTime = new Date(parsed.timestamp);   // 💥 ReferenceError: parsed is not defined
```

`parsed` dideklarasi di dalam `try` block, tapi direferensikan **di luar** block. Untuk user yang kembali dengan cache valid (< 24 jam):
- `ReferenceError` → `initCurrency()` reject di tengah → **background fetch rate refresh tidak pernah jalan**
- Unhandled promise rejection di console
- Rate jadi stale (max 24 jam) tanpa pernah di-refresh, "Diperbarui" tidak tampil

**Fix (10 menit):** Hoist variabel ke scope luar:
```js
let parsedRates = null; let parsedTimestamp = 0;
if (cached) { try { const parsed = JSON.parse(cached); if (...) { parsedRates = parsed.rates; parsedTimestamp = parsed.timestamp; ... } } catch {} }
...
if (usedCache) { const cachedTime = new Date(parsedTimestamp); ... }
```

### CM2. bmi.astro — bare `showToast(...)` → ReferenceError saat klik "Bagikan" di desktop
**Location:** `src/pages/calc/bmi.astro` — share handler, branch `else` (navigator.share tidak ada)

```js
} else {
    navigator.clipboard.writeText(text);
    showToast(window._tToast ? ... : ..., 'success');   // 💥 showToast is not defined
}
```

Bare `showToast` bukan global (yang global `window.showToast`). Di desktop (Chrome Windows/Android desktop — `navigator.share` sering tidak ada) → klik "Bagikan" → ReferenceError → **global error boundary BaseLayout ikut muncul** (toast "Reload") — UX jelek banget. Clipboard tetap ter-copy tapi error.

**Fix (5 menit):** `window.showToast(...)` — dan cek branch `navigator.share` catch pakai `window.showToast` ✅ (sudah benar).

---

## 🟠 High Priority

### CM3. number.astro — parseInt partial-parse + precision loss untuk angka besar
**Location:** line 138-140

```js
const num = parseInt(val, radix);
if (isNaN(num)) { showError(sourceField); return; }
```

2 masalah:
1. **Partial parse**: `parseInt('1102', 2)` → parse '110' berhenti di '2' → hasil 6 (silent, tanpa error). User ngetik biner invalid dapat hasil salah tanpa peringatan.
2. **Precision loss**: `parseInt('9999999999999999', 10)` / hex 64-bit (`FFFFFFFFFFFFFFFF`) → imprecise (JS number max aman 2^53). Base converter seharusnya exact.

**Fix (20 menit):** Validasi regex per-base + pakai `BigInt`:
```js
const VALID = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^\d+$/, 16: /^[0-9a-fA-F]+$/ };
if (!VALID[radix].test(val)) { showError(sourceField); return; }
const num = BigInt(radix === 16 ? '0x' + val : radix === 8 ? '0o' + val : radix === 2 ? '0b' + val : val);
// lalu num.toString(radix) — output exact untuk angka sebesar apapun
```

### CM4. JSON.parse localStorage di top-level module — corrupt storage = script mati total
**Location:** bmi.astro (`bmiHistory`), percentage.astro (`calculationHistory`), unit.astro (`conversionHistory` + `favorites`)

```js
let bmiHistory = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
```

Kalau localStorage corrupt (mis. user pernah pakai versi lama, atau tercoret manual) → JSON.parse throw di **module top-level** → **seluruh script tool tidak jalan sama sekali** (no UI response).

**Fix (10 menit):** Helper try/catch di 3 file:
```js
function safeJSON(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } }
```

---

## 🟢 Low Priority / Notes

| # | Item | Note |
|---|------|------|
| CM5 | number.astro — `Sumber: DEC` hardcoded ID via textContent | Minor i18n |
| CM6 | bmi + percentage — `confirm()` native dialog untuk hapus riwayat | Fungsional tapi jelek di PWA; custom modal = nice-to-have |
| CM7 | bmi/percentage/unit — riwayat di-render innerHTML dari localStorage | Self-XSS only (data dari tool itu sendiri) — low risk, note only |
| CM8 | percentage — `res1.innerText = _tToast("0")` (wrap angka 0) | Cosmetic, pointless |
| CM9 | unit.astro — comparison table temp pakai placeholder `result=0` | Table di-hidden untuk temp — fine |
| CM10 | age.astro — Feb 29 (leap year) DOB edge case di hitungan tahun | Rare, minor |

## ✅ Verified Good (no action)

- **age.astro**: interval cleanup via `astro:after-swap` ✅ · max date hari ini ✅ · validasi tanggal lengkap ✅ · history try/catch ✅ · zodiak/shio benar ✅
- **unit.astro**: **konversi suhu verified benar** (C/F/K/R/Ré semua arah) ✅ · keyboard shortcuts + cleanup `page-leave` ✅ · history dedupe + cap 20 ✅ · select `sr-only` label ✅
- **percentage.astro**: validasi input (x/y ≥ 0, y≠0) ✅ · history cap 10 + debounce ✅
- **currency.astro**: fallback rates + 24h localStorage cache + SW NetworkFirst ✅ · swap animasi ✅ (selain bug CM1)
- **bmi.astro**: kategori & posisi indikator benar ✅ · inline error styling ✅ · history cap 20 ✅
- **number.astro**: radix map + error hints per field ✅ (selain CM3)
- **case.astro**: preview pakai `escapeHtml` → **XSS-safe** ✅ · debounce preview 200ms ✅
- **Offline**: currency API di-cover runtimeCaching `api-cache` (NetworkFirst) ✅

---

## 🗓️ Usulan Eksekusi

```
CM1  Fix parsed scope currency        10 menit   🔴 crash returning users
CM2  Fix bare showToast bmi           5 menit    🔴 error di desktop
CM3  BigInt + regex validation number 20 menit   🟠 correctness
CM4  safeJSON helper 3 file           10 menit   🟠 robustness
```

Total: ~45 menit · 2 bug 🔴 (1 crash + 1 error path) + 2 improve

**Menunggu persetujuan untuk eksekusi.**
