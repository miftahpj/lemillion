// server/utils/db.ts
// Koneksi ke Aiven for PostgreSQL. Satu Pool dipakai ulang di seluruh
// request (bukan bikin koneksi baru tiap kali) supaya ringan di server.
import { Pool } from 'pg'

let pool: Pool | null = null

export const getPool = (): Pool => {
  if (pool) return pool

  const config = useRuntimeConfig()
  const connectionString = config.aivenDatabaseUrl

  if (!connectionString) {
    throw createError({
      statusCode: 500,
      statusMessage: 'AIVEN_DATABASE_URL belum diatur. Cek file .env.',
    })
  }

  pool = new Pool({
    connectionString,
    // Aiven mewajibkan SSL. CA aiven biasanya sudah dipercaya oleh Node,
    // tapi kalau perlu strict verification, taruh ca-certificate.pem
    // Aiven kamu di server/ca.pem lalu baca via fs.readFileSync di sini.
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  })

  return pool
}

// Helper query singkat
export const db = {
  query: (text: string, params?: any[]) => getPool().query(text, params),
}
