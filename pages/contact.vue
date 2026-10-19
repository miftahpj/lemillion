<template>
  <div class="arc">
    <ArcFx />
    <PageHero label="▮▮ Final round" title="Your game.|Our move." sub="Ceritakan proyekmu — saya balas dalam 24–48 jam." />
    <section class="dark">
      <div class="cgrid">
        <form class="frm" @submit.prevent="handleSubmit">
          <input v-model="form.name" required placeholder="Nama" autocomplete="name">
          <input v-model="form.email" type="email" required placeholder="Email" autocomplete="email">
          <input v-model="form.phone" placeholder="WhatsApp / telepon" autocomplete="tel">
          <select v-model="form.session_type"><option value="">Jenis proyek</option><option v-for="t in types" :key="t">{{ t }}</option></select>
          <select v-model="form.budget_range"><option value="">Budget</option><option v-for="b in budgets" :key="b">{{ b }}</option></select>
          <input v-model="form.preferred_date" type="date" aria-label="Tanggal mulai">
          <input v-model="form.location_pref" placeholder="Lokasi / kota" class="wide">
          <textarea v-model="form.message" required rows="5" placeholder="Ceritakan proyekmu" />
          <button class="btn s" :disabled="submitting">{{ submitting ? 'Mengirim…' : 'Start your campaign ↗' }}</button>
          <p v-if="feedback.msg" class="lbl" :class="{ ok: feedback.success }">{{ feedback.msg }}</p>
        </form>
        <aside class="side">
          <p class="lbl">Contact info</p>
          <a v-for="c in contactInfo" :key="c.label" :href="c.href" class="side-i"><span class="lbl">{{ c.label }}</span><b>{{ c.value }}</b></a>
          <template v-if="slots.length">
            <p class="lbl" style="margin-top: 22px">Server status · pilih bulan</p>
            <div class="slots one"><button v-for="m in slots" :key="m.id" type="button" class="slot" :class="m.status" :disabled="m.status === 'full'" @click="form.preferred_date = `${m.year_month}-01`"><span class="lbl">{{ m.month }}</span><b>{{ statusLabel[m.status] || m.status }}</b><small>{{ m.notes }}</small></button></div>
          </template>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Contact — Lemillion Web Developer' })
const route = useRoute()
const { profile, availability, servicesList, fetchProfile, fetchAvailability, fetchServices } = useSiteData()
const { submitInquiry, submitting } = useInquiry()
await Promise.all([fetchProfile(), fetchAvailability(), fetchServices()])

const feedback = reactive({ msg: '', success: false })
const form = reactive({ name: '', email: '', phone: '', session_type: String(route.query.service ?? ''), preferred_date: '', budget_range: '', location_pref: '', message: '' })
const fallbackTypes = ['Landing Page', 'Company Profile', 'Web App / Sistem Informasi', 'E-Commerce', 'Maintenance', 'Lainnya']
const types = computed(() => { const t = servicesList.value.length ? servicesList.value.map((s: any) => s.title) : fallbackTypes; return form.session_type && !t.includes(form.session_type) ? [form.session_type, ...t] : t })
const budgets = ['Di bawah Rp 1 juta', 'Rp 1 – 3 juta', 'Rp 3 – 10 juta', 'Rp 10 juta+']
const statusLabel: Record<string, string> = { open: 'Open', limited: 'Limited', full: 'Full' }
const nowYM = new Date().toISOString().slice(0, 7)
const slots = computed(() => { const a: any[] = availability.value as any[]; const up = a.filter((m) => m.year_month >= nowYM); return (up.length ? up : a).slice(0, 6) })
const contactInfo = computed(() => [
  { label: 'Email', href: `mailto:${profile.value?.email ?? 'miftahpauzanjamil@gmail.com'}`, value: profile.value?.email ?? 'miftahpauzanjamil@gmail.com' },
  { label: 'WhatsApp', href: `https://wa.me/${String(profile.value?.whatsapp ?? '').replace(/\D/g, '')}`, value: profile.value?.whatsapp ?? '+62 812 3456 7890' },
  { label: 'Location', href: '#', value: profile.value?.location ?? 'Tasikmalaya, Indonesia' },
])
const handleSubmit = async () => {
  feedback.msg = ''
  const ok = await submitInquiry({ ...form, phone: form.phone || null, session_type: form.session_type || null, preferred_date: form.preferred_date || null, budget_range: form.budget_range || null, location_pref: form.location_pref || null })
  feedback.success = ok
  feedback.msg = ok ? 'Terima kasih! Saya akan merespons dalam 24–48 jam.' : 'Gagal mengirim. Coba lagi atau hubungi via email langsung.'
  if (ok) {
    Object.assign(form, { name: '', email: '', phone: '', session_type: '', preferred_date: '', budget_range: '', location_pref: '', message: '' })
    setTimeout(() => { feedback.msg = '' }, 6000)
  }
}
</script>
