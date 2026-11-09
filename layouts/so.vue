<template>
  <div class="arc min-h-screen bg-[#14151A]">
    <header class="arc-nav">
      <NuxtLink to="/" class="logo">// Lemillion</NuxtLink>
      <span class="lbl">Sistem Operasi</span>
    </header>
    <main><slot /></main>
    <footer class="so-foot"><small class="lbl">© {{ new Date().getFullYear() }} Lemillion — Tugas kuliah</small></footer>
  </div>
</template>
