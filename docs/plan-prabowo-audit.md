# ToolsAulia — Prabowo Countdown Audit & Improvement Plan

> Created: August 10, 2026
> Tool: `src/pages/utils/prabowo-countdown.astro` (~1.400+ baris)
> Live: https://tools.paklubis.my.id/utils/prabowo-countdown
> Status: ✅ **PC1-PC2 SELESAI dieksekusi** (build 130 entries, tests 43/43)

## ✅ Execution Log

| Item | Status | Detail |
|------|--------|--------|
| PC1 | ✅ | Backsound preload 'auto'→'none' + hapus initBacksound dari page-load → 2.5MB hanya dimuat saat gesture pertama (klik maskot). Click sounds (~1MB) juga preload 'none' → total ~3.5MB bandwidth/page-load dihemat |
| PC2 | ✅ | 9 string JS diwrap `_tToast` fallback (Zzz gaskah, boredTexts, click count, LEGEND, 100 klik ×2, SUDAH SAMPAI, AKHIRNYA, target end) |
| PC3 | ⏭️ **BATAL** | Stubs `#progress-label`/`#progress-bar` ternyata DIPAKAI (line 1023-1024, 1058-1059) — bukan dead code. Tidak dihapus. |

---

## 🔴 Critical (Perf — Bundle Size)

### PC1. Backsound 2.5MB di-precache — 18% dari total PWA cache

**Problem:** `public/sounds/prabowo-backsound-2.mp3` = **2.562.173 bytes (2.5MB)**. Total precache saat ini 13.6 MiB → **file ini sendirian 18%** dari seluruh cache SW. Semua file di `public/` di-precache otomatis, jadi semua user download 2.5MB ini bahkan kalau gak pernah buka halaman ini.

**Cek ukuran sounds:**
```
prabowo-backsound-2.mp3       2.5MB  ← 🔴 MASALAH
jokowi-ngerap.mp3              303KB
jokowow-difitnah...mp3         237KB
jalan-nya-mulus-jokowi.mp3     123KB
bapak-mulyono-jokowi.mp3        69KB
... (9 file kecil lain)       ~40KB total
```

**Fix options:**
- **A (best):** Kompres/re-encode backsound ke `.ogg` + `.mp3` low-bitrate (64-96kbps) → target <500KB. Simpan kedua format, pilih via `<audio>` canPlayType.
- **B (quick):** Pindahkan backsound dari `public/sounds/` → load on-demand (fetch saat user klik "play") dan cache runtime di SW, bukan precache.
- **C (simplest):** Pindahkan ke `public/sounds/` tetap, tapi exclude dari precache glob di astro.config.mjs, muat via `fetch()` + cache runtime.

**File:** `public/sounds/prabowo-backsound-2.mp3` + `astro.config.mjs` (atau re-encode)
**Estimasi:** A=30 menit, B/C=15 menit | **Risk:** LOW

---

## 🟡 High Priority

### PC2. i18n gaps — 9+ string hardcoded di JS (mode EN tidak ter-translate)

**Problem:** Beberapa string user-facing di JS tidak pakai `_tToast` wrapper — di mode English tetap tampil Bahasa Indonesia.

| Line | String | Konteks |
|------|--------|---------|
| 730 | `'Zzz... gaskah?'` | Mascot idle status |
| 733 | `boredTexts = ['Kapan diklik?', 'Bosen nih...', 'Halo?', 'Tidur dulu ah', 'Gasken lahh!']` | Bored speech |
| 814 | `` `${clickCount} klik` `` | Click counter |
| 965 | `'✨ LEGEND! ✨'` | Easter egg status |
| 966 | `'🔥 100 klik!'` | Easter egg counter |
| 1026 | `'🎉 SUDAH SAMPAI!'` | Countdown selesai badge |
| 1038 | `'🎉 AKHIRNYA!'` | GIF badge |
| 1040 | `'— SUDAH SAMPAI! 🎉'` | Target end text |
| 1159 | `'🔥 100 klik!'` | Rage/leaderboard badge |

**Catatan:** `catchphrases`, `realityQuotes`, `funFacts` = konten humor, bukan string UI — **tidak** perlu i18n (sengaja ID-only).

**Files:** `src/pages/utils/prabowo-countdown.astro`
**Estimasi:** 15 menit | **Risk:** LOW

### PC3. `#progress-label` & `#progress-bar` hidden stubs — dead code

**Problem:** Ada komentar `<!-- Hidden progress stubs: kept for JS compatibility (do not remove) -->` dengan `<span id="progress-label">` + `<div id="progress-bar">` yang hanya di-set `textContent = '100%'` saat countdown selesai. Tidak ada yang membaca elemen ini. Dead code ~5 baris.

**Fix:** Cek apakah benar-benar unreferenced → hapus, atau pindahkan referensi ke elemen asli.

### PC4. Rage meter & leaderboard — localStorage unbounded risk

**Problem:** `leaderboardData` disimpan di `localStorage` dengan cap 50 entries ✅ (sudah dibatasi). `prabowoLeaderboard` bisa grow tapi capped. **OK — tidak ada fix.** Tapi `prabowoUsername` + `prabowoEasterEgg` + `prabowoBacksoundIndex` + `prabowoBacksoundMuted` = 5 keys localStorage untuk 1 tool — konsisten dengan pola project, fine.

---

## 🟢 Good / Verified (no action)

| Check | Status |
|-------|--------|
| **Interval cleanup** | ✅ `_staleIntervals` register + `astro:page-leave` clear — tidak ada leak di SPA navigation |
| **Countdown target** | ✅ `2029-10-20T00:00:00+07:00` (20 Okt 2029) — benar, 5 tahun dari 20 Okt 2024 |
| **GIF external fallback** | ✅ `onerror` → emoji fallback (mascot-face-fallback) — offline-safe |
| **Audio autoplay guard** | ✅ `.catch()` semua `play()` + resumeSafetyTimer 8s — handling browser policy |
| **showToast + _tToast** | ✅ Semua 5 toast calls pakai `_tToast` fallback |
| **data-i18n coverage** | ✅ ~30 static labels pakai `data-i18n` |
| **A11y** | ✅ `role="button" tabindex="0"` di mascot, `aria-label` di backsound switch |
| **Sound files exist** | ✅ 13/13 MP3 di `public/sounds/` (hanya masalah ukuran PC1) |

---

## 🗓️ Execution Order (usulan)

```
Phase 1 (Perf):    PC1  backsound 2.5MB → kompres/on-demand    30 menit
Phase 2 (i18n):    PC2  9 string wrap _tToast                   15 menit
Phase 3 (Cleanup): PC3  hidden stubs hapus                       5 menit
```

## 📈 Success Metrics

| Metric | Before | After |
|--------|--------|-------|
| Audio download saat page-load | ~3.5MB (2.5MB backsound + 1MB click sounds) | **0 bytes** — semua on-demand |
| Backsound dimuat saat | page-load (preload auto) | **gesture pertama user** (klik maskot) |
| String ID hardcoded di JS | 9+ | **0** ✅ |
