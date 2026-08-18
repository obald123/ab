import { Link } from 'react-router-dom'
import { useCollection } from '../lib/content'
import { iconFor } from '../lib/icon-map'
import { useT } from '../lib/i18n'

/* ── Top announcement bar — sits above the navbar ── */

interface TickerItem {
  icon: string
  text: string
}

/* Shown only until the CMS responds, and if it never does. A bank's homepage
   with an empty announcement bar looks broken; stale copy does not. */
const FALLBACK: TickerItem[] = [
  { icon: 'gift', text: 'GRAND CAMPAIGN: Open an account before August 15 — get 3 months zero fees + free debit card' },
  { icon: 'mobile', text: 'NEW: eKash Plus — instant transfers, savings pockets & cross-border remittance via *540#' },
  { icon: 'trend-up', text: 'SME Boost Loan: up to RWF 50M approved in 48 hours — apply now at any branch' },
  { icon: 'heart', text: "Umugore Savings: 9.5% p.a. interest rate — celebrating Rwanda's women entrepreneurs" },
  { icon: 'globe', text: 'Send money to 12 African countries instantly via eKash — competitive FX rates daily' },
  { icon: 'star', text: 'AB Rwanda rated #1 for customer satisfaction — 94% of customers would recommend us' },
]

export default function Ticker() {
  const t = useT()
  const { data: items } = useCollection<TickerItem>('ticker', FALLBACK)
  const doubled = [...items, ...items]

  return (
    <div style={{
      // Offset is 0 normally; the staging-preview banner sets it so the fixed
      // chrome sits below the banner instead of under it.
      position: 'fixed', top: 'var(--abr-preview-offset, 0px)', left: 0, right: 0, zIndex: 300,
      background: '#0284c7',
      borderBottom: '1px solid rgba(14,165,233,0.3)',
      height: 36,
      overflow: 'hidden',
      display: 'flex', alignItems: 'center',
    }}>
      {/* Left label */}
      <div className="ticker-label" style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 16px',
        borderRight: '1px solid rgba(168,216,240,0.15)',
        height: '100%',
        background: '#004070',
        zIndex: 2,
      }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%', background: '#e8f400',
          display: 'block', animation: 'blink 1.4s ease-in-out infinite',
          boxShadow: '0 0 5px rgba(232,244,0,0.6)',
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: 9, fontWeight: 900, letterSpacing: '0.18em',
          color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>{t.ticker.latestNews}</span>
      </div>

      {/* Edge fade right of label */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 180, zIndex: 1, background: 'linear-gradient(90deg,#004070 70%,rgba(0,64,112,0))', pointerEvents: 'none' }} />
      {/* Edge fade right */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, zIndex: 1, background: 'linear-gradient(270deg,#0284c7,rgba(2,132,199,0))', pointerEvents: 'none' }} />

      {/* Scrolling text */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          animation: 'marquee 50s linear infinite',
          width: 'max-content', willChange: 'transform',
          paddingLeft: 32,
        }}>
          {doubled.map((item, i) => {
            const Icon = iconFor(item.icon)
            return (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Icon size={13} color="rgba(168,216,240,0.7)" strokeWidth={2} />
                </span>
                <span style={{ fontSize: 11.5, color: 'rgba(168,216,240,0.85)', fontWeight: 600, letterSpacing: '0.01em' }}>
                  {item.text}
                </span>
              </span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(168,216,240,0.25)', flexShrink: 0 }} />
            </span>
            )
          })}
        </div>
      </div>

      {/* Right CTA — a standing, always-visible way in to /report, not just
          the footer link. Anyone scanning past the ticker sees it on every
          page, which matters most for the misconduct/whistleblowing track. */}
      <Link to="/report" className="ticker-cta" style={{
        flexShrink: 0, padding: '0 16px', height: '100%',
        display: 'flex', alignItems: 'center', gap: 6,
        borderLeft: '1px solid rgba(168,216,240,0.15)',
        fontSize: 10.5, fontWeight: 800, color: '#fca5a5',
        textDecoration: 'none', letterSpacing: '0.06em', whiteSpace: 'nowrap',
        transition: 'background 0.2s, color 0.2s',
      }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement
          el.style.background = '#dc2626'
          el.style.color = '#ffffff'
          el.querySelector('svg path')?.setAttribute('stroke', '#ffffff')
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement
          el.style.background = 'transparent'
          el.style.color = '#fca5a5'
          el.querySelector('svg path')?.setAttribute('stroke', '#fca5a5')
        }}
      >
        {t.ticker.whistleblowing}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6M5 2l3 3-3 3" stroke="#fca5a5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </Link>
    </div>
  )
}
