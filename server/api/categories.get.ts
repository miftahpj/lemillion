export default defineEventHandler(async () => {
  return cachedQuery('categories', 60_000, async () => {
    const result = await db.query(
      'SELECT * FROM categories WHERE is_active = true ORDER BY sort_order ASC'
    )
    return result.rows
  })
})
