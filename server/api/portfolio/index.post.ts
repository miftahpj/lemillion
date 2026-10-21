// POST /api/portfolio — tambah karya baru (khusus admin).
export default defineEventHandler(async (event) => {
  requireAuth(event)
  const data = cleanPortfolioBody(await readBody(event))

  if (!data.title) {
    throw createError({ statusCode: 400, statusMessage: 'Judul wajib diisi.' })
  }
  // Nilai bawaan supaya kolom NOT NULL tidak menolak form yang sebagian kosong
  data.description ??= ''
  data.cover_url ??= ''
  data.image_url ??= data.cover_url
  data.gallery_urls ??= []
  data.tags ??= []
  data.year ??= new Date().getFullYear()
  data.is_featured ??= false
  data.is_published ??= true
  if (!data.slug) data.slug = slugify(data.title) || null
  if (data.sort_order === undefined) {
    const r = await db.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM portfolio')
    data.sort_order = Number(r.rows[0].next)
  }

  const insert = () => {
    const keys = Object.keys(data)
    return db.query(
      `INSERT INTO portfolio (${keys.join(', ')}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING *`,
      keys.map((k) => data[k])
    )
  }

  let result
  try {
    result = await insert()
  } catch (e: any) {
    if (e?.code === '23505' && data.slug) {
      data.slug = `${data.slug}-${Date.now().toString(36)}` // slug bentrok → buat unik
      result = await insert()
    } else if (e?.code === '23502') {
      throw createError({ statusCode: 400, statusMessage: `Kolom "${e.column}" wajib diisi.` })
    } else {
      throw createError({ statusCode: 500, statusMessage: e?.message || 'Gagal menyimpan karya.' })
    }
  }

  invalidateCache('portfolio')
  return result.rows[0]
})
