// composables/useAuth.ts
// Session admin sederhana lewat cookie httpOnly yang di-set oleh server.
export const useAuth = () => {
  const user    = useState<{ email: string } | null>('auth_user', () => null)
  const loading = useState<boolean>('auth_loading', () => false)

  const fetchMe = async () => {
    try {
      const { user: u } = await $fetch<{ user: { email: string } | null }>('/api/auth/me')
      user.value = u
    } catch {
      user.value = null
    }
    return user.value
  }

  const login = async (email: string, password: string): Promise<{ ok: boolean; message?: string }> => {
    loading.value = true
    try {
      const res = await $fetch<{ email: string }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      user.value = { email: res.email }
      return { ok: true }
    } catch (e: any) {
      return { ok: false, message: e?.data?.statusMessage ?? 'Email atau password salah.' }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try { await $fetch('/api/auth/logout', { method: 'POST' }) } catch {}
    user.value = null
  }

  return { user: readonly(user), loading: readonly(loading), fetchMe, login, logout }
}
