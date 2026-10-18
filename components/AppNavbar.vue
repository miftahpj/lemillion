<template>
  <header class="arc-nav">
    <NuxtLink to="/" class="logo">// Lemillion</NuxtLink>
    <nav><NuxtLink v-for="l in links" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink></nav>
    <span class="lbl keys" title="Secrets found">⚷ {{ secrets.length }}/6</span>
    <NuxtLink class="btn" to="/#final">Press start ↗</NuxtLink>
  </header>
</template>

<script setup lang="ts">
const secrets = useState<string[]>('secrets', () => [])
const links = [{ to: '/#work', label: 'Work' }, { to: '/#about', label: 'About' }, { to: '/#services', label: 'Services' }, { to: '/#final', label: 'Contact' }]
</script>
