import { useId } from 'react'
import { motion } from 'motion/react'
import InviteArt from '../sections/InviteArt'
import { TEMPLATES } from './data'

const ease = [0.22, 1, 0.36, 1]
// Left, centre (the hero piece, set a little lower), right.
const PICKS = ['mehendi', 'rajwada', 'ivory'].map((id) => TEMPLATES.find((t) => t.id === id))

// The arch geometry is shared by the door SVG and the CSS opening behind it:
// viewBox 200 × 320, opening from x 34 to 166, arch centre y 118, radius 66.
function CarvedDoor() {
  const id = useId()
  const outer = 'M6 320 V112 A94 94 0 0 1 194 112 V320 Z'
  const opening = 'M34 320 V118 A66 66 0 0 1 166 118 V320 Z'
  const beads = Array.from({ length: 19 }, (_, i) => {
    const a = Math.PI + (i / 18) * Math.PI
    return [100 + Math.cos(a) * 80, 115 + Math.sin(a) * 80]
  })
  const studs = Array.from({ length: 10 }, (_, i) => 140 + i * 16)

  return (
    <svg className="door-frame" viewBox="0 0 200 320" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-teak`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6e3b22" />
          <stop offset="0.55" stopColor="#3f1d11" />
          <stop offset="1" stopColor="#24100a" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ecd39a" />
          <stop offset="1" stopColor="#a8834a" />
        </linearGradient>
      </defs>

      {/* Wood, with the arched opening cut out of it. */}
      <path d={`${outer} ${opening}`} fill={`url(#${id}-teak)`} fillRule="evenodd" />

      <g fill="none" stroke={`url(#${id}-gold)`}>
        <path d="M12 320 V112 A88 88 0 0 1 188 112 V320" strokeWidth="1.2" />
        <path d="M28 320 V118 A72 72 0 0 1 172 118 V320" strokeWidth="0.8" opacity="0.75" />
        <path d={opening} strokeWidth="2" />
        {/* Pillars either side of the opening. */}
        <path d="M17 128 V300 M23 128 V300 M177 128 V300 M183 128 V300" strokeWidth="0.7" opacity="0.8" />
      </g>

      <g fill={`url(#${id}-gold)`}>
        {beads.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 2 ? 1.8 : 2.8} />
        ))}
        {studs.map((y) => (
          <g key={y}>
            <path d={`M20 ${y - 3} L23 ${y} L20 ${y + 3} L17 ${y} Z`} />
            <path d={`M180 ${y - 3} L183 ${y} L180 ${y + 3} L177 ${y} Z`} />
          </g>
        ))}
        {/* Capitals where the arch springs. */}
        <rect x="8" y="110" width="26" height="8" rx="1.5" />
        <rect x="166" y="110" width="26" height="8" rx="1.5" />
        {/* Lotus finial crowning the arch. */}
        <path d="M100 2 C107 9 107 16 100 21 C93 16 93 9 100 2 Z" />
        <path d="M100 13 C112 10 118 16 114 22 C108 20 103 19 100 21 C97 19 92 20 86 22 C82 16 88 10 100 13 Z" opacity="0.85" />
      </g>

      {/* Threshold. */}
      <rect x="0" y="302" width="200" height="18" fill="#1d0c07" />
      <rect x="0" y="302" width="200" height="1.5" fill={`url(#${id}-gold)`} />
    </svg>
  )
}

function Door({ template, index }) {
  const mid = index === 1
  return (
    <motion.a
      href={`/templates/${template.id}`}
      className={`door ${mid ? 'door--mid' : ''}`}
      aria-label={`${template.name} — see this design`}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.2 + index * 0.12, duration: 0.9, ease } }}
    >
      <div className="door-back" aria-hidden="true" />
      <motion.div
        className="door-card"
        initial={{ y: '40%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1, transition: { delay: 0.75 + index * 0.12, duration: 0.9, ease } }}
      >
        <InviteArt {...template} meta="Saturday · 4:30 PM" />
      </motion.div>
      <CarvedDoor />
      <span className="door-caption">
        {template.name}
        <span>{template.occasions[0]}</span>
      </span>
    </motion.a>
  )
}

export default function DoorHero({ onBrowse }) {
  return (
    <section className="th" aria-labelledby="th-title">
      <motion.div
        className="th-copy"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease } }}
      >
        <p className="eyebrow">Templates</p>
        <h1 className="display" id="th-title">
          Find the design that <em>feels like yours</em>
        </h1>
        <p className="sec-lede">
          Every design changes to your names, colours and words — for weddings, birthdays, housewarmings and every
          festival.
        </p>
        <div className="actions actions--center">
          <button type="button" className="btn btn--primary" onClick={onBrowse}>
            Browse all designs ↓
          </button>
          <a href="/#create" className="btn btn--text">
            Start from scratch
          </a>
        </div>
      </motion.div>

      <div className="th-doors">
        {PICKS.map((t, i) => (
          <Door key={t.id} template={t} index={i} />
        ))}
      </div>
    </section>
  )
}
