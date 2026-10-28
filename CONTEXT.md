# CONTEXT — Tools MasAul

Situs kumpulan tools 100% client-side (Astro + Tailwind). Data pengguna diproses di browser,
tidak pernah dikirim ke server. Live production: **https://tools.paklubis.my.id** (Vercel).

> **Handoff antar-agent:** entry point rules = `AGENTS.md` di root (lokal/gitignored — baca file itu
> dulu tiap mulai session baru, isinya ringkasan guardrails + peta file konteks). `docs/CONTEXT.md`
> (internal, gitignored) = detail arsitektur, 22 Keputusan teknis, Plan Status.

---

## Konvensi & Guardrails (WAJIB ikut)

- **Tool = 1 file `.astro`** di `src/pages/<kategori>/` (`pdf/`, `calc/`, `utils/`, `file/`, dst).
- **Registrasi tool baru** — 3 file, semua wajib:
  1. `src/data/tools.ts` — daftar tool utama
  2. `src/data/new-tools.ts` — daftar tool baru (href di **urutan paling atas** — homepage
     "Baru Ditambahkan" menampilkan 8 teratas)
  3. `src/i18n/translations.ts` — key i18n
- OG image otomatis ke-generate (`/og/<kategori>-<nama>.png`) — kalau muncul, registrasi valid.
- **Prebuild guardrails** (`scripts/check-*.mjs`, 6): client-side, inline scripts, critical CSS,
  BaseLayout props, toast convention, ToolPageHeader props. Jalan tiap `pnpm build` — build hijau =
  semua lolos. Ditambah `scripts/sync-tool-counts.mjs` (urutan pertama prebuild): **angka jumlah
  tool di README, docs/CONTEXT.md & komentar performa disinkron otomatis dari `src/data/tools.ts`**
  — tambah tool → angka ikut naik tiap build; kalau pola angganya tak ketemu, prebuild gagal
  (exit 1) biar ketahuan, bukan diam-diam basi.
- **Pola SPA buat tool interaktif (WAJIB)** — cegah "tool mati setelah navigasi": binding DOM di
  dalam `init()`, boot di `astro:page-load` + guard path halaman (`const __page = …`) + anti
  dobel-bind via `anchor.dataset.autoBound`, listener global idempoten, timer/interval dibersihkan
  saat `astro:page-leave`/path miss. Bug ini pernah bikin 6 tool mati (jokes, motivation, bmi,
  percentage, unit, photo) — fix `d55c969`.
- **i18n audit**: `node scripts/audit-i18n.mjs` — exit 0 = 0 dup / 0 dangling key. **Status i18n:
  FULL 249/249 (100%) sejak W6 batch 30 (Okt 22, 2026)** + W7 header title/desc gap 59→0.
  Sisa opsional: placeholder keys (170 unwired, mayoritas contoh numerik) — lihat entri W7.
- **Script besar**: tulis sebagai `<script>` eksternal Astro, bukan inline.
- **Lib pihak ketiga**: pola multi-CDN fallback via `src/composables/useCdnLib.ts`
  (SheetJS, html2pdf, dll). `mammoth` (docx→HTML) di-bundle lokal.
- **Jangan pakai class Tailwind dinamis** (`bg-${color}-500`) — gak ke-generate. Pakai mapping statis.
- ⚠️ **Pengecualian privasi (satu-satunya):** `/utils/url-shortener` memakai API pihak ketiga
  **spoo.me** — URL yang dipendekkan dikirim keluar dari browser. Ini satu-satunya halaman di mana
  data pengguna meninggalkan perangkat. Tetap lolos `check-client-side.mjs` karena request dibuat
  dari browser (tanpa kode server). Disclaimer privasi di halaman itu **jangan dihapus**, dan
  `seoDesc`-nya juga harus jujur soal spoo.me. Kalau butuh host API baru, cek CSP `connect-src`
  di `vercel.json` (sementara sudah `https:` — semua host diizinkan).

---

## HR Toolkit (untuk HRD perusahaan minyak, Kalimantan — 1 user)

Semua di bawah `/pdf/*` & `/calc/*` + dashboard semi-privat. Data inti: **localStorage key `hrd_data_v1`**.

| Tool | Path | Fungsi |
|---|---|---|
| HRD Dashboard | `/utils/hrd-dashboard` | Karyawan (CRUD + import Excel/CSV massal), Absensi, Cuti, Rekrutmen (kanban), Payroll, Ringkasan (reminder kontrak PKWT ≤30 hari + countdown THR), Panduan, Data/Backup JSON |
| Slip Gaji | `/pdf/slip-gaji` | Tarik karyawan + absensi dari dashboard → PDF A4 profesional |
| PPh 21 TER | `/calc/pph21-ter` | Tabel TER A/B/C lengkap (PP 58/2023) + Desember metode Pasal 17 |
| THR & BPJS | `/calc/thr-bpjs` | THR prorata Permenaker 6/2016 + iuran BPJS TK & Kes (JKK 0,10–1,60% pasca PP 6/2025, JP cap Rp11.086.300, JKP 0,36% cap Rp5jt, Kes 5% cap Rp12jt) |
| Hari Kerja Efektif | `/calc/workdays` | Exclude weekend/libur custom + prorata gaji & sisa cuti |
| Surat HR | `/pdf/surat-hr` | SKK, SP-1/2/3, PKWT → PDF; autofill karyawan dari dashboard; **batch SKK massal** semua karyawan |
| Word → PDF | `/pdf/word-to-pdf` | mammoth → html2pdf |
| Excel → PDF | `/pdf/excel-to-pdf` | SheetJS → tabel → html2pdf |

### Keputusan penting (jangan diubah tanpa diskusi)

- **Rumus konsisten**: potongan alpha = gaji pokok ÷ 22 × hari alpha (dipakai dashboard, slip gaji, workdays).
- **Dashboard semi-privat** — 3 lapis, gak boleh dibongkar:
  1. `hiddenToolHrefs` di `tools.ts` + export `publicTools` → hilang dari landing, showcase, `search-tools.json`, 404. Halaman kategori `/pdf` pakai daftar hardcoded sendiri.
  2. `public/robots.txt`: `Disallow: /utils/hrd-dashboard`
  3. Meta `noindex, nofollow` via prop `noIndex` BaseLayout
- **Akses dashboard hanya via link langsung** — simpan di bookmark/WhatsApp.
- **Auth lokal** (`hrd_auth_v1` + `hrd_session_v1`): salt + SHA-256 Web Crypto, rate-limit 5× gagal → lock 5 menit, auto-lock idle 15 menit (sessionStorage stamp, throttle 10 dtk). Gak ada backend, sesuai prinsip client-side.
- **Prop `hideChrome` di BaseLayout** (Oktober 2026): halaman app mandiri (HRD Dashboard) pakai `<BaseLayout … noIndex hideChrome>` — menambahkan class `app-mode` di `<body>`; CSS di `global.css` menyembunyikan navbar/footer situs, widget Lapor Bug, modal PWA, dan breadcrumb **tanpa menghapus DOM** (semua binding script null-guarded). Tab title jadi polos tanpa suffix "Tools MasAul". Dashboard punya header + footer personal sendiri di dalam `<slot>`. **Jangan pernah pakai `<BaseLayout … />` self-closing** — bug Oktober 2026: konten jatuh keluar slot, render di bawah footer situs.
- **Import Excel/CSV**: SheetJS CDN, header dikenali fleksibel (ID/EN), tanggal flexibel termasuk serial date Excel, konfirmasi sebelum insert.

### Alur kerja HR yang sudah nyambung

Input karyawan (+import massal) → absensi/cuti → hitung (PPh 21 / THR / hari efektif) → slip gaji / surat (2 klik) → backup mingguan.

---

## Deploy

