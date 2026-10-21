// GET /api/portfolio/admin — daftar SEMUA karya (termasuk Draft) khusus panel admin.
// Endpoint publik /api/portfolio hanya mengirim yang is_published = true.
export default defineEventHandler(async (event) => {
  requireAuth(event)
  const result = await db.query(
    `SELECT p.*,
      json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) AS categories
    FROM portfolio p
    LEFT JOIN categories c ON c.id = p.category_id
    ORDER BY p.sort_order ASC, p.created_at DESC`
  )
  return result.rows
})
