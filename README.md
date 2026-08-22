# ToolsAulia

<div align="center">

**232+ Tools Developer & Produktivitas · 100% Client-Side · Gratis Selamanya**

[🇮🇩 Indonesia](#indonesia) · [🇬🇧 English](#english)

![Astro](https://img.shields.io/badge/astro-5.x-purple.svg)
![Tailwind](https://img.shields.io/badge/tailwind-3.x-06B6D4.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8.svg)
![Client-Side](https://img.shields.io/badge/Client--Side-100%25-16a34a.svg)

</div>

---

<a name="indonesia"></a>
## 🇮🇩 Indonesia

### Tentang

**ToolsAulia** adalah koleksi 232+ tools developer & produktivitas yang berjalan **100% di browser**. Tidak ada data yang dikirim ke server — semua pemrosesan file (PDF, gambar, teks) dilakukan secara lokal. PWA-enabled untuk akses offline.

### ✨ Kenapa ToolsAulia?

- 🔒 **Privasi Utama** — File tidak pernah di-upload ke server. Semua diproses di browser kamu.
- ⚡ **Cepat & Ringan** — Built dengan Astro 5 + Tailwind CSS. Skor Lighthouse 95+.
- 📱 **PWA Ready** — Install sebagai aplikasi di HP/laptop, akses offline.
- 🌙 **Dark Mode** — Otomatis mengikuti sistem.
- 🌍 **Bilingual** — Bahasa Indonesia & English (client-side i18n).
- ♿ **Accessible** — Skip-to-content, aria-labels lengkap, keyboard shortcuts (`/` atau `Ctrl+K` cari).

### 🧰 Kategori Tools

| Kategori | Jumlah | Highlight |
|----------|--------|-----------|
| **PDF** | 32 + hub | Merge, Split, Compress, Sign, Watermark, Redact, To-Word, To-Excel, Booklet, Compare, Repair |
| **Dev** | 29 | JSON, Base64, Regex Tester, JWT, Cron, Diff, SQL Formatter, Subnet, JSON→TS, Grid |
| **Image** | 25 | Studio Editor, Compressor, Remove BG (AI), Cropper, Sign to PNG, Image to Scanner, GIF Maker |
| **Calc** | 23 | Currency (live rates), Age, BMI, EMI, Compound Interest, Matrix, Scientific, Timezone |
| **Utils** | 25 | QR, WA Builder, Pomodoro, Todo, Nama Generator Indonesia, Wordle ID, Habit Tracker |
| **Text** | 19 | Text-to-Speech, Speech-to-Text, Summarizer, Typing Test, Fancy, Morse, Readability |
| **Media** | 17 | Video Studio (CapCut-style), Video Editor, Audio Recorder/Trimmer/EQ, Screen Recorder, Beat Maker |
| **Security** | 16 | Password, Hash, UUID, Bcrypt, TOTP, File Encrypt, Steganography, Cipher |
| **Network** | 16 | REST Client, HTTP Builder, Speed Test, DNS Lookup, WebSocket, Whois, SSL |
| **Data** | 15 | CSV Editor, XLSX Viewer, iCal, Fake Data, Barcode (+reader), GeoJSON, vCard |
| **Life** | 8 | Mood Tracker, Certificate, Snake, Magic 8-Ball |
| **File** | 7 | CSV↔JSON, PDF→Markdown, Zip Extractor, Batch Convert, Splitter, Renamer |

### 🚀 Quick Start

```bash
git clone https://github.com/kandarlubis31/tools-aulia.git
cd tools-aulia
pnpm install
pnpm dev        # → http://localhost:4321
pnpm build      # Production build
```

### 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | [Astro 5](https://astro.build) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) |
| Language | TypeScript 5 |
| PDF | pdf.js 3.11, pdf-lib |
| Image | html2canvas, canvas API |
| Crypto | crypto-js, Web Crypto API |
| QR | qrious, qrcodejs |
| Diff | jsdiff |
| i18n | Custom client-side (ID/EN) |
| PWA | vite-pwa (NetworkFirst, 25MB cache) |
| Hosting | Vercel (SSG) |

### 📁 Struktur Project

```
tools-aulia/
├── src/
│   ├── pages/          # 230+ tool pages (Astro)
│   ├── components/     # Shared UI components
│   ├── composables/    # useToast, useClipboard, useDebounce, useShare, useLoading, usePdf*, useCdnLib
│   ├── layouts/        # BaseLayout (navbar, footer, SEO, PWA, i18n)
│   ├── data/           # tools.ts (233 entries metadata), indonesian-names.ts
│   ├── i18n/           # translations.ts
│   └── styles/         # global.css + critical.css (inline above-the-fold)
├── public/             # Static assets, PWA icons, id-words.json, kbbi-sinonim.json, vendor/, editor/
├── docs/
│   ├── CONTEXT.md      # Project context & decision log
│   ├── adr/            # Architecture Decision Records
│   ├── agents/         # Agent config references
│   └── archive/        # Old plans & audits
├── editor/             # OmniClip vendor build pipeline (build-dist.mjs)
└── package.json
```

### 🤝 Kontribusi

1. Fork repository ini
2. Buat branch: `git checkout -b feature/nama-tool`
3. Commit: `git commit -m 'feat: tambah tool X'`
4. Push: `git push origin feature/nama-tool`
5. Buat Pull Request

### 📄 Lisensi

[MIT License](LICENSE) © Aulia Iskandar Lubis

---

<a name="english"></a>
## 🇬🇧 English

### About

**ToolsAulia** is a collection of 232+ developer & productivity tools that run **100% in the browser**. No data is ever sent to a server — all file processing (PDF, images, text) happens locally. PWA-enabled for offline access.

### ✨ Why ToolsAulia?

- 🔒 **Privacy First** — Files never leave your browser. Everything is processed locally.
- ⚡ **Fast & Lightweight** — Built with Astro 5 + Tailwind CSS. Lighthouse score 95+.
- 📱 **PWA Ready** — Install as an app on mobile/desktop, works offline.
- 🌙 **Dark Mode** — Auto-detects system preference.
- 🌍 **Bilingual** — Indonesian & English (client-side i18n).
- ♿ **Accessible** — Skip-to-content, 22+ aria-labels, keyboard shortcuts.

### 🧰 Tool Categories

| Category | Count | Highlights |
|----------|-------|------------|
| **PDF** | 32 + hub | Merge, Split, Compress, Sign, Watermark, Redact, To-Word, To-Excel, Booklet, Compare, Repair |
| **Dev** | 29 | JSON, Base64, Regex Tester, JWT, Cron, Diff, SQL Formatter, Subnet, JSON→TS, Grid |
| **Image** | 25 | Studio Editor, Compressor, Remove BG (AI), Cropper, Sign to PNG, Image to Scanner, GIF Maker |
| **Calc** | 23 | Currency (live rates), Age, BMI, EMI, Compound Interest, Matrix, Scientific, Timezone |
| **Utils** | 25 | QR, WA Builder, Pomodoro, Todo, Indonesian Name Generator, Wordle ID, Habit Tracker |
| **Text** | 19 | Text-to-Speech, Speech-to-Text, Summarizer, Typing Test, Fancy, Morse, Readability |
| **Media** | 17 | Video Studio (CapCut-style), Video Editor, Audio Recorder/Trimmer/EQ, Screen Recorder, Beat Maker |
| **Security** | 16 | Password, Hash, UUID, Bcrypt, TOTP, File Encrypt, Steganography, Cipher |
| **Network** | 16 | REST Client, HTTP Builder, Speed Test, DNS Lookup, WebSocket, Whois, SSL |
| **Data** | 15 | CSV Editor, XLSX Viewer, iCal, Fake Data, Barcode (+reader), GeoJSON, vCard |
| **Life** | 8 | Mood Tracker, Certificate, Snake, Magic 8-Ball |
| **File** | 7 | CSV↔JSON, PDF→Markdown, Zip Extractor, Batch Convert, Splitter, Renamer |

### 🚀 Quick Start

```bash
git clone https://github.com/kandarlubis31/tools-aulia.git
cd tools-aulia
pnpm install
pnpm dev        # → http://localhost:4321
pnpm build      # Production build
```

### 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Framework | [Astro 5](https://astro.build) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) |
| Language | TypeScript 5 |
| PDF | pdf.js 3.11, pdf-lib |
| Image | html2canvas, canvas API |
| Crypto | crypto-js, Web Crypto API |
| QR | qrious, qrcodejs |
| Diff | jsdiff |
| i18n | Custom client-side (ID/EN) |
| PWA | vite-pwa (NetworkFirst, 25MB cache) |
| Hosting | Vercel (SSG) |

### 📁 Project Structure

```
tools-aulia/
├── src/
│   ├── pages/          # 230+ tool pages (Astro)
│   ├── components/     # Shared UI components
│   ├── composables/    # useToast, useClipboard, useDebounce, useShare, useLoading, usePdf*, useCdnLib
│   ├── layouts/        # BaseLayout (navbar, footer, SEO, PWA, i18n)
│   ├── data/           # tools.ts (233 entries metadata), indonesian-names.ts
│   ├── i18n/           # translations.ts
│   └── styles/         # global.css + critical.css (inline above-the-fold)
├── public/             # Static assets, PWA icons, id-words.json, kbbi-sinonim.json, vendor/, editor/
├── docs/
│   ├── CONTEXT.md      # Project context & decision log
│   ├── adr/            # Architecture Decision Records
│   ├── agents/         # Agent config references
│   └── archive/        # Old plans & audits
├── editor/             # OmniClip vendor build pipeline (build-dist.mjs)
└── package.json
```

### 🤝 Contributing

1. Fork this repository
2. Create branch: `git checkout -b feature/tool-name`
3. Commit: `git commit -m 'feat: add X tool'`
4. Push: `git push origin feature/tool-name`
5. Open Pull Request

### 📄 License

[MIT License](LICENSE) © Aulia Iskandar Lubis

---

<div align="center">

**Made with ❤️ by [Kandar Lubis](https://github.com/kandarlubis31)** · [paklubis.my.id](https://paklubis.my.id)

</div>
