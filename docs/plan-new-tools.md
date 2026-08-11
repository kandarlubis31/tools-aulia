# Plan: 100 Tools Baru — ToolsAulia v2 Expansion

> Created: August 11, 2026
> Target: **58 tools existing (saat plan dibuat) → 158 total** (10 kategori × 10 tools baru).
> Status: 🎉 **B1-B10 SELESAI — 58 → 158 tools (100 tools baru!)**

## ✅ Batch 1 Execution Log (Aug 11, 2026)

**Hasil: 10 tool baru live · build ✅ · tests 43/43 · guardrail G1 ✅**

| ID | Tool | Halaman | Catatan |
|----|------|---------|---------|
| PDF-02 | PDF Password | `/pdf/password` | pdf-lib `setEncryption()` tambah/hapus; mode add/remove; validasi password; download ulang |
| IMG-04 | Image Watermark | `/image/watermark` | Canvas; teks/logo; 9 posisi; opacity & ukuran slider; preview real-time; download full-res |
| DEV-02 | JWT Decoder | `/dev/jwt` | atob decode lokal; summary iss/sub/exp/iat dengan waktu relatif; expired highlight; copy per bagian |
| DEV-04 | JSON to TS | `/dev/json-to-ts` | Generator interface rekursif; nested object + array; nama unik via counter (fix duplikat); optional flag; export .ts |
| MATH-04 | Loan / EMI Calc | `/calc/emi` | Formula EMI; total bunga/pembayaran; tabel amortisasi 360+ bulan scrollable; format IDR |
| TXT-03 | Typing Test | `/text/typing-test` | Timer 15/30/60s; highlight kata; WPM/CPM/akurasi/error live; early finish; teks ID/EN; rating hasil |
| TXT-04 | Text to Speech | `/text/text-to-speech` | Web Speech API; voice select (ID diurutkan pertama); rate & pitch; play/pause/stop; fallback browser |
| SEC-01 | Bcrypt Hash | `/security/bcrypt` | bcryptjs CDN (dcodeIO.bcrypt + fallback); cost 4-14; hash + verify; hasil copy |
| SEC-04 | File Encrypt | `/security/file-encrypt` | WebCrypto AES-256-GCM + PBKDF2 100k; format TAUL1 (name+salt+iv+ct); decrypt restore nama asli |
| DATA-08 | Fake Data Gen | `/data/fake-data` | Dataset Indonesia built-in (tanpa CDN, offline-ready); 10 field checkbox; export JSON/CSV (BOM) |

### Infrastruktur baru
- **Kategori `text` & `data` ditambahkan** — tools.ts categoryNames, index pills, BaseLayout (catMeta, dropdown, mobile menu, footer, catNames JS), i18n keys (nav/index/footer)
- Copy "58+" basi → dinamis `{tools.length}+` di index + BaseLayout; README/offline → 69+
- pdf/index.astro: card PDF Password ditambahkan (kategori security)
- new-tools.ts: 10 hrefs baru (urut terbaru)
- i18n: 84 key baru (tool titles, headers, labels per tool) — EN toggle jalan penuh

### Review & fix
- json-to-ts: nama interface duplikat (sibling nested) → counter global; array double-emission dihapus; exactFlag dead code dibuang
- jwt: output lama dibersihkan saat token invalid
- file-encrypt: hover accent deksripsi → emerald (sebelumnya violet)
- bcrypt: tombol kembali pakai t() agar i18n tidak hilang

## Konteks & Guardrail

