import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { getLenis } from '../lib/lenis'
import TemplateCard from './TemplateCard'
import PreviewModal from './PreviewModal'
import DoorHero from './DoorHero'
import { FilterMenu, SortSelect } from './Dropdown'
import {
  COLOUR_OPTIONS,
  OCCASION_OPTIONS,
  SORT_OPTIONS,
  STYLE_OPTIONS,
  TEMPLATES,
  TRADITION_OPTIONS,
} from './data'
import './templates.css'

const EMPTY = { occasion: [], tradition: [], style: [], colour: [] }

function readInitialFilters() {
  const params = new URLSearchParams(window.location.search)
  const occasion = params.get('occasion')
  return { ...EMPTY, occasion: occasion && OCCASION_OPTIONS.includes(occasion) ? [occasion] : [] }
}

/* ───────── Page ───────── */

export default function TemplatesPage() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const [filters, setFilters] = useState(readInitialFilters)
  const [preview, setPreview] = useState(null)
  const list = useRef(null)

  const toggle = (group) => (value) =>
    setFilters((f) => ({
      ...f,
      [group]: f[group].includes(value) ? f[group].filter((v) => v !== value) : [...f[group], value],
    }))

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matched = TEMPLATES.filter((t) => {
      if (filters.occasion.length && !t.occasions.some((o) => filters.occasion.includes(o))) return false
      if (filters.tradition.length && !filters.tradition.includes(t.tradition)) return false
      if (filters.style.length && !filters.style.includes(t.style)) return false
      if (filters.colour.length && !filters.colour.includes(t.theme)) return false
      if (!q) return true
      return [t.name, t.style, t.tradition, t.eyebrow, ...t.occasions].join(' ').toLowerCase().includes(q)
    })
    if (sort === 'az') return [...matched].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'za') return [...matched].sort((a, b) => b.name.localeCompare(a.name))
    return matched
  }, [query, sort, filters])

  const active = Object.entries(filters).flatMap(([group, values]) =>
    values.map((v) => ({ group, value: v, label: group === 'colour' ? COLOUR_OPTIONS.find(([id]) => id === v)?.[1] : v })),
  )
  const clearGroup = (group) => () => setFilters((f) => ({ ...f, [group]: [] }))
  const clearAll = () => {
    setFilters(EMPTY)
    setQuery('')
  }

  const browse = () => {
    const y = list.current.getBoundingClientRect().top + window.scrollY
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 1.2 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  // Keep the occasion filter in the address bar so a filtered view can be shared.
  useEffect(() => {
    const url = new URL(window.location.href)
    if (filters.occasion.length === 1) url.searchParams.set('occasion', filters.occasion[0])
    else url.searchParams.delete('occasion')
    window.history.replaceState(null, '', url)
  }, [filters.occasion])

  useEffect(() => {
    if (filters.occasion.length) setTimeout(browse, 600)
    // Only on first load, when arriving from "See all … designs".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <DoorHero onBrowse={browse} />

      <section className="tl" ref={list} aria-label="All designs">
        <div className="tl-bar">
          <div className="tl-row">
            <label className="tl-search">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4.5 4.5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search designs — e.g. Nikah, birthday, royal"
                aria-label="Search designs"
              />
            </label>
            <SortSelect value={sort} options={SORT_OPTIONS} onChange={setSort} />
          </div>
          <div className="tl-row tl-row--filters" role="group" aria-label="Filters">
            <span className="tl-filter-label">Filter</span>
            <FilterMenu label="Occasion" options={OCCASION_OPTIONS} values={filters.occasion} onToggle={toggle('occasion')} onClear={clearGroup('occasion')} />
            <FilterMenu label="Tradition" options={TRADITION_OPTIONS} values={filters.tradition} onToggle={toggle('tradition')} onClear={clearGroup('tradition')} />
            <FilterMenu label="Style" options={STYLE_OPTIONS} values={filters.style} onToggle={toggle('style')} onClear={clearGroup('style')} />
            <FilterMenu label="Colour" options={COLOUR_OPTIONS} values={filters.colour} onToggle={toggle('colour')} onClear={clearGroup('colour')} swatch />
          </div>
        </div>

        <div className="tl-results">
            <div className="tl-status">
              <p aria-live="polite">
                {results.length} {results.length === 1 ? 'design' : 'designs'}
                {query.trim() && <> for “{query.trim()}”</>}
              </p>
              <ul className="tl-pills">
                <AnimatePresence>
                  {active.map((a) => (
                    <motion.li
                      key={`${a.group}-${a.value}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <button type="button" onClick={() => toggle(a.group)(a.value)} aria-label={`Remove ${a.label}`}>
                        {a.label} <span aria-hidden="true">×</span>
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              {active.length > 0 && (
                <button type="button" className="btn btn--text tl-clear" onClick={clearAll}>
                  Clear all
                </button>
              )}
            </div>

            {results.length ? (
              <div className="tl-grid">
                <AnimatePresence mode="popLayout">
                  {results.map((t, i) => (
                    <TemplateCard key={t.id} template={t} index={i} onPreview={setPreview} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="tl-empty">
                <p className="tl-empty-title">No designs match yet</p>
                <p>Try fewer filters, or a different word.</p>
                <button type="button" className="btn btn--outline" onClick={clearAll}>
                  Clear search & filters
                </button>
              </div>
            )}

            <p className="tl-note">A first look at the design styles. The full collection opens at launch.</p>
        </div>
      </section>

      <PreviewModal template={preview} onClose={() => setPreview(null)} />
    </>
  )
}
