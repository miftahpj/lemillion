<template>
  <div class="min-h-screen bg-[#080604] flex font-body">
    <aside class="w-56 min-h-screen bg-[#0C0A07] border-r fixed left-0 top-0 flex flex-col z-40" style="border-color:rgba(201,150,58,0.08);">
      <div class="px-6 py-7 border-b" style="border-color:rgba(201,150,58,0.08);">
        <NuxtLink to="/"><p class="font-display text-base tracking-[0.35em] gold-text uppercase">Lemillion</p></NuxtLink>
      </div>
      <nav class="flex-1 py-4 px-3 space-y-0.5">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="flex items-center gap-3 px-4 py-3 transition-all font-mono text-[10px] tracking-widest uppercase" active-class="bg-[#C9963A]/8 border border-[#C9963A]/15 text-[#C9963A]" style="color:rgba(245,240,232,0.25);">
          <span class="text-base select-none">{{ item.icon }}</span>{{ item.label }}
        </NuxtLink>
      </nav>
      <div class="px-6 py-5 border-t" style="border-color:rgba(201,150,58,0.08);">
        <button @click="signOut" class="font-mono text-[9px] tracking-widest uppercase hover:text-[#C9963A] transition-colors" style="color:rgba(201,150,58,0.35);">Sign Out →</button>
      </div>
    </aside>
    <main class="ml-56 flex-1 p-8">
      <div class="mb-8">
        <p class="font-mono text-[9px] tracking-[0.5em] uppercase mb-2" style="color:rgba(201,150,58,0.4);">// Kelola</p>
        <h1 class="font-display text-3xl uppercase tracking-wide gold-text">Ketersediaan</h1>
      </div>
      <div class="h-px mb-8 opacity-15" style="background:linear-gradient(to right,transparent,#C9963A,transparent);" />
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="avail in availability" :key="avail.id" class="border p-5" style="border-color:rgba(201,150,58,0.10); background:rgba(255,255,255,0.01);">
          <p class="font-body text-sm mb-5" style="color:rgba(245,240,232,0.55);">{{ avail.month }}</p>
          <div class="space-y-2">
            <button v-for="st in ['open','limited','full']" :key="st" @click="updateStatus(avail.id, st)"
              class="w-full font-mono text-[9px] tracking-widest uppercase py-2.5 border transition-all duration-200"
              :class="avail.status === st ? statusConfig[st].tw : 'border-white/6 text-white/18 hover:border-white/15'"
            >{{ statusConfig[st].label }}</button>
          </div>
        </div>
      </div>
      <p v-if="availability.length === 0" class="text-center py-10 font-serif italic" style="color:rgba(245,240,232,0.2);">Data availability belum ada. Jalankan neon/02_seed.sql terlebih dahulu.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: ['auth'] })
useHead({ title: 'Kalender — Admin Lemillion' })
const { logout } = useAuth()
const { availability, fetchAvailability, updateStatus, statusConfig } = useAvailability()
const navItems = [
  { to: '/admin',              icon: '◈',  label: 'Overview' },
  { to: '/admin/inquiries',    icon: '✉️',  label: 'Inquiries' },
  { to: '/admin/portfolio',    icon: '🖼️',  label: 'Portfolio' },
  { to: '/admin/availability', icon: '📅',  label: 'Kalender' },
  { to: '/admin/profile',      icon: '👤',  label: 'Profil' },
]
const signOut = async () => { await logout(); navigateTo('/login') }
onMounted(fetchAvailability)
</script>
