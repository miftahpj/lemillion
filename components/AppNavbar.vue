<template>
  <header :class="['fixed top-0 left-0 right-0 z-50 transition-all duration-500', scrolled ? 'py-3 bg-[#0C0A07]/98 border-b border-[#C9963A]/10' : 'py-6 bg-transparent']">
    <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
      <NuxtLink to="/" class="group">
        <p class="font-display text-lg tracking-[0.35em] gold-text uppercase">Lemillion</p>
        <p class="font-mono text-[8px] tracking-[0.4em] uppercase mt-0.5" style="color:rgba(201,150,58,0.45);">Web Developer</p>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-8">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to"
          class="font-display text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 hover:text-[#C9963A]"
          style="color:rgba(245,240,232,0.5);"
          active-class="!text-[#C9963A]"
        >{{ l.label }}</NuxtLink>
      </nav>

      <a href="mailto:miftahpauzanjamil@gmail.com"
        class="hidden md:block font-mono text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 border border-[#C9963A]/30 text-[#C9963A] hover:bg-[#C9963A]/10 transition-all duration-300">
        Hubungi Saya
      </a>

      <button @click="open = !open" class="md:hidden flex flex-col gap-1.5 p-2">
        <span class="block w-6 h-px bg-[#C9963A]" />
        <span class="block w-6 h-px bg-[#C9963A]" :class="open ? 'opacity-0' : ''" />
        <span class="block w-6 h-px bg-[#C9963A]" />
      </button>
    </div>

    <Transition name="mobile">
      <div v-if="open" class="md:hidden bg-[#0C0A07]/98 border-t border-[#C9963A]/10 px-6 py-6 flex flex-col gap-4">
        <NuxtLink v-for="l in links" :key="l.to" :to="l.to" @click="open=false"
          class="font-display text-sm tracking-[0.3em] uppercase" style="color:rgba(245,240,232,0.6);">
          {{ l.label }}
        </NuxtLink>
        <a href="mailto:miftahpauzanjamil@gmail.com" class="font-mono text-xs tracking-widest uppercase text-[#C9963A] border border-[#C9963A]/30 px-5 py-3 text-center">Hubungi Saya</a>
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
</style>
