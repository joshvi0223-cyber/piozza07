'use client'

import { useCart } from '../context/CartContext'
import SplitText from './SplitText'
import { ArrowRight, Plus, Check } from 'lucide-react'
import { useState } from 'react'
import { PIES } from '../data/menu'

function padded(n: number) {
  return String(n).padStart(4, '0')
}

export default function Menu() {
  const { addToCart, openCart } = useCart()
  const [addedId, setAddedId] = useState<string | null>(null)

  const handleAdd = (pie: typeof PIES[0]) => {
    addToCart({
      id: pie.id,
      name: pie.name,
      italian: pie.italian,
      price: pie.price,
      frame: pie.frame,
    })
    setAddedId(pie.id)
    setTimeout(() => setAddedId(null), 1500)
    // briefly open the drawer
    setTimeout(() => openCart(), 300)
  }

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
              <SplitText parts={['Four pies. / ']} by="char" stagger={28} />
              <br />
              <SplitText parts={['Zero ', { text: 'compromise.', className: 'text-red' }]} by="char" stagger={28} delay={500} />
            </h2>
          </div>
        </div>

        {/* Pie cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {PIES.map((pie, idx) => {
            const imgSrc = `/frames/frame_${padded(pie.frame)}.jpg`
            const isAdded = addedId === pie.id
            return (
              <div key={pie.id} className="flex flex-col gap-5" data-reveal data-reveal-delay={String(Math.min(idx + 1, 4)) as '1'|'2'|'3'|'4'}>
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-black/50">
                  <img src={imgSrc} alt={pie.name}
                    className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)' }} />
                  <span className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em] text-ink/70 bg-black/60 px-2 py-1">
                    {pie.badge}
                  </span>
                  <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.15em] text-ink/60">
                    {pie.italian}
                  </span>
                </div>

                {/* Roman numeral + price */}
                <div className="flex items-center justify-between border-b border-hairline pb-3">
                  <span className="font-bodoni text-red text-2xl">{pie.num}</span>
                  <span className="font-bodoni italic text-gold text-xl">${pie.price}</span>
                </div>

                <h3 className="font-bodoni italic text-3xl text-ink">
                  <SplitText parts={[pie.name]} by="char" stagger={40} delay={idx * 120} />
                </h3>
                <p className="font-inter text-sm text-ink/55 leading-relaxed">{pie.desc}</p>
                <p className="font-mono text-[10px] tracking-[0.15em] text-ink/35">
                  {pie.ingredients.join(' · ')}
                </p>

                {/* Add to cart */}
                <button
                  id={`add-to-cart-${pie.id}`}
                  onClick={() => handleAdd(pie)}
                  className={`inline-flex items-center justify-between gap-2 font-mono text-[11px] tracking-[0.2em] border px-4 py-3 rounded-full w-full transition-all duration-300 group ${
                    isAdded
                      ? 'bg-red border-red text-black'
                      : 'border-ink/20 text-ink/60 hover:border-red hover:text-red hover:bg-red/5'
                  }`}
                >
                  <span>{isAdded ? 'ADDED ✓' : 'ADD TO CART'}</span>
                  {isAdded
                    ? <Check size={13} />
                    : <Plus size={13} className="transition-transform duration-200 group-hover:rotate-90" />
                  }
                </button>

                {/* Quick order */}
                <a href="/checkout"
                  className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-ink/30 hover:text-ink border-b border-ink/10 hover:border-ink/40 pb-1 w-fit transition-all duration-200 group">
                  ORDER NOW
                  <ArrowRight size={11} className="transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
