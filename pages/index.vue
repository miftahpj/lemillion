<template>
  <div class="arc" :class="{ shake }">
    <canvas ref="fx" class="spark" />
    <div class="shards" :class="{ go: shardGo }"><i v-for="n in 6" :key="n" :style="{ '--k': n }" /></div>
    <div class="koflash" :class="{ on: shake }">K.O.</div>
    <div class="toast" :class="{ on: toast }">{{ toastMsg }}</div>

    <section id="top" class="hero red">
      <p class="lbl">▮▮ {{ profile?.name || 'Lemillion' }} · Web Developer · {{ profile?.location || 'Tasikmalaya' }}</p>
      <h1 class="gl"><span>Build.</span><span>Launch.</span><span>Last.</span></h1>
      <p class="d">{{ profile?.tagline || 'Landing page, company profile, hingga sistem informasi' }} — <b>dibuat cepat, awet dipakai.</b></p>
      <div class="row"><a class="btn s" href="#work">Lihat karya ↗</a><a class="btn" href="#boss" @click="unlock('reel', 'showreel')">▶ Lihat showreel</a></div>
      <div class="art" aria-hidden="true">
        <svg viewBox="0 0 200 260"><path d="M60 10h55l-38 240H22zM130 10h55l-38 240H92z" /></svg>
        <img v-if="heroImg" :src="heroImg" alt="" @error="heroFail = true">
      </div>
      <div class="stats"><div v-for="(s, i) in stats.slice(0, 3)" :key="s.label"><span class="lbl">{{ s.label }} {{ s.value }}</span><i :style="{ '--n': 5 + (i % 2) }" /></div></div>
    </section>

    <section id="about" class="dark">
      <h2 class="gl">Player 1.</h2>
      <p class="lbl">Character select · {{ profile?.name }}</p>
      <div class="about">
        <div class="portrait">
          <img v-if="avatar" :src="avatar" :alt="profile?.name" @error="avFail = true">
          <span class="lbl">P1 · {{ profile?.location }}</span>
        </div>
        <div class="bio">
          <p class="lead">{{ profile?.bio }}</p>
          <p v-for="(t, i) in bioParas" :key="i">{{ t }}</p>
          <img v-if="sign" class="sign" :src="sign" alt="">
          <div class="stats big"><div v-for="(s, i) in stats" :key="s.label"><span class="lbl">{{ s.label }} {{ s.value }}</span><i :style="{ '--n': 4 + (i % 3) }" /></div></div>
          <div class="row"><a v-for="s in socials" :key="s[0]" class="btn" :href="s[1]" target="_blank" rel="noopener">{{ s[0] }} ↗</a><NuxtLink class="btn s" to="/about">Selengkapnya ↗</NuxtLink></div>
        </div>
      </div>
      <template v-if="awards.length">
        <p class="lbl ach-t">Achievements unlocked · {{ awards.length }}</p>
        <div class="ach"><div v-for="a in awards" :key="a.id" class="it" style="--c: #F5C518"><span class="lbl">{{ a.year }} · {{ a.organization }}</span><b>{{ a.title }}</b><p v-if="a.description">{{ a.description }}</p></div></div>
      </template>
    </section>

    <section id="work" class="dark">
      <h2 class="gl">Pick a level.</h2>
      <p class="lbl">Karya pilihan · tombol panah + Enter</p>
      <div class="combo lbl">Combo<b>X{{ combo }}</b></div>
      <div class="chips">
        <button class="chip" :class="{ on: cat === 'all' }" @click="setCat('all')">All</button>
        <button v-for="c in categories" :key="c.id" class="chip" :class="{ on: cat === c.slug }" @click="setCat(c.slug)">{{ c.name }}</button>
      </div>
      <div v-if="levels.length" class="levels">
        <button v-for="(p, i) in levels" :key="p.id" class="card" :class="{ sel: i === cur }" :style="cardStyle(p, i)" @click="pick(i)" @dblclick="goBoss">
          <b>{{ p.title }}</b><span class="lbl">{{ p.categories?.name || 'Project' }} · {{ p.year }} {{ '★'.repeat(p.is_featured ? 3 : 2) }}</span>
        </button>
      </div>
      <p v-else class="lbl" style="margin-top: 6vh">Belum ada karya di kategori ini.</p>
      <div class="row" style="margin-top: 5vh"><NuxtLink class="btn" to="/portfolio">Semua level ↗</NuxtLink></div>
    </section>

    <section id="boss" class="red">
      <p class="lbl">Boss · {{ sel?.title || 'Launch week' }}</p>
      <div class="hp"><i :style="{ width: hp + '%' }" /></div>
      <p class="lbl">Studi kasus unggulan · {{ sel?.categories?.name }} · {{ sel?.year }}</p>
      <div v-if="sel" class="boss">
        <div>
          <h2 class="gl">{{ sel.title }}</h2>
          <p>{{ sel.description }}</p>
          <p v-if="sel.story" class="story">{{ sel.story }}</p>
          <dl class="meta"><div v-for="m in meta" :key="m[0]"><dt class="lbl">{{ m[0] }}</dt><dd>{{ m[1] }}</dd></div></dl>
          <div class="row"><a v-if="sel.demo_url" class="btn s" :href="sel.demo_url" target="_blank" rel="noopener">Live demo ↗</a><a v-if="sel.repo_url" class="btn" :href="sel.repo_url" target="_blank" rel="noopener">Repo ↗</a></div>
        </div>
        <div class="atk">
          <button v-for="(a, j) in attacks" :key="a" class="a" :class="{ hit: hitIdx.includes(j) }" @click="hit(j)"><span class="lbl">Attack 0{{ j + 1 }}</span><em>{{ icons[j % 5] }}</em>{{ a }}</button>
        </div>
      </div>
      <div v-if="gallery.length" class="gal"><img v-for="g in gallery" :key="g" :src="g" alt="" loading="lazy"></div>
      <span v-for="d in dmgs" :key="d.id" class="dmg" :style="{ left: d.x + '%' }">-{{ dmg }}%</span>
    </section>

    <section id="ko" class="red" :class="{ pop: ko }">
      <h2 class="gl">K.O.</h2><p class="lbl">Campaign cleared</p><p class="st">{{ '★'.repeat(sel?.is_featured ? 3 : 2) }}</p>
      <div class="recap"><span v-for="a in attacks" :key="a" class="lbl">{{ a }}</span></div>
      <NuxtLink v-if="sel" class="btn s" :to="`/portfolio/${sel.id}`" style="margin-top: 22px">Buka halaman proyek ↗</NuxtLink>
    </section>

    <section id="services" class="dark" :class="{ open }">
      <h2 class="gl">What’s<br>in the box.</h2>
      <button class="box" :class="{ open }" aria-label="Open the box" @click="toggleBox"><span>//</span><i v-for="n in 4" :key="n" class="beam" :style="{ '--k': n }" /></button>
      <div class="loot">
        <article v-for="(s, i) in servicesList" :key="s.id" class="it" :style="{ '--c': rarity[i % 4][1], '--k': i }">
          <span class="lbl">{{ rarity[i % 4][0] }}{{ s.duration ? ' · ' + s.duration : '' }}</span>
          <b>{{ s.title }}</b><p>{{ s.description }}</p>
          <ul><li v-for="f in (s.features || []).slice(0, 4)" :key="f">{{ f }}</li></ul>
          <span class="lbl">{{ s.price_label || formatPrice(s.price_min) }}</span>
          <button class="btn" @click="choose(s)">{{ s.cta_label || 'Pilih paket' }} ↗</button>
        </article>
      </div>
    </section>

    <section v-if="testimonials.length" id="reviews" class="dark">
      <h2 class="gl">Player<br>reviews.</h2>
      <div class="revs">
        <blockquote v-for="t in testimonials" :key="t.id" class="rev">
          <span class="lbl star">{{ '★'.repeat(t.rating || 5) }}</span><p>“{{ t.quote }}”</p>
          <footer><b>{{ t.client_name }}</b> <span class="lbl">{{ t.client_role }}</span></footer>
        </blockquote>
      </div>
    </section>

    <section v-if="slots.length" id="slots" class="dark">
      <h2 class="gl">Server<br>status.</h2><p class="lbl">Slot kerja per bulan · pilih bulan lalu kirim brief</p>
      <div class="slots">
        <button v-for="m in slots" :key="m.id" class="slot" :class="m.status" :disabled="m.status === 'full'" @click="pickSlot(m)">
          <span class="lbl">{{ m.month }}</span><b>{{ statusLabel[m.status] || m.status }}</b><small>{{ m.notes }}</small>
        </button>
      </div>
    </section>

    <section id="final" class="red">
      <p class="lbl">Final round</p><h2 class="gl">Proyekmu.<br>Giliran saya.</h2>
      <form class="frm" @submit.prevent="send">
        <input v-model="form.name" required placeholder="Nama" autocomplete="name">
        <input v-model="form.email" type="email" required placeholder="Email" autocomplete="email">
        <input v-model="form.phone" placeholder="WhatsApp / telepon" autocomplete="tel">
        <select v-model="form.session_type"><option value="">Jenis proyek</option><option v-for="t in types" :key="t">{{ t }}</option></select>
        <select v-model="form.budget_range"><option value="">Budget</option><option v-for="b in budgets" :key="b">{{ b }}</option></select>
        <input v-model="form.preferred_date" type="date" aria-label="Tanggal mulai">
        <input v-model="form.location_pref" placeholder="Lokasi / kota" class="wide">
        <textarea v-model="form.message" required rows="4" placeholder="Ceritakan proyekmu" />
        <button class="btn s" :disabled="submitting">{{ submitting ? 'Mengirim…' : 'Start your campaign ↗' }}</button>
        <p v-if="msg" class="lbl" :class="{ ok }">{{ msg }}</p>
      </form>
      <div class="contact">
        <a v-if="profile?.email" :href="`mailto:${profile.email}`" class="lbl">{{ profile.email }}</a>
        <a v-if="profile?.whatsapp" :href="`https://wa.me/${String(profile.whatsapp).replace(/\D/g, '')}`" class="lbl" target="_blank" rel="noopener">WhatsApp {{ profile.whatsapp }}</a>
        <span class="lbl">{{ profile?.location }}</span>
      </div>
    </section>

    <section id="cont" class="dark">
      <h2>{{ gameOver ? 'Game over.' : 'Continue?' }} <b v-if="!gameOver">{{ cd }}</b></h2>
      <div class="yn"><button class="btn" @click="restart">Y – Yes</button><button class="btn" @click="end">N – No</button></div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
