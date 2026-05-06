import dynamic from 'next/dynamic'
import RevealController from './components/RevealController'
import Nav from './components/Nav'
import Prologue from './components/Prologue'
import Menu from './components/Menu'
import Quote from './components/Quote'
import Features from './components/Features'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import CartDrawer from './components/CartDrawer'

const Hero = dynamic(() => import('./components/Hero'), { ssr: false })
const Stats = dynamic(() => import('./components/Stats'), { ssr: false })

export default function Page() {
  return (
    <>
      <RevealController />
      <ScrollProgress />
      <Nav />
      <CartDrawer />
      <main>
        <Hero />
        <Prologue />
        <Menu />
        <Stats />
        <Quote />
        <Features />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
