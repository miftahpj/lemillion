export default defineEventHandler(async () => {
  const result = await db.query('SELECT * FROM availability ORDER BY year_month ASC')
  return result.rows
})
