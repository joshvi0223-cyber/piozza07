'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { itemCount, openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 transition-all duration-500 ${
          scrolled ? 'bg-black/80 backdrop-blur-md border-b border-hairline' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center gap-3">
          <a href="#" className="font-bodoni text-xl font-bold tracking-tight text-ink">
            PIOZZA<span className="text-red">.</span>
          </a>
          <span className="hidden sm:block font-mono text-[10px] text-ink/40 tracking-[0.2em] mt-1">EST. 1962</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: '01 MENU', href: '#menu' },
            { label: '02 STORY', href: '#prologue' },
            { label: '03 LOCAL', href: '#features' },
            { label: '04 CONTACT', href: '#footer' },
          ].map((link) => (
            <a key={link.label} href={link.href}
              className="font-mono text-[11px] tracking-[0.2em] text-ink/60 hover:text-ink transition-colors duration-200">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href="#menu" id="nav-order-btn"
            className="flex items-center gap-1.5 bg-red text-black font-mono text-[11px] tracking-[0.15em] px-3 sm:px-4 py-2 rounded-full hover:bg-red/90 transition-all duration-200 group">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse-dot" />
            <span>ORDER</span><span className="hidden sm:inline">&nbsp;NOW</span>
            <ArrowUpRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </nav>

      {/* Cart bubble — fixed bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          id="cart-bubble"
          onClick={openCart}
          className="relative flex items-center gap-2 bg-red text-black font-mono text-[11px] tracking-[0.1em] h-11 sm:h-12 px-3 sm:px-4 rounded-full shadow-lg shadow-red/20 hover:bg-red/90 transition-all duration-200 hover:scale-105"
        >
          <ShoppingBag size={14} />
          <span>CART ({itemCount})</span>
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gold text-black font-mono text-[9px] flex items-center justify-center animate-bounce">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </>
  )
}
