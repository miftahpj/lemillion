// POST /api/upload — upload satu foto dari perangkat (multipart, field "file"). Khusus admin.
export default defineEventHandler(async (event) => {
  requireAuth(event)

  const parts = await readMultipartFormData(event)
  const file = parts?.find((p) => p.name === 'file' && p.filename)
  if (!file) throw createError({ statusCode: 400, statusMessage: 'File gambar tidak ditemukan.' })
  if (file.data.length > IMAGE_MAX_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'Ukuran gambar maksimal 4 MB.' })
  }
  const mime = sniffImage(file.data)
  if (!mime) {
    throw createError({ statusCode: 415, statusMessage: 'Format tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.' })
  }

  try {
    await ensureImagesTable()
    const r = await db.query(
      'INSERT INTO uploaded_images (mime, size, data) VALUES ($1, $2, $3) RETURNING id',
      [mime, file.data.length, file.data]
    )
    return { id: r.rows[0].id, url: `/api/images/${r.rows[0].id}` }
  } catch (e: any) {
    throw createError({ statusCode: 500, statusMessage: e?.message || 'Gagal menyimpan foto.' })
  }
})
