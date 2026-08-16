// plugins/tilt.ts
// Directive `v-tilt` — efek 3D ringan berbasis posisi pointer (perspective
// tilt + kilau/glare halus). Sengaja dibuat sebagai directive terpisah
// (bukan dipasang global ke semua elemen) supaya efek 3D ini hanya
// dipakai pada elemen-elemen tertentu yang memang diberi `v-tilt`,
// bukan seluruh project.
//
// PENTING: plugin ini didaftarkan universal (bukan *.client.ts) supaya
// directive `v-tilt` juga "dikenal" saat render di server (SSR). Nuxt/Vue
// tetap butuh directive terdaftar sewaktu SSR walau hook mounted-nya
// sendiri hanya benar-benar jalan di client — kalau plugin ini client-only,
// SSR akan error "Failed to resolve directive: tilt" / "Cannot read
// properties of undefined (reading 'getSSRProps')". Semua akses DOM/window
// di bawah tetap dijaga lewat `import.meta.client` supaya tidak dieksekusi
// di server.

const MAX_TILT = 10          // derajat rotasi maksimum
const GLARE_OPACITY = 0.16   // intensitas kilau saat hover

function attach(el: HTMLElement) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (window.matchMedia('(pointer: coarse)').matches) return // skip di layar sentuh

  el.style.transformStyle = 'preserve-3d'
  el.style.transition = 'transform 0.15s ease-out'
  el.style.willChange = 'transform'

  const glare = document.createElement('div')
  glare.setAttribute('aria-hidden', 'true')
  glare.style.cssText = `
    position:absolute; inset:0; pointer-events:none; z-index:5;
    opacity:0; transition:opacity 0.25s ease;
    background:radial-gradient(circle at var(--lm-glare-x,50%) var(--lm-glare-y,50%),
      rgba(232,201,106,${GLARE_OPACITY}), transparent 55%);
  `
  const computedPos = getComputedStyle(el).position
  if (computedPos === 'static') el.style.position = 'relative'
  el.appendChild(glare)

  let raf = 0

  const onMove = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height

    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      const rotY = (px - 0.5) * MAX_TILT * 2
      const rotX = (0.5 - py) * MAX_TILT * 2
      el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`
      glare.style.setProperty('--lm-glare-x', `${px * 100}%`)
      glare.style.setProperty('--lm-glare-y', `${py * 100}%`)
    })
  }

  const onEnter = () => { glare.style.opacity = '1' }
  const onLeave = () => {
    glare.style.opacity = '0'
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  }

  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerenter', onEnter)
  el.addEventListener('pointerleave', onLeave)

  // simpan referensi supaya bisa dibersihkan (unmounted)
  ;(el as any).__lmTiltCleanup = () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerenter', onEnter)
    el.removeEventListener('pointerleave', onLeave)
    glare.remove()
    cancelAnimationFrame(raf)
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tilt', {
    mounted(el: HTMLElement) {
      if (!import.meta.client) return
      attach(el)
    },
    unmounted(el: HTMLElement) {
      if (!import.meta.client) return
      ;(el as any).__lmTiltCleanup?.()
    },
  })
})
