'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const TOTAL_FRAMES = 240
const FRAME_EXT = 'jpg'

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v))
}

function padded(n: number) {
  return String(n).padStart(4, '0')
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const subheadRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)

  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)
  const rafRef = useRef<number>(0)
  const ticking = useRef(false)
  const progressRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const lerpedMouseRef = useRef({ x: 0.5, y: 0.5 })
  const tRef = useRef(0)

  const [loadedCount, setLoadedCount] = useState(0)
  const [ready, setReady] = useState(false)

  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES)
    let loaded = 0
    let isReady = false
    const threshold = Math.floor(TOTAL_FRAMES * 0.8)

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `/frames/frame_${padded(i)}.${FRAME_EXT}`
      const onDone = () => {
        loaded++
        setLoadedCount(loaded)
        if (loaded >= threshold && !isReady) {
          isReady = true
          imagesRef.current = images
          setReady(true)
        }
        if (loaded === TOTAL_FRAMES) {
          imagesRef.current = images
        }
      }
      img.onload = onDone
      img.onerror = onDone
      images[i - 1] = img
    }
  }, [])

  const drawFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const img = imagesRef.current[frameIdx]
    if (!img || !img.complete || !img.naturalWidth) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const cw = canvas.width
    const ch = canvas.height
    ctx.clearRect(0, 0, cw, ch)
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight) * 0.9
    const dw = img.naturalWidth * scale
    const dh = img.naturalHeight * scale
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2
    ctx.drawImage(img, dx, dy, dw, dh)
  }, [])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = wrap.clientWidth
    const h = wrap.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    drawFrame(currentFrameRef.current)
  }, [drawFrame])

  // Main rAF loop
  useEffect(() => {
    if (!ready) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let animId: number

    const loop = (timestamp: number) => {
      tRef.current = timestamp / 1000
      const t = tRef.current
      const p = progressRef.current

      // Bob wrap
      if (!prefersReduced && wrapRef.current) {
        const bob = Math.sin(t * 1.1) * 5
        const scaleV = 1 + p * 0.08
        wrapRef.current.style.transform = `translateY(${bob}px) scale(${scaleV})`
      }

      // Cursor parallax on stage
      if (!prefersReduced && stageRef.current) {
        const lm = lerpedMouseRef.current
        const m = mouseRef.current
        lm.x += (m.x - lm.x) * 0.08
        lm.y += (m.y - lm.y) * 0.08
        const rx = (lm.y - 0.5) * -5
        const ry = (lm.x - 0.5) * 6
        const tx = (lm.x - 0.5) * 10
        stageRef.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateX(${tx}px)`
      }

      // Spotlight
      if (!prefersReduced && spotlightRef.current) {
        const m = mouseRef.current
        const sw = window.innerWidth
        const sh = window.innerHeight
        spotlightRef.current.style.transform = `translate3d(${m.x * sw - 200}px, ${m.y * sh - 200}px, 0)`
      }

      // Overlay opacities driven by p
      if (eyebrowRef.current) {
        const op = p > 0.6 ? Math.max(0, 1 - (p - 0.6) / 0.2) : 1
        eyebrowRef.current.style.opacity = String(op)
      }
      if (headlineRef.current) {
        const ty = p * -40
        const sc = 1 - p * 0.08
        headlineRef.current.style.transform = `translateY(${ty}px) scale(${sc})`
      }
      if (subheadRef.current) {
        const op = p > 0.75 ? Math.max(0, 1 - (p - 0.75) / 0.25) : 1
        subheadRef.current.style.opacity = String(op)
      }
      if (scrollCueRef.current) {
        const op = p > 0.2 ? Math.max(0, 1 - (p - 0.2) / 0.1) : 1
        scrollCueRef.current.style.opacity = String(op)
      }

      animId = requestAnimationFrame(loop)
    }

    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [ready])

  // Scroll handler
  useEffect(() => {
    if (!ready) return

    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const section = sectionRef.current
        if (!section) { ticking.current = false; return }
        const rect = section.getBoundingClientRect()
        const p = clamp01(-rect.top / (section.offsetHeight - window.innerHeight))
        progressRef.current = p
        const frameIdx = Math.round(p * (TOTAL_FRAMES - 1))
        if (frameIdx !== currentFrameRef.current) {
          currentFrameRef.current = frameIdx
          drawFrame(frameIdx)
        }
        ticking.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ready, drawFrame])

  // Mouse tracking
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
      if (spotlightRef.current) spotlightRef.current.classList.add('is-active')
    }
    const onLeave = () => {
      if (spotlightRef.current) spotlightRef.current.classList.remove('is-active')
    }
    window.addEventListener('mousemove', onMouse)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMouse)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  // Resize
  useEffect(() => {
    if (!ready) return
    resizeCanvas()
    const onResize = () => resizeCanvas()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [ready, resizeCanvas])

  // Draw first frame once ready
  useEffect(() => {
    if (ready) {
      resizeCanvas()
      drawFrame(0)
    }
  }, [ready, resizeCanvas, drawFrame])

  const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100)

  return (
    <section ref={sectionRef} id="hero" className="hero relative h-[800vh]">
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-black pt-16">

        {/* Loading veil */}
        {!ready && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black gap-6">
            <div className="w-48 h-px bg-ink/10 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-ink/60 transition-all duration-300"
                style={{ width: `${pct}%` }} />
            </div>
            <span className="font-mono text-[11px] tracking-[0.3em] text-ink/40">PREPARING… {pct}%</span>
          </div>
        )}

        {/* Ambient orbs */}
        <div className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-red/5 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[100px]" />

        {/* Cursor spotlight */}
        <div ref={spotlightRef}
          className="pointer-events-none absolute top-0 left-0 w-[400px] h-[400px] rounded-full opacity-0 transition-opacity duration-300 is-active:opacity-100"
          style={{
            background: 'radial-gradient(circle, rgba(255,58,38,0.08) 0%, transparent 70%)',
            mixBlendMode: 'screen',
            willChange: 'transform',
          }}
        />

        {/* Top corner micro-labels */}
        <div className="hidden md:flex absolute top-20 left-10 z-10">
          <span className="font-mono text-[10px] tracking-[0.2em] text-ink/25">(01) — HERO</span>
        </div>
        <div className="hidden md:flex absolute top-20 right-10 z-10">
          <span className="font-mono text-[10px] tracking-[0.2em] text-ink/25">NEAPOLITAN / WOOD-FIRED</span>
        </div>

        {/* Left side rail */}
        <div className="animate-enter-rail-left hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-10"
          style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}>
          <span className="font-mono text-[10px] tracking-[0.25em] text-ink/25">PIOZZA · NAPOLI · 1962 · ARTIGIANO</span>
        </div>

        {/* Right side rail */}
        <div className="animate-enter-rail-right hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-10"
          style={{ writingMode: 'vertical-rl' }}>
          <span className="font-mono text-[10px] tracking-[0.25em] text-ink/25">FOR. SCROLL — TASTE — TRADITION — ETERNAL</span>
        </div>

        {/* Text block */}
        <div className="relative z-10 flex flex-col items-center text-center pt-6 px-6">
          <div ref={eyebrowRef} className="animate-enter-eyebrow">
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.5em] text-ink/50">
              — A SLICE OF NAPLES —
            </span>
          </div>

          <div ref={headlineRef} className="animate-enter-headline mt-3" style={{ willChange: 'transform' }}>
            <h1 className="font-bodoni italic text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] xl:text-[8rem] text-ink leading-none">
              Taste the <span className="text-red">Tradition.</span>
            </h1>
          </div>

          <div ref={subheadRef} className="animate-enter-subhead mt-4">
            <p className="font-mono text-[11px] sm:text-xs tracking-[0.2em] text-ink/45 max-w-xs sm:max-w-sm">
              900° wood-fired. 60 seconds. Centuries of devotion.
            </p>
          </div>
        </div>

        {/* Canvas stage */}
        <div ref={stageRef} className="animate-enter-canvas relative flex-1 flex items-center justify-center"
          style={{ willChange: 'transform', perspective: '1000px' }}>
          <div ref={wrapRef} className="relative h-full w-full max-w-4xl mx-auto" style={{ willChange: 'transform' }}>
            <canvas
              ref={canvasRef}
              className="absolute inset-0 h-full w-full"
              style={{
                filter: 'contrast(1.18) brightness(0.95) saturate(1.15)',
                maskImage: 'radial-gradient(ellipse 50% 60% at 50% 50%, #000 30%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.45) 70%, transparent 92%)',
                WebkitMaskImage: 'radial-gradient(ellipse 50% 60% at 50% 50%, #000 30%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.45) 70%, transparent 92%)',
              }}
            />
            {/* Floor shadow */}
            <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-8 blur-xl"
              style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)' }} />
          </div>
        </div>

        {/* Bottom credits row */}
        <div ref={scrollCueRef}
          className="animate-enter-credits relative z-10 flex items-center justify-between px-6 md:px-10 pb-6 mt-auto">
          <span className="hidden md:block font-mono text-[10px] tracking-[0.2em] text-ink/25">
            FRESCO / DAILY · NO PRESERVATIVES
          </span>
          <div className="flex flex-col items-center gap-2 mx-auto">
            <span className="font-mono text-[10px] tracking-[0.3em] text-ink/35">SCROLL TO TASTE</span>
            <div className="w-px h-8 bg-ink/30 pulse-line" />
          </div>
          <span className="hidden md:block font-mono text-[10px] tracking-[0.2em] text-ink/25">
            01 / 04 — SECTIONS
          </span>
        </div>

      </div>
    </section>
  )
}
