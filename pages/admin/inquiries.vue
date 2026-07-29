<template>
  <div class="min-h-screen bg-[#080604] flex font-body">
    <aside class="w-56 min-h-screen bg-[#0C0A07] border-r fixed left-0 top-0 flex flex-col z-40" style="border-color:rgba(201,150,58,0.08);">
      <div class="px-6 py-7 border-b" style="border-color:rgba(201,150,58,0.08);">
        <NuxtLink to="/"><p class="font-display text-base tracking-[0.35em] gold-text uppercase">Lemillion</p></NuxtLink>
      </div>
      <nav class="flex-1 py-4 px-3 space-y-0.5">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="flex items-center gap-3 px-4 py-3 transition-all font-mono text-[10px] tracking-widest uppercase" active-class="bg-[#C9963A]/8 border border-[#C9963A]/15 text-[#C9963A]" style="color:rgba(245,240,232,0.25);">
          <span class="text-base select-none">{{ item.icon }}</span>{{ item.label }}
          <span v-if="item.badge && item.badge > 0" class="ml-auto font-mono text-[8px] px-1.5 py-0.5" style="background:rgba(201,150,58,0.15);color:#C9963A;border:1px solid rgba(201,150,58,0.25);">{{ item.badge }}</span>
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
          <h1 class="font-display text-3xl uppercase tracking-wide gold-text">Inquiries</h1>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button v-for="f in filters" :key="f.value" @click="setFilter(f.value)"
            class="font-mono text-[9px] tracking-widest uppercase px-4 py-2 border transition-all duration-200"
            :style="activeFilter === f.value ? 'border-color:rgba(201,150,58,0.5);color:#C9963A;background:rgba(201,150,58,0.08);' : 'border-color:rgba(255,255,255,0.07);color:rgba(245,240,232,0.22);'"
          >{{ f.label }} <span v-if="f.count > 0" class="opacity-50">({{ f.count }})</span></button>
        </div>
      </div>

      <div class="h-px mb-8 opacity-15" style="background:linear-gradient(to right,transparent,#C9963A,transparent);" />

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-px h-16" style="background:linear-gradient(to bottom,#C9963A,transparent); animation:fadeUp 1s ease infinite alternate;" />
      </div>

      <TransitionGroup v-else name="list" tag="div" class="space-y-3">
        <div v-for="inq in inquiries" :key="inq.id" :id="`inq-${inq.id}`"
          class="border overflow-hidden transition-all duration-300"
          :style="selectedId === inq.id ? 'border-color:rgba(201,150,58,0.28);background:rgba(12,10,7,0.5);' : 'border-color:rgba(255,255,255,0.05);'"
          :class="inq.status === 'new' ? 'border-l-2' : ''"
          :style2="inq.status === 'new' ? 'border-left-color:rgba(201,150,58,0.5);' : ''"
        >
          <div class="flex items-center gap-4 px-6 py-4 cursor-pointer" @click="toggleExpand(inq)">
            <div class="w-2 h-2 rounded-full flex-shrink-0"
              :class="{ 'bg-yellow-400 animate-pulse': inq.status==='new', 'bg-blue-400/50': inq.status==='read', 'bg-emerald-400/50': inq.status==='replied', 'bg-white/12': inq.status==='closed', 'bg-red-400/30': inq.status==='spam' }" />
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-3">
                <p class="font-body font-semibold truncate" style="color:rgba(245,240,232,0.72);">{{ inq.name }}</p>
                <span v-if="inq.status==='new'" class="font-mono text-[7px] tracking-widest uppercase px-2 py-0.5 flex-shrink-0" style="color:#C9963A;background:rgba(201,150,58,0.08);border:1px solid rgba(201,150,58,0.2);">BARU</span>
              </div>
              <p class="font-mono text-[9px] truncate mt-0.5" style="color:rgba(245,240,232,0.22);">{{ inq.email }}</p>
            </div>
            <div class="hidden md:block text-right flex-shrink-0 mr-3">
              <p class="font-mono text-[9px] tracking-widest uppercase" style="color:rgba(201,150,58,0.45);">{{ inq.session_type ?? 'Umum' }}</p>
              <p class="font-mono text-[8px] mt-0.5" style="color:rgba(245,240,232,0.15);">{{ formatDate(inq.created_at) }}</p>
            </div>
            <select :value="inq.status" @change.stop="changeStatus(inq, ($event.target as HTMLSelectElement).value)" @click.stop
              class="bg-[#080604] font-mono text-[8px] uppercase tracking-widest px-2 py-1.5 focus:outline-none transition-colors flex-shrink-0"
              style="border:1px solid rgba(255,255,255,0.07); color:rgba(245,240,232,0.32);"
            >
              <option v-for="s in statusOpts" :key="s.value" :value="s.value">{{ s.label }}</option>
            </select>
            <span class="text-xs select-none transition-transform duration-300 flex-shrink-0" style="color:rgba(245,240,232,0.18);" :class="selectedId===inq.id ? 'rotate-180' : ''">▾</span>
          </div>

          <Transition name="expand">
            <div v-if="selectedId===inq.id" class="border-t px-6 py-6" style="border-color:rgba(201,150,58,0.08);">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="md:col-span-2">
                  <p class="font-mono text-[8px] tracking-[0.35em] uppercase mb-3" style="color:rgba(201,150,58,0.38);">Pesan</p>
                  <p class="font-serif text-base italic leading-relaxed mb-6" style="color:rgba(245,240,232,0.52);">{{ inq.message }}</p>
                  <div class="flex flex-wrap gap-5 mb-5">
                    <div v-if="inq.preferred_date"><p class="font-mono text-[8px] tracking-widest uppercase mb-1" style="color:rgba(245,240,232,0.18);">Tanggal</p><p class="font-body text-sm" style="color:rgba(245,240,232,0.48);">{{ inq.preferred_date }}</p></div>
                    <div v-if="inq.budget_range"><p class="font-mono text-[8px] tracking-widest uppercase mb-1" style="color:rgba(245,240,232,0.18);">Budget</p><p class="font-body text-sm" style="color:rgba(245,240,232,0.48);">{{ inq.budget_range }}</p></div>
                    <div v-if="inq.phone"><p class="font-mono text-[8px] tracking-widest uppercase mb-1" style="color:rgba(245,240,232,0.18);">No. HP</p><p class="font-body text-sm" style="color:rgba(245,240,232,0.48);">{{ inq.phone }}</p></div>
                  </div>
                  <p class="font-mono text-[8px] tracking-widest uppercase mb-2" style="color:rgba(245,240,232,0.18);">Catatan Internal</p>
                  <textarea :value="inq.notes ?? ''" @blur="saveNotes(inq, ($event.target as HTMLTextAreaElement).value)" placeholder="Tambah catatan..." rows="3"
                    class="w-full bg-transparent py-3 px-4 font-body text-sm resize-none focus:outline-none" style="border:1px solid rgba(255,255,255,0.05); color:rgba(245,240,232,0.42);" />
                </div>
                <div class="space-y-3">
                  <p class="font-mono text-[8px] tracking-widest uppercase mb-4" style="color:rgba(245,240,232,0.18);">Aksi Cepat</p>
                  <a :href="`mailto:${inq.email}?subject=Re: ${inq.session_type??'Inquiry'} - Lemillion`" @click="changeStatus(inq,'replied')"
                    class="flex items-center gap-3 w-full font-mono text-[10px] tracking-widest uppercase px-4 py-3 border transition-all" style="border-color:rgba(201,150,58,0.22);color:#C9963A;">
                    ✉️ Balas Email
                  </a>
                  <a v-if="inq.phone" :href="`https://wa.me/${inq.phone.replace(/\D/g,'')}`" target="_blank"
                    class="flex items-center gap-3 w-full font-mono text-[10px] tracking-widest uppercase px-4 py-3 border transition-all" style="border-color:rgba(255,255,255,0.06);color:rgba(245,240,232,0.30);">
                    💬 WhatsApp
                  </a>
                  <button @click="changeStatus(inq,'closed')" class="flex items-center gap-3 w-full font-mono text-[10px] tracking-widest uppercase px-4 py-3 border transition-all" style="border-color:rgba(255,255,255,0.06);color:rgba(245,240,232,0.22);">✓ Tandai Selesai</button>
                  <button @click="changeStatus(inq,'spam')" class="flex items-center gap-3 w-full font-mono text-[10px] tracking-widest uppercase px-4 py-3 border transition-all" style="border-color:rgba(255,255,255,0.04);color:rgba(245,240,232,0.14);">⚠ Tandai Spam</button>
                  <button @click="remove(inq.id)" class="flex items-center gap-3 w-full font-mono text-[10px] tracking-widest uppercase px-4 py-3 border transition-all hover:border-red-400/20 hover:text-red-400/50" style="border-color:rgba(255,255,255,0.04);color:rgba(245,240,232,0.10);">🗑 Hapus</button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </TransitionGroup>

      <div v-if="!loading && inquiries.length === 0" class="text-center py-20 border" style="border-color:rgba(255,255,255,0.04);">
        <p class="font-serif text-xl italic" style="color:rgba(245,240,232,0.18);">Tidak ada inquiry.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: ['auth'] })