useSeoMeta({
  title: 'Miftah Pauzan Jamil (Lemillion) — Web Developer Tasikmalaya',
  description: 'Portfolio Miftah Pauzan Jamil (Lemillion), Web Developer di Tasikmalaya sejak 2022. Landing page, company profile, hingga sistem informasi.',
  ogTitle: 'Miftah Pauzan Jamil (Lemillion) — Web Developer Tasikmalaya',
})
const { fetchAll, profile, portfolioList, servicesList, testimonials, awards, availability, categories, getImageUrl, getProfileImageUrl, formatPrice } = useSiteData()
const { submitInquiry, submitting } = useInquiry()
await fetchAll()
const secrets = useState<string[]>('secrets', () => [])

const cat = ref('all'), cur = ref(0), seen = ref<number[]>([]), hitIdx = ref<number[]>([])
const toast = ref(false), toastMsg = ref(''), shake = ref(false), shardGo = ref(false)
const cd = ref(9), gameOver = ref(false), open = ref(false), heroFail = ref(false), avFail = ref(false)
const dmgs = ref<{ id: number; x: number }[]>([]), msg = ref(''), ok = ref(false), fx = ref<HTMLCanvasElement>()
const form = reactive({ name: '', email: '', phone: '', session_type: '', preferred_date: '', budget_range: '', location_pref: '', message: '' })
let bt: any, ct: any, raf = 0, inLevels = false, inCont = false, booted = false, did = 0

