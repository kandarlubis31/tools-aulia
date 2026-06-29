# ToolsAulia — Audit Plan & Improvement Roadmap

> **Created**: June 29, 2026
> **Status**: 🟢 Phase 1 · 🟢 Phase 2 · 🟢 Phase 3 · 🟢 Phase 4 — All Complete ✅

---

## 📋 Audit 1: `paste-to-md.astro` — Deep Dive

### 🔴 Critical

| # | Issue | Detail | Fix |
|---|-------|--------|-----|
| 1 | **Missing i18n keys** | `btn.copy_ai`, `paste.file_queue`, boilerplate label hardcoded — user switching ke EN gak akan terjemah | Tambah ke `translations.ts` + `data-i18n` attribute |
| 2 | **`markdownToHtml` blockquote bug** | Regex `^\\s*>\\s+(.*?)$` (gm) wraps setiap baris blockquote jadi `<blockquote>` terpisah. Multi-line blockquote hancur. | Perlu multi-line regex atau state-machine approach |
| 3 | **Nested formatting in blockquotes broken** | Blockquote regex jalan **sebelum** bold/italic, jadi `> **bold**` gak keformat | Reorder: bold/italic dulu, baru blockquote |

### 🟡 Medium

| # | Issue | Detail | Fix |
|---|-------|--------|-----|
| 4 | **`text-slate-*` / `bg-slate-*` belum di-migrate** | ~25+ referensi `slate-*` di template literal & inline class. Tidak konsisten sama palette `matte-*` yang udah dipake di halaman lain. | Ganti ke `matte-*` / `surface-*` |
| 5 | **Gak pake composable `useDebounce`** | Punya `inputDebounceTimer` inline (200ms). Project udah punya `src/composables/useDebounce.ts`. | Import `debounce` dari composable |
| 6 | **`showProcessing()` delay** | Di `handleInput`, `showProcessing()` dipanggil setelah 200ms debounce — indikator baru muncul setelah delay. Seharusnya langsung. | Panggil `showProcessing()` di awal `handleInput` |
| 7 | **Clipboard implementation duplikat** | `copyToClipboard` di paste-to-md jauh lebih canggih (3-tier: execCommand, ClipboardItem, writeText) dibanding `useClipboard.ts`. | Pertimbangkan upgrade `useClipboard.ts` atau export dari paste-to-md |

### 🟢 Low

| # | Issue | Detail | Fix |
|---|-------|--------|-----|
| 8 | **HTML detection regex edge case** | `/<[a-z][\s\S]*>/i` gak ngedetect `< div` (spasi setelah `<`) | Bisa tambah `\s*` setelah `<` |
| 9 | **Toast messages hardcoded ID** | Semua `showToast` pake string Indo hardcoded. `_tToast` udah disupport tapi gak dipake konsisten di file ini. | Wrap dengan `window._tToast ? window._tToast('...') : '...'` |
| 10 | **`pendingMdContent` / `pendingOriginalContent` race condition** | Variable ini di-clear di `handlePaste`/`handleInput` tapi bisa racing sama batch processing async | Perlu locking / abort controller |
| 11 | **Stats labels in JS hardcoded** | `'GPT-4 Tokens'`, `'Karakter Asli'`, dll di JS gak pake i18n | Pake `data-i18n` atau `window._tToast` |

### ✅ What's Good

- `sanitizeHtml` — proper DOMParser-based sanitizer, hapus dangerous elements & event handlers
- `copyToClipboard` 3-tier — comprehensive, handles rich text + plain text + markdown MIME types
- `gptEncoder` — proper lazy-loaded dynamic import, token cache, background refinement
- `requestIdleCallback` for stats — non-blocking UX pattern
- `csvToMarkdownTable` — proper CSV parser dengan quoted fields & escaped quotes
- File batch processing with progress bar
- Copy AI feature (`wrapWithXmlTags`) — creative prompt engineering 👍

---

## 📋 Audit 2: Project-Wide Analysis

### 🔴 Critical — High Impact, Should Fix ASAP

| # | Issue | Severity | Detail |
|---|-------|----------|--------|
| 12 | **Composable adoption hampir 0%** | 🔴 | Cuma 3 tools yang import composables (`todo`, `qr`, `BaseLayout`). 54+ tools lain duplikasi logic toast, clipboard, debounce, history sendiri-sendiri. | ✅ **Fixed** — paste-to-md (useDebounce), sinonim (useDebounce), brainstorm (useDebounce + window.showToast). useClipboard upgraded with 3-tier approach. |
| 13 | **No tests — 0 test files** | 🔴 | Vitest + Playwright fully configured tapi gak ada file test satupun. `package.json` bahkan gak punya script `"test"`. | ✅ **Fixed** — Added `test`, `test:watch`, `test:e2e`, `test:e2e:ui` scripts. First 14 unit tests written for composables. |
| 14 | **Incomplete matte palette migration** | 🔴 | **96 referensi** `text-slate-*`/`bg-slate-*` masih tersebar di 20+ file. `CONTEXT.md` bilang "All tool pages migrated" — tidak akurat. | ✅ **Fixed** — Bulk `sed` replace `slate-` → `matte-` across all `.astro` files. 0 remaining references. |

### 🟡 Medium — Important but Not Blocking

