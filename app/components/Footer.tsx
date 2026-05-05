'use client'

import { FormEvent } from 'react'

export default function Footer() {
  function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    alert(`Subscribed: ${email}`)
    form.reset()
  }

  return (
    <footer id="footer" className="relative border-t border-hairline overflow-hidden">

      {/* Massive wordmark */}
      <div className="px-4 pt-12 pb-0 leading-none select-none pointer-events-none overflow-hidden" aria-hidden>
        <span className="font-bodoni italic text-[18vw] md:text-[20vw] text-ink/08 tracking-tight whitespace-nowrap">
          piozza<span className="text-red">.</span>
        </span>
      </div>

      {/* Footer columns */}
      <div className="relative z-10 px-6 md:px-10 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 border-t border-hairline">

        {/* Newsletter */}
        <div className="flex flex-col gap-5">
          <span className="font-mono text-[10px] tracking-[0.3em] text-ink/40">NEWSLETTER</span>
          <p className="font-inter text-xs text-ink/45 leading-relaxed">
            Stories from the oven. Recipes never shared. Dispatched monthly.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="YOUR EMAIL"
              className="newsletter-input"
            />
            <button type="submit"
              className="font-mono text-[10px] tracking-[0.25em] text-ink/50 hover:text-ink text-left transition-colors duration-200 w-fit border-b border-ink/20 hover:border-ink/50 pb-0.5">
              SUBSCRIBE →
            </button>
          </form>
        </div>

        {/* Visit */}
        <div className="flex flex-col gap-5">
          <span className="font-mono text-[10px] tracking-[0.3em] text-ink/40">VISIT</span>
          <div className="flex flex-col gap-2">
            <p className="font-inter text-xs text-ink/55 leading-relaxed">Via dei Tribunali 94<br />80138 Napoli, Italy</p>
            <p className="font-mono text-[10px] tracking-[0.1em] text-ink/35 mt-2">MON–FRI 12:00–22:00</p>
            <p className="font-mono text-[10px] tracking-[0.1em] text-ink/35">SAT–SUN 11:00–23:00</p>
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-5">
          <span className="font-mono text-[10px] tracking-[0.3em] text-ink/40">CONTACT</span>
          <div className="flex flex-col gap-2">
            <a href="tel:+390815551962" className="font-inter text-xs text-ink/55 hover:text-ink transition-colors duration-200">
              +39 081 555 1962
            </a>
            <a href="mailto:ciao@piozza.it" className="font-inter text-xs text-ink/55 hover:text-ink transition-colors duration-200">
              ciao@piozza.it
            </a>
          </div>
        </div>

        {/* Follow */}
        <div className="flex flex-col gap-5">
          <span className="font-mono text-[10px] tracking-[0.3em] text-ink/40">FOLLOW</span>
          <div className="flex gap-5">
            <a href="#" aria-label="Instagram" className="text-ink/40 hover:text-ink transition-colors duration-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" aria-label="X (Twitter)" className="text-ink/40 hover:text-ink transition-colors duration-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l16 16M4 20L20 4"/></svg>
            </a>
            <a href="#" aria-label="Facebook" className="text-ink/40 hover:text-ink transition-colors duration-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

      </div>

      {/* Legal row */}
      <div className="border-t border-hairline px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-mono text-[10px] tracking-[0.15em] text-ink/25">
          © {new Date().getFullYear()} PIOZZA SRL. NAPOLI.
        </span>
        <div className="flex items-center gap-6">
          {['Privacy', 'Terms', 'Accessibility'].map((item) => (
            <a key={item} href="#"
              className="font-mono text-[10px] tracking-[0.15em] text-ink/25 hover:text-ink/60 transition-colors duration-200">
              {item.toUpperCase()}
            </a>
          ))}
        </div>
        <span className="font-mono text-[10px] tracking-[0.15em] text-ink/20">v1.0.0</span>
      </div>

    </footer>
  )
}
