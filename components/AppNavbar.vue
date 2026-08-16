<template>
  <header class="fixed top-3 left-3 right-3 md:top-5 md:left-6 md:right-6 z-50">
    <div
      :class="['lm-glass max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 rounded-[26px] md:rounded-full', scrolled ? 'px-5 py-2.5 md:px-6 md:py-3' : 'px-5 py-3.5 md:px-8 md:py-4']"
    >
      <!-- specular sweep highlight -->
      <span class="lm-glass-sheen" aria-hidden="true" />

      <NuxtLink to="/" class="group relative z-10 flex flex-col leading-none">
        <p class="font-display text-base md:text-lg tracking-[0.35em] gold-text uppercase">Lemillion</p>
        <p class="font-mono text-[7px] md:text-[8px] tracking-[0.4em] uppercase mt-0.5" style="color:rgba(201,150,58,0.5);">Web Developer</p>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-8 relative z-10">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to"
          class="font-display text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 hover:text-[#C9963A]"
          style="color:rgba(245,240,232,0.55);"
          active-class="!text-[#C9963A]"
        >{{ l.label }}</NuxtLink>
      </nav>

      <a href="mailto:miftahpauzanjamil@gmail.com"
        class="hidden md:block relative z-10 font-mono text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 rounded-full border border-[#C9963A]/30 text-[#C9963A] hover:bg-[#C9963A]/10 transition-all duration-300">
        Hubungi Saya
      </a>

      <button @click="open = !open" class="md:hidden relative z-10 flex flex-col gap-1.5 p-2" aria-label="Menu">
        <span class="block w-5 h-px bg-[#C9963A] transition-transform duration-300" :class="open ? 'translate-y-[6.5px] rotate-45' : ''" />
        <span class="block w-5 h-px bg-[#C9963A] transition-opacity duration-300" :class="open ? 'opacity-0' : ''" />
        <span class="block w-5 h-px bg-[#C9963A] transition-transform duration-300" :class="open ? '-translate-y-[6.5px] -rotate-45' : ''" />
      </button>
    </div>

    <Transition name="mobile">
      <div v-if="open" class="lm-glass md:hidden mt-2 rounded-[22px] px-6 py-6 flex flex-col gap-4 max-w-7xl mx-auto relative overflow-hidden">
        <span class="lm-glass-sheen" aria-hidden="true" />
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to" @click="open=false"
          class="relative z-10 font-display text-sm tracking-[0.3em] uppercase" style="color:rgba(245,240,232,0.65);"
          active-class="!text-[#C9963A]"
        >
          {{ l.label }}
        </NuxtLink>
        <a href="mailto:miftahpauzanjamil@gmail.com" class="relative z-10 font-mono text-xs tracking-widest uppercase text-[#C9963A] border border-[#C9963A]/30 rounded-full px-5 py-3 text-center">Hubungi Saya</a>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const { y } = useWindowScroll()
const scrolled = computed(() => y.value > 30)
const open = ref(false)
const route = useRoute()
watch(() => route.path, () => { open.value = false })

const links = [
  { to: '/',          label: 'Home' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about',     label: 'About' },
  { to: '/services',  label: 'Services' },
  { to: '/contact',   label: 'Contact' },
]
</script>

<style scoped>
.mobile-enter-active, .mobile-leave-active { transition: all 0.3s ease; }
.mobile-enter-from, .mobile-leave-to { opacity: 0; transform: translateY(-8px); }

/* ────────────────────────────────────────────────────────────
   "Liquid glass" — kaca cair ala iOS: blur + saturasi tinggi,
   highlight tipis di tepi atas, dan sapuan cahaya (sheen) yang
   bergerak pelan supaya terasa hidup/reflektif, bukan flat.
   ──────────────────────────────────────────────────────────── */
.lm-glass {
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02) 40%, rgba(12,10,7,0.35)),
    rgba(12,10,7,0.55);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  backdrop-filter: blur(22px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.09);
  box-shadow:
    0 12px 40px rgba(0,0,0,0.45),
    0 2px 8px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.18),
    inset 0 -1px 0 rgba(0,0,0,0.25),
    inset 0 0 24px rgba(201,150,58,0.05);
}

.lm-glass-sheen {
  position: absolute;
  inset: -2px;
  pointer-events: none;
  background: linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.10) 32%, rgba(201,150,58,0.14) 38%, transparent 52%);
  background-size: 220% 220%;
  background-position: 100% 0%;
  animation: lm-sheen 9s ease-in-out infinite;
  mix-blend-mode: screen;
}

@keyframes lm-sheen {
  0%, 100% { background-position: 110% 0%; }
  50%      { background-position: -10% 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .lm-glass-sheen { animation: none; }
}
</style>
