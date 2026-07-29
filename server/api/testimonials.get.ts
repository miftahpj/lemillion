export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const featuredOnly = query.featured === 'true'

  const conditions = ['is_published = true']
  if (featuredOnly) conditions.push('is_featured = true')

  const result = await db.query(
    `SELECT * FROM testimonials WHERE ${conditions.join(' AND ')} ORDER BY sort_order ASC`
  )
  return result.rows
})
