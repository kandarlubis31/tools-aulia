import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from '@astrojs/vercel';
import AstroPWA from '@vite-pwa/astro';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://toolsaulia.vercel.app',
  output: "static",
  adapter: vercel(),
  integrations: [tailwind(), AstroPWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'safari-pinned-tab.svg', 'og-image.png', 'offline.html', 'pwa-192x192.png', 'pwa-512x512.png'],
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
      globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
      globIgnores: ["**/404.html", "**/404/index.html"],
      navigateFallback: '/',
      maximumFileSizeToCacheInBytes: 15 * 1024 * 1024, // 15 MB — headroom for kbbi-sinonim.json (9.4MB) + id-words.json (2.6MB)
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'cdnjs-cache',
            expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        {
          urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'jsdelivr-cache',
            expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        {
          urlPattern: /^https:\/\/unpkg\.com\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'unpkg-cache',
            expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            cacheableResponse: { statuses: [0, 200] }
          }
        },
        {
          urlPattern: /\/kbbi-sinonim\.json$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'kbbi-sinonim',
            expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 30 },
            cacheableResponse: { statuses: [0, 200] }
          }
        }
      ]
    },
    devOptions: {
      enabled: true
    },
  }), sitemap()],
});