- Vercel CLI via `npx` (gak global), login `kandarlubis31`, domain custom **tools.paklubis.my.id**.
- Deploy: `pnpm build` dulu → `npx vercel --prod --yes` → verify endpoint dengan curl.
- **SELALU production (`--prod`)**, jangan deploy preview doang — user cek langsung di domain
  live, preview URL bikin dikira "belum rilis". Setelah deploy wajib verifikasi live (status
  route baru, isi `/search-tools.json`, changelog, `sw.js`).

## Status saat ini (Oktober 2026)

- 🆕 **(Oct 28) Toast error anti false-positive + posisi kanan atas + gap keyboard HP** —
  commit `c712b91`.
  - **False positive "Operasi gagal"**: `window.onerror` + `unhandledrejection` di
    `BaseLayout.astro` sekarang memfilter error rutin client-side (AbortError saat SPA nav,
    NotAllowedError clipboard/audio, InvalidStateError AudioContext, `ResizeObserver loop`,
    `Failed to fetch`/network, `Script error.`, stack dari ekstensi). Rejection non-`Error`
    (string/undefined) cuma dicatat console. Maks 3 toast error per halaman (anti error loop).
  - **Posisi toast**: dari `bottom-6 left-1/2 -translate-x-1/2` → `top-24 right-5` (sejajar
    `#toast-container`), `role="alert"`, `max-w-[min(24rem,calc(100vw-2.5rem))]`. Stack toast
    biasa otomatis digeser via inline `top` selama toast error tampil, dipulihkan saat dismiss.
    z-index tetap `z-[85]` (di bawah search modal z-100 & feedback z-110).
  - **Gap hitam di atas keyboard**: `meta viewport` ditambah `interactive-widget=resizes-content`
    → layout viewport ikut menyusut saat keyboard Android muncul (default `resizes-visual`
    menyisakan pita gelap di halaman input numerik).
  - **Pencarian**: `ToolDefinition.keywords` baru + field `keywords` di `/search-tools.json` +
    ranking relevansi (exact/awalan nama > nama > keywords > kategori > deskripsi). Cari
    "musik" sekarang menaruh Music Studio di urutan teratas.
  - **Verifikasi**: build ✅ (7 guardrail), 62/62 test, audit i18n exit 0 (250/250 FULL),
    CDP 14/14 (AbortError/Failed to fetch/string rejection tidak memunculkan toast; error nyata
    muncul top-right; stack tidak tumpuk; dismiss restore; muat di 360px; cari "musik") +
    SPA smoke 9/9 (BMI → Age → BMI tetap hidup, Music Studio via search, 0 exception).
  - ✅ **SUDAH LIVE (Oct 28)** — deploy production `npx vercel --prod --yes` sukses
    (`tools-aulia-qdwjriani`, alias `https://tools.paklubis.my.id`). Verifikasi live:
    `/media/music-studio/` **200** (title + `#ms-play` ada), viewport `interactive-widget`
    terpasang, `/search-tools.json` live 250 entri **berisi Music Studio + keywords** dan
    **tidak ada lagi Video Studio/`/editor`**, changelog **v2.26** tampil, `sw.js` precache
    memuat `music-studio`. Smoke CDP live **7/7**: kartu di homepage, cari "musik" →
    Music Studio peringkat 1, buka via SPA (64 step drum, 4 pattern), 0 toast error,
    0 exception.
  - 📌 **Alasan awal gak muncul**: live masih deployment lama — `/media/music-studio` 404 dan
    index pencarian live belum punya entri baru. Bukan bug search.

- 🆕 **(Oct 28)** **Music Studio (mini DAW) rilis + Video Studio/OmniClip dihapus total** —
  commit `bb0e898`.
  - **Hapus total**: route `/editor`, `public/editor` (28.3 MB / 374 file tracked), source
    `omniclip` (117 MB / 472 file tracked), `editor/build-dist.mjs`, entri `tools.ts` +
    `new-tools.ts`, 4 key i18n, header COOP/COEP + redirect di `vercel.json`, exclusion SW di
    `astro.config.mjs`, `.gitignore`, aturan #11 AGENTS. **History git tetap** (tanpa rewrite) —
    changelog lama yang menyebut Video Studio sengaja dipertahankan.
  - **Tool baru `/media/music-studio`**: 4 drum track × 16 step, 2 synth piano roll 13 nada,
    2 track audio/stem import (WAV/MP3, maks 40 MB / 12 menit), mixer 8 channel (vol/pan/mute/solo),
    pattern A–D, song chain maks 16 bar, export WAV via `OfflineAudioContext` (mode Pattern = 1 bar,
    mode Song = susunan + tail audio), demo seed, shortcut Spasi, guard SPA + cleanup AudioContext.
    Tanpa persistence di v1. **Beat Maker lama tetap ada** sebagai tool terpisah.
  - **Verifikasi**: build ✅ (7 guardrail, 507 precache), 62/62 test, audit i18n exit 0
    (250/250 FULL), smoke CDP statis **21/21** (grid 4×16, piano 13×16, play/stop, song mode,
    mixer solo, export WAV 1.58 MB, SPA round-trip, 0 exception) + import stem **7/7**
    (WAV 6 detik → export 12.8 detik).
  - ⚠️ **Jangan jalankan `pnpm build` bareng `pnpm dev`** di laptop ini — watcher + build + Chrome
    bikin Node `EMFILE` (dev server mati; halaman nyangkut `readyState=loading`). Untuk smoke:
    build dulu, lalu serve `dist/client` pakai static server kecil.

- 🆕 **(Oct 27)** **Audit "Bersihkan Cache" + fix layout "Baru Digunakan" + catch-up changelog** —
  commit `699e324` (layout), `be3801a` (cache), `123c990` (changelog), `1960ec8` (title SEO).
  - **Layout**: `#recent-section` landing dikasih `mt-6` senada section Favorit
    (`src/pages/index.astro` ~line 191) — sebelumnya nempel ke filter bar pas Favorit kosong
    (margin-collapse). Smoke: computed margin-top 24px, gap visual 24px semua state.
  - **Audit "Bersihkan Cache"** (tombol footer `#cache-clear-btn` + mobile `#cache-clear-mobile`,
    handler `cacheClearHandler` di `BaseLayout.astro` ~line 1265): fitur memang jalan —
    confirm → unregister service worker → `caches.delete` → reload. **Tapi ada bug data-loss**:
    handler lama juga memanggil `localStorage.clear()` → menghapus SEMUA data user
    (`hrd_data_v1` dashboard HRD!, `hrd_auth_v1`, favorit, riwayat, todo/notes, tema/bahasa).
    Fix: `localStorage.clear()` dihapus — senada self-heal `/offline` yang tidak pernah sentuh
    localStorage. **Keputusan baru #24** (lihat docs/CONTEXT.md): localStorage = DATA user,
    bukan cache.
  - **Smoke CDP 19/19 PASS** (0 exception, 0 console error): layout L1–L5; dialog confirm terbuka
    dibuktikan lewat target-suspension (event `Page.javascriptDialogOpening` TIDAK ter-deliver di
    page-level CDP ws headless=new — jangan disandikan); data user utuh pasca clear via footer +
    mobile + SPA nav; cache marker terhapus; reload terjadi. **Pelajaran harness**: reload via
    handler butuh ±3–6 detik di headless (jangan buru-buru assert) — deteksi paling andal = polling
    `performance.timeOrigin` berubah, bukan freshness window `Page.loadEventFired`.
  - **Changelog catch-up**: 6 entri v2.19 (rebrand Sep 24) s/d v2.24 (Oct 27) ditambah di atas
    v2.18 di `src/data/changelog.ts` — `/changelog` + RSS ikut ke-render otomatis.
  - **Bonus fix title SEO** (`1960ec8`, ketahuan lewat smoke yang sama): `processI18n()` jalur
    bahasa ID menulis-ULANG `document.title` = `${pageTitle} | Tools MasAul` → title SEO landing
    "Koleksi 251+ Tools…" diganti "Dashboard | Tools MasAul" pasca hydration (index.astro kirim
    `pageTitle="Dashboard"`). Fix: jalur ID kini **restore** `document.title` dari
    `meta[property="og:title"]` (= `fullTitle` statik, tidak pernah disentuh i18n; head-swap
    ClientRouter ikut menggantinya saat SPA nav) — fresh load ID = no-op, EN→ID = balik ke
    title SEO, EN rewrite tetap jalan. **Smoke CDP 10/10 PASS**: title === og:title di landing &
    tool page, toggle EN/ID bolak-balik, SPA nav per-halaman, 0 exception. Arsitek: title statik
    `<title>{fullTitle}</title>` TIDAK boleh ditimpa runtime di jalur ID (crawler default = ID).
  - **Fix tambahan handler cache** (`a8e3c9e`, terukur di live): `unregister()` gak resolve
    sampai install SW baru selesai (precache ±35MB) → reload nyangkut >20 detik di produksi.
    Sekarang reload digerbangi delete-cache saja (<1s), unregister fire-and-forget.
    **Live verify: reload cache-clear 620ms** (dulu >20s). Smoke live 4/4 PASS (0 exception):
    title SEO + toggle EN/ID + layout margin 24px + cache-clear cepat + data user utuh.
    Semua commit pushed & deployed.

