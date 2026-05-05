'use client'

import { useEffect, useRef } from 'react'

type Part = string | { text: string; className?: string }

interface SplitTextProps {
  parts: Part[]
  stagger?: number
  delay?: number
  by?: 'char' | 'word'
  className?: string
}

export default function SplitText({
  parts,
  stagger = 42,
  delay = 0,
  by = 'char',
  className = '',
}: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      container.querySelectorAll('.split-piece').forEach((el) => {
        el.classList.add('revealed')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            container.querySelectorAll('.split-piece').forEach((el) => {
              el.classList.add('revealed')
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  let charIndex = 0

  const renderPart = (part: Part, partIdx: number) => {
    const text = typeof part === 'string' ? part : part.text
    const extraClass = typeof part === 'string' ? '' : (part.className ?? '')

    if (by === 'word') {
      const words = text.split(' ')
      return words.map((word, wi) => {
        const idx = charIndex++
        return (
          <span key={`${partIdx}-w${wi}`}>
            <span
              className={`split-piece ${extraClass}`}
              style={{ transitionDelay: `${delay + idx * stagger}ms` }}
            >
              <span className="split-inner">{word}</span>
            </span>
            {wi < words.length - 1 && ' '}
          </span>
        )
      })
    }

    // by char
    return text.split('').map((char, ci) => {
      const idx = charIndex++
      return (
        <span
          key={`${partIdx}-c${ci}`}
          className={`split-piece ${extraClass}`}
          style={{ transitionDelay: `${delay + idx * stagger}ms` }}
        >
          <span className="split-inner">{char === ' ' ? '\u00A0' : char}</span>
        </span>
      )
    })
  }

  return (
    <span ref={containerRef} className={className}>
      {parts.map((part, i) => renderPart(part, i))}
    </span>
  )
}
