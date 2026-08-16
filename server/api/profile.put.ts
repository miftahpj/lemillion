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
    // "updated_at = NOW()" penting supaya nilainya berubah tiap kali profil
    // (termasuk foto) di-update — dipakai sebagai cache-buster di frontend
    // biar browser tidak nampilin foto lama dari cache saat foto diganti
    // dengan nama file yang sama persis (mis. selalu "profile.webp").
    `UPDATE profile SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = (SELECT id FROM profile LIMIT 1) RETURNING *`,
    values
  )

  invalidateCache('profile')
  return result.rows[0] ?? null
})
