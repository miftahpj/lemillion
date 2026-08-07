export default defineEventHandler(async (event) => {
  const session = getAdminSession(event)
  return { user: session }
})
