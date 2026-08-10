# Utils Tools Audit — Plan

> Created: August 11, 2026
> Scope: 9 tools di `src/pages/utils/` (brainstorm, jokes, lorem, motivation, pomodoro, stopwatch, todo, qr, wa-builder) = 4.470 baris
> Status: ✅ **UT1-UT6 SELESAI dieksekusi** (build ✅ · tests 43/43 ✅ · code review approved)

## ✅ Execution Log (UT1-UT6)

| Item | Perubahan | File |
|------|-----------|------|
| **UT1** | `autoRefreshInterval` di-clear di `astro:page-leave` (3 file) + **bonus UT7**: listener `online`/`offline` di-remove di jokes | jokes, motivation, brainstorm |
| **UT2** | Helper `escapeHtml` + entity map di-hoist (`_htmlEntities`) → favorites list di-escape (jokes: content+category, motivation: text+author incl. data-attrs, brainstorm: text) | jokes, motivation, brainstorm |
| **UT3** | `safeJSON(key, fallback)` helper (sama dengan pola CM4 calc) → 3-4 top-level `JSON.parse(localStorage)` diwrap | jokes, motivation, brainstorm |
| **UT4** | Escape key tutup settings modal di `_jokeKeydown` & `_motKeydown` (brainstorm sudah punya) | jokes, motivation |
| **UT5** | `'Gagal render QR JPG'` diwrap `_tToast` ternary | qr |
| **UT6** | `originalTitle` di-capture & di-restore di page-leave + `{ once: true }` (juga fix akumulasi listener) | pomodoro |
| **Review** | Saran reviewer: entity map di-hoist (`_htmlEntities`) diterapkan di 3 file | jokes, motivation, brainstorm |

---

## 🔴 Critical (Do First)

### UT1. Auto-refresh interval LEAK di jokes, motivation, brainstorm
**Location:** `astro:page-leave` handler di ketiga file

```js
// jokes.astro line 702 — sama persis di motivation (581) & brainstorm (823)
document.addEventListener('astro:page-leave', () => { document.removeEventListener('keydown', _jokeKeydown); }, { once: true });
// 💥 autoRefreshInterval TIDAK di-clear!
```

Kalau user aktifkan auto-refresh (settings `autoRefresh > 0` → `setInterval(getJoke, Ns)`), lalu **navigasi ke halaman lain**:
- Interval terus jalan **selamanya** (selama tab terbuka)
- Tiap tick: fetch API + update DOM di node yang sudah terlepas → **boros network/CPU/battery**
- 3 tool kena pola yang sama persis (jokes, motivation, brainstorm)

**Fix (10 menit):** Clear interval di page-leave:
```js
document.addEventListener('astro:page-leave', () => {
  document.removeEventListener('keydown', _jokeKeydown);
  if (autoRefreshInterval) { clearInterval(autoRefreshInterval); autoRefreshInterval = null; }
}, { once: true });
```

---

## 🟠 High Priority

### UT2. XSS — favorites list di-render innerHTML tanpa escape (jokes, motivation, brainstorm)
**Location:**
- jokes.astro line 561-575 — `favoritesList.innerHTML = favorites.map(fav => ... "${content}" ...)` — content = teks joke (dari API!)
- motivation.astro line 438-445 — `${fav.text}` di `<p>`
- brainstorm.astro line 623-630 — `${text}` di `<p>`

Konten dari API (joke/quote) atau localStorage di-inject langsung ke innerHTML **tanpa escaping**. JokeAPI/mymemory bisa mengandung karakter `<` `>` `"` → injeksi HTML/event handler. (wa-builder sudah aman — punya `parseWaFormat` escape ✅; qr aman — dataUrl lokal ✅)

**Fix (15 menit):** Tambah helper escape + pakai di ketiga renderFavorites:
```js
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(str ?? '')));
  return div.innerHTML;
}
// lalu: `<p>..."${escapeHTML(content)}"...</p>` dan kategori juga
```

