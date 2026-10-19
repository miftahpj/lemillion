<template>
  <div class="arc">
    <ArcFx />
    <PageHero label="▮▮ Loot table" title="What’s|in the box." sub="Paket layanan, harga, dan apa saja yang kamu dapat." />
    <section class="dark" :class="{ open }">
      <div v-if="servicesList.length" class="loot">
        <article v-for="(s, i) in servicesList" :key="s.id" class="it" :style="{ '--c': rarity[i % 4][1], '--k': i }">
          <span class="lbl">{{ rarity[i % 4][0] }}{{ s.duration ? ' · ' + s.duration : '' }}</span>
          <b>{{ s.title }}</b><p>{{ s.description }}</p>
          <ul><li v-for="f in s.features || []" :key="f">{{ f }}</li></ul>
          <span class="lbl">{{ s.price_label || formatPrice(s.price_min) }}</span>
          <NuxtLink class="btn" :to="{ path: '/contact', query: { service: s.title } }">{{ s.cta_label || 'Pilih paket' }} ↗</NuxtLink>
        </article>
      </div>
      <p v-else class="lbl">Belum ada layanan yang dipublikasikan.</p>
    </section>
    <section class="dark">
      <h2 class="gl">The<br>process.</h2>
      <div class="steps"><div v-for="(s, i) in processSteps" :key="s.title" class="it"><span class="lbl">Stage 0{{ i + 1 }}</span><b>{{ s.title }}</b><p>{{ s.description }}</p></div></div>
    </section>
    <section class="dark">
      <h2 class="gl">FAQ.</h2>
      <div class="faqs"><details v-for="f in faqs" :key="f.q" class="faq"><summary>{{ f.q }}</summary><p>{{ f.a }}</p></details></div>
    </section>
    <section class="red cta"><p class="lbl">Final round</p><h2 class="gl">Diskusikan<br>proyek.</h2><NuxtLink class="btn s" to="/contact">Start your campaign ↗</NuxtLink></section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Services & Pricing — Lemillion Web Developer' })
const { servicesList, fetchServices, formatPrice } = useSiteData()
await fetchServices()
const open = ref(false)
onMounted(() => requestAnimationFrame(() => (open.value = true)))
const rarity = [['Legendary', '#F5C518'], ['Epic', '#b56cff'], ['Rare', '#3fa9ff'], ['Uncommon', '#2fe36d']]
const processSteps = [
  { title: 'Konsultasi', description: 'Diskusi kebutuhan, tujuan website, dan fitur yang diperlukan.' },
  { title: 'Perencanaan', description: 'Wireframe, pemilihan tech stack, dan timeline pengerjaan disepakati bersama.' },
  { title: 'Development', description: 'Proses coding dengan update progress berkala, mulai dari front-end sampai back-end.' },
  { title: 'Launch & Support', description: 'Deploy ke server, pengujian akhir, dan dukungan teknis setelah website live.' },
]
const faqs = [
  { q: 'Berapa lama waktu pengerjaan?', a: 'Landing page biasanya 3–5 hari kerja. Company profile 1–2 minggu. Web app / sistem informasi 2–6 minggu tergantung kompleksitas.' },
  { q: 'Apakah bisa kerja remote dari luar Tasikmalaya?', a: 'Bisa. Seluruh proses bisa dilakukan online — diskusi lewat WhatsApp/video call, dan progress dipantau bersama.' },
  { q: 'Bagaimana sistem pembayaran?', a: 'DP 50% di awal sebagai tanda jadi, pelunasan setelah website selesai dan disetujui sebelum di-deploy.' },
  { q: 'Apakah website akan cepat diakses di HP?', a: 'Ya. Semua proyek dioptimasi untuk ringan dan responsif di berbagai device, bukan cuma tampil bagus di desktop.' },
  { q: 'Apakah dapat source code & bisa dikelola sendiri?', a: 'Bisa. Kamu dapat akses penuh ke source code dan (kalau perlu) panel admin sederhana untuk kelola konten sendiri.' },
]
</script>
