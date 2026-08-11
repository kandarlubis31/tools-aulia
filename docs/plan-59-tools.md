# Plan: 59 Tools Baru — ToolsAulia v3 Expansion

> Created: August 12, 2026
> Target: **168 tools existing → 227 total** (12 kategori, ~5 tools per kategori)
> Status: 🎉 **COMPLETE — 59/59 done (227 tools!)**

---

## Konteks

- **168 tools existing** across 12 kategori
- **100% client-side** — semua proses di browser
- **Pola existing:** ToolPageHeader + card-base + drop-zone + Web APIs + CDN libs
- **Guardrail G1:** `scripts/check-client-side.mjs` — pastikan semua client-side

---

## 1. PDF (5 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| P2-01 | **PDF Bates Numbering** | Tambah nomor bates (legal numbering) ke PDF | pdf-lib: drawText per halaman | 🟢 | P2 |
| P2-02 | **PDF Text Search** | Cari teks di dalam PDF, highlight halaman | pdf.js getTextContent + filter | 🟡 | P1 |
| P2-03 | **PDF Annotate** | Tambah highlight, underline, notes ke PDF | pdf-lib annotation API | 🟡 | P2 |
| P2-04 | **PDF Overlay** | Tumpuk satu PDF di atas PDF lain (opacity) | pdf-lib: drawPage as image overlay | 🟡 | P3 |
| P2-05 | **PDF to SVG** | Render halaman PDF sebagai SVG vector | pdf.js render + canvas to SVG trace | 🔴 | P3 |

## 2. Image (5 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| P2-06 | **Image Upscaler** | Perbesar gambar (bicubic/lanczos) + sharpen | Canvas scale + imageSmoothingQuality | 🟢 | P1 |
| P2-07 | **Image Splitter** | Potong gambar jadi grid (2×2, 3×3, custom) | Canvas crop per tile | 🟢 | P2 |
| P2-08 | **Image Overlay** | Tumpuk 2 gambar dengan blend mode & opacity | Canvas globalCompositeOperation | 🟢 | P2 |
| P2-09 | **QR Code Art** | QR code dengan warna, logo, dan style custom | QRCode.js CDN + canvas compose | 🟡 | P2 |
| P2-10 | **Image Border** | Tambah frame/border ke gambar (warna, tebal, rounded) | Canvas draw border | 🟢 | P3 |

## 3. Dev Tools (5 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| P2-11 | **Code to Image** | Carbon-style: kode syntax-highlight jadi PNG | highlight.js CDN + canvas render | 🟡 | P1 |
| P2-12 | **API Mock Generator** | Generate JSON response mock dari schema | JSON schema faker | 🟡 | P2 |
| P2-13 | **robots.txt Generator** | Builder robots.txt dengan visual rules | Form builder + text output | 🟢 | P2 |
| P2-14 | **.htaccess Generator** | Redirect, rewrite, security rules → .htaccess | Form builder + template | 🟢 | P3 |
| P2-15 | **NGINX Config Gen** | Generate reverse proxy, SSL, cache config | Form builder + template | 🟢 | P3 |

## 4. Calculator (5 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| P2-16 | **Tip Calculator** | Hitung tip restoran + split bill (IDR/USD) | Persentase + jumlah orang | 🟢 | P1 |
| P2-17 | **Discount Calculator** | Hitung harga setelah diskon bertingkat | Persentase + kumulatif | 🟢 | P1 |
| P2-18 | **Fuel Cost Calc** | Estimasi biaya bensin perjalanan | Jarak ÷ konsumsi × harga | 🟢 | P2 |
| P2-19 | **GPA Calculator** | Hitung IPK (skala 4.0) dari nilai & SKS | Weighted average | 🟢 | P2 |
| P2-20 | **Split Bill** | Patungan + pajak + service charge otomatis | Total ÷ orang + extra | 🟢 | P2 |

## 5. Security (5 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| P2-21 | **Base64 Image Encode** | Encode gambar ke base64 data URI | FileReader readAsDataURL | 🟢 | P1 |
| P2-22 | **Cert Decoder** | Decode sertifikat X.509 PEM/DER | ASN.1 parser + WebCrypto | 🟡 | P2 |
| P2-23 | **Hash Compare** | Bandingkan 2 file/teks via hash (SHA-256) | WebCrypto digest | 🟢 | P2 |
| P2-24 | **Security Headers Gen** | Generate header keamanan (CSP, HSTS, CORS) | Form builder + best practice | 🟢 | P3 |
| P2-25 | **Two-Factor Code** | Generate & validasi kode 2FA 6-digit | TOTP algorithm (RFC 6238) | 🟡 | P3 |

