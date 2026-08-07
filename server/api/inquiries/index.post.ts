export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, any>>(event)

  const name = (body?.name || '').trim()
  const email = (body?.email || '').trim()
  const message = (body?.message || '').trim()

  if (!name || !email || !message) {
    throw createError({ statusCode: 400, statusMessage: 'Nama, email, dan pesan wajib diisi.' })
  }

  const result = await db.query(
    `INSERT INTO inquiries
      (name, email, phone, session_type, preferred_date, budget_range, location_pref, message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      name,
      email,
      body?.phone || null,
      body?.session_type || null,
      body?.preferred_date || null,
      body?.budget_range || null,
      body?.location_pref || null,
      message,
    ]
  )

  return result.rows[0]
})
