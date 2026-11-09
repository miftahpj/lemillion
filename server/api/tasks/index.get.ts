// GET /api/tasks — daftar tugas yang dipublikasikan (untuk halaman /so)
export default defineEventHandler(async () => {
  await ensureTasksTable()
  const r = await db.query(
    `SELECT ${TASK_COLUMNS} FROM tasks
     WHERE is_published = true
     ORDER BY sort_order ASC, deadline ASC NULLS LAST, created_at ASC`
  )
  return r.rows
})