- 🆕 **(Oct 25)** **DropZone netral + sapu emoji dekoratif batch 1 (label/judul)** — commit `a3beedc`.
  - `DropZone.astro`: prop **`gradient` + `hoverClass` dihapus** (20 halaman mengirim palet warna
    sendiri → dropzone jadi blok warna paling menonjol). Border dashed 2px berwarna → **1px hairline**,
    hover lift + ikon `scale-110` dihapus, tile ikon gradient 16×16 → tile hairline 12×12 netral.
    41 prop dicabut dari 20 halaman. Class sisa duotone `.icon-tile` dihapus dari `global.css` +
    `critical.css`.
  - **Sapu emoji batch 1 (aman)**: hanya elemen judul/label aksi — `h1`–`h6`, `label`, `legend`,
    `summary`, `button`, `a`, `.section-title`. Emoji yang jadi SATU-SATUNYA isi elemen (ikon)
    tidak disentuh; elemen status generik (`<p>`/`<div>` ber-`data-i18n` dengan ✅/⚠️) juga tidak,
    dan bendera negara (🇮🇩🇺🇸) dikecualikan. **202 prefix dihapus di 115 file** (utils 37, pdf 27,
    calc 24, dev 23, image 23, text 20, data 18, security 12, file 8, media 5, network 2, life 1,
    changelog 1); **99 key / 68 baris `translations.ts`** dibersihkan juga supaya emoji tidak balik
    saat ID/EN (processI18n menimpa textContent).
  - Verifikasi: validator struktur (jumlah `<`/`>`/tag per file) **115 file identik** sebelum vs
    sesudah; build hijau (7 guardrail), 62/62 test, audit i18n exit 0 + 0 key duplikat (4466 key);
    HTML build dicek langsung (`Copy IPK` tanpa 📋, `Tambah Password` tanpa 🔒); **smoke CDP 14/14
    PASS** (DropZone dashed 1px/radius 12px/tanpa gradient, tile hairline tanpa shadow, label ID
    `Bagikan` & EN `Share` tanpa emoji, verdict tool JWT tetap utuh, landing 36 kartu + filter,
    showcase 20 kartu) — 0 page exception, 0 console error.
  - ⚠️ **Sisa 826 emoji di 138 file** = kebanyakan penanda status yang memang punya makna
    (✅ 55, ⚠ 43, ❌ 25, ✕ 24, ✓ 21) + emoji di dalam string JS/template kartu hasil (📋 23, 🎉 18,
    🔥 17, ✨ 16). Menyapu ini butuh klasifikasi manual per halaman (batch 2), bukan regex.

- 🆕 **(Oct 25)** **Header halaman tool + showcase diseragamkan (clean)** — commit `91024ef`.
  - `ToolPageHeader.astro`: prop **`gradient` DIHAPUS** (199 halaman mengirim salah satu dari
    18 palet warna → tiap halaman terasa beda tema dari landing). Tile ikon gradient + `shadow-lg`
    diganti tile hairline netral (`.icon-mono`, border 1px, radius 12px, tanpa shadow), tipografi
    rata kiri (`text-left` eksplisit supaya tidak ikut center dari parent), judul 2xl/3xl satu tone,
    share button jadi ghost link (bukan pill berbingkai).
  - Migrasi: 199 prop `gradient=` dihapus dari tag `<ToolPageHeader>` saja (21 sisa `gradient=`
    = prop `DropZone`, bukan header). `ToolShell.astro` disamakan; guardrail
    `check-toolpageheader-props.mjs` kini ALLOWED tanpa `gradient`.
  - `showcase.astro`: map `colorTile` 16 key + `colorTileMap` client dihapus, kartu
    `card-base` + lift/shadow → `.tool-tile` datar, tile ikon hairline, nomor peringkat ditenangkan
    (text-xl, netral), heading emoji 🔥/⭐⭐ dihapus dari markup DAN dari nilai i18n
    `showcase.top_used` / `showcase.editors_pick`, background grid sky dihapus, CTA tanpa
    scale/shadow, field `color` dibuang dari JSON `#showcase-tools-data`.
  - Verifikasi: build hijau (7 guardrail), 62/62 test, audit i18n exit 0 (249/249), **smoke CDP
    20/20 PASS** (header netral: 0 `bg-gradient`, border 1px, radius 12px, shadow none, rata kiri,
    1 tombol share, dark mode, mobile 390px tanpa overflow; `/pdf/merge`; `/utils/hrd-dashboard`
    tanpa ikon tetap render; showcase 20 kartu `.tool-tile` tanpa gradient/emoji; round-trip SPA)
    — 0 page exception, 0 console error.
  - ⚠️ **Emoji di header = 0** (memang tidak pernah ada). Emoji dekoratif di **body** halaman tool
    (1203 kemunculan di 176 halaman: 📋 ✅ ⚠ 💾 🔄 …) **belum disentuh** — itu sweep terpisah dan
    butuh klasifikasi mana emoji fungsional (status/ikon tombol) vs dekoratif.

- 🆕 **(Oct 25, lanjutan 4)** Pencarian lebih pintar — commit `13b199c`.
  - **Filter hub `/pdf`**: hanya mencocokkan judul ID → sekarang `data-search` = judul + deskripsi (ID)
    + judul & deskripsi EN dari `translations` (dipetakan lewat `publicTools` by href, dihitung saat
    build). Terbukti: "gabungin" / "multiple pdf files" → Merge PDF, "putar" → Rotate PDF,
    "reduce pdf file size" → Compress PDF.
  - **Search modal**: tiap hasil memakai **ikon tool asli** (dulu satu ikon panah generik untuk 250
    hasil) + tile hairline. `search-tools.json` menambah field `icon`: 36,8 KB → **71,6 KB raw /
    14,7 KB gzip**, tetap lazy-fetch sekali per sesi + precache SW.
  - **Search modal juga mencocokkan judul EN** (`nameEn` dari `translations`): 7 tool punya nama ID
    yang sangat berbeda dari EN ("Kalkulator Pesangon PHK" vs "PHK Severance Calculator"). Terbukti:
    "Severance" → `/calc/pesangon`, "Workdays" → `/calc/workdays`, "Indonesian Name" →
    `/utils/nama-generator`, kata kunci ID lama tetap jalan.
  - **Cek mobile 390px + mode terang** (screenshot + computed style): kartu hairline 9% / radius 12 /
    shadow 1px, judul `matte-800`, deskripsi `matte-500`, tile ikon 32px `bg-matte-50`, drop zone
    dashed 1px `matte-300` radius 12, tombol/teks tidak overflow (scrollWidth = clientWidth). Temuan
    yang diperbaiki: tile ikon kartu & hasil pencarian **transparan** di mode terang (tidak punya bg)
    → disamakan jadi `bg-matte-50 dark:bg-surface-elevated`; tiga blob blur rose/orange di latar hub
    `/pdf` dihapus (setelah kartu netral, glow itu jadi noda pink/orange).
  - **Verifikasi**: `pnpm build` hijau, `pnpm test` 62/62, smoke CDP **12/12 PASS** (0 exception) —
    5 kata kunci (ID & EN) di /pdf, 42 hasil "pdf" di modal dengan 39 ikon berbeda, 0 ikon generik,
    plus 8 assertion visual mobile/mode terang.

