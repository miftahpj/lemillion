export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
  ],

  // ── Aiven (PostgreSQL) connection + admin session secrets ──
  // Semua bisa di-override lewat environment variable (.env / dashboard hosting).
  runtimeConfig: {
    aivenDatabaseUrl: process.env.AIVEN_DATABASE_URL || '',
    adminEmail: process.env.ADMIN_EMAIL || 'miftahpauzanjamil@gmail.com',
    adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
    sessionSecret: process.env.SESSION_SECRET || 'change-this-secret-in-production',
    public: {},
  },

  // Fonts ditrim seminimal mungkin (cuma weight yang benar-benar dipakai)
  // demi ukuran halaman & waktu render yang ringan di semua device.
  googleFonts: {
    families: {
      'Cinzel': [500, 700],
      'DM Sans': [400, 500],
      'Space Mono': [400, 700],
    },
    display: 'swap',
    preload: false,
    download: true,
    inject: true,
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Lemillion — Web Developer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Miftah Pauzan Jamil (Lemillion) — Web Developer di Tasikmalaya. Membangun website landing page, company profile, hingga sistem informasi sejak 2022.' },
        { name: 'theme-color', content: '#0C0A07' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  // Halaman publik jarang berubah tiap detik → di-cache (stale-while-revalidate)
  // supaya kunjungan berikutnya nyaris instan tanpa hit DB berulang-ulang.
  routeRules: {
    '/':              { swr: 900 },
    '/about':         { swr: 900 },
    '/services':      { swr: 900 },
    '/portfolio':     { swr: 900 },
    '/portfolio/**':  { swr: 900 },
    '/contact':       { swr: 60 },
    '/admin/**':      { swr: false, ssr: false },
    '/login':         { ssr: false },
  },

  experimental: {
    payloadExtraction: false,
  },

  nitro: {
    compressPublicAssets: true,
  },

  compatibilityDate: '2024-11-01',
})
