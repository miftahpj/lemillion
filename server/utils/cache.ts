// server/utils/cache.ts
// Cache in-memory sederhana (Map + TTL) untuk data publik yang jarang berubah
// (profile, services, testimonials, dst). Tujuannya dua:
//   1. CEPAT — request kedua dst tidak perlu nunggu round-trip ke Postgres
//      (apalagi Neon/Aiven serverless yang bisa "bangun tidur" kalau idle).
//   2. RINGAN — tidak nambah dependency (Redis dkk), cukup Map bawaan JS,
//      hidup selama proses server hidup (cocok untuk Vercel/Node long-lived
//      atau edge dengan warm instance).
//
// Dipakai di server/api/*.get.ts lewat cachedQuery(), dan di-invalidate
// otomatis dari handler PUT/PATCH yang relevan lewat invalidateCache().

type Entry = { value: any; expires: number }

const store = new Map<string, Entry>()

export async function cachedQuery<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const hit = store.get(key)
  if (hit && hit.expires > Date.now()) {
    return hit.value as T
  }
  const value = await fetcher()
  store.set(key, { value, expires: Date.now() + ttlMs })
  return value
}

// Panggil setelah admin ubah data (PUT/PATCH/DELETE) supaya perubahan
// langsung kelihatan di publik, tanpa nunggu TTL habis.
export function invalidateCache(prefix: string) {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key)
  }
}
