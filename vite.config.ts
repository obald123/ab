import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

// Vite config — https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), abrPwa()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '5173'),
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '5173'),
  },
})

/**
 * Progressive Web App: installable + offline-capable public site.
 *
 * `registerType: 'prompt'` — a bank site must not swap its own code out from
 * under a visitor mid-session. A new build is picked up only when the visitor
 * accepts the "refresh for the latest version" prompt (see
 * src/components/PwaPrompts.tsx). Registration is owned by that component
 * through the `virtual:pwa-register/react` hook, so `injectRegister` is
 * disabled here to avoid a second registration from an injected script.
 *
 * The service worker is deliberately NOT gated behind cookie consent: it
 * stores no personal data and is core functionality, not tracking — the same
 * reasoning already applied to language selection (see src/lib/i18n.tsx).
 *
 * Runtime caches match by full-URL RegExp (workbox `generateSW` does not
 * support function patterns) and start with `https?://<host>/` so they also
 * match the API on its own origin (abapi.…) without tripping workbox's
 * cross-origin "match from the start" warning.
 */
function abrPwa(): Plugin[] {
  return VitePWA({
    registerType: 'prompt',
    injectRegister: null,
    includeAssets: ['favicon.ico', 'favicon.png', 'apple-touch-icon.png'],
    manifest: {
      name: 'AB Bank Rwanda',
      short_name: 'AB Bank',
      description:
        'AB Bank Rwanda — banking services, news, exchange rates and branch information.',
      id: '/',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      lang: 'en',
      dir: 'ltr',
      theme_color: '#0ea5e9',
      background_color: '#ffffff',
      categories: ['finance', 'business'],
      icons: [
        { src: 'icons/pwa-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icons/pwa-512.png', sizes: '512x512', type: 'image/png' },
        {
          src: 'icons/maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      // Shell + the self-hosted brand fonts, so first offline paint has no FOUT.
      globPatterns: ['**/*.{js,css,html,woff2}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      navigateFallback: 'index.html',
      // The app owns every navigable route; the API must fall through to the
      // network, not the SPA shell.
      navigateFallbackDenylist: [/^\/api\//],
      runtimeCaching: [
        {
          // Staging preview: token-scoped, unpublished content. Never cache it —
          // a reviewer must always see the live pending change, and the backend
          // already sends `no-store` here.
          urlPattern: /^https?:\/\/[^/]+\/api\/v1\/preview\//,
          handler: 'NetworkOnly',
        },
        {
          // Published content (ticker, rates, news, hero…). Fresh when online —
          // rates and the ticker are time-sensitive — with the last-known copy
          // served offline, mirroring the `degraded` fallback in lib/content.ts.
          urlPattern: /^https?:\/\/[^/]+\/api\/v1\/content\//,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'abr-content',
            networkTimeoutSeconds: 3,
            expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // Uploaded media: keys are content-addressed and immutable.
          urlPattern: /^https?:\/\/[^/]+\/api\/v1\/media\//,
          handler: 'CacheFirst',
          options: {
            cacheName: 'abr-media',
            expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // Bundled, content-hashed images shipped with the app.
          urlPattern: /\/assets\/[^?]+\.(?:png|jpe?g|webp|gif|svg)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'abr-assets',
            expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
          },
        },
      ],
    },
    // A service worker only gets in the way during local development.
    devOptions: { enabled: false },
  })
}
