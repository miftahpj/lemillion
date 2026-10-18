<template>
  <div class="arc">
    <section id="top" class="hero red">
      <p class="lbl">▮▮ Web Developer · {{ profile?.location || 'Tasikmalaya' }}</p>
      <h1><span>Build.</span><span>Launch.</span><span>Last.</span></h1>
      <p class="d">{{ profile?.tagline || 'Landing page, company profile, hingga sistem informasi' }} — <b>dibuat cepat, awet dipakai.</b></p>
      <div class="row"><a class="btn s" href="#work">Lihat karya ↗</a><NuxtLink class="btn" to="/contact">▶ Ajak kerja sama</NuxtLink></div>
      <div class="stats">
        <div v-for="(s, i) in stats" :key="s.label"><span class="lbl">{{ s.label }} {{ s.value }}</span><i :style="{ '--n': 4 + (i % 3) }" /></div>
      </div>
    </section>

    <section id="work" class="dark">
      <h2>Pick a level.</h2>
      <p class="lbl">Proyek pilihan · pakai tombol panah + Enter</p>
      <div class="combo lbl">Combo<b>X{{ combo }}</b></div>
      <div v-if="levels.length" class="levels">
        <button v-for="(p, i) in levels" :key="p.id" class="card" :class="{ sel: i === cur }" :style="cardStyle(p, i)" @click="pick(i)">
          <b>{{ p.title }}</b><span class="lbl">{{ p.categories?.name || 'Project' }} · {{ p.year }} ★★★</span>
        </button>
      </div>
      <p v-else class="lbl">Belum ada proyek yang dipublikasikan.</p>
    </section>
    <div class="toast" :class="{ on: toast }">Full combo!</div>

    <section id="boss" class="red">
      <p class="lbl">Boss · {{ sel?.title || 'Launch week' }}</p>
      <div class="hp"><i :style="{ width: hp + '%' }" /></div>
      <p class="lbl">Studi kasus unggulan · {{ sel?.year }}</p>
      <div v-if="sel" class="boss">
        <div><h2>{{ sel.title }}</h2><p>{{ sel.description }}</p></div>
        <div class="atk">
          <button v-for="(a, j) in attacks" :key="a" class="a" :class="{ hit: hitIdx.includes(j) }" @click="hit(j)">
            <span class="lbl">Attack 0{{ j + 1 }}</span><em>▶</em>{{ a }}
          </button>
        </div>
      </div>
    </section>

    <section id="ko" class="red" :class="{ pop: ko }">
      <h2>K.O.</h2><p class="lbl">Project cleared</p><p class="st">★★</p>
      <NuxtLink v-if="sel" class="btn s" :to="`/portfolio/${sel.id}`">Buka studi kasus ↗</NuxtLink>
    </section>

    <section id="services" class="dark" :class="{ open }">
      <h2>What’s<br>in the box.</h2>
      <div class="box">//</div>
      <div class="loot">
        <div v-for="(s, i) in servicesList.slice(0, 4)" :key="s.id" class="it" :style="{ '--c': rarity[i][1], '--k': i }">
          <span class="lbl">{{ rarity[i][0] }}</span><b>{{ s.title }}</b><span class="lbl">{{ s.price_label }}</span>
        </div>
      </div>
    </section>

    <section id="final" class="red">
      <p class="lbl">Final round</p><h2>Proyekmu.<br>Giliran saya.</h2>
      <NuxtLink class="btn s" to="/contact">Mulai kampanye ↗</NuxtLink>
    </section>

    <section id="cont" class="dark">
      <h2>{{ gameOver ? 'Game over.' : 'Continue?' }} <b v-if="!gameOver">{{ cd }}</b></h2>
      <div class="yn"><button class="btn" @click="restart">Y – Yes</button><button class="btn" @click="end">N – No</button></div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Miftah Pauzan Jamil (Lemillion) — Web Developer Tasikmalaya',
  description: 'Portfolio Miftah Pauzan Jamil (Lemillion), Web Developer di Tasikmalaya sejak 2022. Landing page, company profile, hingga sistem informasi.',
})
const { fetchAll, profile, portfolioList, servicesList, getImageUrl } = useSiteData()
await fetchAll()

