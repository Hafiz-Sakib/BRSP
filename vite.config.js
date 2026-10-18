import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // নতুন ডেপ্লয় হলে অটো আপডেট
      includeAssets: ['favicon.ico', 'favicon-16.png', 'favicon-32.png', 'icons/apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: 'BRSP – গাড়ি ধোয়ার রোস্টার',
        short_name: 'BRSP রোস্টার',
        description: 'BSP Batch 2 (Morning) – গাড়ি ধোয়ার ডিউটি রোস্টার ও শিক্ষার্থী তালিকা',
        lang: 'bn',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#109ada',
        theme_color: '#1d4ed8',
        categories: ['education', 'productivity'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'রোস্টার', url: '/', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
          { name: 'শিক্ষার্থী তালিকা', url: '/?tab=students', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,gif,webmanifest}'],
        globIgnores: ['**/*.woff'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/\.pdf$/],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
