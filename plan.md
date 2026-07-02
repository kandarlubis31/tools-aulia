# ToolsAulia — Deep Audit Plan #5

> Created: July 2, 2026
> Last audit: July 2, 2026 (Deep scan #5 — +error swallowing, +PWA gaps, +performance, +SEO meta)
> Status: 🟢 Phase 1-6 Complete · 🟡 Phase 7 In Progress · ⬜ Phase 8-15 Planned

---

## 📊 V2 Progress Summary

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1: PWA & Assets | ✅ Complete | Icons, og-image, offline.html, sitemap, includeAssets sync |
| Phase 2: Code Health | ✅ Complete | execCommand replaced, @ts-nocheck, console.log removed, test packages removed, i18n fixes |
| Phase 3: i18n Coverage | ✅ Complete | 95%+ showToast wrapped _tToast, remove-bg keys, PDF/dev/utils/calc sweeps |
| Phase 4: SEO & Meta | ✅ Complete | JSON-LD schema, robots.txt, sitemap |
| Phase 5: UI/UX Polish | ✅ Complete | pageTitle standardized, keyboard shortcuts, loading=lazy, PWA delay, currency timestamp, checkerboard CSS |
| Phase 6: Performance | ✅ Complete | Preconnect unpkg, transition:persist navbar, PWA cache rules |
| Phase 7: Tool Fixes | 🟡 10/13 done → 🟢 10/13 done | 3 remaining (deferred for next session) |
| Phase 13-15: New | ⬜ | Error handling, PWA hardening, SEO per-page, CDN optimization |

---

## 🔴 New Findings — Critical/High

| # | Finding | Severity | Files | Detail |
|---|---------|----------|-------|--------|
| **C1** | **`alert()` calls break UX** | 🔴 | `csv-json.astro` (line 92), `proxy.astro` (line 97), `converter.astro` (line 85) | Replace with `window.showToast?.(... 'error')`. `alert()` is jarring, blocks UI, inconsistent with rest of app. |
| **C2** | **Document event listeners leak on SPA navigation** | 🔴 | 13 files, 29 total doc listeners | 29 `document.addEventListener` calls (mousemove: 10, mouseup: 8, touchmove: 8, touchend: 8, keydown: 7, scroll: 1). Editor.astro worst at 8, watermark.astro & sign.astro 4 each. Only 3 files properly cleanup. Each SPA nav = duplicate listeners → memory leak + duplicate execution. |
| **C3** | **Editor.astro crop listeners leak** | 🔴 | `editor.astro` | 8 document-level listeners for crop + zoom inside `astro:page-load` without ANY cleanup. Most severe leak in codebase. |
| **C4** | **Scripts without `astro:page-load` wrapper** | 🟡 | 8 tool pages | `stopwatch`, `lorem`, `uuid`, `hash`, `password`, `number`, `case`, `pomodoro` — 24 files already have `astro:page-load`. These 8 don't. Scripts run only on initial load, state resets on SPA nav back. |
| **C5** | **Composable adoption only 8.6%** | 🟡 | 5 of 58 pages | Only 5 pages import composables. 53 pages duplicate toast/clipboard/debounce/history logic inline. |
| **C6** | **Accessibility near-zero** | 🟡 | Entire codebase | Only 8 `aria-label` total. Zero `role`, zero `aria-describedby`. 58 tool pages invisible to screen readers. |
| **C7** | **19 silent error swallows** | 🔴 | 8 files | 13 `.catch(() => {})` + 6 empty `catch(e) {}`. Users have ZERO feedback when operations fail. `my-ip.astro` WebRTC silent fail, `prabowo-countdown` audio.play() fails silently (Chrome autoplay policy), `bmi/age` share fails silently, `paste-to-md` GPT encoder fails silently, `proxy/currency/color` fail silently. Users stuck with no indication anything went wrong. |

## 🟡 New Findings — Medium

| # | Finding | Severity | Files | Detail |
|---|---------|----------|-------|--------|
| **M1** | **48 `any` type casts** | 🟡 | `my-ip.astro` (worst at 15+), `age.astro`, `paste-to-md.astro` | Should define proper interfaces. `(h: any)` in history loops, `(d: any)` in API transforms. |
| **M2** | **8 `@ts-ignore` all in one file** | 🟡 | `prabowo-countdown.astro` | `window._tToast` references. Fix by declaring global types. |
| **M3** | **execCommand('copy') fallback** | 🟡 | `html-to-img.astro` | Deprecated API in fallback path. Use modern Clipboard API. |
| **M4** | **Markdown copies innerHTML instead of textContent** | 🟡 | `markdown.astro` (line 71) | `navigator.clipboard.writeText(preview.innerHTML)` — copies HTML tags as text. |
| **M5** | **History stored without typing** | 🟡 | `unit.astro`, `percentage.astro` | `any` in history. Runtime errors on malformed localStorage. |
| **M6** | **`innerHTML` for user HTML parsing** | 🟡 | `paste-to-md.astro` | `doc.body.innerHTML` for parsing. Has `sanitizeHtml()` but pattern is risky. |
| **M7** | **CSV parsing blocks UI** | 🟡 | `csv-json.astro` | Synchronous parsing for large CSVs. Should chunk or use worker. |
| **M8** | **Stopwatch timer global setInterval** | 🟡 | `stopwatch.astro` | Not in `astro:page-load`. Timer state stale after SPA nav. |
| **M9** | **No `<title>` or `<meta description>` per page** | 🟡 | 58 tool pages | Only `BaseLayout` has `<title>{pageTitle} \| ToolsAulia</title>`. No unique meta descriptions. All 58 pages share identical SEO metadata. Google shows duplicate snippets. |
| **M10** | **Z-index values inconsistent** | 🟢 | Multiple files | z-[90], z-[100], z-[200], z-[9999], z-50 scattered. No `z-index` scale documented. Toast at z-[100], PWA modal at z-[200], loading spinner at z-50, confetti at z-[9999], network status at z-50. Potential stacking conflicts between toast (100) and nav (50). |

## 🟢 Findings — Performance & PWA

| # | Finding | Severity | Files | Detail |
|---|---------|----------|-------|--------|
| **P1** | **5.6 MB chunk (id-words.ts)** | 🟡 | `src/data/id-words.ts` | 195k kata dibundle. Dimuat di halaman index (semua user kena). Harusnya lazy-load via dynamic `import()`. |
| **P2** | **pdf.js loaded 12+ times** | 🟢 | 12 PDF tools | `pdf.js@2.16.105` CDN dimuat terpisah tiap halaman. Centralize ke shared chunk. |
| **P3** | **No resource hints for AI model** | 🟢 | `remove-bg.astro` | 5-15MB WASM+ONNX download. No `<link rel="preload">` or progress indicator. |
| **P4** | **No preconnect/dns-prefetch for CDNs** | 🟡 | `BaseLayout.astro` | cdnjs, jsdelivr, unpkg, fonts.googleapis — no `<link rel="preconnect">` or `dns-prefetch`. Saves 100-300ms per first CDN request. |
| **P5** | **PWA: All CacheFirst — no NetworkFirst** | 🟡 | `astro.config.mjs` | 4 runtime caches all use `CacheFirst`. No `NetworkFirst` for content that needs freshness (currency rates, IP data, jokes API). Users see stale data until cache expires (365 days for CDN!). |
| **P6** | **PWA: No offline.html fallback page** | 🟡 | `astro.config.mjs` | `includeAssets` lists `offline.html` but no actual offline fallback configured via Workbox `offlineFallback()` recipe. Uncached pages show browser error, not custom offline page. |
| **P7** | **PWA: 10MB cache limit vs 9.3MB KBBI** | 🟢 | `astro.config.mjs` | KBBI thesaurus is 9.3MB — 93% of max cache size. Any additional large asset (AI model 15MB!) evicts it. Consider increasing to 20MB or splitting KBBI into chunks. |
| **P8** | **PWA: KBBI cached for 30 days only** | 🟢 | `astro.config.mjs` | `maxAgeSeconds: 30 hari` for thesaurus. Dataset rarely changes. Should be 365 days like CDN caches. |

## 🟢 New Findings — Low / Nice to Have

| # | Finding | Severity | Files | Detail |
|---|---------|----------|-------|--------|
| **L1** | **converter.astro only supports PNG input** | 🟢 | `converter.astro` | Alert says "Mohon upload file PNG!" — should support JPG, WEBP, etc. |
| **L2** | **json.astro uses `window.i18n?.t` pattern** | 🟢 | `json.astro` | Different i18n pattern than rest of app (`_tToast`). |
| **L3** | **No loading indicator on proxy.astro request** | 🟢 | `proxy.astro` | Button click → API call with no loading state feedback. |
| **L4** | **Flag image missing alt text** | 🟢 | `my-ip.astro` | `<img id="flag-img" ... alt="Flag">` — generic alt, plus another img with `alt=""` (empty). |
| **L5** | **Jokes/brainstorm/motivation share duplicate logic** | 🟢 | 3 files | Copy-pasted share handler with identical structure. Should be a composable. |
| **L6** | **Pomodoro timer doesn't show session count** | 🟢 | `pomodoro.astro` | User asked for notification + sound (done ✅), but session counter would complement nicely. |
| **L7** | **Some PDF tools load pdf.js CDN but might not use it** | 🟢 | `grayscale.astro`, `rotate.astro`, others | Several load `pdf.js@2.16.105` via CDN. Could consolidate to one version or use pdf-lib consistently. |

---

## ✅ Phase 7 Completed Tasks

| # | Task | Status |
|---|------|--------|
| 7.1 | merge.astro drag-to-reorder | ✅ Done — drop indicator, mouse-position-based index, visual feedback |
| 7.3 | editor.astro canvas crop | ✅ Done — overlay, 8 handles, rule-of-thirds, apply/cancel, history |
| 7.4 | my-ip remove Battery API | ✅ Done — replaced with connection type |
| 7.5 | remove-bg blur background | ✅ Done — ::before pseudo-element blur portrait effect |
| 7.6 | sinonim offline cache badge | ✅ Done — already existed |
| 7.7 | pomodoro end-of-session sound + notification | ✅ Done — 3-note chime + browser Notification + permission request |
| 7.8 | prabowo-countdown share as image | ✅ Done — 1080×1080 canvas card with countdown + branding |
| 7.10 | 404 page smarter suggestions | ✅ Done — popular tools chips + search button |
| 7.11 | merge.astro inconsistent toast | ✅ Done — unified _tToast pattern |
| 7.12 | loading=lazy + alt text on images | ✅ Done — 9 images updated |

---

## 🎯 Phase 7 Remaining Tasks (3 tasks)

| # | Task | Files | Est | Priority |
|---|------|-------|-----|----------|
| 7.2 | **Standardize PDF tools progress UI** | `pdf/*.astro` (~16 files) | 30m | 🟡 |
|  | Satu pattern: progress bar + page counter + cancel button. Gak beda-beda tiap tool. | | | |
| 7.9 | **Homepage Recently Used enhancement** | `index.astro` | 20m | 🟡 |
|  | Track usage frequency, show "Paling Sering Dipake" section. | | | |
| 7.13 | **Calculator input validation feedback** | `bmi.astro`, `age.astro`, `percentage.astro` | 20m | 🟡 |
|  | Inline error message (bukan cuma toast) pas input invalid. | | | |

---

## 🎯 New Quick Wins (Highest ROI)

| # | Task | Time | Impact |
|---|------|------|--------|
| **QW1** | Replace 3 `alert()` calls with toast | 10m | UX consistency |
| **QW2** | Fix editor.astro crop listener leaks | 15m | Memory leak fix |
| **QW3** | Wrap stopwatch/lorem/uuid/hash/password/number/case scripts in `astro:page-load` | 20m | SPA navigation reliability |
| **QW4** | Fix markdown.astro innerHTML copy (line 71) | 5m | Correctness |
| **QW5** | Add `@ts-ignore` → global type declaration for window._tToast/showToast | 10m | Type safety |
| **QW6** | Fix converter.astro to support JPG/WEBP input (not just PNG) | 15m | Feature completeness |

---

## 📋 Phase 8: New — SPA Navigation Hardening

**Kenapa**: 36 document event listeners leak on SPA navigation. This causes memory leaks, duplicate execution, and stale state.

| # | Task | Files | Est |
|---|------|-------|-----|
| 8.1 | **Audit all document-level listeners** | All `.astro` files | 20m |
|  | List every `document.addEventListener` and check for corresponding `removeEventListener` in cleanup. | | |
| 8.2 | **Add `astro:before-swap` cleanup to all tools** | ~15 files | 45m |
|  | Named function pattern: `function handler(e) { ... }` → `document.addEventListener('event', handler)` → `astro:before-swap` → `document.removeEventListener('event', handler)`. | | |
| 8.3 | **Wrap un-wrapped scripts in `astro:page-load`** | 9 files | 25m |
|  | stopwatch, lorem, uuid, hash, password, number, case, pomodoro, wa-builder. | | |
| 8.4 | **Test SPA navigation on all 58 tools** | Manual | 30m |
|  | Navigate to each tool → navigate away → navigate back. Verify state preserved, no duplicate listeners. | | |

---

## 📋 Phase 9: New — TypeScript Cleanup

**Kenapa**: 48 `any` type casts, 8 `@ts-ignore`. Type safety prevents runtime bugs.

| # | Task | Files | Est |
|---|------|-------|-----|
| 9.1 | **Declare global window types** | `src/types/global.d.ts` (new) | 15m |
|  | `_tToast`, `showToast`, `showButtonSpinner`, `_shortcutsRegistered`, `_pwaDeferredPrompt`. Remove 8 `@ts-ignore` in prabowo-countdown. | | |
| 9.2 | **Type my-ip history interfaces** | `my-ip.astro` | 20m |
|  | Replace 15+ `any` casts with proper `IPData`, `SpeedHistory`, `IPHistory` interfaces. | | |
| 9.3 | **Type age.astro history** | `age.astro` | 10m |
|  | `currentAgeData: any` → proper interface. `history.map((h: any)` → typed. | | |
| 9.4 | **Type sinonim cache interfaces** | `sinonim.astro` | 10m |
|  | Cache data: `any[]` → proper `SynonymEntry` interface. | | |

---

## 📋 Phase 10: Nice to Have — Polish

| # | Task | Est |
|---|------|-----|
| 10.1 | Extract shared share handler (jokes/brainstorm/motivation) to composable | 20m |
| 10.2 | Add session count display to pomodoro | 15m |
| 10.3 | converter.astro: support JPG/WEBP input | 15m |
| 10.4 | proxy.astro: add loading state | 10m |
| 10.5 | csv-json.astro: add progress for large files | 20m |
| 10.6 | Consolidate pdf.js CDN versions (2.16.105 used in 12 files) | 10m |

---

## 📋 Phase 11: New — Accessibility Baseline

**Kenapa**: Cuma 8 `aria-label` di seluruh codebase. 58 halaman tools zero semantic roles. Screen reader = blank page.

| # | Task | Files | Est |
|---|------|-------|-----|
| 11.1 | **Add aria-labels to all icon-only buttons** | ~30 files | 30m |
|  | Every `<button>` with just SVG inside needs `aria-label`. Pattern: search, theme, close, copy, download, etc. | | |
| 11.2 | **Add `role="main"` to tool page content** | 58 pages | 15m |
|  | Wrap main content area in `<main role="main">` or add `role="main"` to existing container. | | |
| 11.3 | **Add `role="navigation"` to nav elements** | `BaseLayout.astro` | 5m |
|  | Desktop nav + mobile sidebar. | | |
| 11.4 | **Add `aria-expanded` to toggle buttons** | `BaseLayout.astro` | 10m |
|  | Search modal, mobile menu, theme toggle — all need `aria-expanded` state. | | |
| 11.5 | **Add `aria-live` regions for dynamic content** | ~10 files | 15m |
|  | Toast notifications, timer displays, search results, status updates. Use `aria-live="polite"`. | | |
| 11.6 | **Add focus-visible styles globally** | `global.css` | 5m |
|  | Already have some `focus-visible:` in BaseLayout. Standardize in global.css. | | |

## 📋 Phase 12: New — Composable Adoption Drive

**Kenapa**: 5 composables exist tapi cuma 5 halaman yang pake. 53 halaman duplikasi logic.

| # | Task | Files | Est |
|---|------|-------|-----|
| 12.1 | **Replace inline debounce with composable** | ~10 files | 30m |
| 12.2 | **Replace inline toast with `window.showToast`** | ~15 PDF tools | 30m |
| 12.3 | **Extract share handler to composable `useShare()`** | 3 files | 20m |
| 12.4 | **Adopt `useLocalHistory` in history tools** | 5 files | 20m |

---

## 📋 Phase 13: New — Error Handling & User Feedback

**Kenapa**: 19 silent error swallows. Users get ZERO feedback when operations fail. Critical operations (WebRTC, audio, share, API calls, GPT encoder) fail without any indication.

| # | Task | Files | Est |
|---|------|-------|-----|
| 13.1 | **Replace all `.catch(() => {})` with toast error** | 7 files | 25m |
|  | `my-ip.astro` (WebRTC), `prabowo-countdown` (6× audio.play), `paste-to-md` (2×), `bmi.astro` (share), `age.astro` (share), `html-to-pdf.astro`. Add `window.showToast(..., 'error')` with descriptive messages. | | |
| 13.2 | **Replace empty `catch(e) {}` with toast** | 4 files | 15m |
|  | `BaseLayout.astro` (2× localStorage clear + PWA), `currency.astro`, `color.astro`, `proxy.astro`. Show error toast so user knows something failed. | | |
| 13.3 | **Add error boundaries for tool pages** | All `.astro` | 30m |
|  | Each tool's main `<script>` wrapped in try/catch at top level. On unexpected error, show inline error message + retry button (not just console error). | | |
| 13.4 | **Add loading state to all async operations** | 10 files | 25m |
|  | proxy.astro (no loading indicator), base64.astro (no encoding feedback), currency.astro (no API loading state), diff.astro (no compute feedback), csv-json.astro (large files block). Add spinner or disable-button pattern. | | |

---

## 📋 Phase 14: New — PWA Hardening

**Kenapa**: All caches use `CacheFirst` (stale data forever), no offline fallback page, cache size borderline for KBBI thesaurus + AI model.

| # | Task | Files | Est |
|---|------|-------|-----|
| 14.1 | **Add NetworkFirst for dynamic APIs** | `astro.config.mjs` | 20m |
|  | Currency rates, IP geolocation, jokes/motivation/brainstorm APIs → `NetworkFirst` with 5s timeout. Ensures fresh data while still working offline. | | |
| 14.2 | **Add offline.html fallback** | `public/offline.html` | 15m |
|  | Create styled offline page with: "You're offline" message, list of tools that work offline, PWA install prompt. Register via `navigateFallback` or Workbox `offlineFallback()`. | | |
| 14.3 | **Increase cache limit to 25MB** | `astro.config.mjs` | 5m |
|  | 10MB → 25MB. KBBI thesaurus 9.3MB + AI model 15MB = 24.3MB. Prevents cache eviction wars. | | |
| 14.4 | **Extend KBBI cache to 365 days** | `astro.config.mjs` | 2m |
|  | Thesaurus data rarely changes. 30 days → 365 days matches CDN cache policy. | | |
| 14.5 | **Add preconnect for CDN origins** | `BaseLayout.astro` | 10m |
|  | `<link rel="preconnect">` for cdnjs, jsdelivr, unpkg, fonts.googleapis. Saves 100-300ms per first CDN request. | | |

---

## 📋 Phase 15: 🔥 SEO DOMINATION — Google Search Engine Optimization

**Goal**: ToolsAulia tools muncul di halaman 1 Google untuk keyword seperti "pdf to md mas aul", "merge pdf gratis", "kompres pdf online", "qr code generator indonesia", dll.

**Current State Audit**:
- ✅ `BaseLayout` already has: OG tags, canonical URL, Twitter cards, preconnect (fonts + CDNs)
- ✅ `<html lang="id">`, viewport, theme-color meta — all good
- ❌ **Sitemap: hanya 19 URL dari 58+ halaman** — 39 tools invisible ke Google!
- ❌ **Domain mismatch**: sitemap → `toolsaulia.vercel.app`, robots.txt → `paklubis.my.id`
- ❌ **58 halaman share 1 meta description** — Google anggap duplicate content
- ❌ **Zero JSON-LD structured data** — no WebApplication, BreadcrumbList, HowTo schema
- ❌ **No hreflang tags** — ID/EN versions not linked for Google
- ❌ **`pageTitle` terlalu pendek** — "PDF to Markdown Converter" kurang keyword density
- ❌ **No `lastmod` dates in sitemap** — Google gak tau kapan halaman diupdate
- ❌ **No image alt text optimization** — keyword opportunity missed
- ❌ **No internal linking strategy** — no "related tools" cross-links between pages

---

### 15.1 🔴 Critical: Complete Sitemap — All 58 Tools

**Problem**: `public/sitemap.xml` cuma 19 URL. 39 tools gak bisa di-crawl Google.

**Fix**: Generate ulang sitemap dengan **semua 58 tool pages** + homepage + /pdf hub = **60 URL total**.

```xml
<!-- Format per URL: -->
<url>
  <loc>https://toolsaulia.vercel.app/file/pdf-to-md</loc>
  <lastmod>2026-07-02</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

**Priority tiers**:
| Priority | Pages | Reason |
|----------|-------|--------|
| 1.0 | Homepage (`/`) | Main entry point |
| 0.9 | `/pdf`, `/utils/wa-builder`, `/utils/qr`, `/image/remove-bg` | High traffic potential |
| 0.8 | Most PDF tools, `/security/password`, `/calc/currency`, `/utils/paste-to-md`, `/file/pdf-to-md` | Core utility tools |
| 0.7 | Remaining tools | Niche but crawlable |
| 0.5 | `/404`, `/api/*` | Noindex already |

| # | Task | Est |
|---|------|-----|
| 15.1a | **Generate complete sitemap with all 60 URLs** | 30m |
|  | Use `@astrojs/sitemap` integration properly, or write build script. Include `lastmod`, `changefreq`, `priority`. Verify all URLs return 200. | |
| 15.1b | **Fix domain consistency** | 5m |
|  | robots.txt: `paklubis.my.id` → `toolsaulia.vercel.app`. Or set up custom domain. Single source of truth. | |

---

### 15.2 🔴 Critical: Unique Meta Descriptions per Tool

**Problem**: Semua 58 halaman pake description default: *"Koleksi tools developer favorit saya. Gratis, cepat, dan tanpa iklan."* — Google sees 58 duplicate snippets.

**Strategy**: Setiap tool dapat `pageDescription` prop yang SEO-optimized. Pattern:
```
[Fungsi Tool] secara gratis dan 100% offline di browser. [Keyword 1], [Keyword 2], tanpa upload data. Dibuat oleh Aulia Iskandar Lubis.
```

**Examples**:
| Tool | pageTitle | pageDescription |
|------|-----------|-----------------|
| PDF to Markdown | `PDF to Markdown Converter - Gratis & Offline \| ToolsAulia` | `Konversi PDF ke Markdown secara gratis, cepat, dan 100% offline di browser. Ekstrak teks PDF jadi format Markdown bersih tanpa upload file. Dibuat oleh Aulia Iskandar Lubis (Mas Aul).` |
| Merge PDF | `Merge PDF Online Gratis - Gabung File PDF \| ToolsAulia` | `Gabungkan beberapa file PDF menjadi satu secara gratis dan offline di browser. Merge PDF tanpa batasan ukuran, tanpa upload ke server. ToolsAulia by Mas Aul.` |
| QR Generator | `QR Code Generator Gratis Indonesia - Buat QR \| ToolsAulia` | `Buat QR code WhatsApp, URL, WiFi, vCard, dan lainnya secara gratis. Custom warna, download PNG, 100% offline di browser. ToolsAulia QR Generator.` |
| Remove BG | `Hapus Background Foto Pakai AI Gratis \| ToolsAulia` | `Hapus background gambar otomatis menggunakan AI (ONNX). Ganti background dengan warna solid atau gambar custom. 100% offline, tanpa upload.` |
| Password Gen | `Generator Password Kuat - Acak & Aman \| ToolsAulia` | `Buat password random yang kuat dan aman. Atur panjang, simbol, angka, huruf besar/kecil. Generate 100% di browser, tidak disimpan di server.` |

**Implementation**:
1. Update `BaseLayout.astro` Props: tambah `pageDescription?: string`
2. Di `<head>`, ganti hardcoded description jadi `content={pageDescription ?? defaultDescription}`
3. Update OG: `og:description` + `twitter:description` juga pake `pageDescription`
4. Setiap `.astro` tool page tambahin `pageDescription="..."` prop
5. Gunakan existing `desc` field dari `tools.ts` + keyword expansion

| # | Task | Est |
|---|------|-----|
| 15.2a | **Add `pageDescription` prop to BaseLayout** | 10m |
| 15.2b | **Write SEO-optimized descriptions for all 58 tools** | 45m |
|  | Pattern: "[Fungsi] secara gratis & offline. [Benefit]. ToolsAulia by Aulia Iskandar Lubis." | |
| 15.2c | **Update all 58 .astro pages with pageDescription** | 30m |

---

### 15.3 🟡 High: Keyword-Optimized Titles

**Problem**: `pageTitle` saat ini terlalu generik. "PDF to Markdown Converter" → Google gak tau ini tools Indonesia.

**Strategy**: Title pattern: `[Primary Keyword] - [Secondary Keyword] | ToolsAulia`
| Current | Optimized | Target Keyword |
|---------|-----------|----------------|
| `PDF to Markdown Converter` | `PDF to Markdown Converter - Gratis & Offline` | "pdf to markdown", "pdf ke md" |
| `Merge PDF` | `Merge PDF Online Gratis - Gabung File PDF` | "merge pdf", "gabung pdf" |
| `Persamaan Kata / Sinonim` | `Persamaan Kata & Sinonim KBBI - Kamus Online` | "persamaan kata", "sinonim kbbi" |
| `Remove Background` | `Hapus Background Foto - AI Background Remover` | "hapus background", "remove bg" |
| `Password Gen` | `Generator Password Kuat - Random Password` | "password generator", "buat password" |
| `Studio Editor` | `Editor Foto Online - Edit Gambar Gratis` | "edit foto online", "photo editor" |
| `HTML to Image` | `HTML to Image Converter - Screenshot Kode` | "html to image", "html ke gambar" |
| `My IP Address` | `Cek IP Saya - IP Public & Info Jaringan` | "cek ip", "my ip address" |

**Implementation**: Update `pageTitle` di setiap `.astro` file.

| # | Task | Est |
|---|------|-----|
| 15.3 | **Rewrite all 58 pageTitles with keywords** | 30m |

---

### 15.4 🟡 High: JSON-LD Structured Data

**Problem**: Zero structured data. Google can't show rich snippets (stars, breadcrumbs, FAQ, how-to steps).

**Schemas to implement**:

#### A. WebApplication Schema (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "ToolsAulia",
  "url": "https://toolsaulia.vercel.app",
  "description": "Koleksi 58+ tools developer & produktivitas gratis. 100% offline di browser.",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Any",
  "offers": { "@type": "Offer", "price": "0" },
  "author": { "@type": "Person", "name": "Aulia Iskandar Lubis", "url": "https://paklubis.my.id" }
}
```

#### B. BreadcrumbList Schema (Semua halaman)
Auto-generate dari URL path:
- `/file/pdf-to-md` → Home > File > PDF to Markdown
- `/pdf/merge` → Home > PDF Tools > Merge PDF

#### C. HowTo Schema (Tool pages dengan steps)
Tools seperti QR Generator, WA Builder, Password Generator yang punya steps jelas:
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Cara Generate QR Code WhatsApp",
  "step": [
    { "@type": "HowToStep", "name": "Pilih tipe QR Code" },
    { "@type": "HowToStep", "name": "Isi nomor WhatsApp" },
    { "@type": "HowToStep", "name": "Klik Generate & Download" }
  ]
}
```

#### D. FAQ Schema (Informational tools)
Tools seperti My IP, Sinonim, BMI Calculator:
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Apakah data saya aman saat cek IP?",
    "acceptedAnswer": { "@type": "Answer", "text": "Ya! Semua diproses 100% di browser." }
  }]
}
```

| # | Task | Est |
|---|------|-----|
| 15.4a | **Add WebApplication schema to homepage** | 10m |
| 15.4b | **Add BreadcrumbList to BaseLayout** (auto from path) | 15m |
| 15.4c | **Add HowTo schema to 5-8 step-based tools** | 20m |
| 15.4d | **Add FAQ schema to 5-8 informational tools** | 20m |

---

### 15.5 🟡 High: hreflang Tags (ID ↔ EN)

**Problem**: ToolsAulia supports ID + EN via i18n toggle, but no `hreflang` tags. Google treats ID and EN as duplicate content.

**Fix**: Add to `<head>`:
```html
<link rel="alternate" hreflang="id" href="https://toolsaulia.vercel.app/file/pdf-to-md" />
<link rel="alternate" hreflang="en" href="https://toolsaulia.vercel.app/en/file/pdf-to-md" />
<link rel="alternate" hreflang="x-default" href="https://toolsaulia.vercel.app/file/pdf-to-md" />
```

| # | Task | Est |
|---|------|-----|
| 15.5 | **Add hreflang tags to BaseLayout** (dynamic from URL) | 15m |

---

### 15.6 🟡 High: Image Alt Text SEO

**Problem**: Images are functional (tool previews, QR codes, flags) but `alt` text is generic or empty. Missed keyword opportunity.

**Fix**: Descriptive alt text with keywords:
- `<img alt="QR Code WhatsApp untuk nomor 081234567890">`
- `<img alt="Hasil PDF to Markdown converter ToolsAulia">`
- `<img alt="Bendera Indonesia - IP Location Jakarta">`

| # | Task | Est |
|---|------|-----|
| 15.6 | **Audit & fix alt text across all 58 tools** | 25m |

---

### 15.7 🟢 Medium: Internal Linking — "Related Tools"

**Problem**: Tools are silos. No cross-links between related tools. Google can't discover related content easily.

**Strategy**: Tambah section "Related Tools" / "Tools Terkait" di bawah setiap tool:
- PDF to Markdown → Related: PDF to Text, CSV to JSON, Markdown Editor
- QR Generator → Related: WA Link Builder, URL Encoder
- Image Compressor → Related: Image Converter, Remove Background, Color Picker
- Merge PDF → Related: Split PDF, Compress PDF, Reorder PDF

| # | Task | Est |
|---|------|-----|
| 15.7 | **Add "Related Tools" section to 10-15 flagship tools** | 30m |

---

### 15.8 🟢 Medium: robots.txt Optimization

**Current issues**:
1. ❌ `Sitemap: https://paklubis.my.id/sitemap-index.xml` — wrong domain!
2. ✅ `Allow: /` — good
3. ✅ `Disallow: /api/` — good
4. ✅ `Crawl-delay: 1` — good

**Fix**:
```txt
User-agent: *
Allow: /
Disallow: /api/
Crawl-delay: 1
Sitemap: https://toolsaulia.vercel.app/sitemap-index.xml
```

| # | Task | Est |
|---|------|-----|
| 15.8 | **Fix robots.txt domain** | 2m |

---

### 15.9 🟢 Nice: Google Search Console + Analytics

**Setup untuk monitoring**:
1. Verify `toolsaulia.vercel.app` di Google Search Console
2. Submit sitemap XML
3. Monitor: clicks, impressions, average position, CTR per query
4. Target keywords to track:
   - "pdf to markdown gratis"
   - "merge pdf online"
   - "qr code generator indonesia"
   - "hapus background foto"
   - "kalkulator bmi online"
   - "cek ip saya"
   - "tools aulia" / "mas aul tools" (branded)

| # | Task | Est |
|---|------|-----|
| 15.9 | **Setup Google Search Console + submit sitemap** | 15m |

---

## 📋 Phase 16: 🔴 CRITICAL — Drag & Drop Audit & Fix

**Audit Date**: July 2, 2026
**Severity**: 🔴 **CRITICAL** — 13 files punya drop zone UI tapi ZERO drag-and-drop handlers!

### Audit Results

**Files WITH proper drag & drop (working ✅)**:
| File | Accent | Pattern |
|------|--------|--------|
| `remove-bg.astro` | violet | dragover + dragleave + drop + file validation |
| `paste-to-md.astro` | emerald | dragover + dragleave + drop + multi-file support |
| `converter.astro` | sky | dragover + dragleave + drop + file validation |
| `pdf-to-md.astro` | orange | dragover + dragleave + drop + file handling |
| `to-text.astro` | blue | dragover + dragleave + drop + file handling |
| `merge.astro` | red | dragover + dragleave + drop + multi-file PDF filter |
| `delete.astro` | red | dragover + dragleave + drop + PDF validation |

**Files with drop zone UI but BROKEN drag & drop (13 files)**:
| # | File | Route | Accent Color | Handler |
|---|------|-------|-------------|---------|
| 1 | **`to-jpg.astro`** ⭐ | `/pdf/to-jpg` | red | `processPDF(file)` |
| 2 | `to-ppt.astro` | `/pdf/to-ppt` | orange | `convertToPPT(file)` |
| 3 | `watermark.astro` | `/pdf/watermark` | cyan | `renderPageOne(file)` |
| 4 | `compress.astro` | `/pdf/compress` | emerald | `fileInput change` handler |
| 5 | `extract.astro` | `/pdf/extract` | emerald | `renderThumbnails(file)` |
| 6 | `compressor.astro` | `/image/compressor` | emerald | `fileInput change` handler |
| 7 | `grayscale.astro` | `/pdf/grayscale` | gray | `loadAndPreviewFirstPage(file)` |
| 8 | `page-numbers.astro` | `/pdf/page-numbers` | violet | `fileInput change` handler |
| 9 | `sign.astro` | `/pdf/sign` | blue | `renderPdfPage(file)` |
| 10 | `split.astro` | `/pdf/split` | orange | `renderThumbnails(file)` |
| 11 | `rotate.astro` | `/pdf/rotate` | blue | `renderThumbnails(file)` |
| 12 | `metadata.astro` | `/pdf/metadata` | cyan | `loadMetadata(file)` |
| 13 | `jpg-to-pdf.astro` | `/pdf/jpg-to-pdf` | red | multiple files → `selectedFiles` |

**Root Cause**: File-file ini dibuat dengan copy-paste dari template yang cuma punya click handler. Drag-and-drop event listeners gak pernah ditambahin.

**Fix Pattern**:
```javascript
// After existing click handler:
dropZone.addEventListener('click', () => fileInput.click());

// ADD these three handlers:
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('border-ACCENT-500', 'bg-ACCENT-50', 'dark:bg-ACCENT-950/30');
});
dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('border-ACCENT-500', 'bg-ACCENT-50', 'dark:bg-ACCENT-950/30');
});
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('border-ACCENT-500', 'bg-ACCENT-50', 'dark:bg-ACCENT-950/30');
  const file = e.dataTransfer?.files?.[0];
  if (file) {
    // Call the appropriate handler (same as fileInput change handler)
  }
});
```

| # | Task | Est |
|---|------|-----|
| 16.1 | **Fix `to-jpg.astro` drag & drop** (most critical — user reported broken) | 5m |
| 16.2 | **Fix 9 PDF tools: to-ppt, watermark, compress, extract, grayscale, page-numbers, sign, split, rotate** | 20m |
| 16.3 | **Fix `jpg-to-pdf.astro` drag & drop** (multiple file support) | 5m |
| 16.4 | **Fix Image tools: compressor.astro** | 5m |
| 16.5 | **Fix `metadata.astro` drag & drop** | 5m |

---

## 📊 Overall Progress Tracker

| Phase | Tasks | Priority | Est. Time | Status |
|-------|-------|----------|-----------|--------|
| Phase 1-6 | 30 tasks | — | — | ✅ Complete |
| Phase 7 (remaining) | 3 tasks | 🟡 High | ~1h | 🟡 |
| Phase 8: SPA Hardening | 4 tasks | 🔴 Critical | ~2h | ⬜ |
| Phase 9: TypeScript Cleanup | 4 tasks | 🟡 High | ~1h | ⬜ |
| Phase 10: Polish | 6 tasks | 🟢 Medium | ~1.5h | ⬜ |
| Phase 11: Accessibility | 6 tasks | 🟡 High | ~1.5h | ⬜ |
| Phase 12: Composable Adoption | 4 tasks | 🟡 High | ~1.5h | ⬜ |
| Phase 13: Error Handling | 4 tasks | 🔴 Critical | ~1.5h | ⬜ |
| Phase 14: PWA Hardening | 5 tasks | 🟡 High | ~1h | ⬜ |
| Phase 15: 🔥 SEO Domination | 15 tasks | 🔴 Critical | ~5.5h | ⬜ |
| Phase 16: Drag & Drop Fixes | 5 tasks | 🔴 Critical | ~40m | ✅ Complete |
| Quick Wins | 6 tasks | 🔴 Critical | ~1h | ✅ Complete |

**Total: 62 remaining tasks, ~18.5 jam**

---

## 📈 Audit #5-6 New Findings Summary

| Category | Count | Details |
|----------|-------|--------|
| Silent error swallows | 19 | 13 `.catch(() => {})` + 6 empty `catch(e) {}` |
| No loading states | 10 tools | proxy, base64, currency, diff, csv-json, etc. |
| PWA cache issues | 4 | All CacheFirst, no offline.html, 10MB limit, KBBI 30-day TTL |
| SEO per-page | 0/58 pages | No unique descriptions, no JSON-LD, no hreflang |
| **Sitemap gaps** | **39/58 missing** | Only 19 URLs — 67% of tools invisible to Google |
| **Domain mismatch** | 2 domains | robots.txt→paklubis.my.id, sitemap→toolsaulia.vercel.app |
| CDN performance | 0 preconnects for jsDelivr | cdnjs & unpkg already preconnected ✅ |
| Z-index chaos | 6+ values | No scale, potential stacking conflicts |

## 📊 SEO Keyword Targets (Priority)

| # | Target Keyword | Volume (ID) | Difficulty | Target Page |
|---|---------------|-------------|------------|-------------|
| 1 | "pdf to markdown" | Medium | Low | `/file/pdf-to-md` |
| 2 | "merge pdf online gratis" | High | Medium | `/pdf/merge` |
| 3 | "kompres pdf" | High | Medium | `/pdf/compress` |
| 4 | "qr code generator" | High | High | `/utils/qr` |
| 5 | "hapus background foto" | Medium | Medium | `/image/remove-bg` |
| 6 | "cek ip saya" | Medium | Low | `/dev/my-ip` |
| 7 | "password generator" | Medium | High | `/security/password` |
| 8 | "kalkulator bmi" | Medium | Low | `/calc/bmi` |
| 9 | "whatsapp link generator" | Medium | Medium | `/utils/wa-builder` |
| 10 | "tools aulia" / "mas aul tools" | Low | Low | `/` (branded) |
| 11 | "sinonim kata" / "persamaan kata" | Medium | Low | `/utils/sinonim` |
| 12 | "konversi csv ke json" | Low | Low | `/file/csv-json` |
| 13 | "edit foto online gratis" | High | High | `/image/editor` |
| 14 | "pdf to text" | Medium | Medium | `/pdf/to-text` |
| 15 | "countdown 2029" | Low | Low | `/utils/prabowo-countdown` |

---

## 📝 Audit Metadata (Fresh Scan — July 2, 2026)

| Metric | Count | Notes |
|--------|-------|-------|
| Total `.astro` files | 58 | All pages + layouts + components |
| `innerHTML` assignments | 141 | 95% safe (static/template); ~5% user-content (paste-to-md, wa-builder, sinonim) |
| `addEventListener` calls | 224 | Including element-level (buttons, inputs) |
| **Document-level listeners** | **29** | **mousemove: 10, mouseup: 8, touchmove: 8, touchend: 8, keydown: 7, scroll: 1** |
| Files with doc listeners | 13 | editor.astro (8) > watermark.astro (4) = sign.astro (4) |
| Files with proper cleanup | 3 | prabowo-countdown (keydown), editor (keydown), BaseLayout (pwa scroll) |
| `any` type casts | 48 | my-ip.astro (19) > age.astro (5) > paste-to-md.astro (4) |
| `@ts-ignore` directives | 8 | All in prabowo-countdown.astro |
| `alert()` calls | 3 | csv-json (1), proxy (1), converter (1) |
| `is:inline` scripts | 42 | CDN libs (pdf.js, html2canvas, etc.) + inline page scripts |
| Files with `astro:page-load` | 24 | 22 tool pages + 2 BaseLayout — 8 tool pages still missing it |
| Files importing composables | 6 | BaseLayout + only 5 tool pages (8.6% adoption) |
| `aria-label` attributes | 8 | 6 in BaseLayout, 1 in todo, 1 in prabowo |
| `role` attributes | 1 | `role="button"` on prabowo mascot container |
| `execCommand('copy')` remaining | 1 | html-to-img.astro fallback path |
| `console.log` in production | 0 | ✅ All removed |
| `eval` / `new Function` | 0 | ✅ Clean |
| `text-slate-` / `bg-slate-` | 0 | ✅ Palette migration complete |
| TODO / FIXME / HACK | 0 | ✅ Clean |
| Largest bundle chunk | 5.6 MB | `id-words.ts` (195k Indonesian words) — needs lazy-load |

---

## 📝 Notes

- **Critical path**: Quick Wins → Phase 8 (SPA) → Phase 7 → Phase 11 (a11y) → Phase 12 (composables) → Phase 9 (TS) → Phase 10 (polish)
- **Quick Wins first** — 6 tasks, ~1 jam. Highest ROI. Fixes 3 alert(), 8 leaked listeners, 8 page-load gaps, 1 innerHTML bug, 8 @ts-ignore, 1 format limitation.
- **SPA hardening = biggest tech debt** — 29 doc listeners, only 3 cleanup. 8 pages without page-load. Memory grows with every navigation.
- **Accessibility is embarrassing** — 8 aria-labels in 58 pages. Literally invisible to screen readers. Quick wins possible: just add aria-labels + roles.
- **Composables are underused** — 5 great composables exist but only 5 pages use them. 93% of pages duplicate logic. Drive adoption before writing new features.
- **No new tools** — 58 is enough. Focus = hardening + a11y + consistency.
- **Commit per-phase** — `phase(X): description` for easy tracking.
- **id-words.ts lazy-load** — 5.6MB chunk hits every user on homepage. Move to dynamic import on sinonim page only. Saves ~2.5MB gzip for 99% of users.
