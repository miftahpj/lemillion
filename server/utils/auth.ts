// server/utils/auth.ts
// Auth admin sederhana & ringan — tanpa Supabase Auth, tanpa library
// eksternal tambahan. Password di-hash dengan scrypt (built-in Node crypto),
// session berupa cookie yang ditandatangani (HMAC) supaya tidak bisa dipalsukan.
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const SESSION_COOKIE = 'lemillion_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 14 // 14 hari

// ── Password hashing ──
export const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export const verifyPassword = (password: string, stored: string): boolean => {
  if (!stored || !stored.includes(':')) return false
  const [salt, hash] = stored.split(':')
  const hashBuffer = Buffer.from(hash, 'hex')
  const attempt = scryptSync(password, salt, 64)
  if (attempt.length !== hashBuffer.length) return false
  return timingSafeEqual(attempt, hashBuffer)
}

// ── Signed session token ──
const sign = (value: string, secret: string) =>
  createHmac('sha256', secret).update(value).digest('hex')

export const createSessionToken = (email: string, secret: string): string => {
  const expires = Date.now() + SESSION_MAX_AGE * 1000
  const payload = `${email}.${expires}`
  const signature = sign(payload, secret)
  return `${payload}.${signature}`
}

export const verifySessionToken = (token: string, secret: string): { email: string } | null => {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [email, expiresStr, signature] = parts
  const payload = `${email}.${expiresStr}`
  const expected = sign(payload, secret)

  const sigBuffer = Buffer.from(signature)
  const expBuffer = Buffer.from(expected)
  if (sigBuffer.length !== expBuffer.length || !timingSafeEqual(sigBuffer, expBuffer)) return null

  if (Date.now() > Number(expiresStr)) return null
  return { email }
}

export const setSessionCookie = (event: H3Event, email: string) => {
  const config = useRuntimeConfig()
  const token = createSessionToken(email, config.sessionSecret)
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export const clearSessionCookie = (event: H3Event) => {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export const getAdminSession = (event: H3Event): { email: string } | null => {
  const config = useRuntimeConfig()
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return null
  return verifySessionToken(token, config.sessionSecret)
}

// Panggil di awal setiap API route yang butuh login admin.
export const requireAuth = (event: H3Event): { email: string } => {
  const session = getAdminSession(event)
  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Belum login.' })
  }
  return session
}
