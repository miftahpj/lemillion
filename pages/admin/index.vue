<template>
  <div class="min-h-screen bg-[#080604] flex font-body">
    <!-- Sidebar -->
    <aside class="w-56 min-h-screen bg-[#0C0A07] border-r fixed left-0 top-0 flex flex-col z-40" style="border-color:rgba(201,150,58,0.08);">
      <div class="px-6 py-7 border-b" style="border-color:rgba(201,150,58,0.08);">
        <NuxtLink to="/">
          <p class="font-display text-base tracking-[0.35em] gold-text uppercase">Lemillion</p>
          <p class="font-mono text-[8px] tracking-[0.4em] uppercase mt-1" style="color:rgba(245,240,232,0.15);">Admin Panel</p>
        </NuxtLink>
      </div>

      <nav class="flex-1 py-4 px-3 space-y-0.5">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
          class="flex items-center gap-3 px-4 py-3 transition-all duration-200 font-mono text-[10px] tracking-widest uppercase"
          active-class="bg-[#C9963A]/8 border border-[#C9963A]/15 text-[#C9963A]"
          :style="'color:rgba(245,240,232,0.25);'"
        >
          <span class="text-base select-none flex-shrink-0">{{ item.icon }}</span>
          {{ item.label }}
          <span v-if="item.badge && item.badge > 0" class="ml-auto font-mono text-[8px] px-1.5 py-0.5" style="background:rgba(201,150,58,0.15);color:#C9963A;border:1px solid rgba(201,150,58,0.25);">{{ item.badge }}</span>
        </NuxtLink>
      </nav>

      <div class="px-6 py-5 border-t" style="border-color:rgba(201,150,58,0.08);">
        <p class="font-mono text-[8px] tracking-widest uppercase truncate mb-3" style="color:rgba(245,240,232,0.15);">{{ user?.email }}</p>
        <button @click="signOut" class="font-mono text-[9px] tracking-widest uppercase transition-colors hover:text-[#C9963A]" style="color:rgba(201,150,58,0.35);">Sign Out →</button>
      </div>
    </aside>

    <!-- Main -->
    <main class="ml-56 flex-1 p-8 min-h-screen">
      <!-- Realtime toast -->
      <Transition name="toast">
        <div v-if="toast" class="fixed top-6 right-6 z-50 flex items-center gap-4 px-6 py-4 border shadow-lg" style="background:#0C0A07; border-color:rgba(201,150,58,0.3);">
          <span style="color:#C9963A;">✦</span>
          <div>
            <p class="font-mono text-[10px] tracking-widest uppercase" style="color:#C9963A;">Inquiry Baru!</p>
            <p class="font-body text-sm mt-0.5" style="color:rgba(245,240,232,0.55);">{{ toast.name }} — {{ toast.session_type ?? 'Umum' }}</p>
          </div>
          <button @click="toast = null" class="ml-4 text-xl" style="color:rgba(245,240,232,0.2);">✕</button>
        </div>
      </Transition>

      <!-- Dashboard overview -->
      <div class="mb-8">
        <p class="font-mono text-[9px] tracking-[0.5em] uppercase mb-2" style="color:rgba(201,150,58,0.4);">// Overview</p>
        <h1 class="font-display text-4xl uppercase tracking-wide gold-text">Dashboard</h1>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div v-for="stat in dashStats" :key="stat.label" class="border p-6 hover:border-[#C9963A]/20 transition-colors" style="border-color:rgba(201,150,58,0.10); background:rgba(255,255,255,0.01);">
          <p class="font-mono text-[8px] tracking-[0.35em] uppercase mb-3" style="color:rgba(201,150,58,0.38);">{{ stat.label }}</p>
          <p class="font-display text-4xl gold-text tracking-tight">{{ stat.value }}</p>
          <p v-if="stat.sub" class="font-body text-xs mt-2" style="color:rgba(245,240,232,0.18);">{{ stat.sub }}</p>
        </div>
      </div>

      <!-- Recent inquiries -->
      <div class="border" style="border-color:rgba(201,150,58,0.10); background:rgba(255,255,255,0.01);">
        <div class="flex items-center justify-between px-6 py-4 border-b" style="border-color:rgba(201,150,58,0.08);">
          <div class="flex items-center gap-3">
            <p class="font-mono text-[10px] tracking-widest uppercase" style="color:rgba(245,240,232,0.28);">Inquiry Terbaru</p>
            <span v-if="countByStatus.new > 0" class="font-mono text-[8px] px-2 py-0.5 border" style="background:rgba(201,150,58,0.12);color:#C9963A;border-color:rgba(201,150,58,0.22);">{{ countByStatus.new }} baru</span>
          </div>
          <NuxtLink to="/admin/inquiries" class="font-mono text-[9px] tracking-widest uppercase hover:text-[#C9963A] transition-colors" style="color:rgba(201,150,58,0.35);">Lihat Semua →</NuxtLink>
        </div>
        <div class="divide-y" style="border-color:rgba(201,150,58,0.06);">
          <div v-for="inq in latestInquiries" :key="inq.id" class="px-6 py-4 flex items-center gap-4 hover:bg-white/1 transition-colors">
            <div class="w-2 h-2 rounded-full flex-shrink-0" :class="{ 'bg-yellow-400 animate-pulse': inq.status === 'new', 'bg-blue-400/50': inq.status === 'read', 'bg-emerald-400/50': inq.status === 'replied', 'bg-white/15': inq.status === 'closed' }" />
            <div class="flex-1 min-w-0">
              <p class="font-body text-sm truncate" style="color:rgba(245,240,232,0.65);">{{ inq.name }}</p>
              <p class="font-mono text-[9px] truncate" style="color:rgba(245,240,232,0.22);">{{ inq.email }}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <p class="font-mono text-[9px] tracking-widest uppercase" style="color:rgba(201,150,58,0.45);">{{ inq.session_type ?? '—' }}</p>
              <p class="font-mono text-[8px] mt-0.5" style="color:rgba(245,240,232,0.15);">{{ formatDate(inq.created_at) }}</p>
            </div>
          </div>
          <div v-if="latestInquiries.length === 0" class="px-6 py-10 text-center">
            <p class="font-serif italic" style="color:rgba(245,240,232,0.18);">Belum ada inquiry masuk.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: ['auth'] })
