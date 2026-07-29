// composables/useAvailability.ts
export const useAvailability = () => {
  const availability = useState<any[]>('availability_admin', () => [])

  const fetchAvailability = async () => {
    try { availability.value = await $fetch('/api/availability') }
    catch { availability.value = [] }
  }

  const updateStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      await $fetch(`/api/availability/${id}`, { method: 'PATCH', body: { status } })
      const item = availability.value.find((a: any) => a.id === id)
      if (item) item.status = status
      return true
    } catch { return false }
  }

  const statusConfig: Record<string, { label: string; tw: string }> = {
    open:    { label: 'Tersedia', tw: 'text-emerald-400/80 border-emerald-400/20 bg-emerald-400/5' },
    limited: { label: 'Terbatas', tw: 'text-yellow-400/80 border-yellow-400/20 bg-yellow-400/5' },
    full:    { label: 'Penuh',    tw: 'text-red-400/60 border-red-400/15 bg-red-400/5' },
  }

  return { availability: readonly(availability), fetchAvailability, updateStatus, statusConfig }
}
