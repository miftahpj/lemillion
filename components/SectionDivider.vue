<!--
  SectionDivider — pemisah antar-bagian di beranda.
  Terinspirasi dari transisi "awan" pada video referensi: sebuah bentuk
  lengkung yang menjembatani dua section + strip teks berjalan (ticker) di
  bawahnya. Di sini bentuknya diganti jadi lengkung emas tipis dengan glow,
  supaya tetap sejalan dengan tema gelap/emas "Lemillion" alih-alih awan.
-->
<template>
  <div class="relative select-none" :style="`background:${to};`">
    <!-- Lengkung transisi (menggantikan "awan" pada referensi) -->
    <svg
      class="block w-full"
      :style="flip ? 'transform:scaleY(-1);' : ''"
      viewBox="0 0 1440 90" preserveAspectRatio="none" width="100%" height="90" aria-hidden="true"
    >
      <path :d="curvePath" :fill="from" />
      <path :d="curvePath" fill="none" :stroke="`url(#lm-divider-grad-${uid})`" stroke-width="1.4" opacity="0.7" />
      <defs>
        <linearGradient :id="`lm-divider-grad-${uid}`" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#C9963A" stop-opacity="0" />
          <stop offset="50%" stop-color="#E8C96A" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#C9963A" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>

    <!-- Ornamen berlian tengah -->
    <div class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10" style="top:0;">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M8 0L10 5.5H16L11 9L13 16L8 12.5L3 16L5 9L0 5.5H6L8 0Z" fill="#C9963A" fill-opacity="0.55" />
      </svg>
    </div>

    <!-- Ticker berjalan -->
    <div class="overflow-hidden py-3.5 border-y" :style="`border-color:rgba(201,150,58,0.08);background:${to};`">
      <div class="flex whitespace-nowrap" :style="`animation:ticker ${speed}s linear infinite;`">
        <span v-for="n in 4" :key="n" class="flex items-center gap-8 pr-8 flex-shrink-0">
          <span v-for="item in items" :key="item + n" class="inline-flex items-center gap-8">
            <span class="font-mono text-[9px] tracking-[0.4em] uppercase" style="color:rgba(245,240,232,0.16);">{{ item }}</span>
            <span style="color:rgba(201,150,58,0.22);" class="text-xs">✦</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  items: string[]
  from?: string   // warna section di atas divider
  to?: string     // warna section di bawah divider
  flip?: boolean  // balik arah lengkung
  speed?: number  // durasi animasi ticker (detik)
}>(), {
  from: '#0C0A07',
  to: '#080604',
  flip: false,
  speed: 28,
})

const uid = Math.random().toString(36).slice(2, 8)

const curvePath = computed(() =>
  'M0,0 C240,80 480,80 720,40 C960,0 1200,0 1440,50 L1440,0 L0,0 Z'
)
</script>
