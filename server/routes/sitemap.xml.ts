// server/routes/sitemap.xml.ts
// Sitemap sederhana: halaman statis + semua proyek portfolio yang published.
// Di-generate saat request (bukan build time) supaya portfolio baru dari
// admin panel otomatis ikut tanpa perlu rebuild/redeploy.
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl as string

  const staticPages = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/about', changefreq: 'monthly', priority: '0.8' },
    { path: '/services', changefreq: 'monthly', priority: '0.7' },
    { path: '/portfolio', changefreq: 'weekly', priority: '0.8' },
    { path: '/contact', changefreq: 'monthly', priority: '0.6' },
  ]

  let portfolioUrls: { id: string; updated_at: string }[] = []
  try {
    const result = await db.query(
      `SELECT id, updated_at FROM portfolio WHERE is_published = true ORDER BY sort_order ASC`
    )
    portfolioUrls = result.rows
  } catch (e) {
    console.warn('[sitemap] gagal ambil portfolio, lanjut tanpa itu:', e)
  }

  const urls = [
    ...staticPages.map(
      (p) => `  <url>
    <loc>${siteUrl}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ),
    ...portfolioUrls.map(
      // Halaman detail portfolio route-nya /portfolio/[id] dan cuma lookup
      // by UUID (lihat server/api/portfolio/[id].get.ts), jadi pakai id di sini.
      (p) => `  <url>
    <loc>${siteUrl}/portfolio/${p.id}</loc>
    <lastmod>${new Date(p.updated_at).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    ),
  ].join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  setHeader(event, 'Content-Type', 'application/xml')
  return xml
})
