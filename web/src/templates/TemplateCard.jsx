import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import InviteArt from '../sections/InviteArt'

// A gallery card that tilts toward the pointer, with a soft light sweeping across it.
export default function TemplateCard({ template, onPreview, index = 0 }) {
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spring = { stiffness: 220, damping: 20 }
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-10, 10]), spring)
  const lx = useTransform(px, (v) => `${v * 100}%`)
  const ly = useTransform(py, (v) => `${v * 100}%`)
  const shine = useMotionTemplate`radial-gradient(circle at ${lx} ${ly}, rgba(255, 248, 230, 0.45), rgba(255, 248, 230, 0) 55%)`

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.article
      className="tcard"
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, transition: { delay: Math.min(index, 8) * 0.04, duration: 0.5 } }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="tcard-tilt"
        style={{ rotateX, rotateY }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={(e) => {
          if (!e.target.closest('.tcard-actions')) window.location.href = `/templates/${template.id}`
        }}
      >
        <InviteArt {...template} meta="Saturday · 4:30 PM" />
        <motion.span className="tcard-shine" style={{ background: shine }} aria-hidden="true" />
        <div className="tcard-actions">
          <button type="button" className="btn btn--light btn--sm" onClick={() => onPreview(template)}>
            Preview
          </button>
          <a href={`/templates/${template.id}#personalise`} className="btn btn--primary btn--sm">
            Use this
          </a>
        </div>
      </motion.div>
      <div className="tcard-meta">
        <h3>
          <a href={`/templates/${template.id}`}>{template.name}</a>
        </h3>
        <p>
          {template.occasions[0]} · {template.tradition}
        </p>
      </div>
    </motion.article>
  )
}
