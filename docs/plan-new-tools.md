# Plan: 100 Tools Baru — ToolsAulia v2 Expansion

> Created: August 11, 2026
> Target: **58 tools existing → 158 total** (10 kategori × 10 tools baru)
> Status: 📋 **Plan — menunggu persetujuan eksekusi batch**

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
