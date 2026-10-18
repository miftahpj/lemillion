<template>
  <Transition name="intro">
    <div v-if="visible" id="lm-intro-overlay" class="intro-arc">
      <p class="lbl">Insert coin</p>
      <h1>Lemillion</h1>
      <p class="lbl">{{ siteLabel }}</p>
      <div class="bar"><i :style="{ width: progress + '%' }" /></div>
      <span class="lbl">Loading {{ Math.round(progress) }}%</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { h } from 'vue'

const visible  = ref(true)
const stage    = ref(0)
const progress = ref(0)

const config = useRuntimeConfig()
const siteLabel = computed(() => (config.public.siteUrl || 'miftahpj.web.id').replace(/^https?:\/\//, ''))

const icons = [
  () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none' }, [
    h('path', { d: 'M8 4L2 12L8 20M16 4L22 12L16 20', stroke: 'currentColor', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
  ]),
  () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none' }, [
    h('circle', { cx: 12, cy: 8, r: 3.4, stroke: 'currentColor', 'stroke-width': 1.6 }),
    h('path', { d: 'M4 20c1.6-4 5-6 8-6s6.4 2 8 6', stroke: 'currentColor', 'stroke-width': 1.6, 'stroke-linecap': 'round' }),
  ]),
  () => h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none' }, [
    h('circle', { cx: 12, cy: 12, r: 8.4, stroke: 'currentColor', 'stroke-width': 1.6 }),
    h('path', { d: 'M3.6 12h16.8M12 3.6c2.4 2.3 3.6 5.3 3.6 8.4s-1.2 6.1-3.6 8.4c-2.4-2.3-3.6-5.3-3.6-8.4s1.2-6.1 3.6-8.4z', stroke: 'currentColor', 'stroke-width': 1.4 }),
  ]),
]

let raf = 0

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const alreadyShown = sessionStorage.getItem('lm-intro-shown')

  if (reduceMotion || alreadyShown) {
    visible.value = false
    return
  }

  document.documentElement.style.overflow = 'hidden'
  requestAnimationFrame(() => { stage.value = 1 })

  const duration = 1600
  const start = performance.now()

  const tick = (now: number) => {
    const elapsed = now - start
    progress.value = Math.min(100, (elapsed / duration) * 100)
    if (elapsed < duration) {
      raf = requestAnimationFrame(tick)
    } else {
      sessionStorage.setItem('lm-intro-shown', '1')
      setTimeout(() => {
        visible.value = false
        document.documentElement.style.overflow = ''
      }, 350)
    }
  }
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.intro-enter-active { transition: opacity 0.3s ease; }
.intro-leave-active  { transition: opacity 0.6s ease, filter 0.6s ease; }
.intro-leave-to      { opacity: 0; filter: blur(6px); }

.intro-item {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.intro-item.intro-in {
  opacity: 1;
  transform: translateY(0);
}

</style>
