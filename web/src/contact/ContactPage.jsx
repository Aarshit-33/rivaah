import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Envelope3D from './Envelope3D'
import { CHANNELS, CONTACT, TOPICS } from './info'
import './contact.css'

const ease = [0.22, 1, 0.36, 1]
const rise = (i) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.07, duration: 0.7, ease } },
})

function validate(f) {
  const errors = {}
  if (!f.name.trim()) errors.name = 'Please tell us your name.'
  if (!f.reach.trim()) errors.reach = 'Add an email or phone number so we can reply.'
  else if (!/@/.test(f.reach) && f.reach.replace(/\D/g, '').length < 8) errors.reach = 'That doesn’t look like an email or phone number.'
  if (f.message.trim().length < 10) errors.message = 'A line or two about your celebration helps us reply properly.'
  return errors
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', reach: '', topic: TOPICS[0], date: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | drafted

  useEffect(() => {
    document.title = 'Contact — Nimantran'
  }, [])

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return
    // No backend yet: hand the message to the visitor's email app when an
    // address is configured; otherwise say plainly that messages open at launch.
    // TODO(launch): post to a real inbox / CRM.
    if (CONTACT.email) {
      const body = `${form.message}\n\nName: ${form.name}\nReply to: ${form.reach}${form.date ? `\nCelebration date: ${form.date}` : ''}`
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(form.topic)}&body=${encodeURIComponent(body)}`
    }
    setStatus('drafted')
  }

  return (
    <div className="cp">
      <section className="cp-hero" aria-labelledby="cp-title">
        <div className="cp-copy">
          <motion.p className="eyebrow" {...rise(0)}>
            Contact
          </motion.p>
          <motion.h1 className="display" id="cp-title" {...rise(1)}>
            Let’s talk about your <em>celebration</em>
          </motion.h1>
          <motion.p className="sec-lede" {...rise(2)}>
            Planning a wedding, a first birthday or a Griha Pravesh? Ask us anything — or send the details and we’ll
            help you start.
          </motion.p>
          <motion.ul className="cp-channels" {...rise(3)}>
            {CHANNELS.map((c) => (
              <li key={c.id}>
                <span className="cp-ch-label">{c.label}</span>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noreferrer">
                    {c.value}
                  </a>
                ) : (
                  <span className="cp-ch-tbc">Shared at launch</span>
                )}
                <span className="cp-ch-note">{c.note}</span>
              </li>
            ))}
          </motion.ul>
        </div>
        <Envelope3D mode="auto" className="cp-env" />
      </section>

      <section className="cp-form-wrap" aria-labelledby="cp-form-title">
        <motion.div
          className="cp-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.8, ease }}
        >
          <AnimatePresence mode="wait">
            {status === 'drafted' ? (
              <motion.div
                key="done"
                className="cp-done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease }}
              >
                <span className="seal seal--lg">N</span>
                {CONTACT.email ? (
                  <>
                    <h2>Your message is ready to send</h2>
                    <p>We opened it in your email app — press send there and it reaches us.</p>
                  </>
                ) : (
                  <>
                    <h2>Thank you, {form.name.trim().split(' ')[0]}</h2>
                    <p>
                      Messages open when we launch, so this one hasn’t been sent yet. Your note is kept below if you’d
                      like to copy it.
                    </p>
                    <blockquote>{form.message}</blockquote>
                  </>
                )}
                <button type="button" className="btn btn--outline" onClick={() => setStatus('idle')}>
                  Edit message
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" className="cp-form" onSubmit={submit} noValidate exit={{ opacity: 0 }}>
                <h2 id="cp-form-title">Send us a note</h2>
                <div className="cp-grid">
                  <Field label="Your name" error={errors.name}>
                    <input value={form.name} onChange={set('name')} autoComplete="name" />
                  </Field>
                  <Field label="Email or phone" error={errors.reach}>
                    <input value={form.reach} onChange={set('reach')} autoComplete="email" inputMode="email" />
                  </Field>
                  <Field label="What’s it about?" wide group>
                    <div className="cp-topics" role="radiogroup" aria-label="Topic">
                      {TOPICS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          role="radio"
                          aria-checked={form.topic === t}
                          className={`chip ${form.topic === t ? 'is-active' : ''}`}
                          onClick={() => setForm((f) => ({ ...f, topic: t }))}
                        >
                          {form.topic === t && (
                            <motion.span className="chip-bg" layoutId="cp-topic" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                          )}
                          <span className="chip-label">{t}</span>
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Celebration date (optional)">
                    <input type="date" value={form.date} onChange={set('date')} />
                  </Field>
                  <Field label="Your message" error={errors.message} wide>
                    <textarea rows={5} value={form.message} onChange={set('message')} />
                  </Field>
                </div>
                <motion.button type="submit" className="btn btn--primary" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                  Send message
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  )
}

function Field({ label, error, wide, group, children }) {
  const Tag = group ? 'div' : 'label'
  return (
    <Tag className={`cp-field ${wide ? 'cp-field--wide' : ''} ${error ? 'has-error' : ''}`}>
      <span>{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.em initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {error}
          </motion.em>
        )}
      </AnimatePresence>
    </Tag>
  )
}
