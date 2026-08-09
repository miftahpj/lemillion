const ALLOWED_FIELDS = [
  'title', 'slug', 'category_id', 'description', 'story',
  'cover_url', 'image_url', 'gallery_urls', 'tags', 'year',
  'is_featured', 'is_published', 'sort_order',
  'client', 'location', 'role', 'tech_stack', 'repo_url', 'demo_url',
]

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
    `UPDATE portfolio SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
    values
  )

  invalidateCache('portfolio')
  return result.rows[0] ?? null
})
