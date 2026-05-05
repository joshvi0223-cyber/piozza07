import type { Metadata } from 'next'
import { Bodoni_Moda, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700', '800', '900'],
  adjustFontFallback: false,
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PIOZZA — Artisanal Neapolitan Pizza · Naples, 1962',
  description:
    '900° wood-fired. 60 seconds. Three generations of devotion. PIOZZA crafts authentic Neapolitan pizza from San Marzano D.O.P. tomatoes and Mozzarella di Bufala.',
  keywords: 'Neapolitan pizza, artisanal, wood-fired, Naples, San Marzano, Mozzarella di Bufala',
  openGraph: {
    title: 'PIOZZA — Artisanal Neapolitan Pizza',
    description: '900° wood-fired. 60 seconds. Centuries of devotion.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${inter.variable} ${mono.variable}`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/frames/frame_0001.jpg"
        />
      </head>
      <body className="bg-bg text-ink font-inter overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
