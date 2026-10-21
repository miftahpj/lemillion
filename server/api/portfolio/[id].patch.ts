// PATCH /api/portfolio/:id — edit karya (semua kolom, bukan hanya link). Khusus admin.
export default defineEventHandler(async (event) => {
  requireAuth(event)
  const id = getRouterParam(event, 'id')
  const data = cleanPortfolioBody(await readBody(event))
  const entries = Object.entries(data)

  if (entries.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Tidak ada field valid untuk diupdate.' })
  }
  if ('title' in data && !data.title) {
    throw createError({ statusCode: 400, statusMessage: 'Judul tidak boleh kosong.' })
  }

  const setClauses = entries.map(([key], i) => `${key} = $${i + 1}`)
  const values = entries.map(([, value]) => value)
  values.push(id)

  let result
  try {
    result = await db.query(
      `UPDATE portfolio SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    )
  } catch (e: any) {
    if (e?.code === '23505') throw createError({ statusCode: 409, statusMessage: 'Slug sudah dipakai karya lain.' })
    throw createError({ statusCode: 500, statusMessage: e?.message || 'Gagal menyimpan perubahan.' })
  }
  if (!result.rows[0]) throw createError({ statusCode: 404, statusMessage: 'Karya tidak ditemukan.' })

  invalidateCache('portfolio')
  return result.rows[0]
})
