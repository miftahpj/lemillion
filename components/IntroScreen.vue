<template>
  <Transition name="intro">
    <div
      v-if="visible"
      id="lm-intro-overlay"
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0C0A07] overflow-hidden"
    >
      <!-- background wash, consistent dengan hero -->
      <div class="absolute inset-0" style="background:radial-gradient(ellipse at 50% 40%,rgba(201,150,58,0.10) 0%,transparent 60%),linear-gradient(135deg,#0C0A07 0%,#1a1208 50%,#0C0A07 100%);" />
      <div class="absolute inset-0 pointer-events-none">
        <div v-for="i in 5" :key="i" class="absolute top-0 bottom-0 w-px" :style="`left:${i*20}%;background:rgba(201,150,58,0.03);`" />
      </div>

      <div class="relative z-10 flex flex-col items-center px-6 text-center">
        <!-- icon row -->
        <div class="intro-item flex items-center gap-4 mb-10" :class="{ 'intro-in': stage >= 1 }">
          <div v-for="(icon, i) in icons" :key="i"
            class="w-11 h-11 rounded-full border flex items-center justify-center"
            style="background:rgba(201,150,58,0.06);border-color:rgba(201,150,58,0.25);color:#C9963A;">
            <component :is="icon" />
          </div>
        </div>

        <p class="intro-item font-mono text-[10px] tracking-[0.5em] uppercase mb-4" style="color:rgba(201,150,58,0.55);" :class="{ 'intro-in': stage >= 1 }">
          Selamat Datang
        </p>
        <h1 class="intro-item font-display uppercase leading-none gold-text mb-6" style="font-size:clamp(2rem,6vw,3.75rem);" :class="{ 'intro-in': stage >= 1 }">
          Portfolio Saya
        </h1>

        <div class="intro-item font-mono text-[10px] tracking-[0.3em] uppercase px-5 py-2 border rounded-full mb-14"
          style="color:rgba(245,240,232,0.4);border-color:rgba(201,150,58,0.2);" :class="{ 'intro-in': stage >= 1 }">
          {{ siteLabel }}
        </div>

        <!-- progress -->
        <div class="intro-item w-56 h-px relative overflow-hidden" style="background:rgba(245,240,232,0.08);" :class="{ 'intro-in': stage >= 1 }">
          <div class="absolute inset-y-0 left-0" :style="`width:${progress}%;background:linear-gradient(to right,#A87B2C,#E8C96A,#C9963A);transition:width 0.15s linear;`" />
        </div>
        <span class="intro-item font-mono text-[9px] tracking-[0.3em] mt-3" style="color:rgba(245,240,232,0.22);" :class="{ 'intro-in': stage >= 1 }">
          {{ Math.round(progress) }}%
        </span>
      </div>
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
