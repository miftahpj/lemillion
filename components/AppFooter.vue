<template>
  <footer class="arc-foot">
    <NuxtLink to="/" class="logo">// Lemillion</NuxtLink>
    <div><NuxtLink v-for="l in links" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink></div>
    <div><a href="mailto:miftahpauzanjamil@gmail.com">miftahpauzanjamil@gmail.com</a><a href="https://github.com/miftahpj" target="_blank" rel="noopener">GitHub ↗</a></div>
    <small>© {{ new Date().getFullYear() }} Lemillion — Web Developer, Tasikmalaya. Built fast, built to last.</small>
  </footer>
</template>

<script setup lang="ts">
const links = [{ to: '/portfolio', label: 'Work' }, { to: '/services', label: 'Services' }, { to: '/about', label: 'About' }, { to: '/contact', label: 'Contact' }]
</script>
