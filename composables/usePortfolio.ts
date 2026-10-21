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

  // Kompres di browser (maks 1600 px, WebP) supaya ringan & muat di batas body serverless, lalu upload.
  const compressImage = async (file: File, maxSide = 1600): Promise<Blob> => {
    if (file.type === 'image/gif') return file // jaga animasi
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
      const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height))
      const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w; canvas.height = h
      canvas.getContext('2d')!.drawImage(bmp, 0, 0, w, h)
      bmp.close?.()
      const webp = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/webp', 0.85))
      if (webp && webp.type === 'image/webp' && webp.size < file.size) return webp
      if (file.size <= 4 * 1024 * 1024) return file
      return (await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', 0.8))) ?? file
    } catch {
      return file
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar (JPG, PNG, WebP, GIF).')
    const blob = await compressImage(file)
    if (blob.size > 4 * 1024 * 1024) throw new Error('Ukuran gambar terlalu besar (maks 4 MB setelah dikompres).')
    const ext = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/png' ? 'png' : blob.type === 'image/gif' ? 'gif' : 'jpg'
    const fd = new FormData()
    fd.append('file', blob, `upload.${ext}`)
    const res: any = await $fetch('/api/upload', { method: 'POST', body: fd })
    return res.url as string
  }

  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return ''
    if (path.startsWith('http') || path.startsWith('/')) return path
    return `/${path}`
  }

  return { items: readonly(items), loading: readonly(loading), lastError: readonly(lastError), fetchPortfolio, createPortfolioItem, updatePortfolioItem, uploadImage, getImageUrl }
}
