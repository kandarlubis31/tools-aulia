import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from '@astrojs/vercel';
import AstroPWA from '@vite-pwa/astro';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tools.paklubis.my.id',
  output: "static",
  adapter: vercel(),
  integrations: [tailwind({ applyBaseStyles: false }), AstroPWA({
    registerType: 'autoUpdate',
    // Registration is handled manually in BaseLayout (deferred via requestIdleCallback)
    // to keep it off the critical path. The auto-injected registerSW.js was not being
    // referenced in the built HTML (broken injection) → SW never registered.
    injectRegister: false,
    includeAssets: ['favicon.svg', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'safari-pinned-tab.svg', 'og-image.png', 'pwa-192x192.png', 'pwa-512x512.png'],
    manifest: {
      name: 'ToolsAulia',
      short_name: 'ToolsAulia',
      description: 'Koleksi tools developer dan produktivitas lengkap.',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
      ]
    },
    workbox: {
      // Auto-activate + claim: SW baru langsung aktif & menguasai halaman yang
      // sudah terbuka → controllerchange memicu reload, user tak terjebak cache lama.
      // (injectRegister:false menonaktifkan auto-set ini di plugin, jadi set manual.)
      skipWaiting: true,
      clientsClaim: true,
      globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
      globIgnores: ["**/404.html", "**/404/index.html", "**/og/*.png", "**/_astro/index.*.js", "**/editor/**"], // OG: social-only | index.*.js: Vite shared chunks — skip precache | editor: app standalone (bundle 5MB + aset 60MB) punya SW sendiri
      // manifestTransforms custom → GANTI transform bawaan @vite-pwa/astro.
      // Transform bawaan mengubah 'pdf/annotate/index.html' → 'pdf/annotate' (tanpa
      // slash) yang TIDAK PERNAH cocok dengan navigasi Astro directory-format
      // '/pdf/annotate/' → semua halaman jatuh ke navigateFallback ('Kamu Lagi
      // Offline') — bug kritis yang sudah terverifikasi di production. Transform ini
      // menghasilkan 'pdf/annotate/' (trailing slash) → PrecacheRoute cocok →
      // halaman disajikan dari precache (offline-first) + fallback tetap ada.
      manifestTransforms: [
        async (entries) => {
          for (const e of entries) {
            if (!e.url.endsWith('.html')) continue;
            const url = e.url.startsWith('/') ? e.url.slice(1) : e.url;
            if (url === 'index.html') {
              e.url = '/';
            } else {
              const parts = url.split('/');
              if (parts[parts.length - 1] === 'index.html') {
                parts.pop();
                e.url = parts.join('/') + '/';
              } else {
                parts[parts.length - 1] = parts[parts.length - 1].replace(/\.html$/, '');
                e.url = parts.join('/');
              }
            }
          }
          return { manifest: entries, warnings: [] };
        },
      ],
      navigateFallback: '/offline/',
      navigateFallbackDenylist: [/^\/api\/.*/],
      maximumFileSizeToCacheInBytes: 25 * 1024 * 1024, // 25 MB — headroom for kbbi-sinonim.json (9.4MB) + id-words.json (2.6MB) + AI models
      runtimeCaching: [
        // --- CDN Libraries (long-lived, rarely change) ---
        {
          urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'cdnjs-cache',
            expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        {
          urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'jsdelivr-cache',
            expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        {
          urlPattern: /^https:\/\/unpkg\.com\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'unpkg-cache',
            expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        // --- imgly AI model (remove-bg: wasm/onnx ~5-15MB, cached after first use → offline-capable) ---
        {
          urlPattern: /^https:\/\/staticimgly\.com\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'imgly-model-cache',
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        // --- Large Static Datasets (rarely change) ---
        {
          urlPattern: /\/kbbi-sinonim\.json$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'kbbi-sinonim',
            expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        {
          urlPattern: /\/id-words\.json$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'id-words',
            expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        // --- Dynamic APIs (NetworkFirst — freshness matters) ---
        {
          urlPattern: /^https:\/\/(open\.er-api\.com|ipapi\.co|v2\.jokeapi\.dev|dummyjson\.com|uselessfacts\.jsph\.pl|api\.freedictionaryapi\.dev|api\.mymemory\.translated\.net|1\.1\.1\.1)\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 5,
            expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        // --- Self-hosted FFmpeg core (video-editor: wasm ~32MB). ---
        // NOT precached (over 25MB limit) — cached on first use → offline-capable.
        {
          urlPattern: /\/vendor\/ffmpeg\//,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'ffmpeg-core',
            expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 365 },
            cacheableResponse: { statuses: [0, 200] }
          }
        }
      ]
    },
    devOptions: {
      enabled: true
    },
  }), sitemap({
    filter: (page) => !page.includes('/api/'),
    changefreq: 'weekly',
    priority: 1.0,
    lastmod: new Date(),
    serialize(item) {
      // Homepage
      if (item.url === 'https://tools.paklubis.my.id/' || item.url === 'https://tools.paklubis.my.id') {
        return { ...item, priority: 1.0, changefreq: 'daily', lastmod: new Date() };
      }
      // PDF hub
      if (item.url.endsWith('/pdf') || item.url.endsWith('/pdf/')) {
        return { ...item, priority: 0.9, changefreq: 'weekly' };
      }
      // Popular tools
      const popularPaths = ['/image/editor', '/image/compressor', '/image/remove-bg', '/dev/my-ip', '/calc/currency', '/calc/age', '/calc/bmi', '/security/password', '/utils/wa-builder', '/utils/qr', '/utils/sinonim', '/utils/paste-to-md', '/utils/prabowo-countdown', '/file/pdf-to-md'];
      if (popularPaths.some(p => item.url.endsWith(p) || item.url.endsWith(p + '/'))) {
        return { ...item, priority: 0.8, changefreq: 'weekly' };
      }
      // Regular tool pages
      return { ...item, priority: 0.6, changefreq: 'monthly' };
    }
  })],
});