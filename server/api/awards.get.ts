export default defineEventHandler(async () => {
  return cachedQuery('awards', 60_000, async () => {
    const result = await db.query('SELECT * FROM awards ORDER BY sort_order ASC')
    return result.rows
  })
})