- **Guardrail G1 (WAJIB):** semua tool baru 100% client-side — proses di browser, tidak ada server. Patuhi `scripts/check-client-side.mjs`.
- **Lib CDN:** pakai pola `waitForCdnLib` (cdnjs / jsdelivr / unpkg) — konsisten dengan tool existing.
- **Deps sudah ada yang bisa dipakai:** `js-tiktoken` (token counter), `mammoth` (parsing DOCX), `pdf-lib` (manipulasi PDF), `@imgly/background-removal` (AI remove-bg).
- **API publik whitelisted (CSP `connect-src`):** open.er-api.com (kurs), v2.jokeapi.dev, dummyjson.com, uselessfacts.jsph.pl, api.freedictionaryapi.dev, api.mymemory.translated.net (translate), ipapi.co / ip-api.com / api.ipify.org / 1.1.1.1 (DoH), httpbin.org, www.google.com.
- ⚠️ **Tool baru yang butuh API di luar daftar CSP harus update `vercel.json` dulu** — ditandai (🔧CSP) per tool.
- **Level:** 🟢 Mudah (<1 hari) · 🟡 Sedang (1-2 hari) · 🔴 Sulit (3+ hari)
- **Prioritas:** P1 (high value / sering dipakai) · P2 (menengah) · P3 (nice-to-have)

---

## 1. PDF (10 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| PDF-01 | **PDF to Word (DOCX)** | Konversi PDF ke dokumen Word yang bisa diedit | pdf.js extract + docx builder (CDN) | 🔴 | P1 |
| PDF-02 | **PDF Password** | Tambah/hapus proteksi password PDF | pdf-lib (sudah ada) | 🟢 | P1 |
| PDF-03 | **PDF Redact** | Sensor teks permanen (hitamkan) sebelum share | pdf-lib + canvas | 🟡 | P2 |
| PDF-04 | **PDF Compare** | Bandingkan 2 PDF side-by-side (halaman ke halaman) | pdf.js render 2 canvas | 🟡 | P2 |
| PDF-05 | **PDF Form Filler** | Isi form field PDF interaktif | pdf-lib form API | 🟡 | P2 |
| PDF-06 | **PDF Booklet** | Susun ulang halaman untuk cetak booklet A5 | pdf-lib reorder | 🟢 | P3 |
| PDF-07 | **PDF Thumbnails** | Generate grid thumbnail semua halaman | pdf.js render kecil | 🟢 | P2 |
| PDF-08 | **PDF to Excel** | Ekstrak tabel dari PDF ke format XLSX | pdf.js + SheetJS (CDN) | 🔴 | P2 |
| PDF-09 | **PDF Optimizer** | Optimasi ukuran untuk web (deflate, strip metadata) | pdf-lib | 🟡 | P3 |
| PDF-10 | **PDF Repair** | Perbaiki PDF rusak / recover halaman | pdf.js tolerant parse | 🔴 | P3 |

## 2. Image (10 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| IMG-01 | **Image Cropper** | Crop presisi + preset rasio (1:1, 16:9, IG) | canvas + drag handles | 🟡 | P1 |
| IMG-02 | **Batch Resizer** | Resize banyak gambar sekaligus (folder → zip) | canvas + JSZip | 🟡 | P1 |
| IMG-03 | **Image to ASCII** | Ubah foto jadi seni ASCII | canvas → brightness map | 🟢 | P2 |
| IMG-04 | **Image Watermark** | Watermark teks/logo + opacity & posisi | canvas draw | 🟢 | P1 |
| IMG-05 | **Image Collage** | Gabung beberapa foto jadi grid kolase | canvas composite | 🟡 | P2 |
| IMG-06 | **Meme Generator** | Top/bottom text di gambar template | canvas | 🟢 | P2 |
| IMG-07 | **EXIF Viewer/Remover** | Lihat & hapus metadata EXIF (privasi!) | exif-js (CDN) + canvas strip | 🟡 | P1 |
| IMG-08 | **Palette Extractor** | Ekstrak palet warna dominan dari gambar | canvas + k-means | 🟡 | P2 |
| IMG-09 | **GIF Maker** | Buat GIF animasi dari beberapa frame | gif.js (CDN) | 🟡 | P2 |
| IMG-10 | **Favicon Generator** | Teks/emoji → favicon + semua ukuran PNG | canvas + sharp pipeline | 🟢 | P2 |

