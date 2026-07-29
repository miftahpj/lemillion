const ALLOWED_FIELDS = [
  'name', 'tagline', 'bio', 'bio_extended',
  'avatar_url', 'hero_image_url', 'signature_url',
  'location', 'email', 'whatsapp', 'github', 'linkedin', 'website',
  'years_experience', 'projects_count', 'certifications_count', 'clients_count',
]

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const body = await readBody<Record<string, any>>(event)

  const entries = Object.entries(body || {}).filter(([key]) => ALLOWED_FIELDS.includes(key))
  if (entries.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Tidak ada field valid untuk diupdate.' })
  }

  const setClauses = entries.map(([key], i) => `${key} = $${i + 1}`)
  const values = entries.map(([, value]) => value)

  const result = await db.query(
    `UPDATE profile SET ${setClauses.join(', ')} WHERE id = (SELECT id FROM profile LIMIT 1) RETURNING *`,
    values
  )

  return result.rows[0] ?? null
})
