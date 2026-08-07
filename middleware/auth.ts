export default defineNuxtRouteMiddleware(async (to) => {
  // Cuma perlu dicek di halaman admin & login — biar ga nembak API tiap navigasi publik
  if (!to.path.startsWith('/admin') && to.path !== '/login') return

  const { user, fetchMe } = useAuth()
  if (!user.value) await fetchMe()

  if (to.path.startsWith('/admin') && !user.value) {
    return navigateTo('/login', { replace: true })
  }
  if (to.path === '/login' && user.value) {
    return navigateTo('/admin', { replace: true })
  }
})
