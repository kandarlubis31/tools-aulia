---
title: SEO title landing tertimpa "Dashboard | Tools MasAul" pasca hydration
labels: [bug, seo, i18n, base-layout]
area: base-layout
reported: 2026-10-27
reported_by: sesi audit "Bersihkan Cache" (smoke CDP 19/19)
status: fixed
fixed_in: 1960ec8
fixed_date: 2026-10-27
---

# SEO title landing tertimpa "Dashboard | Tools MasAul" pasca hydration

## Gejala

Title landing (`/`) berubah dari:

```
Koleksi 251+ Tools Developer & Produktivitas Gratis | Tools MasAul   ← SEO title (statik)
Dashboard | Tools MasAul                                            ← pasca hydration (runtime)
```

Terbukti via smoke CDP (`document.title` = "Dashboard | Tools MasAul" setelah load selesai)
dan raw CDP/console pada live build lokal. Meta statik (`<title>`, `og:title`) di
`dist/client/index.html` masih benar — yang rusak runtime.

## Akar masalah (pre-existing, bukan regresi sesi ini)

`src/pages/index.astro` kirim `pageTitle="Dashboard"` ke `BaseLayout` →
`<meta name="original-title" content="Dashboard">` (BaseLayout.astro line ~99).

`processI18n()` di `BaseLayout.astro` menulis ulang `document.title` di KEDUA jalur bahasa:
jalur EN (line ~1925) dan jalur ID (line ~1944) — keduanya memakai `pageTitle` pendek:

```
document.title = `${originalTitle} | Tools MasAul`   // "Dashboard | Tools MasAul"
```

Dampak: title SEO utama halaman paling penting (landing) hilang setelah hydration; crawler
yang jalankan JS (Google, default ID) melihat "Dashboard | Tools MasAul" — keyword utama
(koleksi, tools, gratis) hilang.

## Fix (`1960ec8`)

Jalur ID kini **RESTORE** `document.title` dari `meta[property="og:title"]` — og:title
berisi `fullTitle` statik (landing = title SEO penuh, tool = `seoTitle ?? pageTitle — …`),
tidak pernah disentuh i18n (walk hanya `document.body`), dan ClientRouter head-swap ikut
menggantinya saat SPA nav. Efek:

- Fresh load ID → no-op (title sudah = og:title).
- EN → ID di halaman sama → title balik ke fullTitle SEO.
- SPA nav (mode apapun) → restore selalu og:title halaman AKTIF (bukan snapshot basi).
- Jalur EN TIDAK diubah (rewrite `pageTitle` terjemahan tetap — behavior lama).

## Verifikasi (smoke CDP 10/10 PASS, 0 exception)

- T1 title === og:title landing pasca hydration ("Koleksi 251+…" utuh)
- T2 toggle EN → "Dashboard | Tools MasAul" (behavior EN dipertahankan)
- T3 toggle balik ID → restore "Koleksi 251+…"
- T4/T4b SPA nav → title === og:title tool aktif, og ikut head-swap
- T5/T5b EN-SPA-nav + restore og:title halaman baru
- T6 fresh tool page → fullTitle utuh
- `pnpm test` 62/62, audit-i18n exit 0, build hijau

## Sisa (deferred, tidak blocking)

EN title landing masih "Dashboard | Tools MasAul" (behavior lama). Kalau mau SEO EN lebih
kuat, butuh key i18n title SEO landing + wiring jalur EN — kerjaan terpisah.