useHead({ title: 'Admin Dashboard — Lemillion' })

const { user, fetchMe, logout } = useAuth()
const { inquiries, countByStatus, fetchInquiries } = useInquiry()

const toast = ref<any>(null)
const latestInquiries = computed(() => [...inquiries.value].slice(0, 8))

const dashStats = computed(() => [
  { label: 'Inquiry Baru',  value: countByStatus.value.new,              sub: `${inquiries.value.length} total` },
  { label: 'Dibalas',       value: countByStatus.value.replied,          sub: 'sudah direspons' },
  { label: 'Selesai',       value: countByStatus.value.closed,           sub: 'ditutup' },
  { label: 'Bulan Ini',     value: latestInquiries.value.length,         sub: 'inquiry masuk' },
])

const navItems = computed(() => [
  { to: '/admin',              icon: '◈',  label: 'Overview' },
  { to: '/admin/inquiries',    icon: '✉️',  label: 'Inquiries', badge: countByStatus.value.new },
  { to: '/admin/portfolio',    icon: '🖼️',  label: 'Portfolio' },
  { to: '/admin/availability', icon: '📅',  label: 'Kalender' },
  { to: '/admin/profile',      icon: '👤',  label: 'Profil' },
])

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })

const signOut = async () => {
  await logout()
  navigateTo('/login')
}

// Aiven/pg biasa tidak punya realtime bawaan seperti Supabase, jadi cukup
// polling ringan tiap 30 detik untuk cek inquiry baru (hemat, tidak butuh websocket).
let pollTimer: ReturnType<typeof setInterval> | undefined
onMounted(async () => {
  await fetchMe()
  await fetchInquiries()
  let lastKnownId = inquiries.value[0]?.id

  pollTimer = setInterval(async () => {
    const prevNewest = inquiries.value[0]?.id
    await fetchInquiries()
    const newest = inquiries.value[0]
    if (newest && newest.id !== prevNewest && newest.id !== lastKnownId) {
      toast.value = newest
      lastKnownId = newest.id
      setTimeout(() => { toast.value = null }, 5000)
    }
  }, 30_000)
})
onUnmounted(() => { if (pollTimer) clearInterval(pollTimer) })
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.4s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(20px); }
</style>
