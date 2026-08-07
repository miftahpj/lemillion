// composables/useInquiry.ts
export const useInquiry = () => {
  const inquiries  = useState<any[]>('inquiries', () => [])
  const loading    = useState<boolean>('inquiries_loading', () => false)
  const submitting = ref(false)
  const submitted  = ref(false)

  const submitInquiry = async (payload: Record<string, any>): Promise<boolean> => {
    submitting.value = true
    try {
      await $fetch('/api/inquiries', { method: 'POST', body: payload })
      submitted.value = true
      return true
    } catch (e) {
      console.warn('useInquiry: gagal submit', e)
      return false
    } finally {
      submitting.value = false
    }
  }

  const fetchInquiries = async (status?: string) => {
    loading.value = true
    try {
      inquiries.value = await $fetch('/api/inquiries', { query: status ? { status } : {} })
    } catch (e) {
      inquiries.value = []
    } finally {
      loading.value = false
    }
  }

  const updateInquiry = async (id: string, payload: Record<string, any>): Promise<boolean> => {
    try {
      await $fetch(`/api/inquiries/${id}`, { method: 'PATCH', body: payload })
      const idx = inquiries.value.findIndex((i: any) => i.id === id)
      if (idx > -1) inquiries.value[idx] = { ...inquiries.value[idx], ...payload }
      return true
    } catch { return false }
  }

  const deleteInquiry = async (id: string): Promise<boolean> => {
    try {
      await $fetch(`/api/inquiries/${id}`, { method: 'DELETE' })
      inquiries.value = inquiries.value.filter((i: any) => i.id !== id)
      return true
    } catch { return false }
  }

  const countByStatus = computed(() => ({
    new:     inquiries.value.filter((i: any) => i.status === 'new').length,
    read:    inquiries.value.filter((i: any) => i.status === 'read').length,
    replied: inquiries.value.filter((i: any) => i.status === 'replied').length,
    closed:  inquiries.value.filter((i: any) => i.status === 'closed').length,
    spam:    inquiries.value.filter((i: any) => i.status === 'spam').length,
  }))

  return {
    inquiries: readonly(inquiries), loading: readonly(loading),
    submitting: readonly(submitting), submitted: readonly(submitted),
    countByStatus, submitInquiry, fetchInquiries, updateInquiry, deleteInquiry,
  }
}