const rarity = [['Legendary', '#F5C518'], ['Epic', '#b56cff'], ['Rare', '#3fa9ff'], ['Uncommon', '#2fe36d']]
const grads = ['#ff3d6e,#d9141b', '#9aff3d,#14b84a', '#2fd4ff,#2f5bff']
const icons = ['▶', '▮▮▮', '▣', '▦', '● Live']
const statusLabel: Record<string, string> = { open: 'Open', limited: 'Limited', full: 'Full' }
const budgets = ['Di bawah Rp 1 juta', 'Rp 1 – 3 juta', 'Rp 3 – 10 juta', 'Rp 10 juta+']
const nowYM = new Date().toISOString().slice(0, 7)
const url = (v: string, base: string) => (/^https?:/.test(v) ? v : base + v.replace(/^@/, ''))

const heroImg = computed(() => (heroFail.value ? '' : getProfileImageUrl(profile.value?.hero_image_url || profile.value?.avatar_url)))
const avatar = computed(() => (avFail.value ? '' : getProfileImageUrl(profile.value?.avatar_url)))
const sign = computed(() => getProfileImageUrl(profile.value?.signature_url))
const stats = computed(() => [
  { label: 'Years', value: `${profile.value?.years_experience ?? 4}+` },
  { label: 'Projects', value: `${profile.value?.projects_count ?? 20}+` },
  { label: 'Clients', value: `${profile.value?.clients_count ?? 10}+` },
  { label: 'Certificates', value: `${profile.value?.certifications_count ?? 4}` },
])
const bioParas = computed(() => String(profile.value?.bio_extended || '').split(/\n+/).filter(Boolean))
const socials = computed(() => {
  const p: any = profile.value || {}
  return [['GitHub', p.github && url(p.github, 'https://github.com/')], ['LinkedIn', p.linkedin && url(p.linkedin, 'https://linkedin.com/in/')],
    ['Website', p.website && url(p.website, 'https://')], ['WhatsApp', p.whatsapp && `https://wa.me/${String(p.whatsapp).replace(/\D/g, '')}`],
    ['Email', p.email && `mailto:${p.email}`]].filter((s) => s[1])
})

