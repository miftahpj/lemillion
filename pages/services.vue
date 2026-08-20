<template>
  <div class="min-h-screen bg-[#0C0A07]">

    <!-- Header -->
    <div class="pt-40 pb-14 px-8 max-w-7xl mx-auto text-center">
      <div class="flex items-center justify-center gap-4 mb-5" data-aos="fade-up">
        <div class="h-px w-10" style="background:linear-gradient(to right,transparent,#C9963A);" />
        <span class="font-mono text-[10px] tracking-[0.4em] uppercase" style="color:rgba(201,150,58,0.55);">What I Offer</span>
        <div class="h-px w-10" style="background:linear-gradient(to left,transparent,#C9963A);" />
      </div>
      <h1 class="font-display uppercase leading-none mb-3 gold-text" style="font-size:clamp(4rem,9vw,8rem);" data-aos="fade-up" data-aos-delay="100">Services</h1>
      <p class="font-serif text-lg italic max-w-md mx-auto" style="color:rgba(245,240,232,0.32);" data-aos="fade-up" data-aos-delay="150">
        Setiap proyek dikerjakan dengan standar kode yang rapi dan performa yang ringan di semua device.
      </p>
    </div>

    <!-- Services -->
    <div class="max-w-7xl mx-auto px-8 pb-20">

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="bg-[#0C0A07] border p-10 h-80 animate-pulse" style="border-color:rgba(201,150,58,0.08);" />
      </div>

      <div v-else-if="servicesList.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(svc, idx) in servicesList" :key="svc.id"
          class="group bg-[#0C0A07] border p-10 transition-all duration-500 hover:-translate-y-1 hover:border-[#C9963A]/25 overflow-hidden relative"
          style="border-color:rgba(201,150,58,0.10);"
          data-aos="fade-up" :data-aos-delay="idx * 100"
        >
          <div class="h-px w-0 group-hover:w-full transition-all duration-700 mb-8" style="background:linear-gradient(to right,#C9963A,#E8C96A);" />
          <span class="font-mono text-[9px] tracking-[0.4em] mb-4 block" style="color:rgba(201,150,58,0.28);">{{ String(idx+1).padStart(2,'0') }}</span>
          <ServiceIcon :icon="svc.icon" class="w-9 h-9 mb-5" style="color:#C9963A;" />
          <h3 class="font-display text-2xl tracking-wider mb-3 uppercase group-hover:text-[#E8C96A] transition-colors" style="color:rgba(245,240,232,0.72);">{{ svc.title }}</h3>
          <p class="font-body text-sm leading-relaxed mb-5" style="color:rgba(245,240,232,0.28);">{{ svc.description }}</p>
          <div class="flex items-end gap-2 mb-5">
            <span class="font-mono text-[9px] tracking-widest uppercase" style="color:rgba(201,150,58,0.4);">{{ svc.price_label }}</span>
            <span class="font-display text-xl gold-text">{{ formatPrice(svc.price_min) }}</span>
          </div>
          <div v-if="svc.duration" class="mb-4">
            <span class="font-mono text-[8px] tracking-widest uppercase" style="color:rgba(201,150,58,0.35);">Estimasi: </span>
            <span class="font-mono text-[9px]" style="color:rgba(245,240,232,0.35);">{{ svc.duration }}</span>
          </div>
          <ul v-if="svc.features?.length" class="space-y-2 mb-7">
            <li v-for="f in svc.features" :key="f" class="flex items-center gap-3 font-body text-xs" style="color:rgba(245,240,232,0.26);">
              <span class="w-4 h-px flex-shrink-0" style="background:rgba(201,150,58,0.3);" />{{ f }}
            </li>
          </ul>
          <NuxtLink to="/contact" class="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase group-hover:text-[#C9963A] transition-colors" style="color:rgba(201,150,58,0.38);">
            {{ svc.cta_label }} <span class="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </NuxtLink>
        </div>
      </div>

      <div v-else-if="!loading" class="text-center py-14 border" style="border-color:rgba(201,150,58,0.08);">
        <p class="font-serif italic" style="color:rgba(245,240,232,0.2);">Services belum ada.</p>
      </div>
    </div>

    <!-- Process -->
    <section class="py-24 bg-[#080604]">
      <div class="max-w-7xl mx-auto px-8">
        <div class="text-center mb-14">
          <h2 class="font-display uppercase leading-none gold-text" style="font-size:clamp(2.5rem,6vw,5rem);" data-aos="fade-up">The Process</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div class="absolute top-7 left-[12.5%] right-[12.5%] h-px hidden md:block" style="background:linear-gradient(to right,transparent,rgba(201,150,58,0.1),transparent);" />
          <div v-for="(step, idx) in processSteps" :key="step.title" class="relative text-center" data-aos="fade-up" :data-aos-delay="idx * 120">
            <div class="w-14 h-14 mx-auto mb-7 relative">
              <div class="absolute inset-0 rounded-full border" style="border-color:rgba(201,150,58,0.18);" />
              <div class="absolute inset-1.5 rounded-full border" style="border-color:rgba(201,150,58,0.08);" />
              <div class="w-full h-full flex items-center justify-center">
                <span class="font-display text-xl gold-text">{{ String(idx+1).padStart(2,'0') }}</span>
              </div>
            </div>
            <h3 class="font-display text-sm tracking-wider uppercase mb-2" style="color:rgba(245,240,232,0.6);">{{ step.title }}</h3>
            <p class="font-body text-sm leading-relaxed" style="color:rgba(245,240,232,0.26);">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="py-24 bg-[#0C0A07]">
      <div class="max-w-3xl mx-auto px-8">
        <div class="text-center mb-12">
          <h2 class="font-display uppercase leading-none gold-text" style="font-size:clamp(2.5rem,6vw,5rem);" data-aos="fade-up">FAQ</h2>
        </div>
        <div class="space-y-0">
          <div v-for="(faq, idx) in faqs" :key="faq.q" class="border-b overflow-hidden" style="border-color:rgba(201,150,58,0.08);" data-aos="fade-up" :data-aos-delay="idx * 60">
            <button class="w-full py-6 flex items-center justify-between text-left group" @click="activeIdx = activeIdx === idx ? null : idx">
              <span class="font-display text-sm tracking-wide uppercase pr-4 group-hover:text-[#E8C96A] transition-colors" style="color:rgba(245,240,232,0.52);">{{ faq.q }}</span>
              <span class="flex-shrink-0 text-lg select-none transition-transform duration-300" style="color:rgba(201,150,58,0.4);" :class="activeIdx === idx ? 'rotate-45' : ''">+</span>
            </button>
            <Transition name="faq">
              <div v-if="activeIdx === idx" class="pb-6">
                <p class="font-body text-sm leading-relaxed" style="color:rgba(245,240,232,0.30);">{{ faq.a }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative py-28 bg-[#080604]">

      <div class="relative z-10 max-w-3xl mx-auto px-8 text-center">
        <h2 class="font-display uppercase leading-none mb-8 gold-text" style="font-size:clamp(2.5rem,6vw,5rem);" data-aos="fade-up">Diskusikan Proyek</h2>
        <NuxtLink to="/contact" class="inline-flex items-center font-mono text-[11px] tracking-[0.3em] uppercase px-10 py-4 transition-all hover:-translate-y-0.5" style="background:#C9963A;color:#1a1208;font-weight:700;" data-aos="fade-up" data-aos-delay="100">
          Hubungi Sekarang
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Services & Pricing — Lemillion Web Developer' })

const { servicesList, loading, fetchServices, formatPrice } = useSiteData()
const activeIdx = ref<number | null>(null)

const processSteps = [
  { title: 'Konsultasi',    description: 'Diskusi kebutuhan, tujuan website, dan fitur yang diperlukan.' },
  { title: 'Perencanaan',   description: 'Wireframe, pemilihan tech stack, dan timeline pengerjaan disepakati bersama.' },
  { title: 'Development',   description: 'Proses coding dengan update progress berkala, mulai dari front-end sampai back-end.' },
  { title: 'Launch & Support', description: 'Deploy ke server, pengujian akhir, dan dukungan teknis setelah website live.' },
]

const faqs = [
  { q: 'Berapa lama waktu pengerjaan?',              a: 'Landing page biasanya 3–5 hari kerja. Company profile 1–2 minggu. Web app / sistem informasi 2–6 minggu tergantung kompleksitas.' },
  { q: 'Apakah bisa kerja remote dari luar Tasikmalaya?', a: 'Bisa. Seluruh proses bisa dilakukan online — diskusi lewat WhatsApp/video call, dan progress dipantau bersama.' },
  { q: 'Bagaimana sistem pembayaran?',                a: 'DP 50% di awal sebagai tanda jadi, pelunasan setelah website selesai dan disetujui sebelum di-deploy.' },
  { q: 'Apakah website akan cepat diakses di HP?',    a: 'Ya. Semua proyek dioptimasi untuk ringan dan responsif di berbagai device, bukan cuma tampil bagus di desktop.' },
  { q: 'Apakah dapat source code & bisa dikelola sendiri?', a: 'Bisa. Kamu dapat akses penuh ke source code dan (kalau perlu) panel admin sederhana untuk kelola konten sendiri.' },
]

onMounted(fetchServices)
</script>

<style scoped>
.faq-enter-active, .faq-leave-active { transition: all 0.3s ease; max-height: 300px; overflow: hidden; }
.faq-enter-from, .faq-leave-to { opacity: 0; max-height: 0; }
</style>