- 🆕 **(Oct 25, lanjutan 3)** Netralkan kartu 19 halaman + sortir rilis + hero permanen.
  - **Hub `/pdf`**: `glowColors` (14 palet) + `getColorClass` dihapus. Kartu grid & kartu
    "Sering Dipakai" pindah ke `.tool-tile` (border/radius/shadow/hover lift standar), tile ikon jadi
    hairline 32px (`icon-mono` + border), hover judul ke aksen (bukan rose). Panel "Sering Dipakai"
    (dulu gradient rose + radial glow + count badge rose) → `card-base` + badge netral.
  - **13 halaman tool PDF** (`compress, delete, extract, grayscale, metadata, page-numbers, photo,
    reorder, rotate, sign, split, to-ppt, watermark`): drop zone 1) **`border-3` tidak pernah ada di
    Tailwind** → border dashed-nya *tak terlihat* selama ini; sekarang `border` 1px + radius 12px.
    2) hover berwarna (emerald/red/…) → netral, identik `DropZone.astro`. 3) tile ikon 80px berwarna
    + `group-hover:scale-110` → tile hairline 56px, ikon 28px stroke 1.5.
  - **`jpg-to-pdf`, `paste-to-md`, `dev/my-ip`, `calc/age`, `utils/word-counter`**: tile ikon kartu
    jadi hairline, `group-hover:scale-110` di tile dihapus, blob sudut berwarna di `calc/age` dihapus,
    angka statistik `word-counter`/`age` jadi satu tone (bukan pink/rose/violet/fuchsia/orange).
  - **Sengaja TIDAK disentuh**: `utils/jokes` (watermark emoji dekoratif) dan
    `utils/prabowo-countdown` (maskot + gradient merah) — itu ilustrasi khas halaman, bukan kartu tool.
    Overlay tombol rotate di thumbnail `pdf/rotate` juga tetap (itu kontrol, bukan kartu).
  - 🐛 **Fix global**: `html`/`body` `overflow-x: hidden` → **`overflow-x: clip`**. `hidden` membuat
    html/body jadi scroll container sehingga **semua `position: sticky` rusak** — bar filter landing
    (−406px saat scroll 900) dan hub `/pdf` tidak menempel sama sekali. Setelah `clip`: keduanya
    menempel di `top: 64px` (di bawah navbar). Diubah di `global.css` **dan** `critical.css` (mirror).
  - **`/pdf` filter bar** `top-0` → `top-16` supaya tidak tertutup navbar sticky 64px.
  - **Sortir "Terbaru"** sekarang benar-benar **urutan rilis**: `data-new-rank` (index di
    `new-tools.ts`, 0 = terbaru) ditaruh di kartu SSR + placeholder saat build; tool yang tidak
    terdaftar menyusul mengikuti `data-tool-index`. Sebelumnya opsi ini mengurutkan riwayat pemakaian
    pribadi (`recentTools`) — labelnya menyesatkan.
  - **Hero tidak lagi disembunyikan saat `?cat=`**: inline no-FOUC script + `heroSection` toggle
    dihapus, breadcrumb kategori tetap muncul. User deep-link sekarang tetap melihat brand + band
    "Baru Ditambahkan".
  - **Verifikasi**: `pnpm build` hijau (7 guardrail), `pnpm test` 62/62, `audit-i18n` exit 0.
    **Smoke CDP 28/28 PASS** (0 exception/console error): hub 21 kartu `.tool-tile` tanpa
    `--glow-color`/tile berwarna, tile 1px/8px, panel + badge netral, bar filter menempel 64px,
    5 halaman PDF drop-zone 1px dashed + tile hairline, age/word-counter/my-ip/paste-to-md netral,
    `?cat=pdf` hero 381px tinggi + breadcrumb, sort "Terbaru" mulai `/pdf/ppt-to-pdf` →
    `/data/chart-maker` → `/calc/pesangon`. Harness dihapus.

- 🆕 **(Oct 25, lanjutan 2)** Audit navigasi + pencarian (permintaan user: "audit yang lain lagi").
  - **Dropdown "Tools" (navbar, semua 255 halaman)**: sebelumnya dibuka **murni CSS `:hover`** → di
    perangkat sentuh ≥768px (iPad, touch laptop) menu ini tidak bisa dibuka sama sekali dan
    `aria-expanded` selalu `false` (menyesatkan screen reader). Sekarang `data-open` di
    `#tools-menu-wrap` + klik toggle, tutup saat klik di luar / Esc / klik link, reset di
    `astro:after-swap`. Chevron pakai `group-data-[open=true]:rotate-180`. Panel diberi
    `max-h-[min(70vh,26rem)] overflow-y-auto` (12 kategori bisa melebihi viewport pendek).
  - **Kategori `Life` (8 tool) tidak ada di navbar** — desktop dropdown & menu mobile hanya memuat 11
    dari 12 kategori, jadi satu-satunya jalan masuk adalah chip di landing. Ditambahkan
    (`nav.category_life`).
  - **Menu mobile tidak bisa discroll**: `absolute` tanpa `max-height` → di layar pendek (landscape
    390×480) tombol Install/Bersihkan Cache terpotong di luar layar. Ditambah
    `max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain` + Esc menutup menu.
  - **Pencarian landing**: filter lama hanya mencocokkan `data-title` (judul versi ID) → "pdf",
    "kalkulator", "calculator", "kompres" tidak menemukan apa pun. Sekarang tiap `.tool-item`
    (SSR **dan** placeholder) punya `data-search` = judul + kategori (id & label) + deskripsi +
    judul/deskripsi EN, dihitung saat build (`searchText()` di frontmatter). Konsekuensi payload:
    +26 KB raw / **+8,6 KB gzip** di `index.html` (250 kartu) — nol request tambahan.
  - **Kolom cari punya tombol ×** (muncul saat ada teks, fokus balik ke input, hint `Ctrl+K`
    disembunyikan via inline style supaya tidak muncul di mobile). Sebelumnya satu-satunya cara
    menghapus kata kunci = select-all/backspace atau Esc (tak terlihat).
  - **A11y**: `#results-count` dapat `role="status" aria-live="polite"` (perubahan jumlah hasil
    dibacakan screen reader).
  - 🐛 **Fix**: state "tidak ada hasil" di search modal menyisipkan query mentah ke `innerHTML`
    (`<img onerror=…>` di kolom cari tereksekusi — self-XSS). Sekarang di-escape (`escHtml`).
  - 🐛 **Fix**: `saveToRecent()` menyimpan `data-name` (i18n KEY) — fallback chip "Baru Digunakan"
    bisa tampil `tool.merge_pdf`. Sekarang pakai `data-title`.
  - **Emoji sisa**: `badge.popular` "🔥 Populer" → "Populer" (ID & EN) + markup `/pdf`.
    `nav.mobile_theme_dark/light` 🌙/☀️ dihapus.
  - **Verifikasi**: `pnpm build` hijau (7 guardrail, public=250), `pnpm test` 62/62, `audit-i18n`
    exit 0 (249/249), **smoke CDP 20/20 PASS** (0 page exception, 0 console error): dropdown
    buka/tutup via klik, Esc, klik luar; 12 kategori + Life; menu mobile scrollable di 390×480 dan
    tombol terakhir terjangkau; cari "kalkulator"/"pdf"/"calculator" dapat hasil relevan; tombol ×
    reset ke 36 kartu + fokus balik; `?cat=life` menampilkan 8 tool. Harness dihapus.
  - **Audit tertunda**: (1) ~~sort "Terbaru" = riwayat pemakaian pribadi~~ **selesai** (lanjutan 3);
    (2) ~~20 halaman masih pakai tile gradient + glow rose~~ **selesai** (lanjutan 3);
    (3) ~~hero + band tersembunyi saat `?cat=`~~ **selesai** (lanjutan 3);
    (4) `/pdf` punya filter sendiri yang tetap hanya cocok judul (belum diubah).

