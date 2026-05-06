'use client'

import { useState, FormEvent } from 'react'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'
import Nav from '../components/Nav'
import CartDrawer from '../components/CartDrawer'
import { ArrowLeft, ArrowUpRight, Loader2 } from 'lucide-react'

function padded(n: number) { return String(n).padStart(4, '0') }

type Step = 'details' | 'delivery' | 'payment'

const inputClass = "w-full bg-transparent border-b border-hairline text-ink font-inter text-sm py-3 outline-none placeholder:text-ink/25 focus:border-ink/40 transition-colors duration-200"
const labelClass = "font-mono text-[10px] tracking-[0.25em] text-ink/40 block mb-2"

export default function CheckoutPage() {
  const { state, subtotal, deliveryFee, total, clearCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState<Step>('details')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', postcode: '', notes: '',
    time: 'asap' as 'asap' | 'scheduled',
    scheduledTime: '',
    payment: 'cash' as 'cash' | 'card',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone },
          delivery: { street: form.street, city: form.city, postcode: form.postcode, notes: form.notes, time: form.time, scheduledTime: form.scheduledTime },
          payment: form.payment,
          items: state.items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          subtotal, deliveryFee, total,
        }),
      })
      const data = await res.json()
      if (data.success) {
        clearCart()
        router.push(`/order-confirmation?id=${data.order.id}&eta=${data.order.estimatedMinutes}`)
      }
    } catch {
      setLoading(false)
    }
  }

  const steps: Step[] = ['details', 'delivery', 'payment']
  const stepLabels = ['01 DETAILS', '02 DELIVERY', '03 PAYMENT']
  const stepIdx = steps.indexOf(step)

  if (state.items.length === 0 && state.isHydrated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center flex-col gap-6">
        <Nav />
        <p className="font-bodoni italic text-4xl text-ink/40">Your cart is empty.</p>
        <a href="/#menu" className="font-mono text-[11px] tracking-[0.2em] text-ink/40 hover:text-ink border-b border-ink/20 pb-1">← BACK TO MENU</a>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Nav />
      <CartDrawer />

      <div className="pt-24 pb-20 px-6 md:px-10 max-w-7xl mx-auto">

        {/* Back */}
        <a href="/#menu" className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-ink/30 hover:text-ink transition-colors duration-200 mb-10 group">
          <ArrowLeft size={11} className="transition-transform duration-200 group-hover:-translate-x-1" />
          BACK TO MENU
        </a>

        {/* Title */}
        <div className="mb-12">
          <span className="font-mono text-[10px] tracking-[0.3em] text-ink/30 block mb-3">(CHECKOUT)</span>
          <h1 className="font-bodoni italic text-5xl md:text-6xl text-ink">Complete your <span className="text-red">order.</span></h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-12 border-b border-hairline pb-6">
          {stepLabels.map((label, i) => (
            <button
              key={label}
              onClick={() => i < stepIdx && setStep(steps[i])}
              className={`font-mono text-[10px] tracking-[0.2em] mr-8 pb-1 border-b-2 transition-all duration-200 ${
                i === stepIdx ? 'border-red text-ink' : i < stepIdx ? 'border-ink/20 text-ink/50 cursor-pointer hover:text-ink' : 'border-transparent text-ink/20 cursor-default'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-12 gap-12">

          {/* Form */}
          <div className="md:col-span-7">
            <form onSubmit={handleSubmit}>

              {/* Step 1 — Customer details */}
              {step === 'details' && (
                <div className="space-y-8">
                  <h2 className="font-bodoni italic text-2xl text-ink">Your details</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>FIRST NAME</label>
                      <input required value={form.firstName} onChange={set('firstName')} placeholder="Antonio" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>LAST NAME</label>
                      <input required value={form.lastName} onChange={set('lastName')} placeholder="Russo" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>EMAIL ADDRESS</label>
                    <input required type="email" value={form.email} onChange={set('email')} placeholder="antonio@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>PHONE NUMBER</label>
                    <input required type="tel" value={form.phone} onChange={set('phone')} placeholder="+39 000 000 0000" className={inputClass} />
                  </div>
                  <button type="button" onClick={() => setStep('delivery')}
                    className="flex items-center gap-2 bg-red text-black font-mono text-[11px] tracking-[0.2em] px-8 py-4 rounded-full hover:bg-red/90 transition-all duration-200 group mt-4">
                    CONTINUE TO DELIVERY
                    <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              )}

              {/* Step 2 — Delivery */}
              {step === 'delivery' && (
                <div className="space-y-8">
                  <h2 className="font-bodoni italic text-2xl text-ink">Delivery details</h2>
                  <div>
                    <label className={labelClass}>STREET ADDRESS</label>
                    <input required value={form.street} onChange={set('street')} placeholder="Via dei Tribunali 12" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>CITY</label>
                      <input required value={form.city} onChange={set('city')} placeholder="Napoli" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>POSTCODE</label>
                      <input required value={form.postcode} onChange={set('postcode')} placeholder="80138" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>DELIVERY TIME</label>
                    <div className="flex gap-4 mt-2">
                      {[{ val: 'asap', label: 'AS SOON AS POSSIBLE' }, { val: 'scheduled', label: 'SCHEDULE' }].map(opt => (
                        <button key={opt.val} type="button"
                          onClick={() => setForm(f => ({ ...f, time: opt.val as 'asap' | 'scheduled' }))}
                          className={`flex-1 border py-3 font-mono text-[10px] tracking-[0.15em] rounded-full transition-all duration-200 ${
                            form.time === opt.val ? 'border-red bg-red/10 text-red' : 'border-hairline text-ink/40 hover:border-ink/40 hover:text-ink'
                          }`}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {form.time === 'scheduled' && (
                      <input type="time" value={form.scheduledTime} onChange={set('scheduledTime')}
                        className={`${inputClass} mt-4`} />
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>ORDER NOTES (OPTIONAL)</label>
                    <textarea value={form.notes} onChange={set('notes')} placeholder="Ring the bell twice..." rows={3}
                      className={`${inputClass} resize-none`} />
                  </div>
                  <button type="button" onClick={() => setStep('payment')}
                    className="flex items-center gap-2 bg-red text-black font-mono text-[11px] tracking-[0.2em] px-8 py-4 rounded-full hover:bg-red/90 transition-all duration-200 group mt-4">
                    CONTINUE TO PAYMENT
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              )}

              {/* Step 3 — Payment */}
              {step === 'payment' && (
                <div className="space-y-8">
                  <h2 className="font-bodoni italic text-2xl text-ink">Payment method</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { val: 'cash', label: 'CASH ON DELIVERY', sub: 'Pay when your pizza arrives.' },
                      { val: 'card', label: 'CARD (DEMO)', sub: 'Simulated — no charge.' },
                    ].map(opt => (
                      <button key={opt.val} type="button"
                        onClick={() => setForm(f => ({ ...f, payment: opt.val as 'cash' | 'card' }))}
                        className={`border p-5 text-left rounded transition-all duration-200 ${
                          form.payment === opt.val ? 'border-red bg-red/5' : 'border-hairline hover:border-ink/30'
                        }`}>
                        <p className={`font-mono text-[10px] tracking-[0.2em] mb-2 ${form.payment === opt.val ? 'text-red' : 'text-ink/50'}`}>{opt.label}</p>
                        <p className="font-inter text-xs text-ink/40">{opt.sub}</p>
                      </button>
                    ))}
                  </div>

                  {form.payment === 'card' && (
                    <div className="space-y-6 border border-hairline p-6 rounded">
                      <div>
                        <label className={labelClass}>CARD NUMBER</label>
                        <input placeholder="4242 4242 4242 4242" className={inputClass} readOnly />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className={labelClass}>EXPIRY</label>
                          <input placeholder="MM / YY" className={inputClass} readOnly />
                        </div>
                        <div>
                          <label className={labelClass}>CVC</label>
                          <input placeholder="•••" className={inputClass} readOnly />
                        </div>
                      </div>
                      <p className="font-mono text-[9px] tracking-[0.15em] text-ink/25">DEMO MODE — NO REAL CHARGE</p>
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-red text-black font-mono text-[11px] tracking-[0.2em] py-5 rounded-full hover:bg-red/90 transition-all duration-200 shadow-[0_0_40px_rgba(4,120,87,0.3)] disabled:opacity-60 group mt-4">
                    {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                    {loading ? 'PLACING ORDER...' : 'PLACE ORDER →'}
                  </button>
                  <p className="font-mono text-[10px] tracking-[0.15em] text-ink/25 text-center">
                    By ordering you agree to our Terms & Privacy Policy.
                  </p>
                </div>
              )}

            </form>
          </div>

          {/* Order summary */}
          <div className="md:col-span-5">
            <div className="sticky top-24 border border-hairline p-6 space-y-6">
              <span className="font-mono text-[10px] tracking-[0.3em] text-ink/40">ORDER SUMMARY</span>

              <div className="space-y-4">
                {state.items.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      <img src={`/frames/frame_${padded(item.frame)}.jpg`} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bodoni italic text-base text-ink leading-tight">{item.name}</p>
                      <p className="font-mono text-[10px] text-ink/35">×{item.quantity}</p>
                    </div>
                    <span className="font-mono text-[11px] text-ink/70">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-hairline pt-4 space-y-2">
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
                <div className="flex justify-between pt-3 border-t border-hairline">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-ink">TOTAL</span>
                  <span className="font-bodoni italic text-gold text-2xl">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
