'use client'

import { useEffect, useRef, useState } from 'react'

const chapters = [
  { label: 'HERO', href: '#hero' },
  { label: 'PROLOGUE', href: '#prologue' },
  { label: 'MENU', href: '#menu' },
  { label: 'STATS', href: '#stats' },
  { label: 'QUOTE', href: '#quote' },
  { label: 'CRAFT', href: '#features' },
  { label: 'ORDER', href: '#cta' },
]

export default function ScrollProgress() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight
      const pct = scrollMax > 0 ? window.scrollY / scrollMax : 0
      setActive(Math.min(Math.floor(pct * chapters.length), chapters.length - 1))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
      {chapters.map((ch, i) => (
        <a key={ch.label} href={ch.href}
          className="flex items-center gap-2 group cursor-pointer" title={ch.label}>
          <div
            className="h-px transition-all duration-300"
            style={{
              width: i === active ? 32 : 18,
              background: i === active ? '#ff3a26' : 'rgba(247,241,232,0.18)',
            }}
          />
          <span
            className="font-mono text-[9px] tracking-[0.2em] transition-all duration-300"
            style={{ color: i === active ? 'rgba(247,241,232,0.9)' : 'rgba(247,241,232,0.2)' }}
          >
            {ch.label}
          </span>
        </a>
      ))}
    </div>
  )
}
