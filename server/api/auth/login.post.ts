export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event)
  const config = useRuntimeConfig()

  const email = (body?.email || '').trim().toLowerCase()
  const password = body?.password || ''

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email dan password wajib diisi.' })
  }

  if (!config.adminPasswordHash) {
    throw createError({
      statusCode: 500,
      statusMessage: 'ADMIN_PASSWORD_HASH belum diatur di server. Jalankan scripts/hash-password.mjs.',
    })
  }

  const validEmail = email === config.adminEmail.toLowerCase()
  const validPassword = verifyPassword(password, config.adminPasswordHash)

  if (!validEmail || !validPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Email atau password salah.' })
  }

  setSessionCookie(event, email)
  return { email }
})
