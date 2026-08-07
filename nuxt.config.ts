export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
  ],

  // ── Neon (PostgreSQL) connection + admin session secrets ──
  // Semua bisa di-override lewat environment variable (.env / dashboard hosting).
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || '',
    adminEmail: process.env.ADMIN_EMAIL || 'miftahpauzanjamil@gmail.com',
    adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
    sessionSecret: process.env.SESSION_SECRET || 'change-this-secret-in-production',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://miftahpj.web.id',
    },
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
      htmlAttrs: { lang: 'id' },
      title: 'Lemillion — Web Developer',
      titleTemplate: '%s',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Miftah Pauzan Jamil (Lemillion) — Web Developer di Tasikmalaya. Membangun website landing page, company profile, hingga sistem informasi sejak 2022.',
        },
        {
          name: 'keywords',
          content: 'Miftah Pauzan Jamil, Lemillion, Web Developer Tasikmalaya, Jasa Pembuatan Website Tasikmalaya, Full-stack Developer Indonesia',
        },
        { name: 'author', content: 'Miftah Pauzan Jamil' },
        { name: 'theme-color', content: '#0C0A07' },
        { name: 'robots', content: 'index, follow' },
        // Open Graph — dipakai saat link di-share di WhatsApp/Facebook/LinkedIn
        { property: 'og:site_name', content: 'Miftah Pauzan Jamil — Lemillion' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'id_ID' },
        { property: 'og:title', content: 'Miftah Pauzan Jamil (Lemillion) — Web Developer' },
        {
          property: 'og:description',
          content: 'Portfolio resmi Miftah Pauzan Jamil (Lemillion), Web Developer di Tasikmalaya sejak 2022. Landing page, company profile, hingga sistem informasi.',
        },
        // Twitter/X Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Miftah Pauzan Jamil (Lemillion) — Web Developer' },
        {
          name: 'twitter:description',
          content: 'Portfolio resmi Miftah Pauzan Jamil (Lemillion), Web Developer di Tasikmalaya sejak 2022.',
        },
      ],
      link: [
        { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' },
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
