// composables/useProfile.ts — dipakai di panel admin untuk baca & edit profil
export const useProfile = () => {
  const profile = useState<any | null>('admin_profile', () => null)

  const fetchProfile = async () => {
    try { profile.value = await $fetch('/api/profile') }
    catch (e) { console.warn('useProfile: gagal fetch', e) }
  }

  const updateProfile = async (payload: Record<string, any>): Promise<boolean> => {
    try {
      const updated = await $fetch('/api/profile', { method: 'PUT', body: payload })
      profile.value = updated
      return true
    } catch (e) {
      console.warn('useProfile: gagal update', e)
      return false
    }
  }

  return { profile: readonly(profile), fetchProfile, updateProfile }
}
