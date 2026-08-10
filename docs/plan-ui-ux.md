# UI/UX Improvement Plan — ToolsAulia

> Created: August 11, 2026
> Tujuan: Bikin UI lebih **menarik & enak dilihat** — dari "fungsional" jadi "premium".
> Baseline: commit backup `0b76437` (semua kerjaan audit sesi ini sudah di-commit)
> Status: ✅ **Phase 1-2 SELESAI dieksekusi** (arah B) · Phase 3 menunggu perintah

## ✅ Execution Log — Phase 1 (Warm Premium)

| Item | Perubahan |
|------|-----------|
| **P1-1 A1** | `font-heading: Plus Jakarta Sans` di tailwind config + rule `h1-h4` di global.css + Google Fonts URL (400-800) di BaseLayout |
| **P1-1 A3** | Signature gradient `.gradient-text` (sky→indigo→violet) di hero "Toolbox" + `.gradient-brand` di explore-btn |
| **P1-2 C1** | Duotone icon tile per kategori: `colorTile` (16 warna) di index.astro → prop `tileClass` di ToolCard (gradient tile + warna ikon + `scale-110` hover) |
| **P1-3 E4** | `useToast.ts` upgrade: icon per tipe (lucide), `role="status"`, stack max 3, **message via textContent (XSS-safe)** |
| **P1-4 F1/F2** | Palette refresh: light `#fbfbfd`/`#0f172a`/`#64748b` · dark `#0b0e14`/`#131722`/`#242b3b`/`#f1f5f9`/`#94a3b8` — matte-700/800/900/950 diselaraskan |
| **P1-5 C2** | `.card-base`: radius 1rem, layered hover shadow, dark hover accent border |
| **Review** | 4 saran diterapkan: hapus rule redundant, selaraskan matte scale, toast textContent, font weight 400-500 |

**Verifikasi:** build ✅ · tests 43/43 ✅ · JIT classes ter-generate (gradient-text, icon-tile, from-rose-100, Plus Jakarta Sans) ✅

## ✅ Execution Log — Phase 2

| Item | Perubahan |
|------|-----------|
| **P2-1 B1/B2** | Bento highlight kategori di index.astro — 6 tile gradient (PDF/Image/Dev/Calc/Security/Utils) + icon + count + link `/?cat=X` + hover glow |
| **P2-2 D1** | Search modal → **command palette**: ArrowUp/Down nav + highlight, Enter buka (`.click()` → view transition), Escape tutup, reset state per query |
| **P2-3 D2** | Mobile `<select>` → **horizontal scroll pills** (`.filter-btn-mobile`) + rewiring script (`setActiveFilter` update class, click listener) + `role="group"` a11y |
| **P2-4 E1** | `components/ToolPageHeader.astro` dibuat (gradient icon tile + title + desc, i18n-ready) + **migrasi selesai 56/58 halaman**: batch 1 (5 halaman) + codemod `scripts/migrate-headers.mjs` (47 halaman) + manual 4 (converter, merge, to-jpg, to-text) — sisa 5 = layout custom yang wajar (404, index hero, pdf/index hub, image/editor, utils/prabowo-countdown) |
| **P2-4 fix** | 🐛 **PDF to Text hilang dari `src/data/tools.ts`** (ketemu saat migrasi): tool ada di pdf/index.astro tapi tidak ada di tools.ts → tidak muncul di homepage grid + command palette. Entry ditambahkan (icon file-text, color blue, seo meta) — i18n key `tool.pdf_to_text` sudah ada di translations.ts |
| **P2-5 A4** | Logo header: gradient SVG mark + wordmark `gradient-text` · `public/favicon.svg` → gradient sky-indigo-violet · generate-assets.mjs og-image gradient diupdate · **semua PNG regenerated via sharp** (favicon-16/32, apple-touch, pwa-192/512, og-image) |
| **Review** | 5 saran diterapkan: `.click()` utk Enter, hapus label dead → `role="group"`, ToolPageHeader `<div>` bukan `<header>`, shadow netral, (P2-4 scope ditandai) |

**Verifikasi Phase 2:** build ✅ · tests 43/43 ✅

---

## 1. Snapshot: Kondisi Desain Sekarang

