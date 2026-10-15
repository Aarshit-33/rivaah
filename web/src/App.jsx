import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './lib/gsap'
import { setLenis } from './lib/lenis'
import InkToInstant from './hero/InkToInstant'
import LifeSection from './life/LifeSection'
import Device from './device/Device'
import Nav from './nav/Nav'
import FilmStrip from './sections/FilmStrip'
import Occasions from './sections/Occasions'
import Personalise from './sections/Personalise'
import Compare from './sections/Compare'
import Languages from './sections/Languages'
import Pricing from './sections/Pricing'
import Faq from './sections/Faq'
import { ClosingCta, Footer } from './sections/Closing'
import './sections/sections.css'
import { DeviceProvider } from './device/DeviceContext'
import TemplatesPage from './templates/TemplatesPage'
import TemplateDetail from './templates/detail/TemplateDetail'
import ContactPage from './contact/ContactPage'
import ContactSection from './contact/ContactSection'

// A few pages, no router needed: every link between them is a normal page load.
const PATH = window.location.pathname.replace(/\/+$/, '')
const PAGE =
  PATH === '/templates'
    ? 'templates'
    : PATH.startsWith('/templates/')
      ? 'detail'
      : PATH === '/contact'
        ? 'contact'
        : 'home'

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1 })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  if (PAGE !== 'home') {
    return (
      <>
        <Nav />
        <main>
          {PAGE === 'templates' && <TemplatesPage />}
          {PAGE === 'detail' && <TemplateDetail id={decodeURIComponent(PATH.slice('/templates/'.length))} />}
          {PAGE === 'contact' && <ContactPage />}
        </main>
        <Footer />
      </>
    )
  }

  return (
    <DeviceProvider>
      {/* Rendered first so its parts exist before the hero builds its timeline. */}
      <Device />

      <Nav />

      <main>
        <InkToInstant />

        <LifeSection />
        <FilmStrip />
        <Occasions />
        <Personalise />
        <Languages />
        <Compare />
        <Pricing />
        <Faq />
        <ContactSection />
        <ClosingCta />
      </main>

      <Footer />
    </DeviceProvider>
  )
}
