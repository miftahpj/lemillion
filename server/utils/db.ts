// server/utils/db.ts
// Koneksi ke Neon Postgres. Satu Pool dipakai ulang di seluruh
// request (bukan bikin koneksi baru tiap kali) supaya ringan di server.
import { Pool } from 'pg'

let pool: Pool | null = null

export const getPool = (): Pool => {
  if (pool) return pool

  const config = useRuntimeConfig()
  const connectionString = config.databaseUrl

  if (!connectionString) {
    throw createError({
      statusCode: 500,
      statusMessage: 'DATABASE_URL belum diatur. Cek file .env.',
    })
  }

  pool = new Pool({
    connectionString,
    // Neon pakai certificate yang sudah dipercaya publik, jadi
    // rejectUnauthorized: true aman (beda dari beberapa provider lain
    // yang butuh :false). sslmode=require di connection string sudah cukup,
    // opsi ini cuma jaga-jaga kalau string koneksinya tidak menyertakannya.
    ssl: { rejectUnauthorized: true },
    // Neon serverless Postgres men-scale-to-zero saat idle, jadi koneksi
    // pertama setelah idle lama bisa butuh waktu ekstra untuk "wake up".
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 15_000,
  })

  return pool
}

// Helper query singkat
export const db = {
  query: (text: string, params?: any[]) => getPool().query(text, params),
}
