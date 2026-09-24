# CONTEXT — MasAul Tools

Situs kumpulan tools 100% client-side (Astro + Tailwind). Data pengguna diproses di browser,
tidak pernah dikirim ke server. Live production: **https://tools.paklubis.my.id** (Vercel).

---

## Konvensi & Guardrails (WAJIB ikut)

- **Tool = 1 file `.astro`** di `src/pages/<kategori>/` (`pdf/`, `calc/`, `utils/`, `file/`, dst).
- **Registrasi tool baru** — 3 file, semua wajib:
  1. `src/data/tools.ts` — daftar tool utama
  2. `src/data/new-tools.ts` — daftar tool baru
  3. `src/i18n/translations.ts` — key i18n
- OG image otomatis ke-generate (`/og/<kategori>-<nama>.png`) — kalau muncul, registrasi valid.
- **Prebuild guardrails** (`scripts/check-*.mjs`): client-side guarantee, no inline scripts, critical CSS.
  Jalan tiap `pnpm build` — build hijau = semua lolos.
- **Script besar**: tulis sebagai `<script>` eksternal Astro, bukan inline.
- **Lib pihak ketiga**: pola multi-CDN fallback via `src/composables/useCdnLib.ts`
  (SheetJS, html2pdf, dll). `mammoth` (docx→HTML) di-bundle lokal.
- **Jangan pakai class Tailwind dinamis** (`bg-${color}-500`) — gak ke-generate. Pakai mapping statis.

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
- **Import Excel/CSV**: SheetJS CDN, header dikenali fleksibel (ID/EN), tanggal flexibel termasuk serial date Excel, konfirmasi sebelum insert.

### Alur kerja HR yang sudah nyambung

Input karyawan (+import massal) → absensi/cuti → hitung (PPh 21 / THR / hari efektif) → slip gaji / surat (2 klik) → backup mingguan.

---

## Deploy

- Vercel CLI via `npx` (gak global), login `kandarlubis31`, domain custom **tools.paklubis.my.id**.
- Deploy: `pnpm build` dulu → `npx vercel --prod --yes` → verify endpoint dengan curl.

## Status saat ini (September 2026)

- ✅ Semua item dari audit HRD selesai — antrian kosong.
- ✅ Dashboard gak tampil di landing/search dan gak keindeks (3 lapis, terverifikasi live).
- ⚠️ Catatan: kalau halaman sempat keindeks sebelum noindex, minta user request removal via Google Search Console.
- 💡 Backlog opsional (belum diminta): multi-device sync → butuh backend (kandidat: Supabase), PPT → PDF, absensi dari HP karyawan.
- ✅ **Rebrand (Sep 24, 2026): ToolsAulia → MasAul Tools** — nama baru + logo baru (`public/logo.png`, 1254×1254). Navbar/footer pakai `<img>` `/logo.png`, favicon 16/32, apple-touch 180, PWA 192/512 digenerate dari logo (ffmpeg lanczos), favicon.svg = wrapper logo, safari mask-icon + safari-pinned-tab.svg dihapus, manifest PWA + JSON-LD + seluruh page title `| ToolsAulia` → `| MasAul Tools` (97 file; special-case "ToolsAulia by Mas Aul" tetap), title + favicon 32 di editor ikut. Nama personal "Aulia Iskandar Lubis" di copyright footer/LICENSE tetap.

## Verifikasi standar selesai kerja

`pnpm build` (guardrail + build hijau) → kalau perlu live: deploy Vercel → curl verify.