## 6. File (5 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| P2-26 | **File Converter Batch** | Batch convert file format (gambar, teks) | Canvas + text transform | 🟡 | P1 |
| P2-27 | **ZIP Extractor** | Ekstrak file ZIP di browser + download per file | zip.js / fflate CDN | 🟡 | P2 |
| P2-28 | **File Splitter** | Potong file besar jadi chunks (ukuran kustom) | Blob.slice | 🟢 | P2 |
| P2-29 | **File Joiner** | Gabung kembali chunks jadi file utuh | Blob constructor | 🟢 | P2 |
| P2-30 | **File Rename Batch** | Rename banyak file sekaligus (pola, prefix, suffix) | Input multiple + rename download | 🟢 | P3 |

## 7. Utils (5 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| P2-31 | **Invoice Generator** | Buat invoice/faktur → download PDF | Canvas render + pdf-lib | 🟡 | P1 |
| P2-32 | **Calendar Generator** | Generate kalender printable (bulanan/tahunan) | Canvas render grid | 🟡 | P2 |
| P2-33 | **Countdown Multi** | Beberapa countdown sekaligus (event, deadline) | localStorage + setInterval | 🟢 | P2 |
| P2-34 | **Name Picker** | Random name/spin wheel picker | Canvas wheel + animasi spin | 🟡 | P2 |
| P2-35 | **Receipt Generator** | Buat struk pembayaran palsu (fun/prank) | Canvas template | 🟢 | P3 |

## 8. Text (5 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| P2-36 | **Slug Generator** | Generate URL slug dari teks + custom separator | Regex normalize | 🟢 | P1 |
| P2-37 | **Line Sorter** | Sort, dedupe, shuffle, reverse baris teks | Array.sort + Set | 🟢 | P2 |
| P2-38 | **Find & Replace** | Cari & ganti teks dengan regex, case-sensitive | RegExp + highlight | 🟢 | P2 |
| P2-39 | **Character Map** | Browser karakter Unicode + copy | Grid render + search | 🟢 | P2 |
| P2-40 | **Text to Handwriting** | Konversi teks jadi gaya tulisan tangan | Canvas + font handwriting | 🟡 | P3 |

## 9. Data (5 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| P2-41 | **JSON to CSV** | Konversi JSON array ke CSV + download | Flatten + header inference | 🟢 | P1 |
| P2-42 | **HTML Table to JSON** | Ekstrak tabel HTML ke JSON | DOMParser + iterate TR/TD | 🟢 | P2 |
| P2-43 | **JSON Path Eval** | Evaluasi JSONPath expression (jsonpath CDN) | jsonpath CDN + live preview | 🟡 | P2 |
| P2-44 | **SQL to JSON** | Konversi SQL INSERT statements ke JSON | Regex parse INSERT VALUES | 🟢 | P2 |
| P2-45 | **Markdown Table Gen** | Generate tabel Markdown dari data / CSV | Template builder | 🟢 | P3 |

## 10. Network (5 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| P2-46 | **Wake-on-LAN** | Kirim magic packet WoL ke MAC address | UDP socket (limited browser) | 🟡 | P3 |
| P2-47 | **Subnet Visualizer** | Visual map subnet (network tree) | Canvas draw tree | 🟡 | P2 |
| P2-48 | **URL Parser** | Parse URL ke components (protocol, host, params) | new URL() + table | 🟢 | P2 |
| P2-49 | **QR WiFi Generator** | Generate QR untuk konek WiFi otomatis | QR code + WiFi config string | 🟢 | P2 |
| P2-50 | **Email Header Analyzer** | Parse & analisis email headers | Regex + field extraction | 🟢 | P3 |

## 11. Media (5 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| P2-51 | **Audio Visualizer** | Real-time frequency bars dari mic/file | WebAudio AnalyserNode + canvas | 🟡 | P1 |
| P2-52 | **Video Thumbnail** | Ekstrak thumbnail/screenshot dari video | Canvas drawImage dari video element | 🟢 | P2 |
| P2-53 | **Audio EQ** | 10-band graphic equalizer untuk audio | WebAudio BiquadFilter × 10 | 🟡 | P2 |
| P2-54 | **Audio Converter** | Konversi format audio (WAV→MP3/OGG via ffmpeg.wasm) | ffmpeg.wasm CDN (🔴 berat) | 🔴 | P3 |
| P2-55 | **Media Info** | Tampilkan metadata audio/video (codec, bitrate) | MediaElement properties + mediainfo.js | 🟡 | P3 |

## 12. Life (4 tools)

