'use client'

import { useEffect, useRef, useState } from 'react'
import SplitText from './SplitText'

const stats = [
  { num: '900', unit: '°', label: 'OVEN TEMP', sub: 'Quercia oak fire' },
  { num: '60', unit: 's', label: 'BAKE TIME', sub: 'Stone hearth, no shortcuts' },
  { num: '12', unit: 'd', label: 'FERMENT', sub: 'Slow, cold, deliberate' },
  { num: '1962', unit: '', label: 'EST.', sub: 'Three generations' },
]

function CountUp({ target, duration = 1800 }: { target: number; duration?: number }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) { setVal(target); return }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const tick = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setVal(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{val}</span>
}

export default function Stats() {
  return (
    <section id="stats" className="border-t border-hairline py-20 md:py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-14 grid md:grid-cols-12 gap-6">
          <div className="md:col-span-3 flex flex-col gap-4" data-reveal>
            <span className="font-mono text-[10px] tracking-[0.3em] text-ink/35">(04)</span>
            <span className="font-mono text-[11px] tracking-[0.25em] text-ink/50">BY THE NUMBERS</span>
          </div>
          <div className="md:col-span-9" data-reveal data-reveal-delay="1">
            <h2 className="font-bodoni italic text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
              A pizza is the sum of its{' '}
              <SplitText parts={[{ text: 'discipline.', className: 'text-red' }]} by="char" stagger={32} />
            </h2>
          </div>
        </div>

        {/* Stats band */}
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => {
            const isLastInRowMobile = i % 2 === 1
            const isLastInRowDesktop = i === stats.length - 1
            const isLastRowMobile = i >= stats.length - 2

            return (
              <div
                key={s.label}
                className={[
                  'flex flex-col gap-3 py-10 px-6 md:px-8',
                  !isLastInRowMobile ? 'border-r border-hairline' : '',
                  !isLastInRowDesktop ? 'md:border-r md:border-hairline' : 'md:border-r-0',
                  isLastInRowMobile ? 'border-r-0' : '',
                  !isLastRowMobile ? 'border-b border-hairline md:border-b-0' : '',
                ].join(' ')}
                data-reveal
                data-reveal-delay={String(i + 1) as '1' | '2' | '3' | '4'}
              >
                <span className="font-bodoni text-5xl md:text-6xl text-ink leading-none">
                  <CountUp target={Number(s.num)} />
                  <span className="text-red">{s.unit}</span>
                </span>
                <span className="font-mono text-[10px] tracking-[0.25em] text-ink/45">{s.label}</span>
                <span className="font-inter text-xs text-ink/40 leading-relaxed">{s.sub}</span>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
