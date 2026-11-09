// GET /api/tasks/admin — semua tugas termasuk draft. Khusus admin.
export default defineEventHandler(async (event) => {
  requireAuth(event)
  await ensureTasksTable()
  const r = await db.query(
    `SELECT ${TASK_COLUMNS} FROM tasks ORDER BY sort_order ASC, deadline ASC NULLS LAST, created_at ASC`
  )
  return r.rows
})
