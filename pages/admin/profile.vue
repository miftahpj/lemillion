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
    <main class="ml-56 flex-1 p-8 max-w-3xl">
      <div class="mb-8">
        <p class="font-mono text-[9px] tracking-[0.5em] uppercase mb-2" style="color:rgba(201,150,58,0.4);">// Kelola</p>
        <h1 class="font-display text-3xl uppercase tracking-wide gold-text">Profil Developer</h1>
      </div>
      <div class="h-px mb-10 opacity-15" style="background:linear-gradient(to right,transparent,#C9963A,transparent);" />
      <form @submit.prevent="save" class="space-y-6">
        <div class="grid grid-cols-2 gap-5">
          <div v-for="field in fields" :key="field.key">
            <label class="font-mono text-[9px] tracking-[0.35em] uppercase block mb-2" style="color:rgba(201,150,58,0.4);">{{ field.label }}</label>
            <input v-model="(form as any)[field.key]" :type="field.type ?? 'text'" :placeholder="field.placeholder" class="w-full bg-transparent py-3 font-body text-sm focus:outline-none" style="border-bottom:1px solid rgba(201,150,58,0.14); color:rgba(245,240,232,0.62);" />
          </div>
        </div>
        <div>
          <label class="font-mono text-[9px] tracking-[0.35em] uppercase block mb-2" style="color:rgba(201,150,58,0.4);">Bio Singkat (Hero)</label>
          <textarea v-model="form.bio" rows="3" class="w-full bg-transparent py-3 px-4 font-body text-sm focus:outline-none resize-none" style="border:1px solid rgba(201,150,58,0.10); color:rgba(245,240,232,0.60);" />
        </div>
        <div>
          <label class="font-mono text-[9px] tracking-[0.35em] uppercase block mb-2" style="color:rgba(201,150,58,0.4);">Bio Panjang (Halaman About)</label>
          <textarea v-model="form.bio_extended" rows="6" class="w-full bg-transparent py-3 px-4 font-body text-sm focus:outline-none resize-none" style="border:1px solid rgba(201,150,58,0.10); color:rgba(245,240,232,0.60);" />
        </div>
        <Transition name="fade">
          <div v-if="feedback" class="border px-5 py-4" :style="saved ? 'border-color:rgba(201,150,58,0.22);background:rgba(201,150,58,0.05);' : 'border-color:rgba(239,68,68,0.2);background:rgba(239,68,68,0.05);'">
            <p class="font-mono text-[10px] tracking-widest uppercase" :style="saved ? 'color:#C9963A;' : 'color:rgba(239,68,68,0.65);'">{{ feedback }}</p>
          </div>
        </Transition>
        <button type="submit" :disabled="saving" class="font-mono text-[11px] tracking-[0.3em] uppercase px-10 py-4 transition-all hover:-translate-y-0.5 disabled:opacity-50" style="background:linear-gradient(135deg,#C9963A,#E8C96A,#C9963A); color:#1a1208; font-weight:700;">
          {{ saving ? 'Menyimpan...' : 'Simpan Profil' }}
        </button>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: ['auth'] })
useHead({ title: 'Edit Profil — Admin Lemillion' })
const { logout } = useAuth()
const { profile, fetchProfile, updateProfile } = useProfile()
const saving = ref(false)
const saved  = ref(false)
const feedback = ref('')
const form = reactive({ name: '', tagline: '', bio: '', bio_extended: '', location: '', email: '', whatsapp: '', github: '', linkedin: '', website: '' })
const fields = [
  { key: 'name',      label: 'Nama Lengkap',  placeholder: 'Miftah Pauzan Jamil' },
  { key: 'tagline',   label: 'Tagline',        placeholder: 'Web Developer' },
  { key: 'location',  label: 'Lokasi',         placeholder: 'Tasikmalaya, Indonesia' },
  { key: 'email',     label: 'Email',          placeholder: 'miftahpauzanjamil@gmail.com', type: 'email' },
  { key: 'whatsapp',  label: 'WhatsApp',       placeholder: '+62' },
  { key: 'github',    label: 'GitHub',         placeholder: 'lemillion' },
  { key: 'linkedin',  label: 'LinkedIn',       placeholder: 'miftah-pauzan-jamil' },
  { key: 'website',   label: 'Website',        placeholder: 'https://...' },
]
const navItems = [
  { to: '/admin', icon: '◈', label: 'Overview' }, { to: '/admin/inquiries', icon: '✉️', label: 'Inquiries' },
  { to: '/admin/portfolio', icon: '🖼️', label: 'Portfolio' }, { to: '/admin/availability', icon: '📅', label: 'Kalender' }, { to: '/admin/profile', icon: '👤', label: 'Profil' },
]
const signOut = async () => { await logout(); navigateTo('/login') }
const syncForm = () => { if (!profile.value) return; Object.assign(form, { name: profile.value.name, tagline: profile.value.tagline, bio: profile.value.bio, bio_extended: profile.value.bio_extended, location: profile.value.location, email: profile.value.email, whatsapp: profile.value.whatsapp ?? '', github: profile.value.github ?? '', linkedin: profile.value.linkedin ?? '', website: profile.value.website ?? '' }) }
const save = async () => {
  saving.value = true; feedback.value = ''
  const ok = await updateProfile(form)
  saved.value = ok; feedback.value = ok ? 'Profil berhasil disimpan.' : 'Gagal menyimpan.'
  saving.value = false; setTimeout(() => { feedback.value = '' }, 4000)
}
onMounted(async () => { await fetchProfile(); syncForm() })
watch(profile, syncForm)
</script>
<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