## 3. Dev Tools (10 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| DEV-01 | **Regex Tester** | Test regex live + explainer + flags | RegExp native + parser | 🟡 | P1 |
| DEV-02 | **JWT Decoder** | Decode payload/header JWT tanpa kirim data | atob + JSON | 🟢 | P1 |
| DEV-03 | **HTML Minifier/Formatter** | Format & minify HTML | htmlparser2 / beautify (CDN) | 🟡 | P2 |
| DEV-04 | **JSON ↔ TS Types** | Generate interface TypeScript dari JSON | recursive type builder | 🟢 | P1 |
| DEV-05 | **JSON ↔ YAML** | Konversi dua arah | js-yaml (CDN) | 🟢 | P2 |
| DEV-06 | **SQL Formatter** | Rapikan SQL query | sql-formatter (CDN) | 🟢 | P2 |
| DEV-07 | **Chmod Calculator** | Hitung angka chmod (rwx → 755) + penjelasan | tabel lookup | 🟢 | P3 |
| DEV-08 | **Subnet Calculator** | CIDR → network/host/broadcast + range | bitwise | 🟡 | P2 |
| DEV-09 | **Gradient Generator** | Builder CSS gradient live preview + copy | CSS native | 🟢 | P2 |
| DEV-10 | **Flexbox Playground** | Visual config flexbox + export CSS | inline style + codegen | 🟡 | P3 |

## 4. Math & Calculator (10 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| MATH-01 | **Scientific Calculator** | Fungsi ilmiah + riwayat perhitungan | math.js (CDN) | 🟡 | P1 |
| MATH-02 | **Fraction Calculator** | Operasi pecahan (penyederhanaan) | gcd/lcm | 🟢 | P2 |
| MATH-03 | **Matrix Calculator** | Tambah/kali/invers matriks | linear algebra JS | 🟡 | P2 |
| MATH-04 | **Loan/EMI Calculator** | Angsuran pinjaman + tabel amortisasi | formula bunga | 🟢 | P1 |
| MATH-05 | **Compound Interest** | Simulasi tabungan/investasi + grafik | formula + chart (CDN) | 🟢 | P1 |
| MATH-06 | **Date Diff Calculator** | Selisih 2 tanggal (hari/bulan/tahun, hari kerja) | Date API | 🟢 | P2 |
| MATH-07 | **Work Hours Calculator** | Hitung jam kerja + lembur | Date API | 🟢 | P2 |
| MATH-08 | **BMR & Calorie** | Kalkulasi kebutuhan kalori harian | formula Mifflin-St Jeor | 🟢 | P2 |
| MATH-09 | **Random Generator** | Random number/array/huruf dengan range & seed | Math.random + PRNG | 🟢 | P3 |
| MATH-10 | **Number to Words** | Angka → terbilang (ID/EN) | konversi numeral | 🟡 | P3 |

## 5. Text & Writing (10 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| TXT-01 | **Text Summarizer** | Ringkas teks panjang (extractive, kalimat utama) | scoring frekuensi kata | 🟡 | P1 |
| TXT-02 | **Readability Score** | Skor keterbacaan Flesch / FKGL | formula | 🟢 | P2 |
| TXT-03 | **Typing Speed Test** | Latihan ketik WPM/CPM + akurasi | timer + text sampel | 🟢 | P1 |
| TXT-04 | **Text to Speech** | Baca teks dengan suara (pilih suara) | Web Speech API | 🟢 | P1 |
| TXT-05 | **Speech to Text** | Transkripsi suara → teks | Web Speech API | 🟡 | P2 |
| TXT-06 | **Language Detector** | Deteksi bahasa teks | n-gram + kamus kecil | 🟡 | P3 |
| TXT-07 | **Anagram Solver** | Cari anagram dari kata | permutasi + kamus | 🟡 | P3 |
| TXT-08 | **Fancy Text Generator** | Bold/italic/zalgo/unicode style | unicode mapping | 🟢 | P3 |
| TXT-09 | **Emoji Translator** | Kata kunci → emoji & sebaliknya | kamus emoji | 🟢 | P3 |
| TXT-10 | **Random Text Generator** | Generator kalimat acak/paragraf untuk mockup | template + kata | 🟢 | P3 |

