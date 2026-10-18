<template>
  <header class="arc-nav">
    <NuxtLink to="/" class="logo">// Lemillion</NuxtLink>
    <nav><NuxtLink v-for="l in links" :key="l.to" :to="l.to" active-class="on">{{ l.label }}</NuxtLink></nav>
    <a class="btn" href="mailto:miftahpauzanjamil@gmail.com">Press start ↗</a>
  </header>
</template>

<script setup lang="ts">
const links = [{ to: '/portfolio', label: 'Work' }, { to: '/about', label: 'About' }, { to: '/services', label: 'Services' }, { to: '/contact', label: 'Contact' }]
</script>
