import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const pop = {
  initial: { opacity: 0, y: -8, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
}

function Chevron() {
  return (
    <svg className="dd-chev" viewBox="0 0 12 8" aria-hidden="true">
      <path d="M1 1.5l5 5 5-5" />
    </svg>
  )
}

function Check() {
  return (
    <svg className="dd-check" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  )
}

// Open/close behaviour shared by both dropdowns: outside click and Escape close
// it, and it opens to the left when there is no room on the right.
function usePopover(width = 260) {
  const [open, setOpen] = useState(false)
  const [alignRight, setAlignRight] = useState(false)
  const root = useRef(null)

  useEffect(() => {
    if (!open) return
    const r = root.current.getBoundingClientRect()
    setAlignRight(r.left + width > window.innerWidth - 12)
    const onDown = (e) => !root.current.contains(e.target) && setOpen(false)
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      root.current.querySelector('.dd-btn')?.focus()
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, width])

  return { open, setOpen, alignRight, root }
}

/* ───────── Single choice: "Sort by" ───────── */

export function SortSelect({ value, options, onChange }) {
  const { open, setOpen, alignRight, root } = usePopover(220)
  const id = useId()
  const list = useRef(null)
  const [active, setActive] = useState(0)
  const current = options.find(([v]) => v === value)

  useEffect(() => {
    if (!open) return
    setActive(Math.max(0, options.findIndex(([v]) => v === value)))
    requestAnimationFrame(() => list.current?.focus())
  }, [open, options, value])

  const choose = (v) => {
    onChange(v)
    setOpen(false)
    root.current.querySelector('.dd-btn')?.focus()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(options.length - 1, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(0, a - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(options.length - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      choose(options[active][0])
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div className="dd" ref={root}>
      <button
        type="button"
        className={`dd-btn dd-btn--sort ${open ? 'is-open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault()
            setOpen(true)
          }
        }}
      >
        <span className="dd-label">Sort by</span>
        <span className="dd-value">{current?.[1]}</span>
        <Chevron />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            {...pop}
            ref={list}
            id={`${id}-list`}
            role="listbox"
            aria-label="Sort designs"
            tabIndex={-1}
            aria-activedescendant={`${id}-${active}`}
            className={`dd-pop dd-pop--sort ${alignRight ? 'is-right' : ''}`}
            onKeyDown={onKeyDown}
          >
            {options.map(([v, label], i) => (
              <li
                key={v}
                id={`${id}-${i}`}
                role="option"
                aria-selected={v === value}
                className={`dd-opt ${i === active ? 'is-active' : ''} ${v === value ? 'is-selected' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(v)}
              >
                <span>{label}</span>
                {v === value && <Check />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────── Multiple choice: one filter group ───────── */

export function FilterMenu({ label, options, values, onToggle, onClear, swatch }) {
  const { open, setOpen, alignRight, root } = usePopover(swatch ? 280 : 250)
  const count = values.length

  return (
    <div className="dd" ref={root}>
      <button
        type="button"
        className={`dd-btn dd-btn--filter ${count ? 'has-value' : ''} ${open ? 'is-open' : ''}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        {count > 0 && <span className="dd-count">{count}</span>}
        <Chevron />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            {...pop}
            className={`dd-pop dd-pop--filter ${alignRight ? 'is-right' : ''}`}
            role="group"
            aria-label={label}
          >
            <div className={swatch ? 'dd-swatches' : 'dd-checks'}>
              {options.map((o) => {
                const [value, text] = Array.isArray(o) ? o : [o, o]
                const on = values.includes(value)
                return swatch ? (
                  <button
                    key={value}
                    type="button"
                    className={`fg-swatch ia--${value} ${on ? 'is-on' : ''}`}
                    aria-pressed={on}
                    onClick={() => onToggle(value)}
                  >
                    <span className="fg-swatch-dot" />
                    <span className="fg-swatch-label">{text}</span>
                  </button>
                ) : (
                  <label key={value} className={`fg-check ${on ? 'is-on' : ''}`}>
                    <input type="checkbox" checked={on} onChange={() => onToggle(value)} />
                    <span className="fg-box" aria-hidden="true" />
                    {text}
                  </label>
                )
              })}
            </div>
            {count > 0 && (
              <button type="button" className="dd-clear" onClick={onClear}>
                Clear {label.toLowerCase()}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
