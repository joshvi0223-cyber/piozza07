'use client'

import { useEffect, useRef } from 'react'

interface FloatingPizzaProps {
  size?: number
  frame?: number
  opacity?: number
  spin?: boolean
  parallax?: number
  className?: string
}

export default function FloatingPizza({
  size = 300,
  frame = 1,
  opacity = 0.08,
  spin = false,
  parallax = 0,
  className = '',
}: FloatingPizzaProps) {
  const elRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  const paddedFrame = String(frame).padStart(4, '0')
  const src = `/frames/frame_${paddedFrame}.jpg`

  useEffect(() => {
    if (!parallax || !elRef.current) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      rafRef.current = requestAnimationFrame(() => {
        const el = elRef.current
        if (el) {
          const rect = el.getBoundingClientRect()
          const center = rect.top + rect.height / 2 - window.innerHeight / 2
          const y = center * parallax
          el.style.setProperty('--parallax-y', `${y}px`)
        }
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [parallax])

  return (
    <div
      ref={elRef}
      className={`float-pizza pointer-events-none select-none ${spin ? 'animate-spin-slow' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity,
        filter: 'drop-shadow(0 0 40px rgba(255,58,38,0.25))',
        transform: parallax ? 'translate3d(0, var(--parallax-y, 0px), 0)' : undefined,
      }}
    />
  )
}
