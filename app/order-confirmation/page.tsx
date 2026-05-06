'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Nav from '../components/Nav'
import CartDrawer from '../components/CartDrawer'
import { ArrowUpRight, Check } from 'lucide-react'

function Confirmation() {
  const params = useSearchParams()
  const orderId = params.get('id') || 'PZA-DEMO'
  const eta = params.get('eta') || '35'

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-32 text-center relative overflow-hidden">

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-[600px] h-[600px] rounded-full blur-[160px]" style={{ background: '#047857' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-2xl">
        {/* Check icon */}
        <div className="w-16 h-16 rounded-full border border-red flex items-center justify-center">
          <Check size={24} className="text-red" />
        </div>

        <div>
          <span className="font-mono text-[10px] tracking-[0.4em] text-ink/30 block mb-4">ORDER CONFIRMED</span>
          <h1 className="font-bodoni italic text-5xl sm:text-6xl md:text-7xl text-ink leading-none">
            Order <span className="text-red">received.</span>
          </h1>
        </div>

        <div className="w-px h-12 bg-hairline" />

        <div className="flex flex-col items-center gap-2">
          <p className="font-mono text-[11px] tracking-[0.2em] text-ink/50">ORDER REFERENCE</p>
          <p className="font-bodoni italic text-3xl text-gold">{orderId}</p>
        </div>

        <div className="grid grid-cols-2 gap-12 border-t border-b border-hairline py-8 w-full">
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-ink/30">ESTIMATED DELIVERY</span>
            <span className="font-bodoni italic text-4xl text-ink">{eta}<span className="text-red text-2xl">min</span></span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.2em] text-ink/30">OVEN STATUS</span>
            <span className="font-bodoni italic text-2xl text-ink">
              <span className="inline-block w-2 h-2 rounded-full bg-red mr-2 animate-pulse" />
              FIRING
            </span>
          </div>
        </div>

        <p className="font-inter text-sm text-ink/40 leading-relaxed max-w-sm">
          A confirmation has been sent to your email. Our pizzaiolo is preparing your order at 900°.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <a href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-red text-black font-mono text-[11px] tracking-[0.2em] py-4 rounded-full hover:bg-red/90 transition-all duration-200 group">
            BACK TO HOME
            <ArrowUpRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a href="/#menu"
            className="flex-1 flex items-center justify-center font-mono text-[11px] tracking-[0.2em] text-ink/40 hover:text-ink border border-hairline hover:border-ink/40 py-4 rounded-full transition-all duration-200">
            ORDER MORE
          </a>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-black">
      <Nav />
      <CartDrawer />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="font-mono text-ink/30 text-xs tracking-widest">LOADING...</span></div>}>
        <Confirmation />
      </Suspense>
    </div>
  )
}
