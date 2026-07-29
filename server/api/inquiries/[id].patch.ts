const ALLOWED_FIELDS = ['status', 'notes', 'replied_at']

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody<Record<string, any>>(event)

  const entries = Object.entries(body || {}).filter(([key]) => ALLOWED_FIELDS.includes(key))
  if (entries.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Tidak ada field valid untuk diupdate.' })
  }

  const setClauses = entries.map(([key], i) => `${key} = $${i + 1}`)
  const values = entries.map(([, value]) => value)
  values.push(id)

  const result = await db.query(
    `UPDATE inquiries SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  )
  return result.rows[0] ?? null
})
