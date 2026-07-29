export default defineEventHandler(async (event) => {
  requireAuth(event)
  const query = getQuery(event)
  const status = query.status as string | undefined

  const conditions: string[] = []
  const params: any[] = []
  if (status) {
    params.push(status)
    conditions.push(`status = $${params.length}`)
  }

  const sql = `SELECT * FROM inquiries ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''} ORDER BY created_at DESC`
  const result = await db.query(sql, params)
  return result.rows
})