const filtered = computed(() => portfolioList.value.filter((p: any) => cat.value === 'all' || p.categories?.slug === cat.value))
const levels = computed(() => {
  const l: any[] = filtered.value, base = l.slice(0, 6), pin = l.find((p) => p.id === route.query.level)
  return pin && !base.includes(pin) ? [pin, ...base.slice(0, 5)] : base
})
const sel = computed<any>(() => levels.value[cur.value])
const combo = computed(() => seen.value.length)
const attacks = computed<string[]>(() => {
  const p: any = sel.value
  const l = String(p?.tech_stack || '').split(/[,/·|]+/).map((s) => s.trim()).filter(Boolean)
  return (l.length ? l : p?.tags?.length ? p.tags : ['Nuxt', 'Tailwind', 'PostgreSQL', 'SEO', 'Deploy']).slice(0, 5)
})
const dmg = computed(() => Math.round(100 / (attacks.value.length || 1)))
const hp = computed(() => 100 - (hitIdx.value.length / (attacks.value.length || 1)) * 100)
const ko = computed(() => attacks.value.length > 0 && hitIdx.value.length >= attacks.value.length)
const meta = computed(() => [['Client', sel.value?.client], ['Role', sel.value?.role], ['Location', sel.value?.location], ['Year', sel.value?.year]].filter((m) => m[1]))
const gallery = computed(() => (sel.value?.gallery_urls || []).map((g: string) => getImageUrl(g)).filter(Boolean))
const slots = computed(() => { const a: any[] = availability.value as any[]; const up = a.filter((m) => m.year_month >= nowYM); return (up.length ? up : a).slice(0, 6) })
const types = computed(() => servicesList.value.length ? servicesList.value.map((s: any) => s.title) : ['Landing Page', 'Company Profile', 'Web App / Sistem Informasi', 'E-Commerce', 'Maintenance', 'Lainnya'])

