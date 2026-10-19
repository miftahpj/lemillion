<template>
  <div class="arc">
    <ArcFx />
    <PageHero label="▮▮ All levels" title="Pick a|level." :sub="`${items.length} proyek${activeCategory !== 'all' ? ' di kategori ini' : ''}`" />
    <section class="dark">
      <div class="chips" style="margin-top: 0">
        <button class="chip" :class="{ on: activeCategory === 'all' }" @click="selectCategory('all')">All</button>
        <button v-for="c in categories" :key="c.id" class="chip" :class="{ on: activeCategory === c.slug }" @click="selectCategory(c.slug)">{{ c.name }}</button>
      </div>
      <div v-if="items.length" class="levels all">
        <NuxtLink v-for="(p, i) in items" :key="p.id" :to="`/portfolio/${p.id}`" class="card" :style="cardStyle(p, i)">
          <b>{{ p.title }}</b>
          <span class="lbl">{{ p.categories?.name || 'Project' }} · {{ p.year }} {{ '★'.repeat(p.is_featured ? 3 : 2) }}</span>
          <span class="lbl tags">{{ (p.tags || []).slice(0, 3).join(' · ') }}</span>
        </NuxtLink>
      </div>
      <p v-else class="lbl" style="margin-top: 6vh">Belum ada karya di kategori ini.</p>
    </section>
    <section class="red cta"><p class="lbl">Final round</p><h2 class="gl">Punya proyek<br>serupa?</h2><NuxtLink class="btn s" to="/contact">Start your campaign ↗</NuxtLink></section>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Portfolio — Lemillion Web Developer' })
const route = useRoute()
const { fetchPortfolio, fetchCategories, portfolioList: items, categories, getImageUrl } = useSiteData()
const activeCategory = ref((route.query.category as string) ?? 'all')
await Promise.all([fetchCategories(), fetchPortfolio(activeCategory.value)])

const selectCategory = async (slug: string) => {
  activeCategory.value = slug
  await navigateTo({ path: '/portfolio', query: slug === 'all' ? {} : { category: slug } })
  await fetchPortfolio(slug)
}
const grads = ['#ff3d6e,#d9141b', '#9aff3d,#14b84a', '#2fd4ff,#2f5bff']
function cardStyle(p: any, i: number) {
  let u = ''
  try { u = getImageUrl(p.cover_url || p.image_url) } catch {}
  return { '--g': `linear-gradient(160deg,${grads[i % 3]})`, '--img': u ? `url("${u}")` : 'none' }
}
</script>
