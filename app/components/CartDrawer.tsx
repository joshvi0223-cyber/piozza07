'use client'

import { useEffect, useRef } from 'react'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowUpRight } from 'lucide-react'

function padded(n: number) {
  return String(n).padStart(4, '0')
}

export default function CartDrawer() {
  const { state, closeCart, removeFromCart, setQuantity, subtotal, deliveryFee, total, itemCount } = useCart()
  const router = useRouter()
  const overlayRef = useRef<HTMLDivElement>(null)

  // Lock body scroll when open
  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [state.isOpen])

  const handleCheckout = () => {
    closeCart()
    router.push('/checkout')
  }

  const FREE_THRESHOLD = 50
  const remaining = FREE_THRESHOLD - subtotal
  const freeProgress = Math.min((subtotal / FREE_THRESHOLD) * 100, 100)

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={closeCart}
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: state.isOpen ? 1 : 0, pointerEvents: state.isOpen ? 'auto' : 'none' }}
        aria-hidden
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label="Your cart"
        className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-black border-l border-hairline flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: state.isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-hairline">
          <div className="flex items-center gap-3">
            <ShoppingBag size={16} className="text-ink/50" />
            <span className="font-mono text-[11px] tracking-[0.3em] text-ink/60">YOUR ORDER</span>
            {itemCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red text-black font-mono text-[10px]">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="text-ink/40 hover:text-ink transition-colors duration-200 p-1"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free delivery progress */}
        {subtotal > 0 && (
          <div className="px-6 py-3 border-b border-hairline">
            <div className="flex justify-between mb-1.5">
              <span className="font-mono text-[10px] tracking-[0.15em] text-ink/40">
                {remaining > 0 ? `£${remaining.toFixed(2)} from free delivery` : '✓ FREE DELIVERY UNLOCKED'}
              </span>
              <span className="font-mono text-[10px] text-red">£{FREE_THRESHOLD}</span>
            </div>
            <div className="h-px bg-ink/10 relative">
              <div
                className="absolute inset-y-0 left-0 bg-red transition-all duration-500"
                style={{ width: `${freeProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} className="text-ink/10" />
              <p className="font-bodoni italic text-2xl text-ink/30">The table is empty.</p>
              <p className="font-mono text-[10px] tracking-[0.2em] text-ink/20">ADD A PIE TO BEGIN</p>
            </div>
          ) : (
            state.items.map((item) => {
              const imgSrc = `/frames/frame_${padded(item.frame)}.jpg`
              return (
                <div key={item.id} className="flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-black/40">
                    <img src={imgSrc} alt={item.name} className="w-full h-full object-cover opacity-90" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bodoni italic text-lg text-ink leading-tight">{item.name}</p>
                        <p className="font-mono text-[10px] tracking-[0.12em] text-ink/35 mt-0.5">{item.italian}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-ink/20 hover:text-red transition-colors duration-200 ml-2 mt-0.5"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Qty + price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 border border-hairline rounded-full px-1">
                        <button
                          onClick={() => setQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-ink/50 hover:text-ink transition-colors duration-150"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="font-mono text-[11px] w-5 text-center text-ink">{item.quantity}</span>
                        <button
                          onClick={() => setQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-ink/50 hover:text-ink transition-colors duration-150"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <span className="font-bodoni italic text-gold text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-hairline px-6 py-6 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-mono text-[10px] tracking-[0.15em] text-ink/40">SUBTOTAL</span>
                <span className="font-mono text-[11px] text-ink/70">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-[10px] tracking-[0.15em] text-ink/40">DELIVERY</span>
                <span className="font-mono text-[11px] text-ink/70">
                  {deliveryFee === 0 ? <span className="text-red">FREE</span> : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-hairline">
                <span className="font-mono text-[11px] tracking-[0.2em] text-ink">TOTAL</span>
                <span className="font-bodoni italic text-gold text-xl">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-red text-black font-mono text-[11px] tracking-[0.2em] py-4 rounded-full hover:bg-red/90 transition-all duration-200 shadow-[0_0_30px_rgba(4,120,87,0.3)] hover:shadow-[0_0_50px_rgba(4,120,87,0.45)] group"
            >
              PROCEED TO CHECKOUT
              <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={closeCart}
              className="w-full font-mono text-[10px] tracking-[0.2em] text-ink/30 hover:text-ink/60 transition-colors duration-200 py-1"
            >
              CONTINUE BROWSING
            </button>
          </div>
        )}
      </div>
    </>
  )
}
