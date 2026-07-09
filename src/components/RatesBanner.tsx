/* ── Rates Running Banner ── */

const rates = [
  { label: 'Savings Account',      value: '6.5%',    unit: 'p.a.',  tag: 'Interest Rate' },
  { label: 'Umugore Savings',      value: '9.5%',    unit: 'p.a.',  tag: 'Women\'s Account' },
  { label: 'Fixed Deposit 6M',     value: '10.25%',  unit: 'p.a.',  tag: 'Term Deposit' },
  { label: 'Fixed Deposit 12M',    value: '11.0%',   unit: 'p.a.',  tag: 'Term Deposit' },
  { label: 'SME Business Loan',    value: '17.5%',   unit: 'p.a.',  tag: 'Lending Rate' },
  { label: 'Personal Loan',        value: '19.0%',   unit: 'p.a.',  tag: 'Lending Rate' },
  { label: 'Mortgage Loan',        value: '15.5%',   unit: 'p.a.',  tag: 'Home Loan' },
  { label: 'USD / RWF',            value: '1,347.50', unit: 'RWF',  tag: 'Exchange Rate' },
  { label: 'EUR / RWF',            value: '1,468.20', unit: 'RWF',  tag: 'Exchange Rate' },
  { label: 'GBP / RWF',            value: '1,712.80', unit: 'RWF',  tag: 'Exchange Rate' },
  { label: 'KES / RWF',            value: '10.42',   unit: 'RWF',   tag: 'Exchange Rate' },
  { label: 'UGX / RWF',            value: '0.37',    unit: 'RWF',   tag: 'Exchange Rate' },
  { label: 'eKash Transfer Fee',   value: 'FREE',    unit: '3 months', tag: 'Campaign Offer' },
  { label: 'USSD Banking',         value: '*540#',   unit: 'all networks', tag: 'Mobile Money' },
]

type Direction = 'up' | 'down' | 'neutral'

const indicators: Direction[] = [
  'up', 'up', 'up', 'up',
  'neutral', 'neutral', 'down',
  'up', 'up', 'down', 'up', 'down',
  'neutral', 'neutral',
]

function Arrow({ dir }: { dir: Direction }) {
  if (dir === 'up') return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
      <path d="M5 8V2M2 5l3-3 3 3" stroke="#22c55e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  if (dir === 'down') return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
      <path d="M5 2v6M2 5l3 3 3-3" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
      <path d="M2 5h6" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

function RateItem({ rate, dir }: { rate: typeof rates[0], dir: Direction }) {
  const isCampaign = rate.tag === 'Campaign Offer'
  const isFree = rate.value === 'FREE'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        {/* Tag badge */}
        <span style={{
          fontSize: 8.5, fontWeight: 800, letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: isCampaign ? '#e8f400' : 'rgba(168,216,240,0.55)',
          background: isCampaign ? 'rgba(232,244,0,0.12)' : 'transparent',
          padding: isCampaign ? '2px 7px' : '0',
          borderRadius: isCampaign ? 4 : 0,
          border: isCampaign ? '1px solid rgba(232,244,0,0.3)' : 'none',
        }}>
          {rate.tag}
        </span>
        {/* Label */}
        <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {rate.label}
        </span>
        {/* Arrow */}
        <Arrow dir={dir} />
        {/* Value */}
        <span style={{
          fontSize: 14, fontWeight: 900, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
          color: isFree ? '#e8f400' : dir === 'up' ? '#86efac' : dir === 'down' ? '#fca5a5' : '#ffffff',
        }}>
          {rate.value}
        </span>
        {/* Unit */}
        <span style={{ fontSize: 10, color: 'rgba(168,216,240,0.45)', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {rate.unit}
        </span>
      </span>
      {/* Separator dot */}
      <span style={{
        display: 'inline-block', width: 3, height: 3, borderRadius: '50%',
        background: 'rgba(168,216,240,0.2)', flexShrink: 0,
      }} />
    </span>
  )
}

export default function RatesBanner() {
  const doubled = [...rates, ...rates]

  return (
    <div style={{
      background: 'linear-gradient(90deg, #002030 0%, #002a49 40%, #003d68 60%, #002030 100%)',
      borderTop: '1px solid rgba(168,216,240,0.10)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Top shimmer line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(168,216,240,0.3), transparent)',
        animation: 'shimmer 4s linear infinite',
        backgroundSize: '200% auto',
      }} />

      {/* Header label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        borderBottom: '1px solid rgba(168,216,240,0.08)',
        padding: '8px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginRight: 24 }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#22c55e',
            display: 'block', animation: 'blink 1.5s ease-in-out infinite',
            boxShadow: '0 0 6px rgba(34,197,94,0.6)',
          }} />
          <span style={{
            fontSize: 9.5, fontWeight: 900, letterSpacing: '0.18em',
            color: 'rgba(168,216,240,0.7)', textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>Live Rates</span>
        </div>
        <div style={{ width: 1, height: 14, background: 'rgba(168,216,240,0.15)', marginRight: 24, flexShrink: 0 }} />
        <span style={{ fontSize: 9.5, color: 'rgba(168,216,240,0.35)', whiteSpace: 'nowrap' }}>
          Indicative rates · Updated daily · July 2026
        </span>
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <a href="#contact" style={{
            fontSize: 10, fontWeight: 800, color: 'rgba(168,216,240,0.55)',
            textDecoration: 'none', letterSpacing: '0.08em',
            border: '1px solid rgba(168,216,240,0.15)', borderRadius: 4,
            padding: '2px 10px', transition: 'color 0.2s, border-color 0.2s',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#a8d8f0'; el.style.borderColor = 'rgba(168,216,240,0.4)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(168,216,240,0.55)'; el.style.borderColor = 'rgba(168,216,240,0.15)' }}
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Scrolling rates ticker */}
      <div style={{ padding: '10px 0', overflow: 'hidden', position: 'relative' }}>
        {/* Edge fades */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, zIndex: 2, background: 'linear-gradient(90deg,#002030,rgba(0,32,48,0))', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, zIndex: 2, background: 'linear-gradient(270deg,#002030,rgba(0,32,48,0))', pointerEvents: 'none' }} />

        <div style={{
          display: 'flex', alignItems: 'center',
          animation: 'marquee 55s linear infinite',
          width: 'max-content', willChange: 'transform',
          padding: '0 28px',
        }}>
          {doubled.map((r, i) => (
            <RateItem key={i} rate={r} dir={indicators[i % indicators.length]} />
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        textAlign: 'center', padding: '6px 28px',
        borderTop: '1px solid rgba(168,216,240,0.06)',
        fontSize: 9, color: 'rgba(168,216,240,0.22)', letterSpacing: '0.04em',
      }}>
        Rates are indicative only and subject to change without notice. AB Rwanda is regulated by the National Bank of Rwanda.
      </div>
    </div>
  )
}