## 6. Security (10 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| SEC-01 | **Bcrypt Hash/Verify** | Hash & verifikasi bcrypt | bcryptjs (CDN) | 🟢 | P1 |
| SEC-02 | **HMAC Generator** | HMAC-SHA256/512 dengan secret | WebCrypto | 🟢 | P2 |
| SEC-03 | **Text Cipher** | Caesar/Vigenère/XOR sandi sederhana | algoritma klasik | 🟢 | P2 |
| SEC-04 | **File Encrypt** | Enkripsi file AES-GCM + download | WebCrypto | 🟡 | P1 |
| SEC-05 | **Steganography** | Sembunyikan pesan dalam gambar | canvas LSB | 🔴 | P3 |
| SEC-06 | **TOTP Authenticator** | Generate 6-digit OTP berbasis waktu | HMAC + time | 🟡 | P2 |
| SEC-07 | **Password Strength Meter** | Analisis kekuatan password + saran | entropy + rules | 🟢 | P2 |
| SEC-08 | **Token Generator** | Random token hex/base64 berbagai panjang | crypto.getRandomValues | 🟢 | P2 |
| SEC-09 | **Luhn Validator** | Validasi & generate nomor kartu (Luhn) | algoritma Luhn | 🟢 | P3 |
| SEC-10 | **DNS Lookup** | Resolve domain via DNS-over-HTTPS | 🔧CSP (1.1.1.1 sudah ada) | 🟢 | P2 |

## 7. Data & Format (10 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| DATA-01 | **CSV Editor/Viewer** | Lihat & edit CSV dalam tabel | Papa Parse (CDN) | 🟡 | P1 |
| DATA-02 | **XLSX Viewer** | Preview file Excel tanpa upload | SheetJS (CDN) | 🟡 | P2 |
| DATA-03 | **YAML → JSON** | Konversi YAML ke JSON (dan balik) | js-yaml (CDN) | 🟢 | P2 |
| DATA-04 | **XML Formatter** | Rapikan & validasi XML | DOMParser | 🟢 | P3 |
| DATA-05 | **GeoJSON Viewer** | Preview GeoJSON di mini map | Leaflet (CDN) | 🟡 | P3 |
| DATA-06 | **iCal Generator** | Buat file .ics undangan acara | text builder RFC5545 | 🟢 | P2 |
| DATA-07 | **vCard Generator** | Buat file .vcf kontak | text builder | 🟢 | P3 |
| DATA-08 | **Fake Data Generator** | Generate nama/email/alamat/HP dummy | library faker (CDN) | 🟢 | P1 |
| DATA-09 | **Barcode Generator** | CODE128/EAN/UPC barcode | JsBarcode (CDN) | 🟢 | P2 |
| DATA-10 | **Barcode Reader** | Scan barcode/QR dari foto | ZXing wasm (CDN) | 🔴 | P3 |

## 8. Network (10 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| NET-01 | **HTTP Request Builder** | Test GET/POST dengan header & body | fetch | 🟡 | P1 |
| NET-02 | **REST Client Lite** | Simpan request, lihat response terformat | fetch + JSON viewer | 🟡 | P1 |
| NET-03 | **Speed Test** | Ukur kecepatan unduh/unggah via CDN asset | fetch timing | 🟢 | P2 |
| NET-04 | **Latency Tester** | Ping beberapa host & tampilkan ms | fetch timing | 🟢 | P2 |
| NET-05 | **WebSocket Tester** | Konek & kirim pesan WebSocket | WebSocket API | 🟡 | P3 |
| NET-06 | **HTTP Headers Viewer** | Tampilkan response headers sebuah URL | 🔧CSP (httpbin sudah ada) | 🟢 | P2 |
| NET-07 | **User-Agent Parser** | Parse UA string → browser/OS/device | ua-parser-js (CDN) | 🟢 | P3 |
| NET-08 | **Port Reference** | Daftar port umum + kegunaan | kamus statis | 🟢 | P3 |
| NET-09 | **WHOIS Lookup** | Info domain via API publik | 🔧CSP (API baru) | 🟢 | P2 |
| NET-10 | **SSL Checker** | Cek masa berlaku sertifikat domain | 🔧CSP (API baru) | 🟢 | P3 |

