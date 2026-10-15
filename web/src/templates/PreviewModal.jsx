import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import InviteArt from '../sections/InviteArt'
import { getLenis } from '../lib/lenis'

export default function PreviewModal({ template, onClose }) {
  useEffect(() => {
    if (!template) return
    const lenis = getLenis()
    lenis?.stop()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [template, onClose])

  return (
    <AnimatePresence>
      {template && (
        <motion.div
          className="tpl-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${template.name} preview`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="tpl-modal-body"
            initial={{ y: 40, scale: 0.95 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 30, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tpl-modal-phone">
              <InviteArt {...template} meta="Saturday · 4:30 PM" />
            </div>
            <div className="tpl-modal-copy">
              <p className="eyebrow">
                {template.style} · {template.tradition}
              </p>
              <h3>{template.name}</h3>
              <p>Made for {template.occasions.join(', ').toLowerCase()}. Names, colours, wording and each function’s details can all be changed.</p>
              <a href={`/templates/${template.id}`} className="btn btn--primary">
                See details & personalise
              </a>
              <button type="button" className="btn btn--text" onClick={onClose}>
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
