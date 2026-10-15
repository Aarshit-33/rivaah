import { useEffect, useState } from 'react'
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

export function getRoute() {
  const p = (window.location.pathname || '/').replace(/\/+$/, '').toLowerCase()
  if (p === '/contact' || p.endsWith('/contact')) {
    return { page: 'contact' }
  }
  if (p === '/templates' || p.endsWith('/templates')) {
    return { page: 'templates' }
  }
  if (p.includes('/templates/')) {
    const idx = window.location.pathname.toLowerCase().indexOf('/templates/')
    const id = decodeURIComponent(window.location.pathname.slice(idx + '/templates/'.length).replace(/\/+$/, ''))
    return { page: 'detail', id }
  }
  return { page: 'home' }
}

export default function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onPop = () => setRoute(getRoute())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route.page, route.id])

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
  }, [route.page])

  if (route.page !== 'home') {
    return (
      <>
        <Nav />
        <main>
          {route.page === 'templates' && <TemplatesPage />}
          {route.page === 'detail' && <TemplateDetail id={route.id} />}
          {route.page === 'contact' && <ContactPage />}
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
