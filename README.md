# ToolsAulia

<div align="center">

**129+ Tools Developer & Produktivitas · 100% Client-Side · Gratis Selamanya**

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

**ToolsAulia** adalah koleksi 129+ tools developer & produktivitas yang berjalan **100% di browser**. Tidak ada data yang dikirim ke server — semua pemrosesan file (PDF, gambar, teks) dilakukan secara lokal. PWA-enabled untuk akses offline.

### ✨ Kenapa ToolsAulia?

- 🔒 **Privasi Utama** — File tidak pernah di-upload ke server. Semua diproses di browser kamu.
- ⚡ **Cepat & Ringan** — Built dengan Astro 5 + Tailwind CSS. Skor Lighthouse 95+.
- 📱 **PWA Ready** — Install sebagai aplikasi di HP/laptop, akses offline.
- 🌙 **Dark Mode** — Otomatis mengikuti sistem.
- 🌍 **Bilingual** — Bahasa Indonesia & English (client-side i18n).
- ♿ **Accessible** — Skip-to-content, 22+ aria-labels, keyboard shortcuts.

### 🧰 Kategori Tools

| Kategori | Jumlah | Highlight |
|----------|--------|-----------|
| **PDF Tools** | 16 | Merge, Split, Compress, Rotate, Sign, Watermark, Grayscale, Extract, Reorder, Delete, Page Numbers, PDF→JPG, JPG→PDF, HTML→PDF, PDF→PPT, Metadata |
| **Image Tools** | 6 | Studio Editor, Compressor, Converter (PNG/JPG/WEBP), Color Picker, HTML→Image, Remove Background |
| **Developer** | 10 | JSON, Base64, URL Encoder, Cron, Diff, Markdown, Timestamp, CSS Shadow, My IP, CORS Proxy |
| **Calculator** | 6 | Currency (live rates), Age, BMI, Unit, Number Base, Percentage |
| **Security** | 3 | Password, Hash (MD5/SHA), UUID Generator |
| **Utility** | 13 | QR, WA Builder, Pomodoro, Todo, Stopwatch, Word Counter, Sinonim, Jokes, Brainstorm, Motivation, Lorem, Paste→MD, Prabowo Countdown |
| **File** | 2 | CSV→JSON, PDF→Markdown |

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
│   ├── pages/          # 129+ tool pages (Astro)
│   ├── components/     # Shared UI components
│   ├── composables/    # useToast, useClipboard, useDebounce, useShare, useLoading
│   ├── layouts/        # BaseLayout (navbar, footer, SEO, PWA, i18n)
│   ├── data/           # tools.ts (88 tools metadata)
│   ├── i18n/           # translations.ts
│   └── styles/         # global.css
├── public/             # Static assets, PWA icons, id-words.json, kbbi-sinonim.json
├── docs/
│   ├── agents/         # Agent config references
│   └── archive/        # Old plans & architecture docs
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

**ToolsAulia** is a collection of 129+ developer & productivity tools that run **100% in the browser**. No data is ever sent to a server — all file processing (PDF, images, text) happens locally. PWA-enabled for offline access.

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
| **PDF Tools** | 16 | Merge, Split, Compress, Rotate, Sign, Watermark, Grayscale, Extract, Reorder, Delete, Page Numbers, PDF→JPG, JPG→PDF, HTML→PDF, PDF→PPT, Metadata |
| **Image Tools** | 6 | Studio Editor, Compressor, Converter (PNG/JPG/WEBP), Color Picker, HTML→Image, Remove Background |
| **Developer** | 10 | JSON, Base64, URL Encoder, Cron, Diff, Markdown, Timestamp, CSS Shadow, My IP, CORS Proxy |
| **Calculator** | 6 | Currency (live rates), Age, BMI, Unit, Number Base, Percentage |
| **Security** | 3 | Password, Hash (MD5/SHA), UUID Generator |
| **Utility** | 13 | QR, WA Builder, Pomodoro, Todo, Stopwatch, Word Counter, Sinonim, Jokes, Brainstorm, Motivation, Lorem, Paste→MD, Prabowo Countdown |
| **File** | 2 | CSV→JSON, PDF→Markdown |

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
│   ├── pages/          # 129+ tool pages (Astro)
│   ├── components/     # Shared UI components
│   ├── composables/    # useToast, useClipboard, useDebounce, useShare, useLoading
│   ├── layouts/        # BaseLayout (navbar, footer, SEO, PWA, i18n)
│   ├── data/           # tools.ts (88 tools metadata)
│   ├── i18n/           # translations.ts
│   └── styles/         # global.css
├── public/             # Static assets, PWA icons, id-words.json, kbbi-sinonim.json
├── docs/
│   ├── agents/         # Agent config references
│   └── archive/        # Old plans & architecture docs
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
