import FloatingPizza from './FloatingPizza'
import SplitText from './SplitText'
import { ArrowUpRight } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section id="cta" className="relative border-t border-hairline min-h-[80vh] md:min-h-[100vh] flex items-center py-24 md:py-32 px-6 md:px-10 overflow-hidden">

      {/* Huge ghost pizza */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <FloatingPizza size={700} frame={200} opacity={0.07} spin parallax={0.015} className="animate-spin-slow" />
      </div>

      {/* Corner accents */}
      <div className="pointer-events-none absolute top-20 right-10 hidden md:block">
        <FloatingPizza size={120} frame={80} opacity={0.12} parallax={-0.06} />
      </div>
      <div className="pointer-events-none absolute bottom-20 left-10 hidden md:block">
        <FloatingPizza size={100} frame={40} opacity={0.10} parallax={0.07} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center gap-8">

        <div data-reveal>
          <span className="font-mono text-[10px] tracking-[0.3em] text-ink/35">(07) — ORDER</span>
        </div>

        <h2 className="font-bodoni italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-ink leading-none" data-reveal data-reveal-delay="1">
          <SplitText parts={['One bite.']} by="char" stagger={32} />
          <br />
          <SplitText
            parts={[{ text: "You're hooked.", className: 'text-red' }]}
            by="char"
            stagger={32}
            delay={400}
          />
        </h2>

        <p className="font-mono text-[11px] tracking-[0.25em] text-ink/40 mt-2" data-reveal data-reveal-delay="2">
          MON–FRI 12:00–22:00 · SAT–SUN 11:00–23:00
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4" data-reveal data-reveal-delay="3">
          <a
            href="#menu"
            id="final-order-btn"
            className="flex items-center gap-2 bg-red text-black font-mono text-[11px] tracking-[0.2em] px-8 py-4 rounded-full hover:bg-red/90 transition-all duration-200 shadow-[0_0_40px_rgba(255,58,38,0.35)] hover:shadow-[0_0_60px_rgba(255,58,38,0.5)] group"
          >
            ORDER YOUR SLICE
            <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a href="#menu"
            className="font-mono text-[11px] tracking-[0.2em] text-ink/50 hover:text-ink border-b border-ink/20 hover:border-ink/50 pb-1 transition-all duration-200">
            VIEW FULL MENU
          </a>
        </div>

      </div>
    </section>
  )
}
