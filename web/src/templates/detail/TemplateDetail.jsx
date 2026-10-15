import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { getLenis } from '../../lib/lenis'
import InviteArt from '../../sections/InviteArt'
import DevicePreview from './DevicePreview'
import InviteSite from './InviteSite'
import { COLOUR_OPTIONS, TEMPLATES } from '../data'
import { INCLUDED, FACTS } from './facts'
import '../templates.css'
import './detail.css'

const ease = [0.22, 1, 0.36, 1]

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

function loadDraft(template) {
  const blank = { names: '', date: '', time: '', venue: '', city: '', message: '', theme: template.theme }
  try {
    const saved = JSON.parse(localStorage.getItem(`nimantran:draft:${template.id}`))
    return saved ? { ...blank, ...saved } : blank
  } catch {
    return blank
  }
}

/** Scrolls both device screens in step with the page. */
function useSyncedScreens(root, layout, deps) {
  // `hold` pins the screens to the cover while the visitor edits the form.
  const progress = useRef({ target: 0, current: 0, dirty: true, hold: false })

  useEffect(() => {
    const p = progress.current
    const inners = () => root.current.querySelectorAll('.ds-inner')

    const apply = () => {
      inners().forEach((el) => {
        const s = el.parentElement.clientWidth / Number(el.dataset.w)
        const vp = el.parentElement.clientHeight / s
        el.style.setProperty('--vp', `${vp}px`)
        const max = Math.max(0, el.offsetHeight - vp)
        el.style.transform = `scale(${s}) translateY(${-max * p.current}px)`
      })
      p.dirty = false
    }

    const ro = new ResizeObserver(() => (p.dirty = true))
    root.current.querySelectorAll('.ds, .ds-inner').forEach((el) => ro.observe(el))

    const st = ScrollTrigger.create({
      trigger: layout.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => (p.target = self.progress),
      onRefresh: (self) => (p.target = self.progress),
    })

    const tick = () => {
      const d = (p.hold ? 0 : p.target) - p.current
      if (Math.abs(d) > 0.0004) {
        p.current += d * 0.14
        p.dirty = true
      }
      if (p.dirty) apply()
    }
    gsap.ticker.add(tick)
    apply()

    return () => {
      ro.disconnect()
      st.kill()
      gsap.ticker.remove(tick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  // Content changed (typing in the form): re-measure on the next frame.
  const markDirty = useRef(() => (progress.current.dirty = true)).current
  const hold = useRef((on) => (progress.current.hold = on)).current
  return [markDirty, hold]
}

export default function TemplateDetail({ id }) {
  const template = TEMPLATES.find((t) => t.id === id)
  if (!template) return <NotFound />
  return <Detail key={template.id} template={template} />
}

function NotFound() {
  return (
    <section className="td-missing">
      <p className="eyebrow">Templates</p>
      <h1 className="display display--md">We couldn’t find that design</h1>
      <a href="/templates" className="btn btn--primary">
        See all designs
      </a>
    </section>
  )
}

function Detail({ template }) {
  const root = useRef(null)
  const layout = useRef(null)
  const form = useRef(null)
  const [details, setDetails] = useState(() => loadDraft(template))
  const [saved, setSaved] = useState(false)
  const [markDirty, holdCover] = useSyncedScreens(root, layout, [template.id])

  useEffect(() => {
    document.title = `${template.name} — Nimantran`
    if (window.location.hash === '#personalise') setTimeout(() => scrollToForm(), 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template])

  useEffect(() => {
    markDirty()
    try {
      localStorage.setItem(`nimantran:draft:${template.id}`, JSON.stringify(details))
    } catch {
      /* storage unavailable: the draft just won't survive a reload */
    }
  }, [details, template.id, markDirty])

  const set = (key) => (e) => {
    setSaved(false)
    setDetails((d) => ({ ...d, [key]: e.target.value }))
  }

  const scrollToForm = () => {
    const y = form.current.getBoundingClientRect().top + window.scrollY - 110
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 1.4 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const names = details.names.trim() || template.title
  const url = `nimantran.app/${slug(names)}`
  const related = TEMPLATES.filter((t) => t.id !== template.id && t.occasions.some((o) => template.occasions.includes(o))).slice(0, 3)

  return (
    <div className="td" ref={root}>
      <div className="td-layout" ref={layout}>
        <div className="td-stage">
          <motion.div
            className="td-stage-inner"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease } }}
          >
            <DevicePreview url={url}>
              <InviteSite template={template} details={details} />
            </DevicePreview>
            <p className="td-stage-hint">Scroll — both screens scroll through the invitation</p>
          </motion.div>
        </div>

        <div className="td-info">
          <nav className="td-crumbs" aria-label="Breadcrumb">
            <a href="/templates">Templates</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{template.name}</span>
          </nav>

          <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: 0.1 } }}>
            <p className="eyebrow">
              {template.occasions.join(' · ')}
            </p>
            <h1 className="display td-title">{template.name}</h1>
            <p className="sec-lede">
              A {template.style.toLowerCase()} design for {template.occasions.join(', ').toLowerCase()}. It opens as a
              full invitation page — on a phone or a computer — with every detail your guests need.
            </p>
            <ul className="td-tags">
              <li>{template.tradition}</li>
              <li>{template.style}</li>
              <li>{COLOUR_OPTIONS.find(([c]) => c === template.theme)?.[1]}</li>
            </ul>
            <div className="actions">
              <button type="button" className="btn btn--primary" onClick={scrollToForm}>
                Personalise this design
              </button>
              <a href="/templates" className="btn btn--text">
                ← All designs
              </a>
            </div>
          </motion.header>

          <section className="td-block" aria-labelledby="td-included">
            <h2 id="td-included">What’s included</h2>
            <ul className="td-included">
              {INCLUDED.map(([title, body]) => (
                <li key={title}>
                  <span className="td-tick" aria-hidden="true" />
                  <div>
                    <strong>{title}</strong>
                    <span>{body}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="td-block" aria-labelledby="td-facts">
            <h2 id="td-facts">Good to know</h2>
            <dl className="td-facts">
              {FACTS.map(([label, value, note]) => (
                <div key={label} className={value ? undefined : 'is-tbc'}>
                  <dt>{label}</dt>
                  {/* TODO(launch): values left null are business decisions still to be made. */}
                  <dd>{value ?? 'Confirmed at launch'}</dd>
                  {note && <p>{note}</p>}
                </div>
              ))}
            </dl>
          </section>

          <section className="td-block td-make" id="personalise" ref={form} aria-labelledby="td-make">
            <h2 id="td-make">Make it yours</h2>
            <p className="td-make-lede">Type your details — both screens update as you go.</p>
            <form
              className="td-form"
              onSubmit={(e) => (e.preventDefault(), setSaved(true))}
              onFocus={() => holdCover(true)}
              onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && holdCover(false)}
            >
              <label className="td-field td-field--wide">
                <span>Whose celebration?</span>
                <input value={details.names} onChange={set('names')} placeholder={template.title} maxLength={40} />
              </label>
              <label className="td-field">
                <span>Date</span>
                <input type="date" value={details.date} onChange={set('date')} />
              </label>
              <label className="td-field">
                <span>Time</span>
                <input type="time" value={details.time} onChange={set('time')} />
              </label>
              <label className="td-field">
                <span>Venue</span>
                <input value={details.venue} onChange={set('venue')} placeholder="e.g. The Glasshouse" maxLength={40} />
              </label>
              <label className="td-field">
                <span>City</span>
                <input value={details.city} onChange={set('city')} placeholder="e.g. Pune" maxLength={28} />
              </label>
              <label className="td-field td-field--wide">
                <span>A note to your guests</span>
                <textarea
                  rows={3}
                  value={details.message}
                  onChange={set('message')}
                  placeholder="With joy in our hearts, we would love for you to be part of this day…"
                  maxLength={220}
                />
              </label>
              <fieldset className="td-field td-field--wide">
                <legend>Colour</legend>
                <div className="dd-swatches td-swatches">
                  {COLOUR_OPTIONS.map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`fg-swatch ia--${value} ${details.theme === value ? 'is-on' : ''}`}
                      aria-pressed={details.theme === value}
                      onClick={() => set('theme')({ target: { value } })}
                    >
                      <span className="fg-swatch-dot" />
                      <span className="fg-swatch-label">{label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="td-submit td-field--wide">
                <button type="submit" className="btn btn--primary">
                  Continue with these details
                </button>
                <AnimatePresence>
                  {saved && (
                    <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      Saved on this device. Sign-up opens at launch.
                    </motion.p>
                  )}
                </AnimatePresence>
                {/* TODO(launch): send these details on to sign-up / checkout. */}
              </div>
            </form>
          </section>

          {related.length > 0 && (
            <section className="td-block" aria-labelledby="td-more">
              <h2 id="td-more">More like this</h2>
              <div className="td-related">
                {related.map((t) => (
                  <a key={t.id} href={`/templates/${t.id}`} className="td-rel">
                    <InviteArt {...t} meta="Saturday · 4:30 PM" />
                    <span>{t.name}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
