// composables/useTasks.ts — kelola tugas di panel admin (halaman /admin/so)
export const useTasks = () => {
  const items     = useState<any[]>('admin_tasks', () => [])
  const loading   = useState<boolean>('admin_tasks_loading', () => false)
  const lastError = useState<string>('admin_tasks_error', () => '')
  const errMsg = (e: any) => e?.data?.statusMessage || e?.statusMessage || e?.message || 'Terjadi kesalahan. Coba lagi.'

  const fetchTasks = async (silent = false) => {
    if (!silent) loading.value = true
    try { items.value = await $fetch('/api/tasks/admin') }
    catch (e) { console.warn('useTasks: gagal fetch', e); if (!silent) items.value = [] }
    finally { loading.value = false }
  }

  const run = async (fn: () => Promise<unknown>): Promise<boolean> => {
    lastError.value = ''
    try { await fn(); await fetchTasks(true); return true }
    catch (e) { lastError.value = errMsg(e); return false }
  }

  const createTask = (payload: Record<string, any>) => run(() => $fetch('/api/tasks', { method: 'POST', body: payload }))
  const updateTask = (id: string, payload: Record<string, any>) => run(() => $fetch(`/api/tasks/${id}`, { method: 'PATCH', body: payload }))
  const deleteTask = (id: string) => run(() => $fetch(`/api/tasks/${id}`, { method: 'DELETE' }))

  return { items: readonly(items), loading: readonly(loading), lastError: readonly(lastError), fetchTasks, createTask, updateTask, deleteTask }
}
