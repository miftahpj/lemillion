<template>
  <div class="min-h-screen bg-[#0C0A07] flex items-center justify-center relative overflow-hidden">
    <div class="hidden md:block absolute w-[500px] h-[500px] rounded-full pointer-events-none" style="background:rgba(201,150,58,0.05);filter:blur(150px);top:-100px;right:-100px;" />
    <div class="hidden md:block absolute w-[400px] h-[400px] rounded-full pointer-events-none" style="background:rgba(201,150,58,0.04);filter:blur(120px);bottom:-50px;left:-100px;" />

    <div class="relative z-10 w-full max-w-md px-8">
      <div class="text-center mb-14">
        <NuxtLink to="/">
          <h1 class="font-display text-3xl tracking-[0.4em] gold-text uppercase">Lemillion</h1>
          <p class="font-mono text-[9px] tracking-[0.4em] uppercase mt-1" style="color:rgba(201,150,58,0.4);">Admin Access</p>
        </NuxtLink>
      </div>

      <div class="flex items-center gap-4 mb-10">
        <div class="h-px flex-1" style="background:linear-gradient(to right,transparent,rgba(201,150,58,0.2));" />
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0L8.5 5H14L9.5 8L11 14L7 11L3 14L4.5 8L0 5H5.5L7 0Z" fill="#C9963A" fill-opacity="0.3"/></svg>
        <div class="h-px flex-1" style="background:linear-gradient(to left,transparent,rgba(201,150,58,0.2));" />
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="font-mono text-[9px] tracking-[0.4em] uppercase block mb-3" style="color:rgba(201,150,58,0.45);">Email</label>
          <input v-model="form.email" type="email" required :disabled="loading" placeholder="miftahpauzanjamil@gmail.com"
            class="w-full bg-transparent py-3 font-body text-sm focus:outline-none transition-colors duration-300 disabled:opacity-50"
            style="border-bottom:1px solid rgba(201,150,58,0.18); color:rgba(245,240,232,0.65);" />
        </div>

        <div>
          <label class="font-mono text-[9px] tracking-[0.4em] uppercase block mb-3" style="color:rgba(201,150,58,0.45);">Password</label>
          <div class="relative">
            <input v-model="form.password" :type="showPw ? 'text' : 'password'" required :disabled="loading" placeholder="••••••••"
              class="w-full bg-transparent py-3 font-body text-sm focus:outline-none transition-colors duration-300 pr-20 disabled:opacity-50"
              style="border-bottom:1px solid rgba(201,150,58,0.18); color:rgba(245,240,232,0.65);" />
            <button type="button" @click="showPw = !showPw" class="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[8px] tracking-widest uppercase transition-colors hover:text-[#C9963A]" style="color:rgba(245,240,232,0.2);">
              {{ showPw ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <Transition name="fade">
          <div v-if="errorMsg" class="border px-4 py-3" style="border-color:rgba(239,68,68,0.2);background:rgba(239,68,68,0.05);">
            <p class="font-mono text-[10px] tracking-widest uppercase" style="color:rgba(239,68,68,0.65);">{{ errorMsg }}</p>
          </div>
        </Transition>

        <div class="pt-4">
          <button type="submit" :disabled="loading"
            class="w-full font-mono text-[11px] tracking-[0.3em] uppercase py-4 transition-all disabled:opacity-50"
            :style="loading ? 'background:rgba(201,150,58,0.1);color:rgba(201,150,58,0.4);border:1px solid rgba(201,150,58,0.15);' : 'background:linear-gradient(135deg,#C9963A,#E8C96A,#C9963A);color:#1a1208;font-weight:700;'"
          >
            <span v-if="!loading">Masuk ke Admin Panel</span>
            <span v-else>Memproses...</span>
          </button>
        </div>
      </form>

      <div class="mt-10 text-center">
        <NuxtLink to="/" class="font-mono text-[9px] tracking-[0.3em] uppercase hover:text-[#C9963A] transition-colors" style="color:rgba(245,240,232,0.15);">← Kembali ke Website</NuxtLink>
      </div>
    </div>
  </div>
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
