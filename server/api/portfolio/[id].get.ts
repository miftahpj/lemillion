export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  return cachedQuery(`portfolio-item:${id}`, 30_000, async () => {
    const itemResult = await db.query(
      `SELECT p.*,
        json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) AS categories
      FROM portfolio p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1 AND p.is_published = true`,
      [id]
    )

    const item = itemResult.rows[0]
    if (!item) {
      throw createError({ statusCode: 404, statusMessage: 'Karya tidak ditemukan.' })
    }

    const relatedResult = await db.query(
      `SELECT p.id, p.title, p.year, p.cover_url,
        json_build_object('name', c.name, 'slug', c.slug) AS categories
      FROM portfolio p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.category_id = $1 AND p.is_published = true AND p.id != $2
      ORDER BY p.sort_order ASC LIMIT 3`,
      [item.category_id, item.id]
    )

    return { item, related: relatedResult.rows }
  })
})
