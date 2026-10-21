// server/utils/images.ts — penyimpanan foto upload di database (aman untuk Vercel/Netlify yang tidak punya disk permanen)
export const IMAGE_MAX_BYTES = 4 * 1024 * 1024 // batas body serverless ±4,5 MB; klien sudah mengompres sebelum kirim

let ready: Promise<unknown> | null = null
// Tabel dibuat otomatis saat upload pertama — tidak perlu menjalankan migrasi manual.
export const ensureImagesTable = () =>
  (ready ??= db
    .query(
      `CREATE TABLE IF NOT EXISTS uploaded_images (
         id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
         mime text NOT NULL,
         size integer NOT NULL,
         data bytea NOT NULL,
         created_at timestamptz NOT NULL DEFAULT now()
       )`
    )
    .catch((e: unknown) => {
      ready = null
      throw e
    }))

// Tentukan tipe gambar dari isi file (magic bytes), bukan dari klaim klien.
export const sniffImage = (b: Buffer): string | null => {
  if (b.length < 12) return null
  if (b[0] === 0xff && b[1] === 0xd8) return 'image/jpeg'
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png'
  const g = b.subarray(0, 6).toString('latin1')
  if (g === 'GIF87a' || g === 'GIF89a') return 'image/gif'
  if (b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP') return 'image/webp'
  if (b.subarray(4, 8).toString('latin1') === 'ftyp' && /avif|avis/.test(b.subarray(8, 12).toString('latin1'))) return 'image/avif'
  return null
}