Berdasarkan pembacaan `global.css`, `index.astro`, `ToolCard.astro`, `BaseLayout.astro`, `tailwind.config.mjs`:

**Yang SUDAH modern** (jangan dirombak, cukup disempurnakan):
- ✅ 3D card tilt + gloss shine (`tilt-wrapper`/`tilt-card-gloss`)
- ✅ Hero parallax layer + floating blobs + animated counters
- ✅ Astro view transitions (fade 0.15s/0.2s)
- ✅ Recently Used + Paling Sering Dipake (localStorage)
- ✅ Search + **Ctrl+K** focus + Escape reset + `?cat=` URL state
- ✅ Sticky filter bar (desktop pills / mobile select) + sort (populer/A-Z)
- ✅ Dark mode class-based + `prefers-reduced-motion` respect
- ✅ focus-visible rings, skip-to-content, offline badge, scroll progress bar

**Yang membuatnya terasa "biasa" / kurang premium:**
- Palette monokrom abu (GitHub-dark style) + 1 accent sky — terkesan developer-only, kurang "warm"
- Hero teks-dan-tombol saja (tidak ada visual demo/ilustrasi interaktif)
- Tool card kecil & seragam — tidak ada hirarki visual antar kategori
- Typography flat — semua Inter, tanpa display font buat headline
- Konsistensi antar tool page belum merata (header gradient bervariasi, drop zone beda-beda)
- Mobile: filter pakai `<select>` (kurang touch-friendly), tidak ada bottom nav / quick access

---

## 2. Arah Desain — 3 Opsi (pilih 1, atau campur)

### Opsi A — "Refined Matte" (paling aman, ~2-3 hari)
Pertahankan identitas matte + sky, tapi naikkan kualitas:
- Palette di-soften: bg light `#fbfbfd` (bukan `#fafafa`), dark `#0b0e14` (bukan hitam pekat)
- Card: radius lebih besar (16px), border lebih halus, shadow berlapis (ambient + key)
- Hero: tambah ilustrasi/visual interaktif (mini mock tools), gradient lebih berani
- **Pro**: perubahan kecil, zero risk, tetap konsisten | **Kontra**: kurang "wow"

### Opsi B — "Warm Premium" (menengah, ~4-5 hari)
Identitas matte tetap, tapi accent digeser ke **warm gradient** (amber→rose→violet) + typography display:
- Headline pakai display font (mis. **Plus Jakarta Sans / Sora**) dengan `font-heading`
- Gradient mesh background halus di hero + footer, aksen kategori warna-warni per tool card
- **Pro**: hangat, premium, beda dari kompetitor developer-tools | **Kontra**: perlu tuning kontras aksesibilitas

### Opsi C — "Vibrant Bento" (berani, ~6-8 hari)
Homepage dirombak jadi **bento grid** (pola ilovepdf/tinywow 2026):
- Kategori populer (PDF, Image, Dev) ditampilkan sebagai tile besar asimetris dengan ilustrasi ikon 3D/duotone
- Warna kategori jelas: PDF=red/rose, Image=sky, Dev=violet, Calc=emerald, dll.
- Tool card pakai duotone icon di kotak ber-warna (bukan mono abu)
- **Pro**: paling menarik & memorable | **Kontra**: effort terbesar, risiko konsistensi antar halaman

**Rekomendasi gw: Opsi B** — paling balance "menarik + enak dilihat" tanpa rombak total.

---

## 3. Item Improve Konkret (per area)

### A. Visual Identity & Typography
| # | Item | Detail |
|---|------|--------|
| A1 | **Display font untuk heading** | Tambah `font-heading: ['Plus Jakarta Sans'/'Sora', ...]` di tailwind; hero `h1`, section title, tool page `h1` pakai font ini. Body tetap Inter |
| A2 | **Hirarki teks lebih tegas** | Hero h1: `text-5xl md:text-7xl tracking-tight`; tool page header konsisten `text-3xl md:text-4xl` |
| A3 | **Gradient accent identity** | Buat 1 signature gradient (mis. `from-sky-400 via-indigo-500 to-violet-500`) dipakai konsisten: hero title, logo, CTA, active states |
| A4 | **Brand logo** | Ganti teks logo "ToolsAulia" jadi mark SVG + wordmark (gradient), pakai di header + PWA icon |

