<template>
  <div class="arc-fx" aria-hidden="true">
    <canvas ref="cv" class="spark" />
    <div class="shards" :class="{ go }"><i v-for="n in 6" :key="n" :style="{ '--k': n }" /></div>
  </div>
</template>

<script setup lang="ts">
const cv = ref<HTMLCanvasElement>(), go = ref(false)
let raf = 0
const off: (() => void)[] = []
onMounted(() => {
  const c = cv.value!, g = c.getContext('2d')!
  let w = 0, h = 0
  const size = () => { w = c.width = innerWidth; h = c.height = innerHeight }
  size(); addEventListener('resize', size); off.push(() => removeEventListener('resize', size))
  const ps = Array.from({ length: 70 }, () => ({ x: Math.random() * w, y: Math.random() * h, v: 0.15 + Math.random() * 0.5, r: Math.random() < 0.3 ? 2 : 1, red: Math.random() < 0.45 }))
  const loop = () => {
    g.clearRect(0, 0, w, h)
    for (const p of ps) { p.y -= p.v; if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w } g.fillStyle = p.red ? '#ff5a5a' : '#ffffffaa'; g.fillRect(p.x, p.y, p.r * 2, p.r * 2) }
    raf = requestAnimationFrame(loop)
  }
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) loop()
  let booted = false
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return
    const el = e.target; el.classList.add('gl-on'); setTimeout(() => el.classList.remove('gl-on'), 700)
    if (booted) { go.value = true; setTimeout(() => (go.value = false), 650) }
  }), { threshold: 0.5 })
  document.querySelectorAll('.arc section').forEach((s) => io.observe(s))
  setTimeout(() => (booted = true), 1200); off.push(() => io.disconnect())
})
onBeforeUnmount(() => { cancelAnimationFrame(raf); off.forEach((f) => f()) })
</script>
