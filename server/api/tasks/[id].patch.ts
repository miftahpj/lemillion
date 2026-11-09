// PATCH /api/tasks/:id — edit tugas. Khusus admin.
export default defineEventHandler(async (event) => {
  requireAuth(event)
  await ensureTasksTable()
  const id = getRouterParam(event, 'id') ?? ''
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw createError({ statusCode: 404, statusMessage: 'Tugas tidak ditemukan.' })

  const data = cleanTaskBody(await readBody(event))
  const entries = Object.entries(data)
  if (entries.length === 0) throw createError({ statusCode: 400, statusMessage: 'Tidak ada field valid untuk diupdate.' })
  if ('title' in data && !data.title) throw createError({ statusCode: 400, statusMessage: 'Judul tidak boleh kosong.' })

  const values = entries.map(([, v]) => v)
  values.push(id)
  const r = await db.query(
    `UPDATE tasks SET ${entries.map(([k], i) => `${k} = $${i + 1}`).join(', ')}, updated_at = NOW()
     WHERE id = $${values.length} RETURNING id`,
    values
  )
  if (!r.rows[0]) throw createError({ statusCode: 404, statusMessage: 'Tugas tidak ditemukan.' })
  return { ok: true }
})
