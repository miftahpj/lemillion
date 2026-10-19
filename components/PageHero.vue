<template>
  <section class="hero red phero">
    <p class="lbl">{{ label }}</p>
    <h1 class="gl"><span v-for="l in title.split('|')" :key="l">{{ l }}</span></h1>
    <p v-if="sub" class="d">{{ sub }}</p>
    <slot />
  </section>
</template>

<script setup lang="ts">
defineProps<{ label: string; title: string; sub?: string }>()
</script>