### UT3. Top-level `JSON.parse(localStorage)` — corrupt storage = tool mati total
**Location:** jokes.astro (3× line 228-231), brainstorm.astro (3× line 354-356), motivation.astro (2× line 194-196)

Pola sama dengan CM4 (calc) — storage corrupt → throw di module scope → **seluruh tool tidak jalan**. (wa-builder aman — di dalam page-load closure; qr & todo pakai `useLocalHistory` composable ✅)

**Fix (10 menit):** Helper `safeJSON` di 3 file:
```js
function safeJSON(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } }
```

### UT4. Settings modal tanpa Escape key — jokes & motivation (brainstorm sudah ✅)
**Verified:** brainstorm punya `_bsEscapeKeydown` + cleanup (line 724-730) ✅; **jokes & motivation TIDAK punya handler Escape** (0 match). A11y WCAG 2.1.1 gap dari audit #8 yang belum tuntas (Phase 3 cuma nyampe brainstorm).

**Fix (10 menit):** Escape key + cleanup di 2 file:
```js
const _closeModalEscape = (e) => { if (e.key === 'Escape' && !settingsModal.classList.contains('hidden')) settingsModal.classList.add('hidden'); };
document.addEventListener('keydown', _closeModalEscape);
// + remove di page-leave
```

---

## 🟢 Low Priority / Notes

| # | Item | Note |
|---|------|------|
| UT5 | qr.astro — `'Gagal render QR JPG'` belum diwrap `_tToast` (line 545) | 1 string minor |
| UT6 | pomodoro — `document.title = "12:34 - Pomodoro"` gak di-restore saat page-leave | Title nyangkut di halaman lain |
| UT7 | jokes/motivation/brainstorm — `window.addEventListener('online'/'offline')` tanpa cleanup | Operasi di node terlepas = harmless, note only |
| UT8 | todo.astro — `li.innerHTML` dengan `${todo.text}` (input user) | Stored self-XSS; servernya user sendiri — low |
| UT9 | wa-builder — emoji modal belum ada Escape key | `role="dialog"` ✅, Escape kurang |

## ✅ Verified Good (no action)

- **todo.astro**: pakai `useLocalHistory` composable (tested) ✅
- **qr.astro**: pakai `useLocalHistory` (cap 10) ✅ · qrious CDN pinned 4.0.2 ✅ · history dataUrl lokal (safe) ✅
- **wa-builder.astro**: **XSS-escaped** via `parseWaFormat` (escape & < > " ') ✅ · qrcodejs pinned ✅ · emoji modal `role="dialog"` ✅ · 9 string i18n wrapped ✅ · `checkLib` interval di-clear ✅
- **stopwatch**: interval 10ms + cleanup keydown & timer di page-leave ✅
- **pomodoro**: timer cleanup ✅ · notifikasi permission handling lengkap ✅ · THEMES full class string (Tailwind JIT safe) ✅
- **lorem**: output dari wordlist statis → safe ✅
- **jokes/brainstorm/motivation**: **offline fallback local DB** ✅ · AbortController timeout 4s ✅ · stats + streak tracking ✅
- **Offline**: semua API (jokeapi, uselessfacts, mymemory, dummyjson) di-cover SW `api-cache` ✅ · CDN libs (qrious, qrcodejs) di-cover cdnjs-cache ✅

---

## 🗓️ Usulan Eksekusi

```
UT1  Fix interval leak 3 file           10 menit  🔴 leak nyata
UT2  Escape favorites list 3 file       15 menit  🟠 XSS
UT3  safeJSON helper 3 file             10 menit  🟠 robustness
UT4  Escape key settings modal 2 file   10 menit  🟠 a11y
UT5  Wrap 'Gagal render QR JPG'          5 menit  🟢 i18n
UT6  Restore document.title pomodoro     5 menit  🟢 UX
```

Total: ~55 menit · 1 leak 🔴 + 1 XSS 🟠 + 4 improve

**Menunggu persetujuan untuk eksekusi.**
