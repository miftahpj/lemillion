<template>
  <div ref="containerRef" class="relative mx-auto" style="width:280px;height:460px;">
    <!-- anchor -->
    <div class="absolute left-1/2 -translate-x-1/2 top-0 w-2.5 h-2.5 rounded-full z-20" style="background:#C9963A;box-shadow:0 0 10px rgba(201,150,58,0.6);" />

    <!-- rope -->
    <svg class="absolute inset-0 z-10 pointer-events-none overflow-visible" width="100%" height="100%">
      <path :d="ropePath" fill="none" stroke="rgba(201,150,58,0.4)" stroke-width="2" />
    </svg>

    <!-- card -->
    <div
      class="absolute z-30 cursor-grab active:cursor-grabbing touch-none"
      :style="cardStyle"
      @pointerdown="onPointerDown"
    >
      <div class="w-[210px] p-2.5 pt-3.5" style="background:linear-gradient(155deg,#efe7d8,#d9cead 40%,#efe7d8);box-shadow:0 20px 45px rgba(0,0,0,0.55);border-radius:4px;">
        <!-- clip hole -->
        <div class="absolute left-1/2 -translate-x-1/2 top-1.5 w-8 h-2.5 rounded-full" style="background:#0C0A07;opacity:0.5;" />

        <div class="relative overflow-hidden" style="aspect-ratio:3/4;background:linear-gradient(135deg,#1a1208,#2a1e10,#1a1208);border-radius:2px;">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            :alt="name"
            class="w-full h-full object-cover"
            style="filter:grayscale(1) contrast(1.08);"
            draggable="false"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="font-display" style="font-size:4rem;color:rgba(12,10,7,0.15);">{{ name?.charAt(0) ?? 'M' }}</span>
          </div>
          <div class="absolute inset-0" style="background:linear-gradient(180deg,transparent 55%,rgba(12,10,7,0.75) 100%);" />

          <div class="absolute bottom-0 left-0 right-0 p-3">
            <p class="font-display text-[13px] uppercase tracking-wide leading-tight" style="color:#F5F0E8;">{{ name }}</p>
            <p class="font-mono text-[8px] tracking-[0.25em] uppercase mt-0.5" style="color:#C9963A;">{{ role }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between mt-2 px-0.5">
          <span class="font-mono text-[7px] tracking-[0.2em] uppercase" style="color:rgba(12,10,7,0.4);">Lemillion</span>
          <span class="font-mono text-[7px] tracking-[0.2em] uppercase" style="color:rgba(12,10,7,0.4);">ID · 2022</span>
        </div>
      </div>
    </div>

    <p class="intro-item absolute -bottom-2 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[0.3em] uppercase whitespace-nowrap" style="color:rgba(245,240,232,0.18);">
      ↔ Tarik kartunya
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  avatarUrl?: string
  name?: string
  role?: string
}>()

const containerRef = ref<HTMLElement | null>(null)

const width  = ref(280)
const restX  = computed(() => width.value / 2)
const restY  = 250

const x  = ref(restX.value)
const y  = ref(restY)
const vx = ref(0)
const vy = ref(0)

const dragging = ref(false)
let pointerId: number | null = null
let raf = 0
let lastT = 0
let idleT = 0
let lastMoveT = 0
let lastMoveX = 0
let lastMoveY = 0

const rotation = computed(() => {
  const tilt = (x.value - restX.value) * 0.12 + vx.value * 0.012
  return Math.max(-28, Math.min(28, tilt))
})

const cardStyle = computed(() => ({
  left: '0px',
  top: '0px',
  transform: `translate(${x.value - 105}px, ${y.value}px) rotate(${rotation.value}deg)`,
  transformOrigin: 'top center',
  transition: dragging.value ? 'none' : undefined,
}))

const ropePath = computed(() => {
  const anchorX = restX.value
  const anchorY = 0
  const tipX = x.value
  const tipY = y.value + 4
  const midX = (anchorX + tipX) / 2
  const midY = (anchorY + tipY) / 2 - Math.max(0, 30 - Math.abs(tipX - anchorX) * 0.15)
  return `M ${anchorX} ${anchorY} Q ${midX} ${midY} ${tipX} ${tipY}`
})

function clampToRope(px: number, py: number) {
  const anchorX = restX.value
  const anchorY = 0
  const maxLen = 360
  const dx = px - anchorX
  const dy = py - anchorY
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist <= maxLen) return { x: px, y: py }
  const scale = maxLen / dist
  return { x: anchorX + dx * scale, y: anchorY + dy * scale }
}

function onPointerDown(e: PointerEvent) {
  dragging.value = true
  pointerId = e.pointerId
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  vx.value = 0
  vy.value = 0
  lastMoveT = performance.now()
  lastMoveX = x.value
  lastMoveY = y.value
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const px = e.clientX - rect.left
  const py = e.clientY - rect.top
  const clamped = clampToRope(px, py)
  x.value = clamped.x
  y.value = clamped.y

  const now = performance.now()
  const dt = Math.max(1, now - lastMoveT)
  vx.value = ((x.value - lastMoveX) / dt) * 16
  vy.value = ((y.value - lastMoveY) / dt) * 16
  lastMoveT = now
  lastMoveX = x.value
  lastMoveY = y.value
}

function onPointerUp() {
  dragging.value = false
  pointerId = null
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  startSpring()
}

function startSpring() {
  cancelAnimationFrame(raf)
  lastT = performance.now()
  const stiffness = 0.012
  const damping = 0.085

  const step = (now: number) => {
    const dt = Math.min(32, now - lastT)
    lastT = now

    if (dragging.value) return

    const ax = -stiffness * (x.value - restX.value)
    const ay = -stiffness * (y.value - restY)
    vx.value = (vx.value + ax * dt) * (1 - damping)
    vy.value = (vy.value + ay * dt) * (1 - damping)
    x.value += vx.value * dt * 0.06
    y.value += vy.value * dt * 0.06

    const settled = Math.abs(x.value - restX.value) < 0.4 && Math.abs(vx.value) < 0.05
      && Math.abs(y.value - restY) < 0.4 && Math.abs(vy.value) < 0.05

    if (!settled) {
      raf = requestAnimationFrame(step)
    } else {
      x.value = restX.value
      y.value = restY
      vx.value = 0
      vy.value = 0
      startIdleSway()
    }
  }
  raf = requestAnimationFrame(step)
}

function startIdleSway() {
  cancelAnimationFrame(raf)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const step = (now: number) => {
    if (dragging.value) return
    idleT = now * 0.00055
    x.value = restX.value + Math.sin(idleT) * 5
    y.value = restY + Math.sin(idleT * 1.7) * 2
    raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

function handleResize() {
  if (containerRef.value) width.value = containerRef.value.clientWidth
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  startIdleSway()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})
</script>