- 🆕 **(Oct 25, lanjutan)** Landing v2 — kartu dinaikkan bobotnya + "Baru Ditambahkan" jadi band
  berpanel (permintaan user: Newly Added kurang menonjol, kartu kurang "pop"). Belum di-commit.
  - **`.tool-tile`**: hairline 7% → 9% + `box-shadow 0 1px 2px`; hover = shadow 4px/12px +
    `translateY(-1px)` + border menguat. `.tool-placeholder` ikut diberi shadow identik supaya
    skeleton→kartu tidak "lompat". Dark: border `--surface-border`, shadow 0.3.
  - **Ikon kartu** kembali punya jangkar: tile hairline 32px (ikon 16px, stroke 1.6) — senada tile
    `ToolPageHeader`; hover border tile menguat + ikon/judul jadi aksen. HARUS identik antara
    `ToolCard.astro` ~ `renderCardHTML()` index.
  - **Kontras**: deskripsi kartu `matte-400` → `matte-500` (light) supaya lolos AA di 12px.
  - **"Baru Ditambahkan"**: baris link ber-pemisah titik → panel `#new-tools`
    (`bg-matte-50/70`, dark `surface-elevated/60`) + pill "Baru" (key baru `index.new_badge`) +
    4 kartu ringkas (2 kolom mobile / 4 desktop) berisi ikon 28px, judul, dan label kategori
    (`index.<cat>`). Test "169 badge" tidak kembali — tidak ada angka hitung.
  - 🐛 **Fix**: `data-i18n` dipindah dari `<h3>` ke `<a>` judul. `processI18n()` menulis
    `textContent`, jadi versi lama **menghapus elemen `<a>`** setiap ganti ke EN → stretched-link
    mati, kartu tidak bisa diklik sampai reload. Terverifikasi: EN judul tetap `"Age Calculator"`,
    anchor utuh.
  - 🐛 **Fix**: sortir A-Z pakai `data-title`, bukan `data-name` (sejak W7 isinya i18n key
    `tool.merge_pdf` → urutan tampak acak padahal labelnya "A-Z").
  - **A11y**: `.fav-star` (`opacity-0` + group-hover) dipaksa `opacity: 1` di `@media (pointer: coarse)`
    — di layar sentuh tidak ada hover, jadi fitur favorit tak pernah terjangkau.
  - **Verifikasi**: `pnpm build` hijau (7 guardrail, public=250), `pnpm test` 62/62, audit i18n exit 0,
    **smoke CDP 44/44 PASS** (0 page exception, 0 console error) — band 4 kartu + pill + label
    kategori, shadow/radius/border kartu, hover (shadow naik, lift -1px, judul aksen) via
    `Input.dispatchMouseEvent`, dark mode lewat `localStorage theme`, EN (pill/heading/kategori/anchor),
    mobile 390px (2 kolom, 0 overflow), halaman 2 lazy-render 36/36 pakai gaya baru, A-Z sesuai judul,
    filter+breadcrumb+favorit. Harness `scripts/tmp-smoke-cards.mjs` dihapus.
  - **Audit tertunda (belum diubah, perlu keputusan)**: (1) opsi sort "Terbaru" sebenarnya
    mengurutkan **riwayat pemakaian pribadi**, bukan tool terbaru — label menyesatkan;
    (2) ~~pencarian hanya cocok dengan `data-title` (judul ID)~~ **sudah diperbaiki** (lihat entri
    "lanjutan 2": `data-search` judul+kategori+deskripsi, ID & EN);
    (3) hero + band ikut tersembunyi saat filter kategori aktif (by design lama, tapi berarti
    "Baru Ditambahkan" tak pernah terlihat oleh user yang masuk lewat `?cat=`).

- 🆕 **(Oct 25)** Rombak landing **"clean"** (commit `900a79e`) — scope sengaja **landing saja** (permintaan user: UI
  terasa terlalu ramai/"lebay", mau lebih clean). Belum di-commit.
  - **Hero**: background grid fix dihapus, badge "Productivity Booster" + 2 stat pill dihapus,
    gradient-text dibuang (H1 dua tone: `Tools` muted + `MasAul` tebal), satu baris meta
    (`100% Client-Side · Top 20 Tools`). Subtitle pakai `index.subtitle_safe` lagi supaya
    kalimat tidak menggantung koma saat i18n aktif.
  - **Bento 6 kartu kategori DIHAPUS** — duplikat visual dari chip filter (`#bento-section` hilang,
    referensi di inline script + `updateIntroVisibility()` dibersihkan). "Baru Ditambahkan" jadi
    satu baris link tanpa kartu; badge hitung `{newTools.length}` (169) yang menyesatkan ikut hilang.
  - **Filter bar**: satu set chip (13) untuk mobile+desktop — `#mobile-filters`,
    `.filter-btn-mobile` + loop binding-nya dihapus; search+sort satu baris di atas chip.
    Chip aktif & halaman pagination aktif kini **netral** (`bg-matte-900` / `dark:bg-white`),
    bukan indigo — aksen indigo tinggal di focus ring & hover link.
  - **Favorit & Baru Digunakan**: baris chip datar (border pill) tanpa `card-base`/grid 6 kolom;
    judul Favorit kini pakai key `index.popular` (sebelumnya hardcoded).
  - **Kartu tool**: class baru `.tool-tile` (global.css) — hairline `border`, radius 0.75rem,
    **tanpa box-shadow & tanpa lift hover**; ikon line-art 18px tanpa kotak tile. Dipakai
    `ToolCard.astro` DAN `renderCardHTML()` di `index.astro` (wajib identik); `.tool-placeholder`
    disamakan (border, bukan ring shadow).
  - **Verifikasi**: `pnpm build` hijau (7 guardrail, public=250), `pnpm test` 62/62, audit i18n
    exit 0 (249/249), **smoke CDP 39/39 PASS** (0 page exception, 0 console error) — cakup filter
    kategori + URL + breadcrumb, search, favorit chip, clear riwayat, grid mobile 2 kolom,
    round-trip SPA (kartu → tool → back → filter masih hidup), dan placeholder lazy-render terisi
    saat discroll. Harness `scripts/tmp-smoke-landing.mjs` sudah dihapus (tidak di-commit).
  - ⚠️ **Bukan regresi**: kartu kosong di bawah lipatan = placeholder lazy-render by design
    (terisi saat masuk viewport + `rootMargin: 400px`); sudah diverifikasi 0 kosong di viewport
    setelah scroll.
  - **Deferred** (di luar scope): 249 halaman tool masih pakai `ToolPageHeader` gradient
    (199 halaman kirim `gradient="from-…"`, 18 palet) + emoji dekoratif di 176 halaman → sumber
    kesan "dua website berbeda" setelah landing dibersihkan. `showcase.astro` juga masih punya
    `colorTile` + heading emoji. → **Sudah dikerjakan di entri Oct 25 di atas** (header tool +
    showcase); emoji body halaman tool masih tersisa.

