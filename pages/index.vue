<template>
  <div>

    <!-- ══ HERO ══ -->
    <section class="relative min-h-screen flex flex-col justify-end overflow-hidden bg-[#0C0A07]">
      <div class="absolute inset-0 z-0">
        <img
          v-if="heroImgUrl"
          :src="heroImgUrl"
          alt="Hero"
          class="w-full h-full object-cover object-center"
          style="animation:subtleZoom 20s ease-in-out infinite alternate;"
          loading="eager"
          @error="heroImgUrl = ''"
        />
        <div class="absolute inset-0" style="background:radial-gradient(ellipse at 70% 30%,rgba(201,150,58,0.09) 0%,transparent 60%),radial-gradient(ellipse at 20% 70%,rgba(201,150,58,0.05) 0%,transparent 50%),linear-gradient(135deg,#0C0A07 0%,#1a1208 50%,#0C0A07 100%);" />
        <div class="absolute inset-0 bg-gradient-to-r from-[#0C0A07]/85 via-[#0C0A07]/30 to-transparent" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0C0A07]/80 via-transparent to-[#0C0A07]/20" />
      </div>

      <div class="absolute inset-0 z-0 pointer-events-none">
        <div v-for="i in 5" :key="i" class="absolute top-0 bottom-0 w-px" :style="`left:${i*20}%;background:rgba(201,150,58,0.03);`" />
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-8 md:px-16 pb-28 pt-44 w-full">
        <div class="max-w-3xl">
          <div class="flex items-center gap-4 mb-8" data-aos="fade-up">
            <div class="h-px w-16" style="background:linear-gradient(to right,transparent,#C9963A);" />
            <span class="font-mono text-[10px] tracking-[0.5em] uppercase" style="color:rgba(201,150,58,0.65);">
              {{ profile?.tagline ?? 'Web Developer' }} · {{ profile?.location ?? 'Tasikmalaya' }}
            </span>
          </div>

          <h1 data-aos="fade-up" data-aos-delay="100" class="mb-6">
            <template v-if="profile?.name">
              <span
                v-for="(word, i) in heroNameWords" :key="i"
                :class="['block font-display uppercase leading-none tracking-wider', Number(i) === heroNameWords.length - 1 ? 'gold-text' : '']"
                :style="`font-size:clamp(4rem,11vw,10rem);${Number(i) < heroNameWords.length - 1 ? 'color:rgba(245,240,232,0.92);' : ''}`"
              >{{ word }}</span>
            </template>
            <template v-else>
              <span class="block font-display uppercase leading-none tracking-wider" style="font-size:clamp(4rem,11vw,10rem);color:rgba(245,240,232,0.92);">Miftah</span>
              <span class="block font-display uppercase leading-none tracking-wider gold-text" style="font-size:clamp(4rem,11vw,10rem);">Pauzan Jamil</span>
            </template>
          </h1>

          <p class="font-serif text-xl md:text-2xl italic leading-relaxed mb-12 max-w-xl" style="color:rgba(245,240,232,0.42);" data-aos="fade-up" data-aos-delay="200">
            "{{ profile?.bio ?? 'Membangun website yang cepat, rapi, dan enak dipakai — dari landing page sampai sistem informasi.' }}"
          </p>

          <div class="flex flex-wrap items-center gap-5" data-aos="fade-up" data-aos-delay="300">
            <NuxtLink to="/portfolio" class="inline-flex items-center font-mono text-[11px] tracking-[0.3em] uppercase px-10 py-4 transition-all duration-300 hover:-translate-y-0.5" style="background:linear-gradient(135deg,#C9963A,#E8C96A,#C9963A);color:#1a1208;font-weight:700;">
              Lihat Portfolio
            </NuxtLink>
            <NuxtLink to="/contact" class="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] uppercase px-10 py-4 border transition-all duration-300 hover:bg-[#C9963A]/8" style="border-color:rgba(201,150,58,0.35);color:#C9963A;">
              Diskusikan Proyek <span>→</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span class="font-mono text-[8px] tracking-[0.4em] uppercase" style="color:rgba(245,240,232,0.15);">Scroll</span>
        <div class="w-px h-12" style="background:linear-gradient(to bottom,rgba(201,150,58,0.35),transparent);" />
      </div>
    </section>

    <!-- ══ TICKER ══ -->
    <div class="overflow-hidden py-4 border-y bg-[#0C0A07]" style="border-color:rgba(201,150,58,0.08);">
      <div class="flex whitespace-nowrap" style="animation:ticker 25s linear infinite;">
        <span v-for="n in 4" :key="n" class="flex items-center gap-8 pr-8 flex-shrink-0">
          <span v-for="item in tickerItems" :key="item+n" class="inline-flex items-center gap-8">
            <span class="font-mono text-[9px] tracking-[0.4em] uppercase" style="color:rgba(245,240,232,0.16);">{{ item }}</span>
            <span style="color:rgba(201,150,58,0.22);" class="text-xs">✦</span>
          </span>
        </span>
      </div>
    </div>

    <!-- ══ PORTFOLIO PREVIEW ══ -->
    <section class="py-32 bg-[#0C0A07] relative">
      <div class="absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none" style="background:rgba(201,150,58,0.04);filter:blur(100px);" />
      <div class="max-w-7xl mx-auto px-8">

        <div class="mb-14">
          <div class="flex items-center gap-4 mb-4" data-aos="fade-up">
            <div class="h-px w-10" style="background:linear-gradient(to right,#C9963A,transparent);" />
            <span class="font-mono text-[10px] tracking-[0.4em] uppercase" style="color:rgba(201,150,58,0.55);">Selected Work</span>
          </div>
          <h2 class="font-display uppercase leading-none mb-3 gold-text" style="font-size:clamp(3rem,7vw,6rem);" data-aos="fade-up" data-aos-delay="100">Portfolio</h2>
          <p class="font-serif text-xl italic max-w-lg" style="color:rgba(245,240,232,0.38);" data-aos="fade-up" data-aos-delay="150">Beberapa proyek pilihan dari perjalanan sebagai web developer.</p>
        </div>

        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="i in 6" :key="i" class="aspect-[4/5] animate-pulse" style="background:rgba(255,255,255,0.03);" />
        </div>

        <div v-else-if="featuredPortfolio.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="(item, idx) in featuredPortfolio" :key="item.id"
            data-aos="fade-up" :data-aos-delay="(idx % 3) * 80"
            :class="idx === 0 || idx === 3 ? 'aspect-[3/4]' : 'aspect-[4/5]'"
            class="group relative overflow-hidden"
            style="background:#1a1208;"
          >
            <NuxtLink :to="`/portfolio/${item.id}`" class="block w-full h-full">
              <img
                v-if="getImageUrl(item.cover_url)"
                :src="getImageUrl(item.cover_url)"
                :alt="item.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div v-else class="w-full h-full" :style="getCategoryGradient(item.categories?.slug)" />

              <div class="absolute inset-0 bg-gradient-to-t from-[#0C0A07]/85 via-transparent to-transparent opacity-70 group-hover:opacity-95 transition-opacity duration-500" />
              <div class="absolute inset-0 border border-transparent group-hover:border-[#C9963A]/20 transition-all duration-500" />

              <div class="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-2 group-hover:translate-y-0">
                <span class="font-mono text-[9px] tracking-[0.3em] uppercase px-3 py-1.5" style="color:#C9963A;background:rgba(12,10,7,0.85);border:1px solid rgba(201,150,58,0.2);">
                  {{ item.categories?.name ?? '—' }}
                </span>
              </div>

              <div class="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
                <p class="font-mono text-[9px] tracking-widest uppercase mb-1" style="color:rgba(201,150,58,0.55);">{{ item.year }}</p>
                <h3 class="font-display text-base tracking-wide group-hover:text-[#E8C96A] transition-colors" style="color:#F5F0E8;">{{ item.title }}</h3>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div v-else class="text-center py-16 border" style="border-color:rgba(201,150,58,0.08);">
          <p class="font-serif text-xl italic" style="color:rgba(245,240,232,0.2);">Portfolio belum ada. Tambah data lewat aiven/02_seed.sql atau panel admin.</p>
        </div>

        <div class="flex justify-center mt-16" data-aos="fade-up">
          <NuxtLink to="/portfolio" class="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] uppercase px-10 py-4 border transition-all duration-300 hover:bg-[#C9963A]/8" style="border-color:rgba(201,150,58,0.3);color:#C9963A;">
            Lihat Semua Karya <span>→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ══ ABOUT ══ -->
    <section class="py-32 bg-[#080604] relative">
      <div class="absolute right-0 top-1/4 w-96 h-96 rounded-full pointer-events-none" style="background:rgba(201,150,58,0.04);filter:blur(130px);" />
      <div class="max-w-7xl mx-auto px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div class="relative" data-aos="fade-right">
            <div class="absolute -top-4 -left-4 w-full h-full border z-0" style="border-color:rgba(201,150,58,0.1);" />
            <div class="relative z-10 aspect-[3/4] overflow-hidden" style="background:linear-gradient(135deg,#1a1208,#2a1e10,#1a1208);">
              <img
                v-if="profileAvatarUrl"
                :src="profileAvatarUrl"
                :alt="profile?.name"
                class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                loading="lazy"
                @error="profileAvatarUrl = ''"
              />
              <div class="absolute inset-0 flex items-center justify-center" :class="profileAvatarUrl ? 'opacity-0' : ''">
                <span class="font-display" style="font-size:8rem;color:rgba(201,150,58,0.07);">{{ profile?.name?.charAt(0) ?? 'M' }}</span>
              </div>
            </div>
            <div class="absolute -bottom-4 -right-4 z-20 px-7 py-5 border" style="background:#0C0A07;border-color:rgba(201,150,58,0.18);">
              <span class="block font-display text-4xl gold-text">{{ profile?.years_experience ?? 4 }}+</span>
              <span class="font-mono text-[8px] tracking-[0.3em] uppercase block mt-1" style="color:rgba(245,240,232,0.22);">Tahun Berkarir</span>
            </div>
            <svg class="absolute top-0 left-0 z-20" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M0 24V0H24" stroke="#C9963A" stroke-width="1.5" stroke-opacity="0.4"/></svg>
            <svg class="absolute bottom-0 right-0 z-20 rotate-180" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M0 24V0H24" stroke="#C9963A" stroke-width="1.5" stroke-opacity="0.4"/></svg>
          </div>

          <div>
            <div class="flex items-center gap-4 mb-4" data-aos="fade-up">
              <div class="h-px w-10" style="background:linear-gradient(to right,#C9963A,transparent);" />
              <span class="font-mono text-[10px] tracking-[0.4em] uppercase" style="color:rgba(201,150,58,0.55);">Tentang Saya</span>
            </div>
            <h2 class="font-display uppercase leading-none mb-5 gold-text" style="font-size:clamp(2.5rem,5vw,5rem);" data-aos="fade-up" data-aos-delay="100">
              About<br/>{{ profile?.name?.split(' ')[0] ?? 'Miftah' }}
            </h2>
            <p class="font-serif text-xl italic leading-relaxed mb-5" style="color:rgba(245,240,232,0.52);" data-aos="fade-up" data-aos-delay="150">
              {{ profile?.bio ?? 'Membangun website yang cepat, rapi, dan enak dipakai — dari landing page sampai sistem informasi.' }}
            </p>
            <p class="font-body text-base leading-relaxed mb-10" style="color:rgba(245,240,232,0.32);" data-aos="fade-up" data-aos-delay="200">
              {{ shortBio }}
            </p>

            <div class="grid grid-cols-3 gap-0 border mb-10" style="border-color:rgba(201,150,58,0.10);" data-aos="fade-up" data-aos-delay="250">
              <div v-for="(stat, i) in aboutStats" :key="stat.label" class="py-5 px-4 text-center" :style="i < 2 ? 'border-right:1px solid rgba(201,150,58,0.10);' : ''">
                <span class="block font-display text-3xl mb-1 gold-text">{{ stat.value }}</span>
                <span class="font-mono text-[8px] tracking-[0.25em] uppercase" style="color:rgba(245,240,232,0.2);">{{ stat.label }}</span>
              </div>
            </div>

            <NuxtLink to="/about" class="inline-flex items-center font-mono text-[11px] tracking-[0.3em] uppercase px-8 py-3.5 transition-all duration-300 hover:-translate-y-0.5" style="background:linear-gradient(135deg,#C9963A,#E8C96A,#C9963A);color:#1a1208;font-weight:700;" data-aos="fade-up" data-aos-delay="300">
              Baca Selengkapnya
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SERVICES ══ -->
    <section class="py-32 bg-[#0C0A07] relative">
      <div class="max-w-7xl mx-auto px-8">
        <div class="text-center mb-14">
          <div class="flex items-center justify-center gap-4 mb-4" data-aos="fade-up">
            <div class="h-px w-10" style="background:linear-gradient(to right,transparent,#C9963A);" />
            <span class="font-mono text-[10px] tracking-[0.4em] uppercase" style="color:rgba(201,150,58,0.55);">What I Offer</span>
            <div class="h-px w-10" style="background:linear-gradient(to left,transparent,#C9963A);" />
          </div>
          <h2 class="font-display uppercase leading-none gold-text" style="font-size:clamp(3rem,7vw,6rem);" data-aos="fade-up" data-aos-delay="100">Services</h2>
        </div>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-px" style="background:rgba(201,150,58,0.08);">
          <div v-for="i in 3" :key="i" class="bg-[#0C0A07] p-10 h-64 animate-pulse" />
        </div>

        <div v-else-if="servicesList.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-px border" style="background:rgba(201,150,58,0.08);border-color:rgba(201,150,58,0.10);">
          <div
            v-for="(svc, idx) in servicesList" :key="svc.id"
            class="group relative bg-[#0C0A07] p-10 hover:bg-[#0e0b07] transition-all duration-500 overflow-hidden"
            data-aos="fade-up" :data-aos-delay="idx * 100"
          >
            <div class="h-px w-0 group-hover:w-full transition-all duration-700 mb-8" style="background:linear-gradient(to right,#C9963A,#E8C96A);" />
            <span class="font-mono text-[9px] tracking-[0.4em] mb-4 block" style="color:rgba(201,150,58,0.28);">{{ String(idx+1).padStart(2,'0') }}</span>
            <div class="text-4xl mb-5 select-none">{{ svc.icon }}</div>
            <h3 class="font-display text-2xl tracking-wider mb-3 uppercase group-hover:text-[#E8C96A] transition-colors" style="color:rgba(245,240,232,0.72);">{{ svc.title }}</h3>
            <p class="font-body text-sm leading-relaxed mb-5" style="color:rgba(245,240,232,0.28);">{{ svc.description }}</p>
            <div class="flex items-end gap-2 mb-5">
              <span class="font-mono text-[9px] tracking-widest uppercase" style="color:rgba(201,150,58,0.4);">{{ svc.price_label }}</span>
              <span class="font-display text-xl gold-text">{{ formatPrice(svc.price_min) }}</span>
            </div>
            <ul class="space-y-2 mb-7">
              <li v-for="f in svc.features" :key="f" class="flex items-center gap-3 font-body text-xs" style="color:rgba(245,240,232,0.26);">
                <span class="w-4 h-px flex-shrink-0" style="background:rgba(201,150,58,0.3);" />{{ f }}
              </li>
            </ul>
            <NuxtLink to="/contact" class="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase group-hover:text-[#C9963A] transition-colors" style="color:rgba(201,150,58,0.38);">
              {{ svc.cta_label }} <span class="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </NuxtLink>
          </div>
        </div>

        <div v-else class="text-center py-10 border" style="border-color:rgba(201,150,58,0.08);">
          <p class="font-serif italic" style="color:rgba(245,240,232,0.2);">Services belum ada.</p>
        </div>
      </div>
    </section>

    <!-- ══ TESTIMONIALS ══ -->
    <section class="py-32 bg-[#080604]">
      <div class="max-w-7xl mx-auto px-8">
        <div class="text-center mb-14">
          <div class="flex items-center justify-center gap-4 mb-4" data-aos="fade-up">
            <div class="h-px w-10" style="background:linear-gradient(to right,transparent,#C9963A);" />
            <span class="font-mono text-[10px] tracking-[0.4em] uppercase" style="color:rgba(201,150,58,0.55);">Client Words</span>
            <div class="h-px w-10" style="background:linear-gradient(to left,transparent,#C9963A);" />
          </div>
          <h2 class="font-display uppercase leading-none gold-text" style="font-size:clamp(3rem,7vw,6rem);" data-aos="fade-up" data-aos-delay="100">Testimonials</h2>
        </div>

        <div v-if="testimonials.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            v-for="(t, idx) in testimonials" :key="t.id"
            class="relative p-8 border hover:border-[#C9963A]/25 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            style="background:rgba(255,255,255,0.02);border-color:rgba(255,255,255,0.05);"
            data-aos="fade-up" :data-aos-delay="idx * 100"
          >
            <div class="absolute top-0 left-0 right-0 h-px" style="background:linear-gradient(to right,transparent,rgba(201,150,58,0.25),transparent);" />
            <div class="flex gap-1 mb-4">
              <span v-for="i in t.rating" :key="i" class="text-sm" style="color:rgba(201,150,58,0.55);">★</span>
            </div>
            <p class="font-serif text-lg italic leading-relaxed mb-6 relative z-10" style="color:rgba(245,240,232,0.52);">"{{ t.quote }}"</p>
            <div class="h-px mb-5" style="background:linear-gradient(to right,transparent,rgba(201,150,58,0.12),transparent);" />
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0" style="background:rgba(201,150,58,0.08);border-color:rgba(201,150,58,0.2);">
                <span class="font-display text-sm" style="color:#C9963A;">{{ t.client_name.charAt(0) }}</span>
              </div>
              <div>
                <p class="font-display text-sm tracking-wide" style="color:rgba(245,240,232,0.62);">{{ t.client_name }}</p>
                <p class="font-mono text-[8px] tracking-[0.2em] uppercase mt-0.5" style="color:rgba(201,150,58,0.42);">{{ t.client_role }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="!loading" class="text-center py-10">
          <p class="font-serif italic" style="color:rgba(245,240,232,0.2);">Testimonials belum ada.</p>
        </div>
      </div>
    </section>

    <!-- ══ CTA ══ -->
    <section class="relative py-36 overflow-hidden bg-[#0C0A07]">
      <div class="absolute inset-0" style="background:radial-gradient(ellipse at center,rgba(201,150,58,0.06) 0%,transparent 60%);" />
      <div class="relative z-10 max-w-4xl mx-auto px-8 text-center">
        <div class="flex items-center justify-center gap-4 mb-10" data-aos="fade-down">
          <div class="h-px w-20" style="background:linear-gradient(to right,transparent,rgba(201,150,58,0.35));" />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 0L10 5.5H16L11 9L13 16L8 12.5L3 16L5 9L0 5.5H6L8 0Z" fill="#C9963A" fill-opacity="0.35"/></svg>
          <div class="h-px w-20" style="background:linear-gradient(to left,transparent,rgba(201,150,58,0.35));" />
        </div>
        <h2 class="font-display uppercase leading-none mb-7 gold-text" style="font-size:clamp(3rem,8vw,7rem);" data-aos="fade-up" data-aos-delay="100">Let's Build<br/>Something</h2>
        <p class="font-serif text-xl italic leading-relaxed mb-12 max-w-xl mx-auto" style="color:rgba(245,240,232,0.32);" data-aos="fade-up" data-aos-delay="200">
          Ceritakan kebutuhan website atau sistem kamu. Mari kita rancang bersama.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-5" data-aos="fade-up" data-aos-delay="300">
          <NuxtLink to="/contact" class="inline-flex items-center font-mono text-[11px] tracking-[0.3em] uppercase px-12 py-5 transition-all duration-300 hover:-translate-y-0.5" style="background:linear-gradient(135deg,#C9963A,#E8C96A,#C9963A);color:#1a1208;font-weight:700;">Diskusikan Proyek</NuxtLink>
          <a :href="`mailto:${profile?.email ?? 'miftahpauzanjamil@gmail.com'}`" class="inline-flex items-center font-mono text-[11px] tracking-[0.3em] uppercase px-12 py-5 border transition-all duration-300" style="border-color:rgba(201,150,58,0.32);color:#C9963A;">
            {{ profile?.email ?? 'miftahpauzanjamil@gmail.com' }}
          </a>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Lemillion — Web Developer' })

const { fetchAll, fetchFeaturedPortfolio, profile, servicesList, testimonials, loading, getImageUrl, getProfileImageUrl, formatPrice } = useSiteData()

const featuredPortfolio = ref<any[]>([])
const heroImgUrl        = ref('')
const profileAvatarUrl  = ref('')

const heroNameWords = computed(() => {
  if (!profile.value?.name) return ['Miftah', 'Pauzan Jamil']
  return profile.value.name.trim().split(' ')
})

// Bio singkat dari bio_extended (2 kalimat pertama)
const shortBio = computed(() => {
  const bio = profile.value?.bio_extended ?? ''
  const sentences = bio.split(/[.!?]+/).filter((s: string) => s.trim()).slice(0, 2)
  return sentences.join('. ') + (sentences.length ? '.' : '')
})

const aboutStats = computed(() => [
  { value: `${profile.value?.years_experience ?? 4}+`,  label: 'Years' },
  { value: `${profile.value?.projects_count ?? 20}+`,    label: 'Projects' },
  { value: `${profile.value?.certifications_count ?? 4}`, label: 'Certificates' },
])

// Gradient fallback per kategori (kalau screenshot proyek belum diupload)
const getCategoryGradient = (slug: string) => {
  const map: Record<string, string> = {
    'landing-page':    'background:linear-gradient(135deg,#1a0d08,#2e1a10,#1a0d08);',
    'company-profile': 'background:linear-gradient(135deg,#0d1520,#1a2535,#0d1520);',
    'web-app':         'background:linear-gradient(135deg,#0a1a12,#142a1e,#0a1a12);',
    'e-commerce':      'background:linear-gradient(135deg,#12080e,#231018,#12080e);',
    'api-backend':     'background:linear-gradient(135deg,#141414,#242424,#141414);',
  }
  return (map[slug] ?? 'background:linear-gradient(135deg,#1a1208,#2a1e10,#1a1208);') + 'width:100%;height:100%;'
}

const tickerItems = computed(() => {
  const loc = profile.value?.location ?? 'Tasikmalaya'
  return ['Web Developer', 'Landing Page', 'Company Profile', 'Web App', 'Sistem Informasi', loc, 'Est. 2022']
})

onMounted(async () => {
  await fetchAll()

  heroImgUrl.value       = getProfileImageUrl(profile.value?.hero_image_url)
  profileAvatarUrl.value = getProfileImageUrl(profile.value?.avatar_url)

  const featured = await fetchFeaturedPortfolio(6)
  featuredPortfolio.value = featured as any[]
})
</script>

<style>
@keyframes subtleZoom { from { transform: scale(1); }     to { transform: scale(1.06); } }
@keyframes ticker     { from { transform: translateX(0); } to { transform: translateX(-25%); } }
</style>