### B. Homepage / Landing
| # | Item | Detail |
|---|------|--------|
| B1 | **Hero visual interaktif** | Tambah mini "live demo strip" di hero (mis. 3 chip tool populer yang hover lift + gradasi) atau mock drop-zone animasi — bukan cuma teks |
| B2 | **Bento highlight kategori** | Di bawah hero: grid 2-4 tile besar (PDF, Image, Dev, Utils) dengan ikon besar + count + hover shine — masuk ke `/pdf`, `/image` dgn `?cat=` |
| B3 | **Stats lebih hidup** | Counter animasi (sudah ada) + tambah "57+ Tools · 7 Kategori · 100% Client-Side · 0 Upload" jadi strip statistik kontras |
| B4 | **New Tools section upgrade** | Chip "Baru" badge per item + gradient border hover (bukan cuma border color) |
| B5 | **Frequent/Recent row** | Tampilkan default (bukan hidden sampai ada data) dengan skeleton; item pakai gradient bg per kategori |

### C. Tool Card & Grid
| # | Item | Detail |
|---|------|--------|
| C1 | **Icon duotone berwarna per kategori** | `icon-mono` abu → ikon di dalam kotak gradient lembut per kategori (`data-color` sudah ada di index). Warna muncul diam-diam saat hover (pertahankan filosofi "hover reveals color") |
| C2 | **Card polish** | Radius 16px, hover `-translate-y-1` + shadow besar + border accent; deskripsi `line-clamp-2`; arrow "→" muncul konsisten |
| C3 | **Badge favorit/populer** | Tambah badge kecil "Populer" / "🔥" di card populer (data sudah ada) |
| C4 | **Grid responsive lebih baik** | `card-grid`: 1→2→3→4 sudah oke; tambah `auto-fit minmax(240px)` agar fluid di 1024-1280 |

### D. Navigasi & Search
| # | Item | Detail |
|---|------|--------|
| D1 | **Search → command palette penuh** | Upgrade Ctrl+K jadi overlay modal (bukan cuma focus input): hasil + ikon + deskripsi + arrow-key navigation + Enter buka tool. Reuse data `searchTools` JSON yang sudah ada di BaseLayout |
| D2 | **Category pill bar mobile** | Ganti `<select>` mobile dengan horizontal scroll pill (swipe-friendly), sama seperti desktop |
| D3 | **Breadcrumb di tool page** | Tambah breadcrumb `Beranda / PDF / Merge PDF` di atas header tool (SEO + orientasi) |
| D4 | **Footer redesign** | Footer sekarang apa adanya — tambah kolom kategori links + badge PWA/client-side + social |

### E. Konsistensi Tool Page (58 halaman!)
| # | Item | Detail |
|---|------|--------|
| E1 | **Header tool seragam** | Template: gradient icon tile 56px + `h1` + deskripsi. Audit sudah nemu variasi (ada yang gradient, ada yang flat, ada yang tanpa icon) |
| E2 | **Drop zone seragam** | Semua upload tool pakai pola `usePdfDropZone` (sudah untuk 16 PDF) → extend ke image/file tools: dashed border, icon besar, format badge, ukuran max |
| E3 | **Tombol & input konsisten** | Standarisasi: primary button (gradient atau matte-900), secondary (border), radius 12px, active scale |
| E4 | **Toast upgrade** | Toast sekarang basic — tambah icon per tipe (✅/❌/ℹ️), slide-in dari bottom, progress auto-dismiss, stack max 3 |
| E5 | **Empty state tool** | Sebelum file di-drop: placeholder dengan illustrasi + tips (sudah banyak yang bagus, standarisasi) |

### F. Dark Mode & Theming
| # | Item | Detail |
|---|------|--------|
| F1 | **Dark palette lebih kaya** | Dark bg `#0b0e14` bukan `#010409`; surface berlapis (elevated/hover/border) dengan translucency + blur di header sticky |
| F2 | **Light mode warm** | Light bg `#fbfbfd` + card putih bersih; text `#0f172a` (slate-900) bukan hitam |
| F3 | **Theme toggle polish** | Animasi transisi (sun/moon morph), persist localStorage (sudah ada), `prefers-color-scheme` fallback |

