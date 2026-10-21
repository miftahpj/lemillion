// server/utils/portfolio.ts
// Field yang boleh ditulis dari panel admin + normalisasi tipe. Dipakai bersama oleh
// POST /api/portfolio (tambah) dan PATCH /api/portfolio/:id (edit penuh).
export const PORTFOLIO_FIELDS = [
  'title', 'slug', 'category_id', 'description', 'story',
  'cover_url', 'image_url', 'gallery_urls', 'tags', 'year',
  'is_featured', 'is_published', 'sort_order',
  'client', 'location', 'role', 'tech_stack', 'repo_url', 'demo_url',
]
const NULLABLE = ['slug', 'category_id', 'story', 'client', 'location', 'role', 'tech_stack', 'repo_url', 'demo_url']
const ARRAYS = ['gallery_urls', 'tags']
const NUMBERS = ['year', 'sort_order']
const BOOLS = ['is_featured', 'is_published']

export const slugify = (s: string): string =>
  s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)

export const cleanPortfolioBody = (body: Record<string, any> | null | undefined): Record<string, any> => {
  const out: Record<string, any> = {}
  for (const [key, raw] of Object.entries(body || {})) {
    if (!PORTFOLIO_FIELDS.includes(key) || raw === undefined) continue
    let v: any = raw
    if (typeof v === 'string') v = v.trim()
    if (ARRAYS.includes(key)) {
      const sep = key === 'tags' ? /[\n,]+/ : /\n+/
      v = (Array.isArray(v) ? v : String(v ?? '').split(sep)).map((x: any) => String(x).trim()).filter(Boolean)
    } else if (NUMBERS.includes(key)) {
      v = Number(v)
      if (!Number.isFinite(v)) continue
    } else if (BOOLS.includes(key)) {
      v = v === true || v === 'true'
    } else if (NULLABLE.includes(key) && v === '') {
      v = null
    }
    out[key] = v
  }
  return out
}
