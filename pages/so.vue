<template>
  <div class="so">
    <div class="so-hero">
      <p class="lbl">▮▮ Sistem Operasi · Tugas kuliah</p>
      <h1>Tugas<br>SO.</h1>
      <p class="so-sub">{{ tasks.length }} tugas · {{ activeCount }} belum selesai</p>
      <div class="chips">
        <button v-for="f in filters" :key="f.key" type="button" class="chip" :class="{ on: filter === f.key }" @click="filter = f.key">{{ f.label }}</button>
      </div>
    </div>

    <div class="so-list">
      <article v-for="t in shown" :id="`t-${t.id}`" :key="t.id" class="so-card" :class="stateOf(t).key">
        <header class="so-top">
          <h2>{{ t.title }}</h2>
          <div class="so-meta">
            <span v-if="t.deadline" class="lbl so-chip">Deadline · {{ formatDate(t.deadline) }}</span>
            <span v-if="stateOf(t).label" class="lbl so-chip st">{{ stateOf(t).label }}</span>
          </div>
        </header>

        <div class="rich" v-html="renderRich(t.description)" />

        <div v-if="t.images?.length" class="so-imgs">
          <button v-for="(img, i) in t.images" :key="img + i" type="button" class="so-img" :aria-label="`Perbesar gambar ${i + 1}`" @click="zoom = img">
            <img :src="img" :alt="`${t.title} — gambar ${i + 1}`" loading="lazy">
          </button>
        </div>

        <details v-if="t.answer" class="faq so-ans">
          <summary>Jawaban</summary>
          <div class="rich" v-html="renderRich(t.answer)" />
        </details>
      </article>

      <p v-if="!shown.length" class="lbl so-empty">{{ tasks.length ? 'Tidak ada tugas di filter ini.' : 'Belum ada tugas.' }}</p>
    </div>

    <Transition name="page">
      <div v-if="zoom" class="so-zoom" role="dialog" aria-modal="true" @click="zoom = ''">
        <img :src="zoom" alt="">
        <button type="button" class="btn" @click.stop="zoom = ''">Tutup ✕</button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'so' })

// Halaman ini sengaja tidak ditautkan dari mana pun & tidak boleh diindeks mesin pencari.
useSeoMeta({ title: 'Tugas Sistem Operasi — Lemillion', robots: 'noindex, nofollow' })

const { data } = await useFetch<any[]>('/api/tasks', { key: 'so-tasks', default: () => [] })
const tasks = computed(() => data.value ?? [])

// Status relatif terhadap tanggal hari ini (WIB) — dihitung di browser setelah mount agar tidak beda dengan SSR.
const today = ref('')
onMounted(() => { today.value = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }) })

const stateOf = (t: any): { key: string; label: string } => {
  if (t.is_done) return { key: 'done', label: 'Selesai' }
  if (!t.deadline || !today.value) return { key: 'open', label: '' }
  const days = Math.round((Date.parse(t.deadline) - Date.parse(today.value)) / 86_400_000)
  if (days < 0) return { key: 'late', label: 'Lewat deadline' }
  if (days === 0) return { key: 'soon', label: 'Hari ini!' }
  if (days === 1) return { key: 'soon', label: 'Besok' }
  if (days <= 3) return { key: 'soon', label: `${days} hari lagi` }
  return { key: 'open', label: `${days} hari lagi` }
}

const formatDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

const filters = [
  { key: 'all', label: 'Semua' },
  { key: 'active', label: 'Belum selesai' },
  { key: 'done', label: 'Selesai' },
]
const filter = ref('all')
const activeCount = computed(() => tasks.value.filter((t: any) => !t.is_done).length)
const shown = computed(() =>
  tasks.value.filter((t: any) => filter.value === 'all' || (filter.value === 'done' ? t.is_done : !t.is_done))
)

const zoom = ref('')
const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') zoom.value = '' }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>
