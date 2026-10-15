import { Motif } from '../../sections/InviteArt'

// Sample running order for each occasion. These are demo contents of the
// invitation itself (what a host would fill in), not facts about the business.
const FUNCTIONS = {
  Wedding: [
    ['Mehendi', 'Friday · 4:00 PM', 'Garden lawn'],
    ['Sangeet', 'Friday · 8:00 PM', 'Banquet hall'],
    ['Wedding', 'Saturday · 7:00 PM', 'Main courtyard'],
    ['Reception', 'Sunday · 8:00 PM', 'Terrace'],
  ],
  Birthday: [
    ['Welcome', '4:30 PM', 'Front lawn'],
    ['Cake cutting', '5:30 PM', 'Main hall'],
    ['Dinner', '7:00 PM', 'Main hall'],
  ],
  'Griha Pravesh': [
    ['Pooja', '10:00 AM', 'At home'],
    ['Lunch', '1:00 PM', 'At home'],
  ],
  'Baby shower': [
    ['Welcome', '4:00 PM', 'Garden'],
    ['Godh bharai', '5:00 PM', 'Garden'],
    ['High tea', '6:00 PM', 'Garden'],
  ],
  Anniversary: [
    ['Welcome drinks', '7:30 PM', 'Terrace'],
    ['Toast', '8:30 PM', 'Terrace'],
    ['Dinner', '9:00 PM', 'Dining room'],
  ],
  'Pooja & festivals': [
    ['Aarti', '6:30 PM', 'At home'],
    ['Prasad & dinner', '7:30 PM', 'At home'],
  ],
}

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

const formatTime = (t) => {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

function daysUntil(iso) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((new Date(`${iso}T00:00:00`) - today) / 86400000)
}

/**
 * The invitation as guests would see it. Rendered at a fixed "logical" width
 * (desktop or phone) and scaled into the device frames by DevicePreview.
 */
export default function InviteSite({ template, details }) {
  const theme = details.theme || template.theme
  const names = details.names.trim() || template.title
  const when = details.date ? formatDate(details.date) : 'Date to be announced'
  const time = formatTime(details.time)
  const place = [details.venue.trim(), details.city.trim()].filter(Boolean).join(', ') || 'Venue to be announced'
  const message =
    details.message.trim() ||
    'With joy in our hearts, we would love for you to be part of this day. Your presence is the only gift we ask for.'
  const days = details.date ? daysUntil(details.date) : null
  const functions = FUNCTIONS[template.occasions[0]] ?? FUNCTIONS.Birthday

  return (
    <div className={`site ia--${theme}`}>
      <header className="site-cover">
        <div className="site-cover-frame">
          <Motif type={template.motif} />
          <p className="site-eyebrow">{template.eyebrow}</p>
          <h1 className="site-names">{names}</h1>
          <p className="site-when">
            {when}
            {time && <> · {time}</>}
          </p>
          <p className="site-where">{place}</p>
          <span className="site-seal" />
          <p className="site-scroll">Scroll to open ↓</p>
        </div>
      </header>

      <section className="site-sec site-count">
        <p className="site-label">Counting down</p>
        {days === null ? (
          <p className="site-count-empty">Add a date and the countdown begins.</p>
        ) : (
          <div className="site-count-row">
            <span>
              <b>{Math.max(0, days)}</b>
              {Math.abs(days) === 1 ? 'day' : 'days'}
            </span>
            <span>
              <b>{days > 0 ? 'to go' : days === 0 ? 'today' : 'ago'}</b>
              {when.split(',')[0]}
            </span>
          </div>
        )}
      </section>

      <section className="site-sec site-message">
        <p className="site-label">A note from us</p>
        <p className="site-quote">{message}</p>
      </section>

      <section className="site-sec">
        <p className="site-label">The celebrations</p>
        <div className="site-events">
          {functions.map(([name, at, where]) => (
            <article className="site-event" key={name}>
              <h3>{name}</h3>
              <p>{at}</p>
              <p className="site-event-where">{where}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-sec site-venue">
        <div>
          <p className="site-label">Getting there</p>
          <h2>{details.venue.trim() || 'The venue'}</h2>
          <p className="site-venue-city">{details.city.trim() || 'Your city'}</p>
          <span className="site-btn">Get directions</span>
        </div>
        <div className="site-map" aria-hidden="true">
          <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
            <path d="M0 140 C60 120 90 160 150 130 S240 80 300 100" />
            <path d="M40 0 C60 60 50 120 90 200" />
            <path d="M210 0 C190 70 230 130 200 200" />
            <path d="M0 60 H300" opacity="0.5" />
          </svg>
          <span className="site-pin" />
        </div>
      </section>

      <section className="site-sec">
        <p className="site-label">Moments</p>
        <div className="site-gallery">
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="site-sec site-rsvp">
        <p className="site-label">Will you join us?</p>
        <h2>Kindly reply</h2>
        <div className="site-rsvp-row">
          <span className="site-btn">Joyfully attending</span>
          <span className="site-btn site-btn--ghost">Regretfully decline</span>
        </div>
        <p className="site-small">Guests · 2 &nbsp;·&nbsp; Meal · Vegetarian</p>
      </section>

      <footer className="site-foot">
        <span className="site-seal" />
        <p>With love, {names}</p>
      </footer>
    </div>
  )
}