## 9. Audio & Media (10 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| MED-01 | **Audio Recorder** | Rekam suara → download WAV/OGG | MediaRecorder | 🟢 | P1 |
| MED-02 | **Waveform Visualizer** | Visualisasi gelombang audio saat putar/rekam | WebAudio Analyser | 🟡 | P2 |
| MED-03 | **Tone Generator** | Bangkitkan nada/frekuensi untuk tuning | WebAudio Oscillator | 🟢 | P3 |
| MED-04 | **Metronome** | Ketukan tempo + suara click | WebAudio + timer | 🟢 | P2 |
| MED-05 | **Audio Trimmer** | Potong audio (trim start/end) + download | WebAudio decode/encode | 🟡 | P2 |
| MED-06 | **Video to GIF** | Ubah potongan video jadi GIF | canvas capture + gif.js | 🔴 | P2 |
| MED-07 | **Beat Maker** | Drum machine sederhana (kit + sequencer) | WebAudio scheduling | 🟡 | P3 |
| MED-08 | **White Noise Generator** | Pembangkit noise (putih/coklat) untuk fokus | WebAudio buffer | 🟢 | P3 |
| MED-09 | **Screen Recorder** | Rekam layar + mikrofon → WebM | getDisplayMedia | 🟡 | P2 |
| MED-10 | **Music Scale Reference** | Nada tangga nada + frekuensi + play | WebAudio | 🟢 | P3 |

## 10. Life & Fun (10 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| LIFE-01 | **Habit Tracker** | Catat kebiasaan harian + streak | localStorage | 🟡 | P1 |
| LIFE-02 | **Expense Tracker** | Catat pengeluaran + total bulanan | localStorage + chart | 🟡 | P1 |
| LIFE-03 | **Timezone Converter** | Konversi waktu antar kota | Intl API | 🟢 | P2 |
| LIFE-04 | **Decision Wheel** | Putar roda pilihan acak | canvas + animasi | 🟢 | P2 |
| LIFE-05 | **Mood Tracker** | Jurnal mood + grafik mingguan | localStorage + emoji | 🟢 | P2 |
| LIFE-06 | **Notes (Markdown)** | Catatan markdown tersimpan lokal | localStorage + preview | 🟡 | P1 |
| LIFE-07 | **Certificate Generator** | Buat sertifikat nama peserta/event | canvas + template | 🟡 | P2 |
| LIFE-08 | **Wordle ID** | Tebak kata 5 huruf (bahasa Indonesia) | kamus kata + game state | 🟡 | P1 |
| LIFE-09 | **Snake Game** | Game snake klasik + high score | canvas + loop | 🟡 | P3 |
| LIFE-10 | **Magic 8-Ball** | Jawaban acak konsultasi | array jawaban | 🟢 | P3 |

---

## Roadmap Eksekusi (batch)

| Batch | Isi | Estimasi |
|-------|-----|----------|
| **B1 — Quick Wins P1 (10 tools)** | PDF-02 · IMG-04 · DEV-02 · DEV-04 · MATH-04 · TXT-03 · TXT-04 · SEC-01 · SEC-04 · DATA-08 | ~3 hari |
| **B2 — Image & Media (10)** | IMG-01 · IMG-02 · IMG-07 · MED-01 · MED-02 · MED-05 · PDF-01 · PDF-05 · MATH-05 · LIFE-06 | ~4 hari |
| **B3 — Dev & Data (10)** | DEV-01 · DEV-05 · DEV-06 · DEV-08 · DATA-01 · DATA-02 · DATA-03 · DATA-06 · NET-01 · NET-02 | ~4 hari |
| **B4 — Security & Life (10)** | SEC-03 · SEC-06 · SEC-07 · SEC-08 · SEC-10 · LIFE-01 · LIFE-02 · LIFE-03 · LIFE-04 · LIFE-08 | ~3 hari |
| **B5 — Sisa (60)** | Menengah & nice-to-have per kategori | bertahap |

