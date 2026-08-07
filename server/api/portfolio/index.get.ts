export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const categorySlug = query.category as string | undefined
  const featuredOnly = query.featured === 'true'
  const limit = query.limit ? Number(query.limit) : null

  const conditions: string[] = ['p.is_published = true']
  const params: any[] = []

  if (categorySlug && categorySlug !== 'all') {
    params.push(categorySlug)
    conditions.push(`c.slug = $${params.length}`)
  }
  if (featuredOnly) {
    conditions.push('p.is_featured = true')
  }

  let sql = `
    SELECT p.*,
      json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) AS categories
    FROM portfolio p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY p.sort_order ASC
  `
  if (limit) {
    params.push(limit)
    sql += ` LIMIT $${params.length}`
  }

  const result = await db.query(sql, params)
  return result.rows
})
