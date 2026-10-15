import { motion } from 'motion/react'
import Reveal from './Reveal'
import { FOOTER_COLUMNS } from './content'

const PRODUCT_LINKS = { 'How it works': '/#how', Templates: '/templates', Pricing: '/#pricing', Questions: '/#questions' }
const linkFor = (column, label, base) => {
  if (column === 'Occasions') return `/templates?occasion=${encodeURIComponent(label)}`
  if (label === 'Contact') return '/contact'
  return base ?? PRODUCT_LINKS[label]
}

export function ClosingCta() {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <Reveal className="closing-inner">
        <span className="seal seal--lg">N</span>
        <p className="eyebrow">For every celebration</p>
        <h2 className="display display--md" id="closing-title">
          Your celebration deserves an heirloom
        </h2>
        <p className="sec-lede">
          Birthdays, housewarmings, weddings, baby showers, anniversaries and poojas — made with care, sent in one link.
        </p>
        <div className="actions actions--center">
          <motion.a href="#create" className="btn btn--primary" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            Create your invite
          </motion.a>
          <a href="/templates" className="btn btn--text">
            Explore all templates
          </a>
        </div>
      </Reveal>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="sf-top">
        <div className="sf-brand">
          <a href="/" className="brand">
            <span className="seal">N</span>
            <span className="wordmark">Nimantran</span>
          </a>
          <p>Digital invitations for every celebration — from a first birthday to a golden anniversary.</p>
        </div>
        {FOOTER_COLUMNS.map(([title, links, base]) => (
          <nav key={title} aria-label={title}>
            <h3>{title}</h3>
            <ul>
              {links.map((l) => (
                <li key={l}>
                  <a href={linkFor(title, l, base)}>{l}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="sf-bottom">
        <span>© 2026 Nimantran</span>
        <a href="#">Back to top ↑</a>
      </div>
    </footer>
  )
}
