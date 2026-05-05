import FloatingPizza from './FloatingPizza'
import SplitText from './SplitText'

export default function Quote() {
  return (
    <section id="quote" className="relative border-t border-hairline min-h-[60vh] md:min-h-[80vh] flex items-center py-20 md:py-32 px-6 md:px-10 overflow-hidden">

      {/* Ghost pizza */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <FloatingPizza size={600} frame={180} opacity={0.06} spin parallax={0.02} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
        {/* Opening quote */}
        <span className="font-bodoni text-[8rem] md:text-[12rem] text-red leading-none" aria-hidden>
          &#8220;
        </span>

        <blockquote className="font-bodoni italic text-2xl sm:text-3xl md:text-4xl text-ink leading-relaxed -mt-16 md:-mt-20" data-reveal>
          <SplitText
            parts={[
              'In the center of Naples, time is measured in dough rises and oven flares — ',
              { text: 'never minutes.', className: 'text-red' },
            ]}
            by="word"
            stagger={60}
          />
        </blockquote>

        <div className="flex flex-col items-center gap-4 mt-4" data-reveal data-reveal-delay="2">
          <div className="w-12 h-px bg-hairline" />
          <span className="font-mono text-[11px] tracking-[0.3em] text-ink/60">NONNA LUCIA</span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-ink/35">PIZZAIOLA · NAPLES · 1962</span>
        </div>
      </div>

    </section>
  )
}
