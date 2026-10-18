<script setup lang="ts">
await navigateTo({ path: '/', query: { level: String(useRoute().params.id) }, hash: '#boss' }, { replace: true })
</script>
<template><div /></template>
