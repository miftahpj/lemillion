<template>
  <footer class="bg-[#080604] border-t border-[#C9963A]/10 relative">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px opacity-20" style="background:linear-gradient(to right,transparent,#C9963A,transparent);" />
    <div class="max-w-7xl mx-auto px-8 pt-16 pb-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
        <div class="md:col-span-2">
          <h3 class="font-display text-2xl tracking-[0.3em] gold-text uppercase mb-2">Lemillion</h3>
          <p class="font-mono text-[9px] tracking-[0.3em] uppercase mb-5" style="color:rgba(201,150,58,0.4);">Web Developer · Est. 2022</p>
          <p class="font-serif text-lg italic leading-relaxed max-w-sm" style="color:rgba(245,240,232,0.35);">"Website yang baik bukan cuma tampil bagus, tapi juga cepat, jelas, dan enak dipakai siapa saja."</p>
        </div>
        <div>
          <p class="font-mono text-[9px] tracking-[0.35em] uppercase mb-5" style="color:rgba(201,150,58,0.5);">Navigation</p>
          <ul class="space-y-3">
            <li v-for="l in links" :key="l.to">
              <NuxtLink :to="l.to" class="font-body text-sm transition-colors duration-300 hover:text-[#C9963A]" style="color:rgba(245,240,232,0.35);">{{ l.label }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <p class="font-mono text-[9px] tracking-[0.35em] uppercase mb-5" style="color:rgba(201,150,58,0.5);">Contact</p>
          <ul class="space-y-3">
            <li class="font-body text-sm" style="color:rgba(245,240,232,0.35);">Tasikmalaya, Indonesia</li>
            <li><a href="mailto:miftahpauzanjamil@gmail.com" class="font-body text-sm hover:text-[#C9963A] transition-colors" style="color:rgba(245,240,232,0.35);">miftahpauzanjamil@gmail.com</a></li>
            <li><a href="https://github.com/miftahpj" target="_blank" rel="noopener" class="font-body text-sm hover:text-[#C9963A] transition-colors" style="color:rgba(245,240,232,0.35);">github.com/miftahpj</a></li>
          </ul>
        </div>
      </div>
      <div class="h-px mb-6 opacity-10" style="background:linear-gradient(to right,transparent,#C9963A,transparent);" />
      <div class="flex flex-col md:flex-row items-center justify-between gap-3">
        <p class="font-mono text-[9px] tracking-[0.2em] uppercase" style="color:rgba(245,240,232,0.18);">© {{ year }} Lemillion — Web Developer. All rights reserved.</p>
        <p class="font-mono text-[9px] tracking-[0.2em] uppercase" style="color:rgba(245,240,232,0.18);">Built fast, built to last.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
const links = [
  { to: '/', label: 'Home' }, { to: '/portfolio', label: 'Portfolio' },
  { to: '/about', label: 'About' }, { to: '/services', label: 'Services' }, { to: '/contact', label: 'Contact' },
]
</script>