const stats = computed(() => [
  { value: `${profile.value?.years_experience ?? 4}+`, label: 'Years' },
  { value: `${profile.value?.projects_count ?? 20}+`, label: 'Projects' },
  { value: `${profile.value?.clients_count ?? 10}+`, label: 'Clients' },
])
const levels = computed(() => portfolioList.value.slice(0, 3))
const grads = ['#ff3d6e,#d9141b', '#9aff3d,#14b84a', '#2fd4ff,#2f5bff']
const rarity = [['Legendary', '#F5C518'], ['Epic', '#b56cff'], ['Rare', '#3fa9ff'], ['Uncommon', '#2fe36d']]
const cardStyle = (p: any, i: number) => {
  let u = ''
  try { u = getImageUrl(p.cover_url || p.image_url) } catch {}
  return { '--g': `linear-gradient(160deg,${grads[i % 3]})`, '--img': u ? `url("${u}")` : 'none' }
}

const cur = ref(0), seen = ref<number[]>([]), toast = ref(false), hitIdx = ref<number[]>([])
const cd = ref(9), gameOver = ref(false), open = ref(false)
let bt: any, ct: any, inLevels = false, inCont = false

const sel = computed(() => levels.value[cur.value])
const combo = computed(() => seen.value.length)
const attacks = computed(() => {
  const p: any = sel.value
  const l = String(p?.tech_stack || '').split(/[,/·|]+/).map((s) => s.trim()).filter(Boolean)
  return (l.length ? l : p?.tags?.length ? p.tags : ['Nuxt', 'Tailwind', 'PostgreSQL', 'SEO', 'Deploy']).slice(0, 5)
})
const hp = computed(() => 100 - (hitIdx.value.length / (attacks.value.length || 1)) * 100)
const ko = computed(() => attacks.value.length > 0 && hitIdx.value.length >= attacks.value.length)

function pick(i: number) {
  const n = levels.value.length
  if (!n) return
  cur.value = (i + n) % n
  if (!seen.value.includes(cur.value)) seen.value.push(cur.value)
  hitIdx.value = []
  if (seen.value.length === n && n > 1) { toast.value = true; setTimeout(() => (toast.value = false), 1600) }
}
const hit = (j: number) => { if (!hitIdx.value.includes(j)) hitIdx.value.push(j) }
function battle() {
  clearInterval(bt)
  let k = 0
  bt = setInterval(() => { if (k >= attacks.value.length) return clearInterval(bt); hit(k++) }, 500)
}
function start() {
  clearInterval(ct); gameOver.value = false; cd.value = 9
  ct = setInterval(() => { if (--cd.value <= 0) { gameOver.value = true; clearInterval(ct) } }, 1000)
}
function end() { clearInterval(ct); gameOver.value = true }
function restart() {
  clearInterval(ct); clearInterval(bt); seen.value = []; hitIdx.value = []; cur.value = 0; open.value = false
  scrollTo({ top: 0, behavior: 'smooth' })
}
function onKey(e: KeyboardEvent) {
  if (inLevels && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); pick(cur.value + (e.key === 'ArrowRight' ? 1 : -1)) }
  else if (inLevels && e.key === 'Enter') document.getElementById('boss')?.scrollIntoView({ behavior: 'smooth' })
  else if (inCont && /^[yn]$/i.test(e.key)) e.key.toLowerCase() === 'y' ? restart() : end()
}
onMounted(() => {
  const obs = (id: string, fn: (v: boolean) => void) =>
    new IntersectionObserver(([e]) => fn(e.isIntersecting), { threshold: 0.35 }).observe(document.getElementById(id)!)
  obs('work', (v) => (inLevels = v))
  obs('boss', (v) => v && battle())
  obs('services', (v) => v && (open.value = true))
  obs('cont', (v) => { inCont = v; if (v) start() })
  addEventListener('keydown', onKey)
})
onBeforeUnmount(() => { clearInterval(bt); clearInterval(ct); removeEventListener('keydown', onKey) })
</script>