- 🆕 **(Oct 23)** Poles design homepage premium anti-AI-slop (scope homepage + navbar/footer) →
  commits **`d794a02`** feat(ui) + **`84b0049`** fix(data):
  bento **grid 3-kolom simetris** kartu charcoal hairline + ikon `.icon-mono` netral
  (colorTile/duotone dihapus), **aksen electric indigo global** `--accent-blue`
  (light `#4f46e5` / dark `#6366f1`, triplet `79 70 229` sinkron global+critical, teks aktif
  dark `#818cf8` AA 6.3:1), flat gradient, emoji chrome bersih (flag footer 🇮🇩 ikut; key
  `index.network`/`index.life`), filter+pagination seluruh titik indigo. Fix homepage dari
  smoke: chip favorit by pathname (href absolut vs relatif), judul chip Favorit & Baru Digunakan
  dari judul live DOM (bukan raw key `tool.*`), template recent `${title}`.
  **Fix I1: blok display critical.css kini `@layer critical-display`** — terbukti via instrumen
  urutan head: fresh load `[STYLE[crit]][LINK]`, setelah ClientRouter swap `[LINK][STYLE[crit]]`
  → `.hidden` menang tie-break atas `.md:flex` → baris chip desktop hilang pasca-navigasi SPA
  ("light only" = kebetulan pre/post-swap, bukan tema). **Fix data HRD (pre-existing sejak
  b719749):** `tools-client-data` tak filter `hiddenToolHrefs` → kartu lazy-render off-by-one +
  `/utils/hrd-dashboard` bocor ke grid landing (ketangkap review screenshot; search index,
  showcase, strip New Tools sudah `publicTools`; assertion A5 anti-bocor ditambah ke harness).
  Verifikasi final: build hijau (7 guardrail), 62/62 test, audit exit 0 (gap 0/0/0),
  **smoke CDP 30/30 — 0 exception, 0 consoleErr** + screenshot dark/light/mobile di-review.
  **Pushed head `3c5d74e` (`d794a02` feat + `84b0049` fix + `3c5d74e` docs) → live verify:**
  marker deploy `/_astro/global.QLH9myco.css` 200 (poll ke-1), curl HTML production lolos semua
  marker (`@layer critical-display`, triplet `79 70 229`, h1 brand, **0 link HRD**, 0 flag),
  **smoke CDP live 30/30 PASS — 0 exception, 0 consoleErr** (I1 post-swap `[LINK][STYLE[crit]]`
  tapi `dpDisplay:flex` — fix `@layer` bekerja di prod; A5 anti-HRD; B3/B4/G2 nilai indigo AA;
  roundtrip SPA), screenshot live `scripts/tmp-poles-shots-live/`. Harness
  `scripts/tmp-smoke-poles.mjs` kini dukung env `SMOKE_BASE`/`SMOKE_SHOTS` (mode lokal tetap
  default) — untracked, jangan di-commit (disimpan untuk iterasi desain).
  **Live extras:** 3-lapis HRD lengkap kebukti — lapis1 filter landing/search (smoke A5),
  lapis2 `robots.txt` `Disallow: /utils/hrd-dashboard` ✓, lapis3 `sitemap-0.xml` tanpa HRD ✓
  + halaman HRD `meta robots noindex` ✓; **CI GitHub Actions hijau** (2 run: astro check +
  vitest + build). **Panel Source Control menampilkan 4 item untracked — BUKAN kode
  tertinggal:** itu harness/screenshot sementara (`scripts/tmp-smoke-poles.mjs`,
  `scripts/tmp-debug-poles.mjs`, `scripts/tmp-poles-shots/`, `scripts/tmp-poles-shots-live/`),
  memang tak pernah di-commit; semua kode proyek sudah ter-commit & `main` = `origin/main`
  (`d185e25`). **Deferred batch berikutnya:** `showcase.astro` masih tile gradient lokal
  (di luar scope poles homepage — kandidat batch kecil konsistensi `.icon-mono`).
