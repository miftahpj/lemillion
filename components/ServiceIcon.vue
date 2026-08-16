<!--
  ServiceIcon — pengganti emoji (🚀 🏢 ⚙️ 🛠️, dst) di kartu Services dengan
  ikon SVG garis tipis bergaya sama dengan ornamen emas lain di proyek ini.
  Prop `icon` menerima emoji yang tersimpan di database (kolom services.icon)
  supaya tidak perlu mengubah skema data — cukup dipetakan di sini.
  Emoji yang belum dikenal otomatis jatuh ke ikon bintang (fallback).
-->
<template>
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" v-bind="$attrs">
    <!-- 🚀 Landing Page -->
    <g v-if="icon === '🚀'" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2.5c2.6 1.6 4.2 4.5 4.2 8 0 2-1.1 4.6-2.4 6.2h-3.6C9 15.1 7.8 12.5 7.8 10.5c0-3.5 1.6-6.4 4.2-8Z" />
      <circle cx="12" cy="9.5" r="1.7" />
      <path d="M8.2 14.5 5.6 17c-.4.4-.6 1-.5 1.5l.4 1.8 1.8.4c.6.1 1.1-.1 1.5-.5l2.5-2.6" />
      <path d="M15.8 14.5 18.4 17c.4.4.6 1 .5 1.5l-.4 1.8-1.8.4c-.6.1-1.1-.1-1.5-.5l-2.5-2.6" />
      <path d="M10 20.5c0 .7-.9 1.3-2 1.3" />
      <path d="M14 20.5c0 .7.9 1.3 2 1.3" />
    </g>

    <!-- 🏢 Company Profile -->
    <g v-else-if="icon === '🏢'" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <rect x="4.5" y="3.5" width="9" height="17" rx="0.5" />
      <rect x="13.5" y="9" width="6" height="11.5" rx="0.5" />
      <path d="M7 7h1.2M10.3 7h1.2M7 10.3h1.2M10.3 10.3h1.2M7 13.6h1.2M10.3 13.6h1.2M7 16.9h1.2M10.3 16.9h1.2" />
      <path d="M16 12.3h1.2M16 15.2h1.2M16 18.1h1.2" />
      <path d="M8.5 20.5v-3h2v3" />
    </g>

    <!-- ⚙️ Web App / Sistem -->
    <g v-else-if="icon === '⚙️' || icon === '⚙'" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 3.3v2.3M12 18.4v2.3M20.7 12h-2.3M5.6 12H3.3M18.1 5.9l-1.6 1.6M7.5 16.5l-1.6 1.6M18.1 18.1l-1.6-1.6M7.5 7.5 5.9 5.9" />
    </g>

    <!-- 🛠️ Maintenance & Optimasi -->
    <g v-else-if="icon === '🛠️' || icon === '🛠'" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.5 3.8a4 4 0 0 0-5.1 4.9L4 14.1v3.6h3.6l5.4-5.4a4 4 0 0 0 4.9-5.1l-2.6 2.6-2-2 2.6-2.6Z" />
      <path d="M4.7 19.3h.01" />
    </g>

    <!-- Fallback untuk emoji lain yang belum dipetakan -->
    <path v-else stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"
      d="M12 3.5 13.9 9h5.6l-4.5 3.4 1.7 5.6L12 14.7l-4.7 3.3 1.7-5.6L4.5 9h5.6L12 3.5Z" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{ icon?: string }>()
defineOptions({ inheritAttrs: false })
</script>