| ID | Tool | Deskripsi | Approach | Level | Prioritas |
|----|------|-----------|----------|-------|-----------|
| P2-56 | **Sleep Calculator** | Hitung waktu tidur ideal (sleep cycle 90min) | Time math + rekomendasi | 🟢 | P1 |
| P2-57 | **Water Tracker** | Catat konsumsi air harian + target | localStorage + counter | 🟢 | P2 |
| P2-58 | **Grocery List** | Daftar belanja tersimpan + checklist | localStorage + CRUD | 🟢 | P2 |
| P2-59 | **Bucket List** | Catat & track mimpi/goals hidup | localStorage + progress | 🟢 | P3 |

---

## Roadmap Eksekusi

| Batch | Isi | Estimasi |
|-------|-----|----------|
| **B12** | 10 tools: Bates, Text Search, Upscaler, Code2Image, Tip Calc, Discount Calc, Base64 Image, Batch Convert, Invoice Gen, Slug Gen | ~3 hari |
| **B13** | 10 tools: Annotate, Overlay (Image), QR Art, API Mock, Fuel Cost, GPA, Split Bill, ZIP Extractor, Calendar, Line Sorter | ~3 hari |
| **B14** | 10 tools: Overlay (PDF), Splitter (Image), robots.txt, Cert Decoder, Hash Compare, File Splitter, File Joiner, Countdown, Find&Replace, JSON to CSV | ~3 hari |
| **B15** | 10 tools: PDF to SVG, Border, htaccess, Security Headers, 2FA Code, File Rename, Name Picker, Char Map, HTML Table2JSON, JSON Path | ~4 hari |
| **B16** | 10 tools: NGINX Config, Subnet Viz, URL Parser, QR WiFi, Email Header, Audio Viz, Video Thumb, Audio EQ, Sleep Calc, Water Tracker | ~3 hari |
| **B17** | 9 tools: Audio Converter, Media Info, WoL, SQL2JSON, MD Table, Text2Handwriting, Receipt Gen, Grocery List, Bucket List | ~4 hari |

**Total: 59 tools · 6 batch · ~20 hari**

---

## Level & Prioritas Summary

| Level | Count |
|-------|-------|
| 🟢 Mudah | 38 |
| 🟡 Sedang | 17 |
| 🔴 Sulit | 4 |

| Prioritas | Count |
|-----------|-------|
| P1 (high value) | 10 |
| P2 (menengah) | 36 |
| P3 (nice-to-have) | 13 |

---

## Catatan

1. **Semua 100% client-side** — gak ada backend, gak ada API server (kecuali CDN lib)
2. **Lib CDN yang dibutuhkan:** highlight.js, QRCode.js, zip.js/fflate, jsonpath, ffmpeg.wasm (🔴), mediainfo.js
3. **Pola halaman:** BaseLayout + ToolPageHeader + card-base — konsisten dengan existing
4. **Proses:** tiap batch → tulis tools.ts + i18n + halaman → build → commit
5. 🔴 tools (PDF to SVG, Audio Converter) mungkin perlu riset ekstra — bisa di-skip kalau terlalu rumit

### Batch 17 — Life + Data + Media (SELESAI · 9 tools · 218 → 227) 🎉

**Build ✅ 67s · precache 328 entries · 59-PLAN COMPLETE!**

| Tool | Halaman | Highlight |
|------|---------|-----------|
| Media Info | /media/media-info | Metadata audio/video: codec, durasi, resolusi |
| Wake-on-LAN | /network/wol | Magic packet WoL sender |
| SQL to JSON | /data/sql-to-json | Parse INSERT SQL → JSON array |
| Markdown Table | /data/md-table | CSV → tabel MD ready copy |
| Text to Handwriting | /text/handwriting | Canvas tulisan tangan PNG |
| Receipt Generator | /utils/receipt | Struk belanja lucu (prank) |
| Grocery List | /life/grocery | Checklist belanja localStorage |
| Bucket List | /life/bucket-list | Goals & mimpi tracker |
| Audio Converter | /media/audio-convert | WAV/WebM offline render |

---

## 🏁 59-Plan — COMPLETE!

- **168 → 227 tools** (59 new)
- **6 batch (B12-B17)** in ~1 week
- **328 precache entries** (32.9MB)

---

## ✅ Execution Log

### Batch 12 — P1 Quick Wins (SELESAI · 10 tools · 168 → 178)

**Build ✅ 58s · precache 274 entries**

| Tool | Halaman | Highlight |
|------|---------|-----------|
| PDF Bates Numbering | /pdf/bates | Incremental legal numbering |
| PDF Text Search | /pdf/text-search | Keyword search + match page |
| Image Upscaler | /image/upscaler | Bicubic 2x/4x + sharpen slider |
| Code to Image | /dev/code-to-image | Syntax highlight → PNG (15+ langs) |
| Tip Calculator | /calc/tip | Bill split + round up |
| Discount Calculator | /calc/discount | 3 mode: % off, flat, final |
| Base64 Image | /security/base64-image | Encode/decode image ↔ base64 |
| Batch Convert | /file/batch-convert | Multi image → batch format |
| Invoice Generator | /utils/invoice | Fill form → printable PNG |
| Slug Generator | /text/slug | URL slug + separator options |