### G. Micro-interactions & Motion
| # | Item | Detail |
|---|------|--------|
| G1 | **Button feedback** | Semua button: `active:scale-95` (banyak yang sudah), tambah ripple/glow subtle di primary |
| G2 | **Copy feedback** | Sudah ada `✅ Copied!` di beberapa — standarisasi jadi toast + icon swap (check untuk 1.5s) |
| G3 | **Hover reveal berlanjut** | Filosofi "hover reveals color" dipertahankan tapi diperkuat: icon, dot, arrow, underline semuanya transisi 200ms |
| G4 | **Scroll reveal** | `animate-on-scroll` sudah ada di beberapa page — tambah IntersectionObserver wrapper biar semua section muncul bertahap (respect reduced-motion) |

### H. Aksesibilitas & Polish
| # | Item | Detail |
|---|------|--------|
| H1 | **Kontras accent** | Pastikan accent-blue di teks kecil ≥ 4.5:1 (cek `#38bdf8` di white — kemungkinan perlu darken jadi `#0284c7` untuk teks) |
| H2 | **Touch target** | Semua tombol min 44×44px di mobile (banyak yang 32px) |
| H3 | **Reduced motion** | Sudah di-respect global ✅ — pastikan fitur baru (B1, G4) ikut conditional |

---

## 4. Prioritas Eksekusi

### Phase 1 — "Enak dilihat" cepat (≈4-6 jam, high impact / low risk)
```
P1-1  A1+A3  Display font + signature gradient        → tailwind config + global.css + index.astro
P1-2  C1     Icon duotone per kategori (index grid)    → index.astro + ToolCard.astro
P1-3  E4     Toast upgrade (icon + stack + slide)      → BaseLayout.astro (showToast)
P1-4  F1+F2  Palette refresh light/dark                → global.css + tailwind.config.mjs
P1-5  C2     Card polish (radius, shadow, hover)       → global.css (.card-base) + ToolCard
```

### Phase 2 — "Menarik" (≈8-12 jam)
```
P2-1  B1+B2  Hero visual + bento highlight kategori    → index.astro
P2-2  D1     Search command palette (Ctrl+K modal)     → BaseLayout.astro + index.astro
P2-3  D2     Mobile category horizontal pills          → index.astro
P2-4  E1     Seragam header tool (58 halaman, batch)   → skrip codemod + audit per kategori
P2-5  A4     Logo + PWA icon upgrade                   → BaseLayout + public/ + manifest
```

### Phase 3 — "Premium" (opsional, ≈2-3 hari)
```
P3-1  B5/D4  Frequent default + footer redesign
P3-2  E2     Drop zone seragam ke semua upload tool
P3-3  G4     Scroll reveal wrapper global
P3-4  C3+D3  Badge populer + breadcrumb
P3-5  H1-H2  Aksesibilitas pass (kontras accent + touch target 44px)
```

---

## 5. Referensi Riset (2025-2026 trends)

- **Bento grid hero** — asimetris, kategori besar langsung terlihat (ilovepdf/tinywow style)
- **Liquid glass dark mode** — surface transluscent + backdrop-blur, bukan hitam pekat
- **Duotone iconography** — ikon custom dalam tile berwarna, bukan mono abu
- **Command palette search** — Ctrl+K fuzzy + arrow-key + intent matching ("perkecil file" → Compress)
- **Progressive disclosure** — jangan tumpah 58 tool; tampilkan kategori relevan dulu, "Recent/Frequent" default
- **Micro-commitment** — drop file dulu baru minta aksi (client-side = tanpa signup, ini keunggulan kita)

## 6. Guardrail

- Semua perubahan **tetap client-side** (guard `npm run check:client-side` sudah aktif di `prebuild`)
- Dark mode & reduced-motion harus tetap di-respect
- Jangan rombak struktur data `tools.ts` — warna/hirarki via `data-color` yang sudah ada
- Setiap phase: build + test (vitest 43) + review sebelum lanjut

**Menunggu persetujuan: pilih arah desain (A/B/C) + phase mana yang dieksekusi.**