**Catatan proses:**
1. Setiap batch: tulis tools.ts entry (icon + color + seo) + buat halaman + migrasi header (ToolPageHeader) + drop zone (DropZone) — pola sudah ada.
2. Jalankan `scripts/check-client-side.mjs` (prebuild) + build + vitest tiap batch.
3. Tool ber-API baru: update `vercel.json` CSP `connect-src` dulu (tandai 🔧CSP).
4. Simpan fitur yang jalan: audit plan per kategori seperti sebelumnya, update `docs/plan-new-tools.md` jadi execution log.

---

## ✅ Execution Log

### Batch 1 — Quick Wins P1 (SELESAI · 10 tools · 58 → 69 tools)

**Build ✅ · tests ✅ 43/43 · guardrail client-side ✅ · precache 145 entries**

| Tool | Halaman | Highlight |
|------|---------|-----------|
| PDF Password | `/pdf/password` | pdf-lib `setEncryption()` tambah/hapus password |
| Image Watermark | `/image/watermark` | teks/logo, 9 posisi, opacity & ukuran slider |
| JWT Decoder | `/dev/jwt` | decode lokal, summary iss/sub/exp (waktu relatif) |
| JSON to TS | `/dev/json-to-ts` | interface rekursif, nested + array, optional flag |
| Loan / EMI Calc | `/calc/emi` | angsuran + total bunga + tabel amortisasi IDR |
| Typing Test | `/text/typing-test` | timer 15/30/60s, WPM/CPM/akurasi, rating |
| Text to Speech | `/text/text-to-speech` | Web Speech API, pilih suara, rate & pitch |
| Bcrypt Hash | `/security/bcrypt` | bcryptjs CDN, cost 4-14, hash + verify |
| File Encrypt | `/security/file-encrypt` | AES-256-GCM + PBKDF2, format `.taenc` |
| Fake Data Gen | `/data/fake-data` | dataset Indonesia built-in, export JSON/CSV |

Infra: kategori baru `text` & `data` (tools.ts, pills, dropdown, mobile, footer, breadcrumb, search, i18n) · 84 key i18n · copy "58+" basi → dinamis `{tools.length}+`.

### Batch 3 — Dev & Data & Network (SELESAI · 10 tools · 79 → 89 entries)

**Build ✅ 39.9s · tests ✅ 43/43 · guardrail client-side ✅ · sitemap + precache auto-update**

| Tool | Halaman | Highlight |
|------|---------|-----------|
| Regex Tester | `/dev/regex-tester` | live match highlight, flags g/i/m/s/u, capture groups, waktu uji |
| JSON ⇄ YAML | `/dev/json-to-yaml` | js-yaml CDN, auto-detect arah, upload file |
| SQL Formatter | `/dev/sql-formatter` | custom tokenizer inline (tanpa dep), uppercase + highlight |
| Subnet Calculator | `/dev/subnet` | netmask/network/broadcast/host range + biner + kelas IP |
| CSV Editor | `/data/csv-editor` | spreadsheet-like: edit sel, baris/kolom, search, export RFC 4180 |
| XLSX Viewer | `/data/xlsx-viewer` | SheetJS CDN, sheet tabs, preview + export CSV |
| YAML ⇄ JSON | `/data/yaml-json` | file upload, multi-doc (loadAll), download |
| iCal Generator | `/data/ical` | .ics + reminder, all-day (DTEND exclusive), UTC |
| HTTP Builder | `/network/http-builder` | GET/POST/PUT/PATCH/DELETE, headers/body, response viewer |
| REST Client | `/network/rest-client` | saved requests localStorage + env vars `{{name}}` |

Infra: kategori baru `network` (nav/footer/i18n/breadcrumb) · vercel.json connect-src dibuka ke `https:` (trade-off untuk HTTP tools, dicatat di CONTEXT) · 75+ key i18n baru.

Review fixes: **build crash** `{{nama}}` di template Astro (harus `{'{{nama}}'}`) · csv-editor row-select salah elemen (closest('tr'), sebelumnya delete selalu hapus header) · i18n value tidak boleh HTML (textContent) · rest-client `new URL` unguarded · fetch timeout 30s · ical DTEND all-day exclusive · sql-formatter dead code. Copy "78+" → "88+".

