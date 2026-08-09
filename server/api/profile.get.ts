export default defineEventHandler(async () => {
  return cachedQuery('profile', 30_000, async () => {
    const result = await db.query('SELECT * FROM profile LIMIT 1')
    return result.rows[0] ?? null
  })
})
