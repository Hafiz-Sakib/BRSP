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
        name: 'BRSP Batch 2',
        short_name: 'BRSP Batch 2',
        description: 'BRSP Batch 2 (Morning) – গাড়ি ধোয়ার ডিউটি রোস্টার ও শিক্ষার্থী তালিকা',
        lang: 'bn',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#ffffff',
        theme_color: '#0a3631',
        categories: ['education', 'productivity'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'রোস্টার', url: '/?tab=roster', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
          { name: 'শিক্ষার্থী তালিকা', url: '/?tab=students', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
          { name: 'শাটল ট্রেন', url: '/?tab=train', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,woff2,gif,webmanifest}'],
        globIgnores: ['**/*.woff', '**/train-schedule.png', '**/assets/g[0-9][0-9]-*.jpg'], // গ্যালারির বড় ছবি অফলাইন ক্যাশে নেই (থাম্বনেইল আছে)
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/\.pdf$/],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