### Batch 2 — Image & Media (SELESAI · 10 tools · 69 → 79 tools)

**Build ✅ 63.7s · tests ✅ 43/43 · guardrail client-side ✅**

| Tool | Halaman | Highlight |
|------|---------|-----------|
| Image Cropper | `/image/cropper` | drag + 8 handle, preset rasio (1:1/16:9/4:5), rotate 90° |
| Batch Resizer | `/image/batch-resizer` | resize banyak gambar → ZIP, lebar/tinggi/persen + kualitas |
| EXIF Viewer | `/image/exif` | exif-js CDN, GPS warning, strip metadata via canvas re-encode |
| Audio Recorder | `/media/audio-recorder` | MediaRecorder + level meter + timer, export WAV/WebM |
| Waveform Visualizer | `/media/waveform` | decode WebAudio, waveform 240 bar, seek + speed + volume |
| Audio Trimmer | `/media/audio-trimmer` | drag marker start/end, preview, export WAV |
| PDF to Word | `/pdf/to-word` | pdf.js ekstraksi teks + DOCX builder (store-only ZIP inline, tanpa dep) |
| PDF Form Filler | `/pdf/form-filler` | pdf-lib form API: text/checkbox/radio/dropdown + flatten |
| Compound Interest | `/calc/compound-interest` | simulasi per bulan, tabel tahunan, grafik canvas |
| Notes (Markdown) | `/utils/notes-md` | marked + DOMPurify preview, autosave localStorage, history, export .md |

Infra: kategori baru `media` (nav/footer/pills/i18n) · `useAudioWav.ts` composable (decode/encodeWav/peaks/waveform) · `vercel.json` Permissions-Policy microphone · 2 card baru di PDF hub + glowColors amber · 41 key i18n UI baru.

Review fixes: bug math compound-interest (top-up bulanan per periode, bukan per bulan) · XSS exif (escape nilai tag) · notes-md tanpa typography plugin (scoped style) · form-filler `getSelected()` · waveform redraw cache · trimmer reuse AudioContext. Copy "69+" → "78+" (README/offline) + seoDesc PDF "18+" → "20+".

### Batch 9 — Network + Image (SELESAI · 10 tools · 138 → 148 tools)

**Build ✅ 52s · precache 244 entries · 148 tools total**

| Tool | Halaman | Highlight |
|------|---------|-----------|
| Speed Test | `/network/speed-test` | gauge arc, download/ping/jitter, upload estimasi |
| Latency Tester | `/network/latency` | ping multi-host, bar visual, highlight warna |
| WebSocket Tester | `/network/websocket` | connect/send/receive, preset servers, message log |
| HTTP Headers Viewer | `/network/http-headers` | fetch headers, security badge (HSTS,CSP,XFO) |
| User-Agent Parser | `/network/ua-parser` | auto-detect + manual: browser/OS/device/engine |
| Port Reference | `/network/port-ref` | 50+ port TCP/UDP, search (offline-ready) |
| WHOIS Lookup | `/network/whois` | RDAP API: registrar, expiry, nameserver |
| SSL Checker | `/network/ssl` | fetch + crt.sh CT logs: expiry, HSTS |
| GIF Maker | `/image/gif-maker` | canvas animation preview + download PNG frame |
| Favicon Generator | `/image/favicon` | teks/emoji → 8 ukuran (16-512px), pilih warna |

Infra: network 3→11 · image 14→16 · 20 i18n keys baru.

### Batch 10 — Media + Life + Text (SELESAI · 10 tools · 148 → 158 tools)

**Build ✅ 46s · precache 254 entries · 158 tools total 🎉**

