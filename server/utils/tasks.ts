// server/utils/tasks.ts
// Tabel `tasks` untuk halaman /so (tugas kuliah Sistem Operasi).
// Dibuat otomatis saat pertama kali dipakai (sama seperti uploaded_images),
// jadi tidak perlu menjalankan migrasi SQL manual.

let ready: Promise<unknown> | null = null

const SEED = [
  {
    id: '5b7c0a11-0000-4000-8000-000000000001',
    title: 'Tugas 1',
    deadline: '2026-11-23',
    sort: 1,
    description: [
      'Sebuah *hard disk* memiliki **200 track** bernomor **0 hingga 199**. Saat ini posisi *head* berada pada **track 50**. Antrian permintaan akses *track* yang masuk secara berurutan adalah:',
      '`62, 170, 43, 150, 23, 16, 185, 123, 67, 43, 162, 23, 71, 111, 43, 178`',
      'Hitunglah total banyaknya lintasan yang dilewati menggunakan seluruh algoritma yang ada (buat dalam bentuk tabel) dan gambarkan arah proses yang terjadi secara lengkap!',
    ].join('\n\n'),
  },
  {
    id: '5b7c0a11-0000-4000-8000-000000000002',
    title: 'Tugas 2',
    deadline: '2026-11-30',
    sort: 2,
    description: [
      '| Nama Proses | Saat Tiba | Lama Proses |',
      '|---|---|---|',
      '| A | 0 | 8 |',
      '| B | 3 | 4 |',
      '| C | 5 | 7 |',
      '| D | 8 | 6 |',
      '| E | 12 | 5 |',
      '',
      'Hitunglah total dan rata-rata lama tanggap yang terjadi dengan menggunakan algoritma:',
      '',
      '1. FCFS / PTPD',
      '2. SJF / PTD',
      '3. SRT / PTDP',
      '4. HPRN / RPTD',
      '5. RR dengan:',
      '   a. kuantum = 3',
      '   b. kuantum = 5',
    ].join('\n'),
  },
]

export const ensureTasksTable = () =>
  (ready ??= (async () => {
    const existed = (await db.query(`SELECT to_regclass('public.tasks') AS t`)).rows[0]?.t
    await db.query(
      `CREATE TABLE IF NOT EXISTS tasks (
         id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
         title text NOT NULL,
         description text NOT NULL DEFAULT '',
         answer text NOT NULL DEFAULT '',
         images text[] NOT NULL DEFAULT '{}',
         deadline date,
         is_done boolean NOT NULL DEFAULT false,
         is_published boolean NOT NULL DEFAULT true,
         sort_order integer NOT NULL DEFAULT 0,
         created_at timestamptz NOT NULL DEFAULT now(),
         updated_at timestamptz NOT NULL DEFAULT now()
       )`
    )
    // Contoh awal (Tugas 1 dan 2) hanya dimasukkan sekali, saat tabel baru dibuat.
    if (!existed) {
      for (const s of SEED) {
        await db.query(
          `INSERT INTO tasks (id, title, description, deadline, sort_order)
           VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
          [s.id, s.title, s.description, s.deadline, s.sort]
        )
      }
    }
  })().catch((e: unknown) => {
    ready = null
    throw e
  }))

// Kolom yang dikirim ke klien (deadline diformat teks supaya tidak kena geser zona waktu)
export const TASK_COLUMNS = `id, title, description, answer, images,
  to_char(deadline, 'YYYY-MM-DD') AS deadline,
  is_done, is_published, sort_order, updated_at`

const TASK_FIELDS = ['title', 'description', 'answer', 'images', 'deadline', 'is_done', 'is_published', 'sort_order']

export const cleanTaskBody = (body: Record<string, any> | null | undefined): Record<string, any> => {
  const out: Record<string, any> = {}
  for (const [key, raw] of Object.entries(body || {})) {
    if (!TASK_FIELDS.includes(key) || raw === undefined) continue
    let v: any = raw
    if (key === 'title') {
      v = String(v ?? '').trim()
    } else if (key === 'description' || key === 'answer') {
      v = String(v ?? '').replace(/\r\n?/g, '\n').trim()
    } else if (key === 'images') {
      v = (Array.isArray(v) ? v : []).map((x: any) => String(x).trim()).filter(Boolean)
    } else if (key === 'deadline') {
      v = String(v ?? '').trim()
      if (v === '') v = null
      else if (!/^\d{4}-\d{2}-\d{2}$/.test(v) || Number.isNaN(Date.parse(v))) {
        throw createError({ statusCode: 400, statusMessage: 'Format deadline tidak valid.' })
      }
    } else if (key === 'is_done' || key === 'is_published') {
      v = v === true || v === 'true'
    } else if (key === 'sort_order') {
      v = Number(v)
      if (!Number.isFinite(v)) continue
    }
    out[key] = v
  }
  return out
}
