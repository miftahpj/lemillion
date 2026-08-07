<template>
  <div class="min-h-screen bg-[#0C0A07]">

    <!-- Header -->
    <div class="pt-40 pb-14 px-8 max-w-7xl mx-auto text-center">
      <div class="flex items-center justify-center gap-4 mb-5" data-aos="fade-up">
        <div class="h-px w-10" style="background:linear-gradient(to right,transparent,#C9963A);" />
        <span class="font-mono text-[10px] tracking-[0.4em] uppercase" style="color:rgba(201,150,58,0.55);">Get In Touch</span>
        <div class="h-px w-10" style="background:linear-gradient(to left,transparent,#C9963A);" />
      </div>
      <h1 class="font-display uppercase leading-none mb-3 gold-text" style="font-size:clamp(4rem,9vw,8rem);" data-aos="fade-up" data-aos-delay="100">Contact</h1>
      <p class="font-serif text-lg italic max-w-md mx-auto" style="color:rgba(245,240,232,0.32);" data-aos="fade-up" data-aos-delay="150">
        Ceritakan tentang proyek Anda. Saya akan merespons dalam 24–48 jam.
      </p>
    </div>

    <div class="max-w-7xl mx-auto px-8 pb-32">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-16">

        <!-- Left: info -->
        <div class="md:col-span-2 space-y-10" data-aos="fade-right">

          <div class="space-y-8">
            <div v-for="info in contactInfo" :key="info.label">
              <p class="font-mono text-[8px] tracking-[0.4em] uppercase mb-2" style="color:rgba(201,150,58,0.38);">{{ info.label }}</p>
              <a :href="info.href" class="font-serif text-xl italic transition-colors duration-300 hover:text-[#E8C96A]" style="color:rgba(245,240,232,0.48);">{{ info.value }}</a>
            </div>
          </div>

          <div class="h-px opacity-10" style="background:linear-gradient(to right,transparent,#C9963A,transparent);" />

          <!-- Availability -->
          <div>
            <p class="font-mono text-[8px] tracking-[0.4em] uppercase mb-5" style="color:rgba(201,150,58,0.38);">Availability</p>

            <div v-if="loadingAvail" class="space-y-3">
              <div v-for="i in 5" :key="i" class="h-10 animate-pulse" style="background:rgba(255,255,255,0.03);" />
            </div>

            <div v-else-if="availability.length > 0" class="space-y-0">
              <div
                v-for="avail in availability" :key="avail.id"
                class="flex items-center justify-between py-3 border-b"
                style="border-color:rgba(201,150,58,0.06);"
              >
                <span class="font-body text-sm" style="color:rgba(245,240,232,0.30);">{{ avail.month }}</span>
                <span
                  class="font-mono text-[8px] tracking-widest uppercase px-3 py-1 border"
                  :class="{
                    'text-emerald-400/70 border-emerald-400/20 bg-emerald-400/5': avail.status === 'open',
                    'text-yellow-400/70 border-yellow-400/20 bg-yellow-400/5':   avail.status === 'limited',
                    'text-red-400/55 border-red-400/15 bg-red-400/5':            avail.status === 'full',
                  }"
                >
                  {{ avail.status === 'open' ? 'Tersedia' : avail.status === 'limited' ? 'Terbatas' : 'Penuh' }}
                </span>
              </div>
            </div>

            <p v-else class="font-serif italic text-sm" style="color:rgba(245,240,232,0.2);">Info ketersediaan belum diatur.</p>
          </div>

          <!-- Social links -->
          <div>
            <p class="font-mono text-[8px] tracking-[0.4em] uppercase mb-4" style="color:rgba(201,150,58,0.38);">Follow</p>
            <div class="flex gap-5 flex-wrap">
              <a v-if="profile?.github" :href="`https://github.com/${profile.github}`" target="_blank" rel="noopener"
                class="font-mono text-[9px] tracking-[0.2em] uppercase hover:text-[#C9963A] transition-colors" style="color:rgba(245,240,232,0.2);">GitHub</a>
              <a v-if="profile?.linkedin" :href="`https://linkedin.com/in/${profile.linkedin}`" target="_blank" rel="noopener"
                class="font-mono text-[9px] tracking-[0.2em] uppercase hover:text-[#C9963A] transition-colors" style="color:rgba(245,240,232,0.2);">LinkedIn</a>
              <a v-if="profile?.website" :href="profile.website" target="_blank" rel="noopener"
                class="font-mono text-[9px] tracking-[0.2em] uppercase hover:text-[#C9963A] transition-colors" style="color:rgba(245,240,232,0.2);">Website</a>
            </div>
          </div>
        </div>

        <!-- Right: Form -->
        <div class="md:col-span-3" data-aos="fade-left">
          <form @submit.prevent="handleSubmit" class="space-y-7">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="font-mono text-[9px] tracking-[0.35em] uppercase block mb-3" style="color:rgba(201,150,58,0.42);">Nama Lengkap *</label>
                <input v-model="form.name" type="text" required placeholder="Nama Anda"
                  class="w-full bg-transparent py-3 font-body text-sm focus:outline-none transition-colors duration-300"
                  style="border-bottom:1px solid rgba(201,150,58,0.15);color:rgba(245,240,232,0.65);" />
              </div>
              <div>
                <label class="font-mono text-[9px] tracking-[0.35em] uppercase block mb-3" style="color:rgba(201,150,58,0.42);">Email *</label>
                <input v-model="form.email" type="email" required placeholder="email@anda.com"
                  class="w-full bg-transparent py-3 font-body text-sm focus:outline-none transition-colors duration-300"
                  style="border-bottom:1px solid rgba(201,150,58,0.15);color:rgba(245,240,232,0.65);" />
              </div>
            </div>

            <div>
              <label class="font-mono text-[9px] tracking-[0.35em] uppercase block mb-3" style="color:rgba(201,150,58,0.42);">No. HP / WhatsApp</label>
              <input v-model="form.phone" type="tel" placeholder="+62 812 xxxx xxxx"
                class="w-full bg-transparent py-3 font-body text-sm focus:outline-none"
                style="border-bottom:1px solid rgba(201,150,58,0.15);color:rgba(245,240,232,0.65);" />
            </div>

            <div>
              <label class="font-mono text-[9px] tracking-[0.35em] uppercase block mb-3" style="color:rgba(201,150,58,0.42);">Jenis Proyek *</label>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="type in sessionTypes" :key="type"
                  type="button"
                  @click="form.session_type = type"
                  class="font-mono text-[9px] tracking-[0.2em] uppercase px-5 py-2.5 border transition-all duration-300"
                  :style="form.session_type === type
                    ? 'border-color:rgba(201,150,58,0.6);color:#C9963A;background:rgba(201,150,58,0.08);'
                    : 'border-color:rgba(255,255,255,0.06);color:rgba(245,240,232,0.22);'"
                >{{ type }}</button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="font-mono text-[9px] tracking-[0.35em] uppercase block mb-3" style="color:rgba(201,150,58,0.42);">Target Mulai</label>
                <input v-model="form.preferred_date" type="date"
                  class="w-full bg-transparent py-3 font-body text-sm focus:outline-none"
                  style="border-bottom:1px solid rgba(201,150,58,0.15);color:rgba(245,240,232,0.55);color-scheme:dark;" />
              </div>
              <div>
                <label class="font-mono text-[9px] tracking-[0.35em] uppercase block mb-3" style="color:rgba(201,150,58,0.42);">Budget Range</label>
                <select v-model="form.budget_range"
                  class="w-full py-3 font-body text-sm focus:outline-none"
                  style="background:#0C0A07;border-bottom:1px solid rgba(201,150,58,0.15);color:rgba(245,240,232,0.50);">
                  <option value="" disabled>Pilih range budget</option>
                  <option v-for="b in budgets" :key="b">{{ b }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="font-mono text-[9px] tracking-[0.35em] uppercase block mb-3" style="color:rgba(201,150,58,0.42);">Lokasi / Kota</label>
              <input v-model="form.location_pref" type="text" placeholder="Tasikmalaya, Bandung, dll. (opsional, kerja remote)"
                class="w-full bg-transparent py-3 font-body text-sm focus:outline-none"
                style="border-bottom:1px solid rgba(201,150,58,0.15);color:rgba(245,240,232,0.65);" />
            </div>

            <div>
              <label class="font-mono text-[9px] tracking-[0.35em] uppercase block mb-3" style="color:rgba(201,150,58,0.42);">Ceritakan Proyek Anda *</label>
              <textarea v-model="form.message" required rows="5"
                placeholder="Deskripsikan website/aplikasi yang Anda butuhkan, fitur utamanya, atau referensi yang Anda suka..."
                class="w-full bg-transparent py-3 px-4 font-body text-sm resize-none focus:outline-none"
                style="border:1px solid rgba(201,150,58,0.10);color:rgba(245,240,232,0.60);" />
            </div>

            <div class="flex items-center justify-between pt-4">
              <p class="font-mono text-[8px] tracking-[0.2em] uppercase" style="color:rgba(245,240,232,0.15);">* Wajib diisi</p>
              <button
                type="submit"
                :disabled="submitting"
                class="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.3em] uppercase px-10 py-4 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50"
                style="background:linear-gradient(135deg,#C9963A,#E8C96A,#C9963A);color:#1a1208;font-weight:700;"
              >
                <svg v-if="submitting" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="32" stroke-dashoffset="12" stroke-linecap="round"/>
                </svg>
                {{ submitting ? 'Mengirim...' : 'Kirim Pesan' }}
              </button>
            </div>

            <Transition name="fade">
              <div
                v-if="feedback.msg"
                class="border px-6 py-5"
                :style="feedback.success
                  ? 'border-color:rgba(201,150,58,0.25);background:rgba(201,150,58,0.05);'
                  : 'border-color:rgba(239,68,68,0.2);background:rgba(239,68,68,0.05);'"
              >
                <p class="font-display text-sm tracking-wider uppercase mb-1"
                  :style="feedback.success ? 'color:#C9963A;' : 'color:rgba(239,68,68,0.7);'">
                  {{ feedback.success ? 'Pesan Terkirim ✦' : 'Gagal Terkirim' }}
                </p>
                <p class="font-body text-sm" style="color:rgba(245,240,232,0.38);">{{ feedback.msg }}</p>
              </div>
            </Transition>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Contact — Lemillion Web Developer' })

const { profile, availability, fetchProfile, fetchAvailability } = useSiteData()
const { submitInquiry, submitting } = useInquiry()

const loadingAvail = ref(true)
const feedback     = reactive({ msg: '', success: false })

const form = reactive({
  name: '', email: '', phone: '',
  session_type: '', preferred_date: '', budget_range: '',
  location_pref: '', message: '',
})

const contactInfo = computed(() => [
  { label: 'Email',    href: `mailto:${profile.value?.email ?? 'miftahpauzanjamil@gmail.com'}`,       value: profile.value?.email ?? 'miftahpauzanjamil@gmail.com' },
  { label: 'WhatsApp', href: `https://wa.me/${(profile.value?.whatsapp ?? '').replace(/\D/g,'')}`,     value: profile.value?.whatsapp ?? '+62 812 3456 7890' },
  { label: 'Location', href: '#',                                                                       value: profile.value?.location ?? 'Tasikmalaya, Indonesia' },
])

const handleSubmit = async () => {
  feedback.msg = ''
  const ok = await submitInquiry({
    name:           form.name,
    email:          form.email,
    phone:          form.phone || null,
    session_type:   form.session_type || null,
    preferred_date: form.preferred_date || null,
    budget_range:   form.budget_range || null,
    location_pref:  form.location_pref || null,
    message:        form.message,
  })
  feedback.success = ok
  feedback.msg = ok
    ? 'Terima kasih! Saya akan merespons dalam 24–48 jam.'
    : 'Gagal mengirim. Coba lagi atau hubungi via email langsung.'
  if (ok) {
    Object.assign(form, { name:'', email:'', phone:'', session_type:'', preferred_date:'', budget_range:'', location_pref:'', message:'' })
    setTimeout(() => { feedback.msg = '' }, 6000)
  }
}

const sessionTypes = ['Landing Page', 'Company Profile', 'Web App / Sistem Informasi', 'E-Commerce', 'Maintenance', 'Lainnya']
const budgets      = ['Di bawah Rp 1 juta', 'Rp 1 – 3 juta', 'Rp 3 – 10 juta', 'Rp 10 juta+']

onMounted(async () => {
  await Promise.all([fetchProfile(), fetchAvailability()])
  loadingAvail.value = false
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.4s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; transform: translateY(6px); }
</style>
