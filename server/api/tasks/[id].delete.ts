// DELETE /api/tasks/:id — hapus tugas. Khusus admin.
export default defineEventHandler(async (event) => {
  requireAuth(event)
  await ensureTasksTable()
  const id = getRouterParam(event, 'id') ?? ''
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw createError({ statusCode: 404, statusMessage: 'Tugas tidak ditemukan.' })
  await db.query('DELETE FROM tasks WHERE id = $1', [id])
  return { ok: true }
})
