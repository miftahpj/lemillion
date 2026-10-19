<template>
  <header class="arc-nav">
    <NuxtLink to="/" class="logo">// Lemillion</NuxtLink>
    <nav><NuxtLink v-for="l in links" :key="l.to" :to="l.to" :active-class="l.to === '/' ? '' : 'on'" exact-active-class="on">{{ l.label }}</NuxtLink></nav>
    <span class="lbl keys" title="Secrets found">⚷ {{ secrets.length }}/6</span>
    <NuxtLink class="btn" to="/contact">Press start ↗</NuxtLink>
  </header>
</template>

<script setup lang="ts">
const secrets = useState<string[]>('secrets', () => [])
const links = [{ to: '/', label: 'Home' }, { to: '/portfolio', label: 'Work' }, { to: '/about', label: 'About' }, { to: '/services', label: 'Services' }, { to: '/contact', label: 'Contact' }]
</script>
