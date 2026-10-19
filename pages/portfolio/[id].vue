<template>
  <div class="arc" :class="{ shake }">
    <ArcFx />
    <div class="koflash" :class="{ on: shake }">K.O.</div>
    <template v-if="item">
      <PageHero :label="`▮▮ Boss · ${item.categories?.name || 'Project'} · ${item.year}`" :title="item.title" :sub="item.description" />
      <section id="boss" class="red">
        <p class="lbl">Boss HP · serang tiap tech stack</p>
        <div class="hp"><i :style="{ width: hp + '%' }" /></div>
        <div class="boss">
          <div>
            <p v-if="item.story" class="story">{{ item.story }}</p>
            <dl class="meta"><div v-for="m in meta" :key="m[0]"><dt class="lbl">{{ m[0] }}</dt><dd>{{ m[1] }}</dd></div></dl>
            <div class="row"><a v-if="item.demo_url" class="btn s" :href="item.demo_url" target="_blank" rel="noopener">Live demo ↗</a><a v-if="item.repo_url" class="btn" :href="item.repo_url" target="_blank" rel="noopener">Repo ↗</a></div>
          </div>
          <div class="atk"><button v-for="(a, j) in attacks" :key="a" class="a" :class="{ hit: hitIdx.includes(j) }" @click="hit(j)"><span class="lbl">Attack 0{{ j + 1 }}</span><em>▶</em>{{ a }}</button></div>
        </div>
        <span v-for="d in dmgs" :key="d.id" class="dmg" :style="{ left: d.x + '%' }">-{{ dmg }}%</span>
      </section>
      <section class="red" :class="{ pop: ko }" id="ko"><h2 class="gl">K.O.</h2><p class="lbl">Project cleared</p><p class="st">{{ '★'.repeat(item.is_featured ? 3 : 2) }}</p><div class="recap"><span v-for="a in attacks" :key="a" class="lbl">{{ a }}</span></div></section>
      <section v-if="gallery.length" class="dark"><h2 class="gl">Screen<br>shots.</h2><div class="gal"><img v-for="g in gallery" :key="g" :src="g" alt="" loading="lazy"></div></section>
      <section v-if="related.length" class="dark">
        <h2 class="gl">Next<br>level.</h2>
        <div class="levels all"><NuxtLink v-for="(p, i) in related" :key="p.id" :to="`/portfolio/${p.id}`" class="card" :style="cardStyle(p, i)"><b>{{ p.title }}</b><span class="lbl">{{ p.categories?.name || 'Project' }} · {{ p.year }}</span></NuxtLink></div>
      </section>
    </template>
    <PageHero v-else label="▮▮ Game over" title="Level|not found." sub="Proyek ini tidak ada atau belum dipublikasikan." />
    <section class="red cta"><p class="lbl">Final round</p><h2 class="gl">Punya proyek<br>serupa?</h2><NuxtLink class="btn s" to="/contact">Start your campaign ↗</NuxtLink></section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchPortfolioItem, getImageUrl } = useSiteData()
const data: any = await fetchPortfolioItem(route.params.id as string)
const item = ref<any>(data?.item ?? null)
const related = ref<any[]>(data?.related ?? [])
const hitIdx = ref<number[]>([]), shake = ref(false), dmgs = ref<{ id: number; x: number }[]>([])
let bt: any, did = 0

const attacks = computed<string[]>(() => {
  const l = String(item.value?.tech_stack || '').split(/[,/·|]+/).map((s) => s.trim()).filter(Boolean)
  return (l.length ? l : item.value?.tags?.length ? item.value.tags : ['Nuxt', 'Tailwind', 'PostgreSQL', 'SEO', 'Deploy']).slice(0, 5)
})
const hp = computed(() => 100 - (hitIdx.value.length / (attacks.value.length || 1)) * 100)
const ko = computed(() => attacks.value.length > 0 && hitIdx.value.length >= attacks.value.length)
const dmg = computed(() => Math.round(100 / (attacks.value.length || 1)))
const meta = computed(() => [['Client', item.value?.client], ['Role', item.value?.role], ['Location', item.value?.location], ['Year', item.value?.year]].filter((m) => m[1]))
const gallery = computed(() => (item.value?.gallery_urls || []).map((g: string) => getImageUrl(g)).filter(Boolean))
function hit(j: number) {
  if (hitIdx.value.includes(j)) return
  hitIdx.value.push(j)
  const id = ++did
  dmgs.value.push({ id, x: 30 + Math.random() * 50 })
  setTimeout(() => (dmgs.value = dmgs.value.filter((d) => d.id !== id)), 900)
}
watch(ko, (v) => { if (v) { shake.value = true; setTimeout(() => (shake.value = false), 1300) } })
const grads = ['#ff3d6e,#d9141b', '#9aff3d,#14b84a', '#2fd4ff,#2f5bff']
function cardStyle(p: any, i: number) {
  let u = ''
  try { u = getImageUrl(p.cover_url || p.image_url) } catch {}
  return { '--g': `linear-gradient(160deg,${grads[i % 3]})`, '--img': u ? `url("${u}")` : 'none' }
}
onMounted(() => {
  const el = document.getElementById('boss')
  if (!el) return
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting || bt) return
    let k = 0
    bt = setInterval(() => { if (k >= attacks.value.length) return clearInterval(bt); hit(k++) }, 500)
  }, { threshold: 0.35 }).observe(el)
})
onBeforeUnmount(() => clearInterval(bt))
useHead(() => ({ title: item.value ? `${item.value.title} — Lemillion` : 'Portfolio — Lemillion' }))
</script>
