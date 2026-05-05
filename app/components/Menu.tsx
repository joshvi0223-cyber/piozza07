import SplitText from './SplitText'
import { ArrowRight } from 'lucide-react'

const TOTAL_FRAMES = 240

const pies = [
  {
    num: 'I',
    badge: '№ 01',
    italian: '— LA REGINA',
    name: 'Margherita',
    price: '$18',
    desc: 'The original. Nothing hidden, nothing lacking. A study in balance.',
    ingredients: ['San Marzano', 'Bufala', 'Basil', 'EVOO'],
    frame: 1,
  },
  {
    num: 'II',
    badge: '№ 02',
    italian: '— IL DIAVOLO',
    name: 'Diavola',
    price: '$22',
    desc: 'Calabrian heat, restrained. Spice that builds slowly, lingers longer.',
    ingredients: ['Spicy Salami', 'Calabrian', 'Mozzarella', 'Sugo'],
    frame: Math.round(TOTAL_FRAMES * 0.3),
  },
  {
    num: 'III',
    badge: '№ 03',
    italian: '— IL TESORO',
    name: 'Tartufo',
    price: '$26',
    desc: 'Earth and luxury. A truffle-threaded canvas on a char-kissed crust.',
    ingredients: ['Black Truffle', 'Mushroom', 'Fior di Latte', 'Truffle Oil'],
    frame: Math.round(TOTAL_FRAMES * 0.6),
  },
  {
    num: 'IV',
    badge: '№ 04',
    italian: '— LA BIANCA',
    name: 'Quattro Formaggi',
    price: '$24',
    desc: 'Four cheeses, one harmony. Rich, molten, and restrained all at once.',
    ingredients: ['Gorgonzola', 'Fior di Latte', 'Pecorino', 'Parmigiano'],
    frame: Math.round(TOTAL_FRAMES * 0.75),
  },
]

export default function Menu() {
  return (
    <section id="menu" className="border-t border-hairline py-20 md:py-32 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="mb-16 md:mb-20 grid md:grid-cols-12 gap-6">
          <div className="md:col-span-3 flex flex-col gap-4" data-reveal>
            <span className="font-mono text-[10px] tracking-[0.3em] text-ink/35">(03)</span>
            <span className="font-mono text-[11px] tracking-[0.25em] text-ink/50">MENU</span>
          </div>
          <div className="md:col-span-9" data-reveal data-reveal-delay="1">
            <h2 className="font-bodoni italic text-4xl sm:text-5xl md:text-6xl text-ink leading-tight">
              <SplitText
                parts={['Three pies. / ']}
                by="char"
                stagger={28}
              />
              <br />
              <SplitText
                parts={['Zero ', { text: 'compromise.', className: 'text-red' }]}
                by="char"
                stagger={28}
                delay={500}
              />
            </h2>
          </div>
        </div>

        {/* Pie cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {pies.map((pie, idx) => {
            const padded = String(pie.frame).padStart(4, '0')
            const imgSrc = `/frames/frame_${padded}.jpg`
            return (
              <div key={pie.num} className="flex flex-col gap-5" data-reveal data-reveal-delay={String(idx + 1) as '1' | '2' | '3' | '4'}>
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-black/50">
                  <img src={imgSrc} alt={pie.name}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105" />
                  {/* Gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }} />
                  {/* Top-left badge */}
                  <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em] text-ink/70 bg-black/60 px-2 py-1">
                    {pie.badge}
                  </span>
                  {/* Bottom-left Italian name */}
                  <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.15em] text-ink/60">
                    {pie.italian}
                  </span>
                </div>

                {/* Roman numeral + price row */}
                <div className="flex items-center justify-between border-b border-hairline pb-3">
                  <span className="font-bodoni text-red text-2xl">{pie.num}</span>
                  <span className="font-bodoni italic text-gold text-xl">{pie.price}</span>
                </div>

                {/* Name */}
                <h3 className="font-bodoni italic text-3xl text-ink">
                  <SplitText parts={[pie.name]} by="char" stagger={40} delay={idx * 120} />
                </h3>

                {/* Desc */}
                <p className="font-inter text-sm text-ink/55 leading-relaxed max-w-md">{pie.desc}</p>

                {/* Ingredients */}
                <p className="font-mono text-[10px] tracking-[0.15em] text-ink/35">
                  {pie.ingredients.join(' · ')}
                </p>

                {/* CTA */}
                <a href="#" className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-ink/60 hover:text-ink border-b border-ink/20 hover:border-ink/60 pb-1 w-fit transition-all duration-200 group">
                  ADD TO CART
                  <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
