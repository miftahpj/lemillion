// composables/usePortfolio.ts — dipakai di panel admin untuk kelola daftar proyek (tambah / edit / toggle)
export const usePortfolio = () => {
  const items     = useState<any[]>('admin_portfolio_items', () => [])
  const loading   = useState<boolean>('admin_portfolio_loading', () => false)
  const lastError = useState<string>('admin_portfolio_error', () => '')
  const errMsg = (e: any) => e?.data?.statusMessage || e?.statusMessage || e?.message || 'Terjadi kesalahan. Coba lagi.'

  // Pakai /api/portfolio/admin supaya karya berstatus Draft ikut tampil
  // (endpoint publik /api/portfolio hanya mengirim yang sudah published).
  const fetchPortfolio = async (silent = false) => {
    if (!silent) loading.value = true
    try {
      items.value = await $fetch('/api/portfolio/admin')
    } catch (e) {
      console.warn('usePortfolio: gagal fetch', e)
      if (!silent) items.value = []
    } finally {
      loading.value = false
    }
  }

  const createPortfolioItem = async (payload: Record<string, any>): Promise<boolean> => {
    lastError.value = ''
    try {
      await $fetch('/api/portfolio', { method: 'POST', body: payload })
      await fetchPortfolio(true)
      return true
    } catch (e) {
      lastError.value = errMsg(e)
      console.warn('usePortfolio: gagal tambah', e)
      return false
    }
  }

  const updatePortfolioItem = async (id: string, payload: Record<string, any>): Promise<boolean> => {
    lastError.value = ''
    try {
      await $fetch(`/api/portfolio/${id}`, { method: 'PATCH', body: payload })
      await fetchPortfolio(true)
      return true
    } catch (e) {
      lastError.value = errMsg(e)
      console.warn('usePortfolio: gagal update', e)
      return false
    }
  }

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return ''
    if (path.startsWith('http') || path.startsWith('/')) return path
    return `/${path}`
  }

  return { items: readonly(items), loading: readonly(loading), lastError: readonly(lastError), fetchPortfolio, createPortfolioItem, updatePortfolioItem, getImageUrl }
}