| Tool | Halaman | Highlight |
|------|---------|-----------|
| Metronome | `/media/metronome` | WebAudio click, BPM 20-240, time sig 1/4-8/4 |
| Tone Generator | `/media/tone-generator` | sine/square/triangle/sawtooth, 20-8000Hz |
| White Noise | `/media/white-noise` | white/pink/brown noise, timer auto-stop |
| Screen Recorder | `/media/screen-recorder` | getDisplayMedia, audio optional, download WebM |
| Music Scale Ref | `/media/scale-ref` | C0-B8 frequency table + play notes |
| Mood Tracker | `/life/mood-tracker` | 5 emoji moods, daily log, localStorage |
| Certificate Gen | `/life/certificate` | canvas template, nama/acara/tanggal, 5 warna |
| Snake Game | `/life/snake` | klasik snake, arrow/WASD, high score |
| Magic 8-Ball | `/life/magic-8ball` | 20+ jawaban random, animasi shake |
| Random Text | `/text/random-text` | kalimat/paragraf/lorem, plain/JSON/MD |

Infra: **kategori baru life** (4 tools) · media 3→8 · 20 i18n keys baru.

---

## 🎉 Plan 100 Tools — Complete!

| Batch | Tools | Status |
|-------|-------|--------|
| B1-B8 | 80 | ✅ |
| B9 | 10 (Network + Image) | ✅ |
| B10 | 10 (Media + Life + Text) | ✅ |
| **Total** | **100** | 🎉 58→158 |

**Final:** 12 kategori · 158 tools · 254 precache · ~24.8MB · build ~46s

### Batch 9 — Network + Image (SELESAI · 10 tools · 138 → 148 tools)

**Build ✅ 52s · precache 244 entries**

| Tool | Halaman | Highlight |
|------|---------|-----------|
| Speed Test | /network/speed-test | gauge arc, download/ping/jitter, upload estimasi |
| Latency Tester | /network/latency | ping multi-host, bar visual, highlight warna |
| WebSocket Tester | /network/websocket | connect/send/receive, preset servers |
| HTTP Headers Viewer | /network/http-headers | fetch headers, security badge HSTS/CSP/XFO |
| User-Agent Parser | /network/ua-parser | auto-detect + manual: browser/OS/device |
| Port Reference | /network/port-ref | 50+ port TCP/UDP, search (offline-ready) |
| WHOIS Lookup | /network/whois | RDAP API: registrar, expiry, nameserver |
| SSL Checker | /network/ssl | fetch + crt.sh CT logs: expiry, HSTS |
| GIF Maker | /image/gif-maker | canvas animation preview + PNG frame download |
| Favicon Generator | /image/favicon | teks/emoji to 8 sizes (16-512px) |

Infra: network 3 to 11 tools · image 14 to 16 · 20 i18n keys baru.

### Batch 10 — Media + Life + Text (SELESAI · 10 tools · 148 → 158 tools)

**Build ✅ 46s · precache 254 entries · TARGET TERCAPAI!**

| Tool | Halaman | Highlight |
|------|---------|-----------|
| Metronome | /media/metronome | WebAudio click, BPM 20-240, time sig 1/4-8/4 |
| Tone Generator | /media/tone-generator | sine/square/triangle/sawtooth, 20-8000Hz |
| White Noise | /media/white-noise | white/pink/brown noise, timer auto-stop |
| Screen Recorder | /media/screen-recorder | getDisplayMedia, audio optional, download WebM |
| Music Scale Ref | /media/scale-ref | C0-B8 frequency table + play notes |
| Mood Tracker | /life/mood-tracker | 5 emoji moods, daily log, localStorage |
| Certificate Gen | /life/certificate | canvas template, nama/acara/tanggal, PNG |
| Snake Game | /life/snake | classic snake, arrow/WASD, high score |
| Magic 8-Ball | /life/magic-8ball | 20+ random answers, shake animation |
| Random Text | /text/random-text | kalimat/paragraf/lorem, plain/JSON/MD |

Infra: new life category (4 tools) · media 3 to 8 · 20 i18n keys baru.

---

## Plan Complete

| Batch | Tools | Status |
|-------|-------|--------|
| B1-B8 | 80 | Done |
| B9 | 10 (Network + Image) | Done |
| B10 | 10 (Media + Life + Text) | Done |
| Total | 100 | 58 to 158 |

Final: 12 kategori · 158 tools · 254 precache · 24.8MB · build 46s
