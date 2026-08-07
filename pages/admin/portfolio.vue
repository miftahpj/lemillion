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
      <div class="flex items-end justify-between mb-8">
        <div>
          <p class="font-mono text-[9px] tracking-[0.5em] uppercase mb-2" style="color:rgba(201,150,58,0.4);">// Kelola</p>
          <h1 class="font-display text-3xl uppercase tracking-wide gold-text">Portfolio</h1>
        </div>
        <p class="font-body text-sm" style="color:rgba(245,240,232,0.3);">{{ items.length }} karya terdaftar</p>
      </div>
      <div class="h-px mb-8 opacity-15" style="background:linear-gradient(to right,transparent,#C9963A,transparent);" />
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-px h-16" style="background:linear-gradient(to bottom,#C9963A,transparent);" />
      </div>
      <div v-else-if="items.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <div v-for="item in items" :key="item.id" class="group relative border overflow-hidden" style="border-color:rgba(255,255,255,0.05);">
          <div class="aspect-[4/5] relative" style="background:linear-gradient(135deg,#1a1208,#2a1e10,#1a1208);">
            <img v-if="getImageUrl(item.cover_url)" :src="getImageUrl(item.cover_url)" :alt="item.title" class="w-full h-full object-cover" @error="($event.target as HTMLImageElement).style.display='none'" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#080604]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <div class="flex gap-2">
                <button @click="toggleFeatured(item)" class="font-mono text-[8px] px-2 py-1 border transition-all" :style="item.is_featured ? 'color:#C9963A;border-color:rgba(201,150,58,0.4);' : 'color:rgba(245,240,232,0.3);border-color:rgba(255,255,255,0.1);'">★ Featured</button>
                <button @click="togglePublished(item)" class="font-mono text-[8px] px-2 py-1 border transition-all" :style="item.is_published ? 'color:rgba(52,211,153,0.7);border-color:rgba(52,211,153,0.25);' : 'color:rgba(245,240,232,0.2);border-color:rgba(255,255,255,0.06);'">{{ item.is_published ? '✓ Live' : '○ Draft' }}</button>
              </div>
            </div>
          </div>
          <div class="p-3">
            <p class="font-mono text-[8px] tracking-widest uppercase mb-0.5" style="color:rgba(201,150,58,0.4);">{{ item.categories?.name ?? '—' }}</p>
            <p class="font-body text-xs truncate" style="color:rgba(245,240,232,0.55);">{{ item.title }}</p>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-20 border" style="border-color:rgba(255,255,255,0.04);">
        <p class="font-serif text-xl italic mb-3" style="color:rgba(245,240,232,0.18);">Belum ada portfolio.</p>
        <p class="font-mono text-[9px] tracking-widest uppercase" style="color:rgba(245,240,232,0.10);">Tambah data via neon/02_seed.sql atau query manual di Neon Console.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: ['auth'] })
useHead({ title: 'Portfolio — Admin Lemillion' })
const { logout } = useAuth()
const { items, loading, fetchPortfolio, updatePortfolioItem, getImageUrl } = usePortfolio()
const navItems = [
  { to: '/admin', icon: '◈', label: 'Overview' }, { to: '/admin/inquiries', icon: '✉️', label: 'Inquiries' },
  { to: '/admin/portfolio', icon: '🖼️', label: 'Portfolio' }, { to: '/admin/availability', icon: '📅', label: 'Kalender' }, { to: '/admin/profile', icon: '👤', label: 'Profil' },
]
const signOut        = async () => { await logout(); navigateTo('/login') }
const toggleFeatured = (item: any) => updatePortfolioItem(item.id, { is_featured: !item.is_featured })
const togglePublished = (item: any) => updatePortfolioItem(item.id, { is_published: !item.is_published })
onMounted(fetchPortfolio)
</script>
