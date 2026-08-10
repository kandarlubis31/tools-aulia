# Client-Side Processing Audit — Plan

> Created: August 11, 2026
> Perintah: "pastikan selalu client side untuk pemprosesan"
> Status: ✅ **G1-G3 SELESAI dieksekusi** (script + dokumentasi + badge)

## ✅ Execution Log (G1-G2)

| Item | Perubahan |
|------|-----------|
| **G1** | `scripts/check-client-side.mjs` dibuat — scan `src/` + `astro.config.mjs`, fail (exit 1) kalau ada pola server-side (`import.meta.env.SSR`, `Astro.locals`, `prerender = false`, `node:*`, Bun/Deno, `output: "server"`). Satu-satunya pengecualian: `src/pages/api/proxy.ts`. Wiring: `npm run check:client-side` **+ `prebuild`** → otomatis jalan tiap `npm run build`. Reviewer fix: pola `node:` diperluas (sebelumnya miss `from 'node:fs'` & `import('node:')`) |
| **G2** | `docs/CONTEXT.md` — section baru **Client-Side Guarantee (Enforced)** + update Known Decisions #1 (enforced) & #9 (daftar script) |
| **G3** | README badge **Client-Side 100%** (hijau, shield.io) ditambahkan di header badge row |

---

## ✅ Hasil Audit — 100% Client-Side TERVERIFIKASI

| # | Bukti | Detail |
|---|-------|--------|
| 1 | `output: "static"` di astro.config.mjs | Seluruh site di-build jadi static HTML/JS — **tidak ada SSR**. Vercel adapter cuma hosting file statis |
| 2 | **0 match** pola server-side di `src/` | Tidak ada `Astro.locals`, `import.meta.env.SSR`, `export const prerender` (selain proxy), `fs.*`, `node:*`, server endpoints, `Astro.request` handler |
| 3 | Semua pemrosesan file di browser | PDF (pdf.js + pdf-lib), gambar (imgly wasm/onnx), teks (mammoth, js-tiktoken), QR (qrious/qrcodejs) — semua library client-side, jalan di `<script>` |
| 4 | Web Workers = client-side | `pdf-to-md-worker.js` & `pdf-to-text-worker.js` di-load via `new Worker('/workers/...')` di browser (file statis di `public/`) |
| 5 | Data user gak pernah naik ke server | Upload PDF/gambar diproses lokal; fetch eksternal (jokeapi, er-api, dll) = data *masuk* ke browser, bukan data user *keluar* |

### Satu-satunya endpoint server: `api/proxy.ts`
- `export const prerender = false` → serverless function di Vercel
- **Bukan pemrosesan** — cuma **forwarding proxy CORS** dengan allowlist 6 domain (anti-SSRF): exchangerate-api, er-api, frankfurter, wttr.in, ipify, ipapi.co
- Dipakai tool `dev/proxy` & `calc/currency` buat bypass CORS rate API
- **File user tidak pernah lewat sini** — data yang diforward cuma URL yang user ketik di tool proxy (untuk test API)

### Mengapa pengecualian ini aman & tetap
1. Tidak memproses/menyimpan apapun — hanya `fetch` → forward response
2. Allowlist ketat → tidak bisa dipakai SSRF ke IP internal
3. Tidak ada upload, tidak ada storage, tidak ada database

---

## 🗓️ Usulan Guardrail (menunggu persetujuan)

```
G1  Script check-client-side (package.json "scripts")   15m
    - grep pola server-side di src/ (Astro.locals, SSR, fs, node:, prerender)
    - gagal (exit 1) kalau ada match — biar garansi gak dilanggar di masa depan
    - bisa dijalankan manual / ditambah ke CI

G2  Dokumentasi garansi di CONTEXT.md                     5m
    - Tambah section "Client-Side Guarantee": semua pemrosesan lokal,
      satu-satunya pengecualian api/proxy.ts (forwarding-only, allowlist)
G3  (Opsional) README badge "100% Client-Side"             5m
```

**Tidak ada bug yang ditemukan — garansi sudah terpenuhi. Guardrail di atas opsional untuk mengunci garansi.**
