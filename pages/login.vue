<template>
  <main class="arc login">
    <form class="frm one" @submit.prevent="handleLogin">
      <p class="lbl">Admin · insert credentials</p>
      <h1>Press start.</h1>
      <input v-model="form.email" type="email" required placeholder="Email" autocomplete="username">
      <div class="pw"><input v-model="form.password" :type="showPw ? 'text' : 'password'" required placeholder="Password" autocomplete="current-password"><button type="button" class="btn" @click="showPw = !showPw">{{ showPw ? 'Hide' : 'Show' }}</button></div>
      <p v-if="errorMsg" class="lbl err">{{ errorMsg }}</p>
      <button class="btn s" :disabled="loading">{{ loading ? 'Loading…' : 'Start ↗' }}</button>
      <NuxtLink to="/" class="lbl">← Kembali ke situs</NuxtLink>
    </form>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: ['auth'] })
useHead({ title: 'Admin Login — Lemillion' })

const { login } = useAuth()
const loading  = ref(false)
const errorMsg = ref('')
const showPw   = ref(false)
const form     = reactive({ email: '', password: '' })

const handleLogin = async () => {
  loading.value  = true
  errorMsg.value = ''
  const result = await login(form.email, form.password)
  loading.value = false
  if (!result.ok) {
    errorMsg.value = result.message ?? 'Email atau password salah.'
    return
  }
  await navigateTo('/admin')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
