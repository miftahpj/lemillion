<template>
  <div class="min-h-screen bg-[#0C0A07]">

    <!-- Header -->
    <div class="pt-40 pb-14 px-8 max-w-7xl mx-auto text-center">
      <div class="flex items-center justify-center gap-4 mb-5" data-aos="fade-up">
        <div class="h-px w-10" style="background:linear-gradient(to right,transparent,#C9963A);" />
        <span class="font-mono text-[10px] tracking-[0.4em] uppercase" style="color:rgba(201,150,58,0.55);">Selected Work</span>
        <div class="h-px w-10" style="background:linear-gradient(to left,transparent,#C9963A);" />
      </div>
      <h1 class="font-display uppercase leading-none mb-3 gold-text" style="font-size:clamp(4rem,9vw,8rem);" data-aos="fade-up" data-aos-delay="100">Portfolio</h1>
      <p class="font-serif text-lg italic max-w-md mx-auto" style="color:rgba(245,240,232,0.32);" data-aos="fade-up" data-aos-delay="150">
        Kumpulan proyek website dan aplikasi yang pernah saya kerjakan sejak 2022.
      </p>
    </div>

    <!-- Category filter -->
    <div class="max-w-7xl mx-auto px-8 mb-12">
      <div class="flex flex-wrap items-center justify-center gap-3" data-aos="fade-up">
        <button
          @click="selectCategory('all')"
          class="font-mono text-[9px] tracking-[0.25em] uppercase px-5 py-2.5 border transition-all duration-300"
          :style="activeCategory === 'all'
            ? 'border-color:rgba(201,150,58,0.6);color:#C9963A;background:rgba(201,150,58,0.08);'
            : 'border-color:rgba(255,255,255,0.06);color:rgba(245,240,232,0.24);'"
        >Semua</button>
        <button
          v-for="cat in categories" :key="cat.id"
          @click="selectCategory(cat.slug)"
          class="font-mono text-[9px] tracking-[0.25em] uppercase px-5 py-2.5 border transition-all duration-300"
          :style="activeCategory === cat.slug
            ? 'border-color:rgba(201,150,58,0.6);color:#C9963A;background:rgba(201,150,58,0.08);'
            : 'border-color:rgba(255,255,255,0.06);color:rgba(245,240,232,0.24);'"
        >{{ cat.name }}</button>
      </div>
    </div>

    <!-- Grid -->
    <div class="max-w-7xl mx-auto px-8 pb-32">
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="i in 6" :key="i" class="aspect-[4/5] animate-pulse" style="background:rgba(255,255,255,0.03);" />
      </div>

      <div v-else-if="items.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="(item, idx) in items" :key="item.id"
          v-tilt
          data-aos="fade-up" :data-aos-delay="(idx % 6) * 60"
          class="group relative aspect-[4/5] overflow-hidden"
          style="background:#1a1208;"
        >
          <NuxtLink :to="`/portfolio/${item.id}`" class="block w-full h-full">
            <img
              v-if="getImageUrl(item.cover_url)"
              :src="getImageUrl(item.cover_url)"
              :alt="item.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy" decoding="async"
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

      <div v-else class="text-center py-24 border" style="border-color:rgba(201,150,58,0.08);">
        <p class="font-serif text-xl italic" style="color:rgba(245,240,232,0.2);">Belum ada proyek di kategori ini.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Portfolio — Lemillion Web Developer' })

const route = useRoute()
const { fetchPortfolio, fetchCategories, portfolioList: items, categories, loading, getImageUrl } = useSiteData()

const activeCategory = ref((route.query.category as string) ?? 'all')

// SSR: kategori aktif dari query URL langsung di-fetch di server.
await Promise.all([fetchCategories(), fetchPortfolio(activeCategory.value)])

const selectCategory = async (slug: string) => {
  activeCategory.value = slug
  await navigateTo({ path: '/portfolio', query: slug === 'all' ? {} : { category: slug } })
  await fetchPortfolio(slug)
}

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
</script>