useHead({ title: 'Inquiries — Admin Lemillion' })

const { logout } = useAuth()
const route    = useRoute()
const { inquiries, loading, countByStatus, fetchInquiries, updateInquiry, deleteInquiry } = useInquiry()

const activeFilter = ref('all')
const selectedId   = ref<string | null>(null)

const filters = computed(() => [
  { value: 'all',     label: 'Semua',   count: inquiries.value.length },
  { value: 'new',     label: 'Baru',    count: countByStatus.value.new },
  { value: 'read',    label: 'Dibaca',  count: countByStatus.value.read },
  { value: 'replied', label: 'Dibalas', count: countByStatus.value.replied },
  { value: 'closed',  label: 'Selesai', count: countByStatus.value.closed },
  { value: 'spam',    label: 'Spam',    count: countByStatus.value.spam },
])

const statusOpts = [
  { value: 'new', label: '● Baru' }, { value: 'read', label: '○ Dibaca' },
  { value: 'replied', label: '✓ Dibalas' }, { value: 'closed', label: '✗ Selesai' }, { value: 'spam', label: '⚠ Spam' },
]

const navItems = computed(() => [
  { to: '/admin',              icon: '◈',  label: 'Overview' },
  { to: '/admin/inquiries',    icon: '✉️',  label: 'Inquiries', badge: countByStatus.value.new },
  { to: '/admin/portfolio',    icon: '🖼️',  label: 'Portfolio' },
  { to: '/admin/availability', icon: '📅',  label: 'Kalender' },
  { to: '/admin/profile',      icon: '👤',  label: 'Profil' },
])

const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

const setFilter    = async (f: string) => { activeFilter.value = f; await fetchInquiries(f === 'all' ? undefined : f) }
const toggleExpand = async (inq: any) => {
  selectedId.value = selectedId.value === inq.id ? null : inq.id
  if (inq.status === 'new') await updateInquiry(inq.id, { status: 'read' })
}
const changeStatus = async (inq: any, status: string) => { await updateInquiry(inq.id, { status }) }
const saveNotes    = async (inq: any, notes: string) => { if (notes !== (inq.notes ?? '')) await updateInquiry(inq.id, { notes }) }
const remove       = async (id: string) => { if (!confirm('Hapus inquiry ini?')) return; await deleteInquiry(id); if (selectedId.value === id) selectedId.value = null }
const signOut      = async () => { await logout(); navigateTo('/login') }

onMounted(async () => {
  await fetchInquiries()
  const targetId = route.query.id as string
  if (targetId) { selectedId.value = targetId; await nextTick(); document.getElementById(`inq-${targetId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }
})
</script>

<style scoped>
.list-move, .list-enter-active, .list-leave-active { transition: all 0.35s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(6px); }
.list-leave-active { position: absolute; width: 100%; }
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; max-height: 800px; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
</style>
