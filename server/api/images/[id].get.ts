// GET /api/images/:id — sajikan foto upload (publik, di-cache lama karena id selalu baru tiap upload).
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw createError({ statusCode: 404, statusMessage: 'Gambar tidak ditemukan.' })

  let row: any = null
  try {
    row = (await db.query('SELECT mime, data FROM uploaded_images WHERE id = $1', [id])).rows[0]
  } catch (e: any) {
    if (e?.code !== '42P01') throw e // 42P01 = tabel belum ada (belum pernah upload)
  }
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Gambar tidak ditemukan.' })

  setHeader(event, 'Content-Type', row.mime)
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  return row.data
})
