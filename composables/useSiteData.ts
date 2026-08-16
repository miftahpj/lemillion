// composables/useSiteData.ts
// Satu composable untuk fetch semua data publik dari API kita sendiri
// (yang di baliknya bicara ke Neon PostgreSQL). Dipakai di semua halaman publik.

export const useSiteData = () => {
  // ─── STATE (di-cache lewat useState, jadi ga fetch ulang antar-komponen) ───
  const profile       = useState<any | null>('site_profile',      () => null)
  const portfolioList = useState<any[]>('site_portfolio',         () => [])
  const servicesList  = useState<any[]>('site_services',          () => [])
  const testimonials  = useState<any[]>('site_testimonials',      () => [])
  const awards        = useState<any[]>('site_awards',            () => [])
  const availability  = useState<any[]>('site_availability',      () => [])
  const categories    = useState<any[]>('site_categories',        () => [])

  const loading = useState<boolean>('site_loading', () => false)
  const error   = useState<string | null>('site_error', () => null)

  const fetchProfile = async () => {
    if (profile.value) return profile.value
    try {
      const { data } = await useAsyncData('bootstrap:profile', () => $fetch('/api/profile'))
      profile.value = data.value
    } catch (e) { console.warn('[useSiteData] fetchProfile gagal', e) }
    return profile.value
  }

  const fetchPortfolio = async (categorySlug?: string) => {
    try {
      const key = `bootstrap:portfolio:${categorySlug ?? 'all'}`
      const { data } = await useAsyncData(key, () => $fetch('/api/portfolio', {
        query: categorySlug && categorySlug !== 'all' ? { category: categorySlug } : {},
      }))
      portfolioList.value = (data.value as any[]) ?? []
    } catch (e) { console.warn('[useSiteData] fetchPortfolio gagal', e) }
    return portfolioList.value
  }

  const fetchFeaturedPortfolio = async (limit = 6) => {
    try {
      const { data } = await useAsyncData(`bootstrap:portfolio:featured:${limit}`, () =>
        $fetch('/api/portfolio', { query: { featured: 'true', limit } }))
      return data.value ?? []
    } catch (e) { console.warn('[useSiteData] fetchFeaturedPortfolio gagal', e); return [] }
  }

  const fetchPortfolioItem = async (id: string) => {
    try {
      const { data } = await useAsyncData(`bootstrap:portfolio-item:${id}`, () => $fetch(`/api/portfolio/${id}`))
      return data.value
    } catch (e) { return null }
  }

  const fetchServices = async () => {
    if (servicesList.value.length) return servicesList.value
    try {
      const { data } = await useAsyncData('bootstrap:services', () => $fetch('/api/services'))
      servicesList.value = (data.value as any[]) ?? []
    } catch (e) { console.warn('[useSiteData] fetchServices gagal', e) }
    return servicesList.value
  }

  const fetchTestimonials = async (featuredOnly = false) => {
    try {
      const key = `bootstrap:testimonials:${featuredOnly}`
      const { data } = await useAsyncData(key, () => $fetch('/api/testimonials', {
        query: featuredOnly ? { featured: 'true' } : {},
      }))
      testimonials.value = (data.value as any[]) ?? []
    } catch (e) { console.warn('[useSiteData] fetchTestimonials gagal', e) }
    return testimonials.value
  }

  const fetchAwards = async () => {
    if (awards.value.length) return awards.value
    try {
      const { data } = await useAsyncData('bootstrap:awards', () => $fetch('/api/awards'))
      awards.value = (data.value as any[]) ?? []
    } catch (e) { console.warn('[useSiteData] fetchAwards gagal', e) }
    return awards.value
  }

  const fetchAvailability = async () => {
    if (availability.value.length) return availability.value
    try {
      availability.value = await $fetch('/api/availability')
    } catch (e) { console.warn('[useSiteData] fetchAvailability gagal', e) }
    return availability.value
  }

  const fetchCategories = async () => {
    if (categories.value.length) return categories.value
    try {
      const { data } = await useAsyncData('bootstrap:categories', () => $fetch('/api/categories'))
      categories.value = (data.value as any[]) ?? []
    } catch (e) { console.warn('[useSiteData] fetchCategories gagal', e) }
    return categories.value
  }

  // ─── FETCH ALL (homepage) ───
  // Pakai useAsyncData supaya jalan di SERVER saat render pertama (SSR) —
  // hasilnya langsung ikut di HTML yang dikirim ke browser, jadi tidak ada
  // jeda "kosong dulu baru keisi" seperti kalau fetch di onMounted (client-only).
  // Nuxt otomatis simpan hasilnya di payload, jadi saat hydrate di browser
  // TIDAK fetch ulang (hemat 1 round-trip lagi).
  const fetchAll = async () => {
    if (profile.value && servicesList.value.length) return
    loading.value = true
    error.value = null
    try {
      const { data } = await useAsyncData('bootstrap:home', async () => {
        const [profileData, featured, services, testimonialsData, awardsData, categoriesData] = await Promise.all([
          $fetch('/api/profile'),
          $fetch('/api/portfolio', { query: { featured: 'true', limit: 6 } }),
          $fetch('/api/services'),
          $fetch('/api/testimonials', { query: { featured: 'true' } }),
          $fetch('/api/awards'),
          $fetch('/api/categories'),
        ])
        return { profileData, featured, services, testimonialsData, awardsData, categoriesData }
      })

      if (data.value) {
        profile.value      = data.value.profileData
        portfolioList.value = Array.isArray(data.value.featured) ? data.value.featured : []
        servicesList.value = data.value.services as any[]
        testimonials.value = data.value.testimonialsData as any[]
        awards.value        = data.value.awardsData as any[]
        categories.value    = data.value.categoriesData as any[]
      }
    } catch (e: any) {
      error.value = e?.message ?? 'Gagal memuat data'
      console.error('[useSiteData] fetchAll error:', e)
    } finally {
      loading.value = false
    }
  }

  // ─── IMAGE URL HELPER ───
  // Tanpa storage bucket (bukan Supabase lagi): kalau sudah full URL, pakai apa
  // adanya; kalau berupa path lokal, anggap file ada di /public.
  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return ''
    if (path.startsWith('http') || path.startsWith('/')) return path
    return `/${path}`
  }

  // Khusus foto profil (avatar/hero/signature): file-nya sering diganti
  // lewat panel admin TAPI dengan nama file yang sama persis (mis. selalu
  // "profile.webp"). Kalau URL tidak berubah, browser akan tetap pakai versi
  // LAMA dari cache walau file di server sudah baru — makanya foto lama
  // "nyangkut" terus meski di database sudah ter-update.
  // Solusinya: tempelkan query `?v=<updated_at profil>` di belakang URL-nya.
  // Setiap kali profil di-update (termasuk ganti foto), `updated_at` ikut
  // berubah → URL-nya jadi "baru" di mata browser → foto lama otomatis
  // di-fetch ulang, tanpa perlu selalu mem-bypass cache di kunjungan lain.
  const getProfileImageUrl = (path: string | null | undefined): string => {
    const url = getImageUrl(path)
    if (!url) return url
    const raw = profile.value?.updated_at
    const version = raw ? new Date(raw).getTime() : null
    if (!version) return url
    return `${url}${url.includes('?') ? '&' : '?'}v=${version}`
  }

  // ─── FORMAT PRICE ───
  const formatPrice = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

  return {
    profile:       readonly(profile),
    portfolioList: readonly(portfolioList),
    servicesList:  readonly(servicesList),
    testimonials:  readonly(testimonials),
    awards:        readonly(awards),
    availability:  readonly(availability),
    categories:    readonly(categories),
    loading:       readonly(loading),
    error:         readonly(error),
    fetchAll,
    fetchProfile,
    fetchPortfolio,
    fetchFeaturedPortfolio,
    fetchPortfolioItem,
    fetchServices,
    fetchTestimonials,
    fetchAwards,
    fetchAvailability,
    fetchCategories,
    getImageUrl,
    getProfileImageUrl,
    formatPrice,
  }
}
