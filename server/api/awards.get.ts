export default defineEventHandler(async () => {
  const result = await db.query('SELECT * FROM awards ORDER BY sort_order ASC')
  return result.rows
})
