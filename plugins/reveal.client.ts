// plugins/reveal.client.ts
//
// Pengganti library "aos" (±13KB + overhead scroll listener) dengan
// IntersectionObserver bawaan browser. Markup `data-aos="fade-up"` &
// `data-aos-delay="100"` yang sudah ada di semua halaman TETAP DIPAKAI apa
// adanya — cuma "mesin" di baliknya diganti jadi jauh lebih ringan.
export default defineNuxtPlugin(() => {
  if (import.meta.server) return
  if (typeof window === 'undefined') return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate')
          observer.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  )

  const scan = () => {
    document.querySelectorAll<HTMLElement>('[data-aos]:not(.aos-scanned)').forEach((el) => {
      el.classList.add('aos-scanned')
      if (prefersReducedMotion) {
        el.classList.add('aos-animate')
        return
      }
      const delay = el.getAttribute('data-aos-delay')
      if (delay) el.style.transitionDelay = `${delay}ms`
      observer.observe(el)
    })
  }

  // Elemen dari data async (portfolio grid, testimonials, dll) muncul setelah
  // fetch selesai — MutationObserver menangkap itu tanpa polling terus-menerus.
  const mutationObserver = new MutationObserver(() => scan())

  const start = () => {
    scan()
    mutationObserver.observe(document.body, { childList: true, subtree: true })
  }

  if (document.readyState === 'complete') start()
  else window.addEventListener('load', start, { once: true })

  const router = useRouter()
  router.afterEach(() => {
    // Re-scan setelah pindah halaman (elemen baru belum ke-observe)
    requestAnimationFrame(scan)
  })
})
