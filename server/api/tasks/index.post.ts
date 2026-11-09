// POST /api/tasks — tambah tugas baru. Khusus admin.
export default defineEventHandler(async (event) => {
  requireAuth(event)
  await ensureTasksTable()
  const data = cleanTaskBody(await readBody(event))

  if (!data.title) throw createError({ statusCode: 400, statusMessage: 'Judul wajib diisi.' })
  data.is_published ??= true
  if (data.sort_order === undefined) {
    const r = await db.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM tasks')
    data.sort_order = Number(r.rows[0].next)
  }

  const keys = Object.keys(data)
  try {
    const r = await db.query(
      `INSERT INTO tasks (${keys.join(', ')}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING id`,
      keys.map((k) => data[k])
    )
    return { id: r.rows[0].id }
  } catch (e: any) {
    throw createError({ statusCode: 500, statusMessage: e?.message || 'Gagal menyimpan tugas.' })
  }
})
