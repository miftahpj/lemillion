// composables/useSiteData.ts
// Satu composable untuk fetch semua data publik dari API kita sendiri
// (yang di baliknya bicara ke Aiven PostgreSQL). Dipakai di semua halaman publik.

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
    try {
      profile.value = await $fetch('/api/profile')
    } catch (e) { console.warn('[useSiteData] fetchProfile gagal', e) }
    return profile.value
  }

  const fetchPortfolio = async (categorySlug?: string) => {
    try {
      const data = await $fetch('/api/portfolio', {
        query: categorySlug && categorySlug !== 'all' ? { category: categorySlug } : {},
      })
      portfolioList.value = data as any[]
    } catch (e) { console.warn('[useSiteData] fetchPortfolio gagal', e) }
    return portfolioList.value
  }

  const fetchFeaturedPortfolio = async (limit = 6) => {
    try {
      return await $fetch('/api/portfolio', { query: { featured: 'true', limit } })
    } catch (e) { console.warn('[useSiteData] fetchFeaturedPortfolio gagal', e); return [] }
  }

  const fetchPortfolioItem = async (id: string) => {
    try {
      return await $fetch(`/api/portfolio/${id}`)
    } catch (e) { return null }
  }

  const fetchServices = async () => {
    if (servicesList.value.length) return servicesList.value
    try {
      servicesList.value = await $fetch('/api/services')
    } catch (e) { console.warn('[useSiteData] fetchServices gagal', e) }
    return servicesList.value
  }

  const fetchTestimonials = async (featuredOnly = false) => {
    try {
      testimonials.value = await $fetch('/api/testimonials', {
        query: featuredOnly ? { featured: 'true' } : {},
      })
    } catch (e) { console.warn('[useSiteData] fetchTestimonials gagal', e) }
    return testimonials.value
  }

  const fetchAwards = async () => {
    if (awards.value.length) return awards.value
    try {
      awards.value = await $fetch('/api/awards')
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
      categories.value = await $fetch('/api/categories')
    } catch (e) { console.warn('[useSiteData] fetchCategories gagal', e) }
    return categories.value
  }

  // ─── FETCH ALL (homepage) ───
  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      const [, featured] = await Promise.all([
        fetchProfile(),
        fetchFeaturedPortfolio(6),
        fetchServices(),
        fetchTestimonials(true),
        fetchAwards(),
        fetchCategories(),
      ])
      if (Array.isArray(featured)) portfolioList.value = featured
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
  const getProfileImageUrl = getImageUrl

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
