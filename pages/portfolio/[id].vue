<template>
  <div class="min-h-screen bg-[#0C0A07]">

    <div v-if="loading" class="pt-40 px-8 max-w-5xl mx-auto space-y-6">
      <div class="h-10 w-1/2 animate-pulse" style="background:rgba(255,255,255,0.03);" />
      <div class="aspect-video animate-pulse" style="background:rgba(255,255,255,0.03);" />
    </div>

    <div v-else-if="!item" class="pt-52 px-8 text-center">
      <p class="font-serif text-2xl italic mb-6" style="color:rgba(245,240,232,0.3);">Proyek tidak ditemukan.</p>
      <NuxtLink to="/portfolio" class="font-mono text-[11px] tracking-[0.3em] uppercase" style="color:#C9963A;">← Kembali ke Portfolio</NuxtLink>
    </div>

    <template v-else>
      <!-- Hero -->
      <div class="relative min-h-[55vh] flex items-end overflow-hidden">
        <div class="absolute inset-0 z-0">
          <img v-if="getImageUrl(item.cover_url)" :src="getImageUrl(item.cover_url)" :alt="item.title"
            class="w-full h-full object-cover" loading="eager" />
          <div v-else class="w-full h-full" :style="getCategoryGradient(item.categories?.slug)" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#0C0A07] via-[#0C0A07]/30 to-transparent" />
        </div>
        <div class="relative z-10 max-w-5xl mx-auto px-8 pb-16 pt-36 w-full">
          <NuxtLink to="/portfolio" class="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase mb-8 transition-colors hover:text-[#E8C96A]" style="color:rgba(201,150,58,0.55);">
            ← Portfolio
          </NuxtLink>
          <span class="font-mono text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 border inline-block mb-5" style="color:#C9963A;border-color:rgba(201,150,58,0.25);background:rgba(12,10,7,0.6);">
            {{ item.categories?.name ?? '—' }}
          </span>
          <h1 class="font-display uppercase leading-none gold-text" style="font-size:clamp(2.5rem,7vw,6rem);">{{ item.title }}</h1>
        </div>
      </div>

      <!-- Body -->
      <div class="max-w-5xl mx-auto px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">

          <!-- Meta sidebar -->
          <div class="md:col-span-1 space-y-8 order-2 md:order-1">
            <div v-for="meta in metaFields" :key="meta.label">
              <p class="font-mono text-[8px] tracking-[0.4em] uppercase mb-2" style="color:rgba(201,150,58,0.4);">{{ meta.label }}</p>
              <p class="font-body text-sm" style="color:rgba(245,240,232,0.5);">{{ meta.value }}</p>
            </div>

            <div v-if="item.repo_url || item.demo_url" class="space-y-3 pt-4">
              <a v-if="item.demo_url" :href="item.demo_url" target="_blank" rel="noopener"
                class="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase px-6 py-3.5 w-full transition-all hover:-translate-y-0.5"
                style="background:linear-gradient(135deg,#C9963A,#E8C96A,#C9963A);color:#1a1208;font-weight:700;">
                Live Demo ↗
              </a>
              <a v-if="item.repo_url" :href="item.repo_url" target="_blank" rel="noopener"
                class="flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase px-6 py-3.5 w-full border transition-all"
                style="border-color:rgba(201,150,58,0.3);color:#C9963A;">
                Source Code ↗
              </a>
            </div>
          </div>

          <!-- Description -->
          <div class="md:col-span-2 order-1 md:order-2">
            <p class="font-mono text-[9px] tracking-[0.5em] uppercase mb-6" style="color:rgba(201,150,58,0.4);">// Overview</p>
            <p class="font-serif text-xl italic leading-relaxed mb-6" style="color:rgba(245,240,232,0.55);">{{ item.description }}</p>
            <p v-if="item.story" class="font-body text-base leading-relaxed" style="color:rgba(245,240,232,0.32);">{{ item.story }}</p>

            <div v-if="item.tags?.length" class="flex flex-wrap gap-2 mt-8">
              <span v-for="tag in item.tags" :key="tag" class="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border" style="border-color:rgba(201,150,58,0.15);color:rgba(245,240,232,0.3);">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Gallery -->
        <div v-if="item.gallery_urls?.length" class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
          <img v-for="(url, i) in item.gallery_urls" :key="i" :src="getImageUrl(url)" :alt="`${item.title} screenshot ${Number(i)+1}`" class="w-full object-cover" loading="lazy" decoding="async" />
        </div>
      </div>

      <!-- Related -->
      <section v-if="related.length > 0" class="py-24 bg-[#080604]">
        <div class="max-w-5xl mx-auto px-8">
          <p class="font-mono text-[9px] tracking-[0.5em] uppercase mb-10 text-center" style="color:rgba(201,150,58,0.4);">More Projects</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <NuxtLink v-for="r in related" :key="r.id" :to="`/portfolio/${r.id}`" class="group relative aspect-[4/5] overflow-hidden" style="background:#1a1208;">
              <img v-if="getImageUrl(r.cover_url)" :src="getImageUrl(r.cover_url)" :alt="r.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" decoding="async" />
              <div v-else class="w-full h-full" :style="getCategoryGradient(r.categories?.slug)" />
              <div class="absolute inset-0 bg-gradient-to-t from-[#0C0A07]/85 via-transparent to-transparent" />
              <div class="absolute bottom-0 left-0 right-0 p-5">
                <p class="font-mono text-[9px] tracking-widest uppercase mb-1" style="color:rgba(201,150,58,0.55);">{{ r.year }}</p>
                <h3 class="font-display text-base tracking-wide group-hover:text-[#E8C96A] transition-colors" style="color:#F5F0E8;">{{ r.title }}</h3>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="relative py-24 bg-[#0C0A07]">
        <div class="relative z-10 max-w-2xl mx-auto px-8 text-center">
          <h2 class="font-display uppercase leading-none mb-8 gold-text" style="font-size:clamp(2.2rem,5vw,4rem);">Punya Proyek Serupa?</h2>
          <NuxtLink to="/contact" class="inline-flex items-center font-mono text-[11px] tracking-[0.3em] uppercase px-10 py-4 transition-all hover:-translate-y-0.5" style="background:linear-gradient(135deg,#C9963A,#E8C96A,#C9963A);color:#1a1208;font-weight:700;">
            Diskusikan Proyek
          </NuxtLink>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchPortfolioItem, getImageUrl } = useSiteData()

const data: any = await fetchPortfolioItem(route.params.id as string)
const item    = ref<any | null>(data?.item ?? null)
const related = ref<any[]>(data?.related ?? [])
const loading = ref(false)

const metaFields = computed(() => {
  if (!item.value) return []
  return [
    item.value.client   && { label: 'Client',     value: item.value.client },
    item.value.role      && { label: 'Role',       value: item.value.role },
    item.value.tech_stack && { label: 'Tech Stack', value: item.value.tech_stack },
    { label: 'Year', value: String(item.value.year) },
  ].filter(Boolean) as { label: string; value: string }[]
})

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

useHead(() => ({ title: item.value ? `${item.value.title} — Lemillion` : 'Portfolio — Lemillion' }))
</script>
