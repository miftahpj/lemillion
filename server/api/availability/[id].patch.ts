export default defineEventHandler(async (event) => {
  requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ status?: string }>(event)

  if (!body?.status || !['open', 'limited', 'full'].includes(body.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Status tidak valid.' })
  }

  const result = await db.query(
    'UPDATE availability SET status = $1 WHERE id = $2 RETURNING *',
    [body.status, id]
  )
  return result.rows[0] ?? null
})
