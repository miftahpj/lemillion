export default defineEventHandler(async (event) => {
  requireAuth(event)
  const id = getRouterParam(event, 'id')
  await db.query('DELETE FROM inquiries WHERE id = $1', [id])
  return { ok: true }
})