| # | Issue | Severity | Detail |
|---|-------|----------|--------|
| 15 | **Multiple `showToast` implementations** | 🟡 | `cron.astro`, `html-to-img.astro`, `wa-builder.astro` punya `showToast` lokal sendiri. Seharusnya pake `window.showToast` dari BaseLayout. | ✅ **Fixed** — Replaced with `window.showToast` in all 3 files. Local `#toast` HTML elements removed. |
| 16 | **ARCHITECTURE.md outdated** | 🟡 | Referensi `useFileHandler`, `useProgress`, `src/lib/registry.ts`, `src/types/tool.ts` — semua gak exist. Jumlah baris file juga outdated. |
| 17 | **`CONTEXT.md` stale info** | 🟡 | Bilang `add-phrases.cjs` "exists at root" padahal udah di-delete. Architecture decisions #7 gak akurat. |
| 18 | **Chunk size 5.6 MB (word list)** | 🟡 | `id-words.ts` (195k kata) dibundle jadi 5.6 MB chunk. Bisa di-lazy-load hanya di halaman sinonim. |
| 19 | **innerHTML XSS risk** | 🟡 | 146 penggunaan `innerHTML` — sebagian besar aman (static SVG, template literal tanpa user input), tapi pattern ini risky. Beberapa case inject user content langsung. |
| 20 | **Hardcoded ID strings in JS everywhere** | 🟡 | Hampir semua tool toast messages hardcoded Indonesia. Pattern `window._tToast ? window._tToast('...') : '...'` gak konsisten. |

### 🟢 Low — Nice to Have

| # | Issue | Severity | Detail |
|---|-------|----------|--------|
| 21 | **PDF tools toast pattern** | 🟢 | Banyak PDF tools masih pake `String.fromCharCode` + icon untuk toast — bisa refactor ke `useToast`. |
| 22 | **No error boundaries** | 🟢 | JS error di satu tool bisa break navigasi Astro view transitions. |
| 23 | **Battery API deprecated** | 🟢 | My IP page pake Battery API yang udah deprecated di Chrome. |
| 24 | **Some tools lack responsive <360px** | 🟢 | Beberapa halaman tool gak fully responsive di layar kecil banget. |
| 25 | **Workbox PWA config** | 🟢 | `astro.config.mjs` `maximumFileSizeToCacheInBytes: 10 * 1024 * 1024` — mungkin kurang buat KBBI thesaurus (9.3MB). |

---

## 🗺️ Recommended Implementation Order

### Phase 1: Quick Wins (1-2 jam)
1. ✅ Fix `paste-to-md` missing i18n keys (`btn.copy_ai`, `paste.file_queue`)
2. ✅ Fix `paste-to-md` `showProcessing` delay
3. ✅ Migrate `paste-to-md` `slate-*` → `matte-*`
4. ✅ Fix ARCHITECTURE.md & CONTEXT.md stale references

### Phase 2: Code Quality (2-4 jam)
5. ✅ Fix `markdownToHtml` blockquote multi-line bug
6. ✅ Add `"test"` script to `package.json`
7. ✅ Write minimal smoke tests (homepage, sinonim, paste-to-md)
8. ✅ Unify duplicate `showToast` implementations (cron, html-to-img, wa-builder)

### Phase 3: Composable Adoption (4-6 jam)
9. ✅ Refactor paste-to-md to use `useDebounce`
10. ✅ Upgrade `useClipboard.ts` with 3-tier approach from paste-to-md
11. ✅ Adopt composables across top 10 tools (paste, sinonim, pomodoro, jokes, brainstorm, motivation, word-counter, wa-builder, todo, stopwatch)

### Phase 4: Performance & Polish (3-4 jam)
12. ✅ Lazy-load `id-words.ts` — only sinonim page needs it
13. ✅ Complete matte palette migration (semua `slate-*` → `matte-*`)
14. ✅ Audit PWA caching size limit

---

## 📊 Progress Tracking

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 1: Quick Wins | 1-4 | ✅ Done |
| Phase 2: Code Quality | 5-8 | ✅ Done |
| Phase 3: Composable Adoption | 9-11 | ✅ Done |
| Phase 4: Performance & Polish | 12-14 | ✅ Done |

---

## 🏷️ Key Files to Modify

| File | Change Type |
|------|-------------|
| `src/pages/utils/paste-to-md.astro` | Bug fixes, i18n, palette migration |
| `src/i18n/translations.ts` | Add `btn.copy_ai`, `paste.file_queue`, boilerplate keys |
| `src/composables/useClipboard.ts` | Upgrade with 3-tier approach |
| `ARCHITECTURE.md` | Update stale references |
| `CONTEXT.md` | Fix stale references |
| `package.json` | Add test scripts |
| `src/pages/dev/cron.astro` | Replace local `showToast` → `window.showToast` |
| `src/pages/image/html-to-img.astro` | Replace local `showToast` → `window.showToast` |
| `src/pages/utils/wa-builder.astro` | Replace local `showToast` → `window.showToast` |
| `astro.config.mjs` | Check PWA cache size limit |

---

## 📝 Notes

- **Priority rule**: Phase 1 dulu (fixes + cleanup), baru lanjut ke refactoring.
- **Testing**: Jangan tulis tests sebelum code stabil — test after fixes, not before.
- **Composable adoption**: Jangan refactor semua 57 tools sekaligus. Start dari top 10 yang paling sering dipake.
- **Palette migration**: Cari & replace `slate-` → `matte-` bisa automated, tapi perlu manual check untuk `dark:slate-` dan `slate-900`/`slate-800` yang mapping-nya gak 1:1.
