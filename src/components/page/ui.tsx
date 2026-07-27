import type { CSSProperties, ReactNode } from 'react'
import { IconSearch } from '../Icons'

/* Small presentational primitives shared by the standalone pages, so
   Careers / Tenders / News / Articles / Forms stay visually consistent
   without each one re-inventing a chip, a card or an empty state. */

const PAGE_WRAP: CSSProperties = {
  maxWidth: 1180,
  margin: '0 auto',
  padding: '0 48px',
}

export function Section({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <section className="page-section" style={{ padding: '64px 0 96px', ...style }}>
      <div style={PAGE_WRAP}>{children}</div>
    </section>
  )
}

export function Card({
  children,
  style,
  interactive = false,
}: {
  children: ReactNode
  style?: CSSProperties
  interactive?: boolean
}) {
  return (
    <div
      className={interactive ? 'page-card page-card--interactive' : 'page-card'}
      style={{
        background: '#ffffff',
        border: '1px solid rgba(14,165,233,0.13)',
        borderRadius: 16,
        boxShadow: '0 2px 14px rgba(2,30,60,0.05)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

const TONES = {
  blue: { bg: 'rgba(14,165,233,0.1)', fg: '#0284c7', bd: 'rgba(14,165,233,0.22)' },
  green: { bg: 'rgba(22,163,74,0.1)', fg: '#15803d', bd: 'rgba(22,163,74,0.24)' },
  amber: { bg: 'rgba(217,119,6,0.12)', fg: '#b45309', bd: 'rgba(217,119,6,0.26)' },
  red: { bg: 'rgba(220,38,38,0.1)', fg: '#b91c1c', bd: 'rgba(220,38,38,0.24)' },
  grey: { bg: 'rgba(100,112,128,0.1)', fg: '#647080', bd: 'rgba(100,112,128,0.2)' },
} as const

export type Tone = keyof typeof TONES

export function Chip({ tone = 'blue', children }: { tone?: Tone; children: ReactNode }) {
  const t = TONES[tone]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        borderRadius: 100,
        padding: '3px 11px',
        fontSize: 10.5,
        fontWeight: 800,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

export function Meta({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 9.5,
          fontWeight: 800,
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
          color: '#94a3b8',
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>{value}</div>
    </div>
  )
}

/** Filter toolbar: a search box plus one row of mutually exclusive chips. */
export function FilterBar({
  query,
  onQuery,
  placeholder,
  options,
  active,
  onSelect,
}: {
  query: string
  onQuery: (v: string) => void
  placeholder: string
  options: readonly string[]
  active: string
  onSelect: (v: string) => void
}) {
  return (
    <div style={{ marginBottom: 34 }}>
      <label style={{ display: 'block', position: 'relative', maxWidth: 420, marginBottom: 16 }}>
        <span className="sr-only">{placeholder}</span>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
          <IconSearch size={16} color="#94a3b8" strokeWidth={2} />
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '11px 14px 11px 40px',
            borderRadius: 10,
            border: '1px solid rgba(14,165,233,0.2)',
            fontSize: 14,
            color: '#0f172a',
            background: '#ffffff',
          }}
        />
      </label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {options.map((o) => {
          const on = active === o
          return (
            <button
              key={o}
              onClick={() => onSelect(o)}
              aria-pressed={on}
              style={{
                background: on ? '#0ea5e9' : 'rgba(14,165,233,0.07)',
                color: on ? '#ffffff' : '#0284c7',
                border: `1px solid ${on ? '#0ea5e9' : 'rgba(14,165,233,0.18)'}`,
                borderRadius: 100,
                padding: '7px 15px',
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.18s, color 0.18s, border-color 0.18s',
              }}
            >
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* Countdown dial. Used wherever a deadline is the single most important
   fact on a card — job closing dates and tender submission deadlines. The
   ring drains as the window closes and shifts amber, then grey. */
export function DeadlineRing({
  daysLeft,
  windowDays = 30,
  size = 74,
}: {
  daysLeft: number
  windowDays?: number
  size?: number
}) {
  const expired = daysLeft < 0
  const pct = expired ? 0 : Math.min(Math.max(daysLeft / windowDays, 0), 1)
  const stroke = 5
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const color = expired ? '#94a3b8' : daysLeft <= 7 ? '#d97706' : '#0ea5e9'

  return (
    <div
      style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
      role="img"
      aria-label={expired ? 'Closed' : `${daysLeft} days remaining`}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(14,165,233,0.14)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          lineHeight: 1,
        }}
      >
        <div>
          <div style={{ fontSize: expired ? 12 : 20, fontWeight: 900, color, fontFamily: 'var(--font-serif)' }}>
            {expired ? '—' : daysLeft}
          </div>
          <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.1em', color: '#94a3b8', marginTop: 2 }}>
            {expired ? 'CLOSED' : daysLeft === 1 ? 'DAY' : 'DAYS'}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Rubber-stamp status marker for the procurement register. */
export function Stamp({ label, tone }: { label: string; tone: Tone }) {
  const t = TONES[tone]
  return (
    <span
      style={{
        display: 'inline-block',
        transform: 'rotate(-7deg)',
        border: `2.5px solid ${t.fg}`,
        color: t.fg,
        borderRadius: 6,
        padding: '4px 12px',
        fontSize: 12,
        fontWeight: 900,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        opacity: 0.82,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '64px 24px',
        border: '1px dashed rgba(14,165,233,0.25)',
        borderRadius: 16,
        color: '#647080',
        fontSize: 14.5,
        background: '#f8fbfe',
      }}
    >
      {message}
    </div>
  )
}