function cardStyle(p: any, i: number) {
  let u = ''
  try { u = getImageUrl(p.cover_url || p.image_url) } catch {}
  return { '--g': `linear-gradient(160deg,${grads[i % 3]})`, '--img': u ? `url("${u}")` : 'none' }
}
function flash(m: string, ms = 1700) { toastMsg.value = m; toast.value = true; setTimeout(() => (toast.value = false), ms) }
function unlock(k: string, m: string) {
  if (secrets.value.includes(k)) return
  secrets.value = [...secrets.value, k]
  flash(`Secret ${secrets.value.length}/6 · ${m}`)
}
function pick(i: number) {
  const n = levels.value.length
  if (!n) return
  cur.value = (i + n) % n
  if (!seen.value.includes(cur.value)) seen.value.push(cur.value)
  hitIdx.value = []
  if (n > 1 && seen.value.length === n) { flash('Full combo!', 1200); setTimeout(() => unlock('combo', 'full combo'), 1300) }
}
function setCat(s: string) { cat.value = s; cur.value = 0; seen.value = []; hitIdx.value = [] }
const goBoss = () => document.getElementById('boss')?.scrollIntoView({ behavior: 'smooth' })
function hit(j: number) {
  if (hitIdx.value.includes(j)) return
  hitIdx.value.push(j)
  const id = ++did
  dmgs.value.push({ id, x: 30 + Math.random() * 50 })
  setTimeout(() => (dmgs.value = dmgs.value.filter((d) => d.id !== id)), 900)
}
watch(ko, (v) => { if (!v) return; shake.value = true; setTimeout(() => (shake.value = false), 1300); unlock('ko', 'boss down') })
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
  clearInterval(ct); clearInterval(bt); seen.value = []; hitIdx.value = []; cur.value = 0; cat.value = 'all'; open.value = false
  scrollTo({ top: 0, behavior: 'smooth' })
}
function toggleBox() { open.value = !open.value; if (open.value) unlock('box', 'loot box') }
const toFinal = () => document.getElementById('final')?.scrollIntoView({ behavior: 'smooth' })
function choose(s: any) { form.session_type = s.title; toFinal() }
function pickSlot(m: any) { form.preferred_date = `${m.year_month}-01`; toFinal() }
async function send() {
  msg.value = ''
  const good = await submitInquiry({ ...form, phone: form.phone || null, session_type: form.session_type || null, preferred_date: form.preferred_date || null, budget_range: form.budget_range || null, location_pref: form.location_pref || null })
  ok.value = good
  msg.value = good ? 'Campaign terkirim! Saya balas dalam 24–48 jam.' : 'Gagal mengirim. Coba lagi atau email langsung.'
  if (good) { Object.keys(form).forEach((k) => ((form as any)[k] = '')); unlock('form', 'campaign sent'); setTimeout(() => (msg.value = ''), 6000) }
}
function onKey(e: KeyboardEvent) {
  if (/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement)?.tagName)) return
  const k = e.key
  if (inLevels && (k === 'ArrowRight' || k === 'ArrowLeft')) { e.preventDefault(); pick(cur.value + (k === 'ArrowRight' ? 1 : -1)) }
  else if (inLevels && k === 'Enter') goBoss()
  else if (inCont && /^[yn]$/i.test(k)) k.toLowerCase() === 'y' ? restart() : end()
}
function sparks() {
  const c = fx.value!, g = c.getContext('2d')!
  let w = 0, h = 0
  const size = () => { w = c.width = innerWidth; h = c.height = innerHeight }
  size(); addEventListener('resize', size)
  const ps = Array.from({ length: 70 }, () => ({ x: Math.random() * w, y: Math.random() * h, v: 0.15 + Math.random() * 0.5, r: Math.random() < 0.3 ? 2 : 1, red: Math.random() < 0.45 }))
  const loop = () => {
    g.clearRect(0, 0, w, h)
    for (const p of ps) { p.y -= p.v; if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w } g.fillStyle = p.red ? '#ff5a5a' : '#ffffffaa'; g.fillRect(p.x, p.y, p.r * 2, p.r * 2) }
    raf = requestAnimationFrame(loop)
  }
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) loop()
}
onMounted(() => {
  const i0 = levels.value.findIndex((p: any) => p.id === route.query.level)
  if (i0 > 0) cur.value = i0
  const flag = (id: string, fn: (v: boolean) => void) => new IntersectionObserver(([e]) => fn(e.isIntersecting), { threshold: 0.35 }).observe(document.getElementById(id)!)
  flag('work', (v) => (inLevels = v)); flag('boss', (v) => v && battle()); flag('services', (v) => v && (open.value = true))
  flag('cont', (v) => { inCont = v; if (v) { start(); unlock('end', 'continue?') } })
  const fxo = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return
    const el = e.target; el.classList.add('gl-on'); setTimeout(() => el.classList.remove('gl-on'), 700)
    if (booted) { shardGo.value = true; setTimeout(() => (shardGo.value = false), 650) }
  }), { threshold: 0.5 })
  document.querySelectorAll('.arc section').forEach((s) => fxo.observe(s))
  setTimeout(() => (booted = true), 1200)
  addEventListener('keydown', onKey); sparks()
})
onBeforeUnmount(() => { clearInterval(bt); clearInterval(ct); cancelAnimationFrame(raf); removeEventListener('keydown', onKey) })
</script>