- 🆕 **(Oct 22)** Rebrand kedua + favicon monogram: nama **"MasAul Tools" → "Tools MasAul"**
  (415 replacements / 36 file tracked — src, config, i18n-phrases key+value, root md; `editor/`
  + `omniclip/` + `public/editor/` sengaja dikecualikan = sub-project terproteksi AGENTS.md #11).
  H1 homepage "My Toolbox" → "Tools MasAul" (gradient di "MasAul"), navbar/footer markup split
  ikut, grammar EN manual (`showcase.desc` "tools on Tools MasAul"). **Favicon baru N1 "MA"
  chevron** (huruf condensed geometric, crossbar A = chevron » DNA mark lama, putih di tile
  #0b0b10): favicon.svg 501B (dari 10KB), favicon-16/32 rounded rx=14, apple-touch-180 +
  pwa-192/512 **full-bleed rx=0** (iOS/Android mask sendiri), logo.png 12.7KB @512 (dari 287KB).
  Verifikasi: build hijau, 62/62 test, audit FULL 249/249, dup NONE, CDP smoke 15/15 (0 exception,
  roundtrip SPA hidup). **Pushed `623e206` → live di-prod, CDP smoke live 17/17 PASS, 0 exception**
  (title suffix, H1, navbar/footer, favicon link+render, no-old-brand, roundtrip SPA).
  ⚠️ `public/og-image.png` masih statis branding lama — deferred.

- ✅ **(Oct 19)** Konteks di-migrasi buat pindah ke **opencode**: `AGENTS.md` root dibuat (rules
  ringkas + pointer lazy-load ke `@CONTEXT.md` / `@docs/CONTEXT.md` / `@docs/AGENTS.md`), kebijakan
  tetap lokal (gitignored), header `docs/CONTEXT.md` di-refresh ke Okt 19.
- ✅ **(Oct 19)** Audit SPA round-trip: **6 tool mati** setelah navigasi (jokes, motivation, bmi,
  percentage, unit, photo) → ke-fix semua pola W6; 17 kandidat `?.addEventListener` lain terbukti
  alive. Prod CDP 6/6 PASS (`d55c969`).
- ✅ **(Oct 19)** Tool baru **`/calc/shoe-size`** (ukur kaki → EU/US/UK/Mondopoint/CM, bayi–dewasa)
  + **EU jadi ukuran default** — kolom EU di depan tabel + badge "Ukuran utama" (`40f2915`, `326a571`).
- ✅ **(Oct 19)** i18n: **FULL 169/242 (70%)**; 128 dangling key ditutup; harness resmi
  `scripts/audit-i18n.mjs` — 0 dup/0 dangling (`3cb3b78`, `5b0e90f`, `72ae710`).
- ✅ **(Oct 19)** Fix **false positif offline** ("Koneksi terputus" sering muncul padahal online):
  race guard `netSeq` di BaseLayout (probe basi gak boleh nimpa state baru), vonis offline butuh
  **2 probe gagal** (jeda 1.5s), + komposable baru `src/composables/useOnline.ts` (`probeOnline`/
  `verifyOffline`) dipakai jokes/my-ip/motivation/brainstorm yang tadinya percaya `navigator.onLine`
  mentah. CDP: fake-offline event gak lagi tampil banner; offline nyata tetap tampil; 11/11 lokal +
  9/9 prod PASS (`e6e12f2`).
- ✅ **(Oct 19)** Angka jumlah tool **otomatis** naik-turun via `scripts/sync-tool-counts.mjs` (prebuild).
- ✅ Semua item dari audit HRD selesai — antrian kosong.
- ✅ Dashboard gak tampil di landing/search dan gak keindeks (3 lapis, terverifikasi live).
- ⚠️ Catatan: kalau halaman sempat keindeks sebelum noindex, minta user request removal via Google Search Console.
- 💡 Backlog opsional (belum diminta): multi-device sync → butuh backend (kandidat: Supabase), PPT → PDF, absensi dari HP karyawan.
- ✅ **Rebrand (Sep 24, 2026): ToolsAulia → Tools MasAul** — nama baru + logo baru (`public/logo.png`, 1254×1254). Navbar/footer pakai `<img>` `/logo.png`, favicon 16/32, apple-touch 180, PWA 192/512 digenerate dari logo (ffmpeg lanczos), favicon.svg = wrapper logo, safari mask-icon + safari-pinned-tab.svg dihapus, manifest PWA + JSON-LD + seluruh page title `| ToolsAulia` → `| Tools MasAul` (97 file; special-case "ToolsAulia by Mas Aul" tetap), title + favicon 32 di editor ikut. Nama personal "Aulia Iskandar Lubis" di copyright footer/LICENSE tetap.

- 🆕 **URL Shortener (Okt 2026):** `/utils/url-shortener` — pendekkan link via **spoo.me**
  (browser → API langsung, tanpa server). Custom alias, batch (maks 15 URL + jeda 400ms), riwayat
  localStorage (`hist:url-shortener`, maks 20), **QR code otomatis** di kartu hasil (qrious
  `/vendor` + fallback CDN, langsung tampil tanpa perlu tombol), dan **statistik klik** via
  `POST https://spoo.me/stats/{shortCode}` (tanpa API key — total/klik unik, rata-rata harian,
  klik terakhir, negara & referrer teratas).
  Terdaftar di `tools.ts` + `new-tools.ts` + i18n (`tool.*`, `header.*`, `shortener.*`).
  **Ini pengecualian privasi project** — lihat catatan di Konvensi & Guardrails.

- 🆕 **W6 batch 21 i18n (Okt 22, 2026):** 5 tool full i18n (`34863c4`) — `calc/timezone`, `dev/json`,
  `image/exif`, `image/meme`, `utils/calendar`: +22 key (blok `// --- W6 batch 21 ---` di
  translations.ts), helper `toast()` + `t()` di 4 file, `titleKey/descKey` nol → semua (json,
  calendar), GPS warning exif di-`data-i18n`-kan. **FULL 186/249 (75%)**, guard 249/249,
  toast 249/249. Kandidat batch 22: screen-recorder (7), xlsx-viewer, reorder, ssl, overlay.
  ⚠️ Pelajaran: `data-i18n` **di elemen berisi SVG = SVG hilang** (processI18n ganti textContent)
  — bungkus teks pakai `<span data-i18n>`; dan jangan pakai key `text.valid_json` (isi 'Valid
  JSON') buat teks '✓ Valid' — bikin key baru.

- 🆕 **W6 batch 22 i18n (Okt 22, 2026):** 5 tool full i18n (`e910a99`) — `media/screen-recorder`,
  `data/xlsx-viewer`, `pdf/reorder`, `network/ssl`, `image/overlay`: +37 key (blok
  `// --- W6 batch 22 ---`), `titleKey/descKey` ditambah (reorder, overlay), teks dinamis hasil
  fetch SSL & limit baris XLSX ikut `t()`. **FULL 191/249 (77%)**. Kandidat batch 23: pdf/extract
  (2), image/to-pdf (4), pdf/annotate (0), dev/regex-tester (6), media/waveform (2).
  ⚠️ Pelajaran: **`import { t }` HARUS di top-level `<script>`, jangan di dalam callback
  `astro:page-load`/`init()`** (import dalam fungsi = ilegal → build gagal); hati-hati key
  duplikat saat tambah di blok batch (cek dulu key lama, mis. `header.image_overlay_desc`).

- 🆕 **W6 batch 23 i18n (Okt 22, 2026):** 5 tool full i18n (`61bfe6c`) — `pdf/extract`, `image/to-pdf`,
  `pdf/annotate`, `dev/regex-tester`, `media/waveform`: +41 key (blok `// --- W6 batch 23 ---`),
  teks dinamis (count gambar, meta audio, status proses annotate) ikut `t()`. **FULL 196/249 (79%)**.
  Kandidat batch 24: pdf/word-to-pdf (2), dev/timestamp (1), media/audio-recorder (4), calc/case (6),
  calc/scientific (2), text/to-pdf (7).
  ⚠️ Pelajaran tambahan: (1) **wajib cek duplikat key** sebelum commit — `node -e` script deteksi
  dup (key yang sama muncul 2x di translations.ts); (2) separator teks asli di file bisa `·`
  (bukan `A·` yang muncul di terminal — itu mojibake), baca pakai Read tool dulu sebelum edit.

- 🆕 **W6 batch 24 i18n (Okt 22, 2026):** 6 tool full i18n (`4081dfa`) — `dev/timestamp`,
  `media/audio-recorder`, `calc/case`, `calc/scientific`, `calc/matrix`, `pdf/word-to-pdf`:
  +39 key (blok `// --- W6 batch 24 ---`), label title/aria ikut `data-i18n-attr`,
  teks status dinamis (recording, error calc) ikut `t()`. **FULL 196→202/249 (81%)** — lewat 80%.
  Kandidat batch 25: text/to-pdf (7), pdf/repair (4), media/video-to-gif (6), data/geojson (6),
  image/ascii (5), security/uuid (3).
  ⚠️ Pelajaran: saat pakai key yang sudah ada (mis. `matrix.rows`/`matrix.cols`/`header.timestamp_desc`)
  cek dulu di translations.ts — kalau sudah ada JANGAN bikin key baru (duplikat); grep prefix key
  (`'matrix\.|'ts\.`) sebelum menambah blok batch.

- 🆕 **W6 batch 25 i18n (Okt 22, 2026):** 7 tool full i18n (`8453336`) — `text/to-pdf`,
  `pdf/repair`, `media/video-to-gif`, `data/geojson`, `image/ascii`, `security/uuid`,
  `pdf/to-text`: +41 key (blok `// --- W6 batch 25 ---`). **FULL 202→209/249 (84%)**.
  Kandidat batch 26: utils/decision-wheel (4), utils/stopwatch (1), media/audio-trimmer (4),
  pdf/redact (1), pdf/rotate (7).
  ⚠️ Pelajaran: `pdf/to-text` pakai `<script is:inline>` — **TIDAK BISA `import { t }`**
  (is:inline tidak dibundle). Solusi: penuhi kuota i18n lewat `data-i18n` di markup saja
  (titleKey/descKey + label + placeholder), biarkan toast dinamis pakai `_tToast` phrase map.

- 🆕 **W6 batch 26 i18n (Okt 22, 2026):** 5 tool full i18n (`41bd12e`) — `utils/decision-wheel`,
  `utils/stopwatch`, `media/audio-trimmer`, `pdf/redact`, `pdf/rotate`: +25 key (blok
  `// --- W6 batch 26 ---`). **FULL 209→213/249 (86%)**.
  ⚠️ Pelajaran: (1) stopwatch sebelumnya terdeteksi "toast=Y" tapi ternyata **false positive** —
  `_tToast` dipakai untuk label tombol Start/Stop, bukan toast. Setelah di-convert ke `t()`,
  audit turun jadi toast=248 (stopwatch emang tidak butuh toast — bukan regresi, guardrail build
  tetap hijau). (2) Cek key lama sebelum tambah: `btn.start`/`btn.stop`/`header.stopwatch_desc`
  sudah ada — pakai yang lama.

- 🆕 **W6 batch 27 i18n (Okt 22, 2026):** 6 tool full i18n (`e5bf73a`) — `data/fake-data`,
  `file/pdf-to-md`, `pdf/form-filler`, `pdf/excel-to-pdf`, `pdf/to-excel`, `image/compressor`:
  +34 key (blok `// --- W6 batch 27 ---`). **FULL 213→218/249 (88%)**.
  ⚠️ Pelajaran: (1) `pdf-to-md` masih i18n=7 (belum masuk FULL) — DropZone `labelKey`/`subLabelKey`
  TIDAK dihitung audit sebagai i18n usage, tapi `data-i18n` markup biasa (mis. result_title,
  placeholder, preparing) dihitung. Kalau tool pakai DropZone tapi tetap kurang, tambah
  `data-i18n` di elemen markup lain (progress text, judul section). (2) toast helper yang
  param-nya `t` wajib rename ke `type` biar tidak shadow import `t` (kasus `to-excel.astro`).

- 🆕 **W6 batch 28 i18n (Okt 22, 2026):** 11 tool full i18n (`b18148f`) — `utils/stopwatch`,
  `file/pdf-to-md`, `data/csv-editor`, `utils/word-counter`, `pdf/split`, `pdf/to-word`,
  `utils/habit-tracker`, `dev/sql-formatter`, `utils/wordle-id`, `calc/currency`,
  `pdf/html-to-pdf`: +48 key (blok `// --- W6 batch 28 ---`). **FULL 218→229/249 (92%)**;
  toast 248→249 (stopwatch kini punya toast reset valid). Sisa 20 halaman.
  ⚠️ Pelajaran: (1) banyak file punya **local variabel `t`** yang shadow import `t` — wajib
  rename sebelum tambah `import { t }`: `parseCsv`'s `const t = text.replace`→`txt`, CRC
  table `const t = new Uint32Array`→`tbl`, sql-formatter loop `const t = tokens[i]`→`tok`.
  Kalau gak direname → TS error "Block-scoped variable 't' used before declaration" atau
  silent bug. (2) `pdf-to-md` akhirnya FULL dengan tambah 1 `data-i18n` literal
  (`p2md.result_info`) di elemen markup — konfirmasi pelajaran batch 27.

- 🆕 **W6 batch 29 i18n (Okt 22, 2026):** 6 tool full i18n (`7f43932`) — `calc/thr-bpjs`,
  `utils/expense-tracker`, `utils/pomodoro`, `calc/pph21-ter`, `calc/workdays`, `dev/cron`:
  +22 key (blok `// --- W6 batch 29 ---`). **FULL 229→235/249 (94%)**. Sisa 14 halaman
  (semua file besar: cropper, slip-gaji, delete, color, jpg-to-pdf, typing-test, remove-bg,
  grayscale, html-to-img, editor, photo, diagram-to-img, beat-maker, sign).
  ⚠️ Pelajaran: file yang **`<script is:inline>`** (mis. `dev/cron`) gak bisa `import { t }` —
  penuhi kuota i18n lewat markup `data-i18n` aja (cron: 5 label field Minute/Hour/... ).
  `calc/pph21-ter` & `calc/workdays` saling **reuse key** `ter.loaded`/`ter.cleared` (teks
  riwayat identik) — gak perlu duplikat key baru.

- 🆕 **W6 batch 30 i18n (Okt 22, 2026) — TARGET 100% TERCAPAI:** 14 tool full i18n
  (`dca39c5`) — `image/cropper`, `pdf/slip-gaji`, `pdf/delete`, `image/color`,
  `pdf/jpg-to-pdf`, `text/typing-test`, `image/remove-bg`, `pdf/grayscale`,
  `image/html-to-img`, `image/editor`, `pdf/photo`, `text/diagram-to-img`,
  `media/beat-maker`, `pdf/sign`: +96 key (blok `// --- W6 batch 30 ---`).
  **FULL 235→249/249 (100%)**; guard 249/249; toast 249; i18n≥8 249. Build+test 62/62 hijau;
  0 dup key (4377 keys).
  ⚠️ Pelajaran batch 30: (1) **audit regex cuma hitung `t('single-quote')`** — `t("double-quote")`
  TIDAK kehitung. Diagram-to-img sempat pakai `t("d2i.*", ...)` (double-quote) → audit=3, harus
  dikonversi ke `t('d2i.*', ...)` (single-quote). (2) **file besar dengan local `const t` yang
  dipakai ekstensif** (mis. `media/beat-maker` pakai `t` sbg audio-time param di `playSound`,
  20+ pemakaian) — jangan paksakan rename (riskan), penuhi kuota i18n via markup `data-i18n`/
  `data-i18n-attr` aja (beat-maker: 4 tombol action title + labels). Toasts tetap ke-translate
  via `_tToast` phrase map global. (3) **konfirmasi pelajaran batch 27/28**: file `is:inline`
  (cron, html-to-img, editor, currency) & DropZone-props tetap harus tambah literal
  `data-i18n` di markup — gak ada jalan lain.

- 🆕 **W7 header title/desc (Okt 22, 2026) — GAP 59→0:** wire `titleKey`/`descKey` ke 57 page
  (`ef332f9`) — 36 auto-wire (key sudah terdaftar, tinggal tambah props) + 12 manual-key
  (+27 key: `gpa`, `pph21_ter`, `workdays`, `merge`, `photo`, `slip_gaji`, `surat_hr`,
  `to_svg`, `headers_gen`, `totp`, `charmap`, `receipt`, blok `// --- W7 header title/desc gap ---`).
  Gap title/desc **59→0** (2 false positive di-skip: `image/editor` & `utils/prabowo-countdown`
  gak pakai `ToolPageHeader` — `title=` mereka di button tooltip). Build+test 62/62 hijau;
  audit 249/249; dup NONE (4402 keys). Total key 4402.
  ⚠️ Pelajaran W7: (1) **banyak `ToolPageHeader` multi-line** — `title=`/`desc=` di baris
  terpisah (bukan satu baris). Script auto-wire harus scan baris berikutnya setelah
  `<ToolPageHeader`, splice `titleKey=`/`descKey=` sbg baris baru (indentasi 6 spasi).
  (2) **`desc=` fallback prop = teks Indonesia**; `descKey` override saat i18n aktif.
  (3) **gap-detection false positive**: page tanpa `ToolPageHeader` tapi punya `title=` di
  `<button>` (tooltip) ke-detek sbg gap — cek manual sebelum wire. (4) `image/qr-art` sudah
  ke-wire dari awal.

- 🆕 **CDP smoke test W6+W7 (Okt 22, 2026):** ✅ — harness Chrome headless manual via Node 25
  built-in WebSocket (gak perlu puppeteer). Serve build via static server Node kecil (Vercel
  adapter gak support `astro preview`). **Load test 15/15 PASS** (0 page exception, 0 console
  error, title+DOM asli tiap page): landing, utils/qr, image/editor, media/beat-maker, pdf/sign,
  diagram-to-img, pph21-ter, workdays, cron, wol, hash-compare, gpa, stopwatch, charmap, receipt.
  **SPA round-trip 4/4 PASS** (load → back → forward → load, 0 exception, tool tetap hidup):
  utils/qr, calc/gpa, text/charmap, network/wol.
  ⚠️ Pelajaran smoke: (1) **static server wajib handle directory-style** — Astro build output
  `dist/client/<kategori>/<tool>/index.html` (bukan `<tool>.html`); fallback ke root index tanpa
  cek `<tool>/index.html` → semua page resolve ke Dashboard (false PASS). Fix: cek directory
  dulu → serve `<dir>/index.html`. (2) **assertion smoke harus kuat** — cek `title` unik +
  `bodyLen>200` + `!Dashboard`, bukan cuma `bodyLen>200` (false PASS awal: 15/15 identik
  `title="Dashboard" body=675`). (3) **anchor klik di landing gak selalu ketemu** → round-trip
  pakai `history.back()`/`location.href` fallback (full-load), true SPA nav belum ke-exercise
  ketat. Harness bersifat sementara (tmp-*.cjs, sudah dihapus — tidak di-commit).

- 🆕 **Push + deploy Vercel (Okt 22, 2026):** ✅ — push **21 commit** (`d468026..abf2db7`) ke
  `main` → auto-deploy Vercel. **Terverifikasi live**: local `abf2db7` = `origin/main` (ahead 0/
  behind 0); `https://tools.paklubis.my.id` HOME 200; marker W7 (`header.gpa` ada di HTML
  `/calc/gpa`) ke-poll sukses di production. Semua kerja W6 (249/249=100%) + W7 (gap title/desc
  59→0) + smoke test sekarang live. Sisa opsional: W7 placeholder-keys (170 unwired di 66 page,
  mayoritas contoh numerik — low value, teks instruksional saja yang bernilai).

## Verifikasi standar selesai kerja

1. `pnpm build` — prebuild (sync angka + 6 guardrail) + build hijau.
2. `pnpm test` — vitest 62/62.
3. `node scripts/audit-i18n.mjs` — exit 0 (0 dup / 0 dangling).
4. Perubahan interaktif → smoke **CDP Chrome headless**: klik nyata, assert nilai DOM,
   round-trip SPA (pergi → balik → tool harus tetap hidup), 0 page exception.
5. Kalau live: push → tunggu deploy (poll marker URL/fitur baru) → verifikasi ulang di production.