### Batch 13 — P2 Menengah (SELESAI · 10 tools · 178 → 188)

**Build ✅ 54s · precache 288 entries**

| Tool | Halaman | Highlight |
|------|---------|-----------|
| PDF Annotate | /pdf/annotate | Highlight, underline, sticky notes |
| Image Overlay | /image/overlay | 10+ blend modes + opacity |
| QR Code Art | /image/qr-art | Custom colors + centered logo |
| API Mock Generator | /dev/api-mock | Schema → fake JSON data |
| Fuel Cost Calculator | /calc/fuel-cost | Distance / km/L × price |
| GPA Calculator | /calc/gpa | Weighted 4.0 scale, dynamic rows |
| Split Bill | /calc/split-bill | Tax + service charge auto |
| ZIP Extractor | /file/zip-extractor | Extract + download per file |
| Calendar Generator | /utils/calendar | Monthly/yearly canvas printable |
| Line Sorter | /text/line-sorter | Sort, dedupe, shuffle, reverse |

### Batch 14-15 — P2/P3 (SELESAI · 20 tools · 188 → 208)

**Build ✅ 74s · precache 309 entries**

| Tool | Halaman | Highlight |
|------|---------|-----------|
| PDF Overlay | /pdf/overlay | Overlay PDF + opacity + position |
| Image Splitter | /image/splitter | Grid 2×2, 3×3, custom tiles |
| robots.txt Generator | /dev/robots-txt | Allow/Disallow/Sitemap builder |
| Certificate Decoder | /security/cert-decode | X.509 PEM: subject, issuer, validity |
| Hash Compare | /security/hash-compare | SHA-256 compare 2 files/texts |
| File Splitter | /file/splitter | Blob.slice → chunks |
| File Joiner | /file/joiner | Merge .part chunks → file |
| Countdown Multi | /utils/countdown | Multiple events, localStorage |
| Find & Replace | /text/find-replace | Regex search/replace + highlight |
| JSON to CSV | /data/json-to-csv | Auto header + table preview |
| PDF to SVG | /pdf/to-svg | Render page → vector SVG |
| Image Border | /image/border | Frame: color, thickness, radius |
| .htaccess Generator | /dev/htaccess | Apache redirect, rewrite, CORS |
| Security Headers Gen | /security/headers-gen | CSP, HSTS, XFO for NGINX |
| 2FA TOTP | /security/totp | RFC 6238: generate + verify |
| File Rename Batch | /file/rename | Pattern, prefix, suffix, counter |
| Name Picker | /utils/name-picker | Canvas spin wheel animation |
| Character Map | /text/charmap | Unicode grid + search + copy |
| HTML Table to JSON | /data/html-table-json | DOMParser extract table |
| JSON Path Evaluator | /data/json-path | JSONPath live preview |

### Batch 16 — Media + Network + Life (SELESAI · 10 tools · 208 → 218)

**Build ✅ 61s · precache 319 entries**

| Tool | Halaman | Highlight |
|------|---------|-----------|
| NGINX Config Gen | /dev/nginx | Reverse proxy, SSL, HSTS, cache |
| Subnet Visualizer | /network/subnet-viz | Canvas tree + network info |
| URL Parser | /network/url-parser | Protocol, host, path, params |
| QR WiFi Generator | /network/qr-wifi | Scan QR → auto connect WiFi |
| Email Header Analyzer | /network/email-header | SPF/DKIM/DMARC + routing |
| Audio Visualizer | /media/audio-viz | Bars/wave/circle from mic/file |
| Video Thumbnail | /media/video-thumb | Capture frames at time offsets |
| Audio Equalizer | /media/audio-eq | 10-band EQ + pop/rock/vocal/bass |
| Sleep Calculator | /life/sleep | 90-min sleep cycles |
| Water Tracker | /life/water-tracker | Daily intake + localStorage goal |

---

## 📊 Progress Summary

| Batch | Tools | Status | Build | Precache |
|-------|-------|--------|-------|----------|
| B12 | 10 | ✅ | 58s | 274 |
| B13 | 10 | ✅ | 54s | 288 |
| B14-15 | 20 | ✅ | 74s | 309 |
| B16 | 10 | ✅ | 61s | 319 |
| **B17** | 9 | ✅ | 67s | 328 |
| **Total** | **59/59** | 🎉 | **67s** | **328** |
