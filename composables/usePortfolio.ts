// composables/usePortfolio.ts — dipakai di panel admin untuk kelola daftar proyek
export const usePortfolio = () => {
  const items   = useState<any[]>('admin_portfolio_items', () => [])
  const loading = useState<boolean>('admin_portfolio_loading', () => false)

  const fetchPortfolio = async (categorySlug?: string) => {
    loading.value = true
    try {
      items.value = await $fetch('/api/portfolio', {
        query: categorySlug ? { category: categorySlug } : {},
      })
    } catch (e) {
      console.warn('usePortfolio: gagal fetch', e)
      items.value = []
    } finally {
      loading.value = false
    }
  }

  const updatePortfolioItem = async (id: string, payload: Record<string, any>): Promise<boolean> => {
    try {
      const updated: any = await $fetch(`/api/portfolio/${id}`, { method: 'PATCH', body: payload })
      const idx = items.value.findIndex((i: any) => i.id === id)
      if (idx > -1) items.value[idx] = { ...items.value[idx], ...updated }
      return true
    } catch (e) {
      console.warn('usePortfolio: gagal update', e)
      return false
    }
  }

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return ''
    if (path.startsWith('http') || path.startsWith('/')) return path
    return `/${path}`
  }

  return { items: readonly(items), loading: readonly(loading), fetchPortfolio, updatePortfolioItem, getImageUrl }
}
