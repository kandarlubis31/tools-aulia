# CONTEXT — MasAul Tools

Situs kumpulan tools 100% client-side (Astro + Tailwind). Data pengguna diproses di browser,
tidak pernah dikirim ke server. Live production: **https://tools.paklubis.my.id** (Vercel).

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
- **i18n audit**: `node scripts/audit-i18n.mjs` — exit 0 = 0 dup / 0 dangling key (gap sisa: 73
  halaman belum full i18n).
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
- **Prop `hideChrome` di BaseLayout** (Oktober 2026): halaman app mandiri (HRD Dashboard) pakai `<BaseLayout … noIndex hideChrome>` — menambahkan class `app-mode` di `<body>`; CSS di `global.css` menyembunyikan navbar/footer situs, widget Lapor Bug, modal PWA, dan breadcrumb **tanpa menghapus DOM** (semua binding script null-guarded). Tab title jadi polos tanpa suffix "MasAul Tools". Dashboard punya header + footer personal sendiri di dalam `<slot>`. **Jangan pernah pakai `<BaseLayout … />` self-closing** — bug Oktober 2026: konten jatuh keluar slot, render di bawah footer situs.
- **Import Excel/CSV**: SheetJS CDN, header dikenali fleksibel (ID/EN), tanggal flexibel termasuk serial date Excel, konfirmasi sebelum insert.

### Alur kerja HR yang sudah nyambung

Input karyawan (+import massal) → absensi/cuti → hitung (PPh 21 / THR / hari efektif) → slip gaji / surat (2 klik) → backup mingguan.

---

## Deploy

- Vercel CLI via `npx` (gak global), login `kandarlubis31`, domain custom **tools.paklubis.my.id**.
- Deploy: `pnpm build` dulu → `npx vercel --prod --yes` → verify endpoint dengan curl.

## Status saat ini (Oktober 2026)

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
- ✅ **Rebrand (Sep 24, 2026): ToolsAulia → MasAul Tools** — nama baru + logo baru (`public/logo.png`, 1254×1254). Navbar/footer pakai `<img>` `/logo.png`, favicon 16/32, apple-touch 180, PWA 192/512 digenerate dari logo (ffmpeg lanczos), favicon.svg = wrapper logo, safari mask-icon + safari-pinned-tab.svg dihapus, manifest PWA + JSON-LD + seluruh page title `| ToolsAulia` → `| MasAul Tools` (97 file; special-case "ToolsAulia by Mas Aul" tetap), title + favicon 32 di editor ikut. Nama personal "Aulia Iskandar Lubis" di copyright footer/LICENSE tetap.

- 🆕 **URL Shortener (Okt 2026):** `/utils/url-shortener` — pendekkan link via **spoo.me**
  (browser → API langsung, tanpa server). Custom alias, batch (maks 15 URL + jeda 400ms), riwayat
  localStorage (`hist:url-shortener`, maks 20), **QR code otomatis** di kartu hasil (qrious
  `/vendor` + fallback CDN, langsung tampil tanpa perlu tombol), dan **statistik klik** via
  `POST https://spoo.me/stats/{shortCode}` (tanpa API key — total/klik unik, rata-rata harian,
  klik terakhir, negara & referrer teratas).
  Terdaftar di `tools.ts` + `new-tools.ts` + i18n (`tool.*`, `header.*`, `shortener.*`).
  **Ini pengecualian privasi project** — lihat catatan di Konvensi & Guardrails.

## Verifikasi standar selesai kerja

1. `pnpm build` — prebuild (sync angka + 6 guardrail) + build hijau.
2. `pnpm test` — vitest 62/62.
3. `node scripts/audit-i18n.mjs` — exit 0 (0 dup / 0 dangling).
4. Perubahan interaktif → smoke **CDP Chrome headless**: klik nyata, assert nilai DOM,
   round-trip SPA (pergi → balik → tool harus tetap hidup), 0 page exception.
5. Kalau live: push → tunggu deploy (poll marker URL/fitur baru) → verifikasi ulang di production.
