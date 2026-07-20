import { useState, useRef, useEffect } from 'react'

/* ── helpers ── */
const fmt = (n: number) => n.toLocaleString('en-RW', { maximumFractionDigits: 0 })
const pct = (n: number) => n.toLocaleString('en-RW', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/* ── single calculator card ── */
function CalcCard({
  title, subtitle, rate, rateNote, accent, icon,
}: {
  title: string
  subtitle: string
  rate: number
  rateNote: string
  accent: string
  icon: React.ReactNode
}) {
  const [amount, setAmount] = useState(500000)
  const [months, setMonths] = useState(24)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const r = rate / 100 / 12
  const monthly = r === 0
    ? amount / months
    : amount * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
  const total = monthly * months
  const interest = total - amount

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        background: '#ffffff',
        borderRadius: 24,
        border: '1px solid rgba(14,165,233,0.08)',
        boxShadow: '0 8px 40px rgba(14,165,233,0.06)',
        padding: '40px 36px',
        flex: 1, minWidth: 320,
      }}
    >
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 24px ${accent}22`,
        }}>
          {icon}
        </div>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0284c7', lineHeight: 1.2 }}>{title}</h3>
          <p style={{ fontSize: 12.5, color: '#647080', fontWeight: 600 }}>{subtitle}</p>
        </div>
      </div>

      {/* rate badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: `${accent}10`, border: `1.5px solid ${accent}22`,
        borderRadius: 10, padding: '8px 14px', marginBottom: 28,
      }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: accent }}>{pct(rate)}%</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#647080', lineHeight: 1.3 }}>
          Annual Rate<br />{rateNote}
        </span>
      </div>

      {/* loan amount */}
      <div style={{ marginBottom: 22 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: '#647080', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>
          Loan Amount (RWF)
        </label>
        <input
          type="range" min={50000} max={10000000} step={50000}
          value={amount}
          onChange={e => setAmount(+e.target.value)}
          style={{ width: '100%', accentColor: accent, height: 6 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 10.5, color: '#94a3b8' }}>50,000</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#0284c7' }}>RWF {fmt(amount)}</span>
          <span style={{ fontSize: 10.5, color: '#94a3b8' }}>10,000,000</span>
        </div>
      </div>

      {/* loan term */}
      <div style={{ marginBottom: 32 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: '#647080', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>
          Loan Term
        </label>
        <input
          type="range" min={3} max={60} step={1}
          value={months}
          onChange={e => setMonths(+e.target.value)}
          style={{ width: '100%', accentColor: accent, height: 6 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={{ fontSize: 10.5, color: '#94a3b8' }}>3 months</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#0284c7' }}>{months} months ({pct(months / 12)} years)</span>
          <span style={{ fontSize: 10.5, color: '#94a3b8' }}>60 months</span>
        </div>
      </div>

      {/* results */}
      <div style={{
        background: `linear-gradient(135deg, #f0f9ff, #f8fbfe)`,
        borderRadius: 16, padding: '24px 20px',
        border: '1px solid rgba(14,165,233,0.06)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#647080', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Monthly Payment</span>
        </div>
        <div style={{
          fontSize: 32, fontWeight: 900, color: accent,
          letterSpacing: '-0.03em', lineHeight: 1,
        }}>
          RWF {fmt(monthly)}
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
          marginTop: 20, paddingTop: 16,
          borderTop: '1px solid rgba(14,165,233,0.08)',
        }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Total Interest</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0284c7' }}>RWF {fmt(interest)}</div>
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Total Repayment</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0284c7' }}>RWF {fmt(total)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── main section ── */
export default function LoanCalculator() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} style={{ padding: '96px 48px', background: '#f4f8fc', position: 'relative', overflow: 'hidden' }}>
      {/* decorative bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(14,165,233,0.03) 1px, transparent 1px)',
        backgroundSize: '32px 32px', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        {/* header */}
        <div style={{
          textAlign: 'center', marginBottom: 56,
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <span style={{
            display: 'inline-block', background: 'rgba(186,230,253,0.12)', border: '1.5px solid rgba(186,230,253,0.25)',
            color: '#0284c7', borderRadius: 100, padding: '5px 18px', fontSize: 11.5, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18,
          }}>
            Loan Calculator
          </span>
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 44px)', color: '#0284c7', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            Compare & Calculate Your <span style={{ color: '#0ea5e9' }}>Loan Repayment</span>
          </h2>
          <p style={{ fontSize: 15, color: '#647080', maxWidth: 560, margin: '14px auto 0', lineHeight: 1.65 }}>
            See how much you could save with AB Bank Rwanda. Use our calculators to compare BNR market rates with our competitive microfinance rates.
          </p>
        </div>

        {/* calculators side by side */}
        <div className="calc-grid" style={{ display: 'flex', gap: 32, alignItems: 'stretch' }}>
          <CalcCard
            title="BNR Market Rate"
            subtitle="Average Rwanda lending rate"
            rate={16.01}
            rateNote="National average"
            accent="#0284c7"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}><rect x="2" y="3" width="20" height="18" rx="3" /><path d="M2 9h20" /></svg>}
          />
          <CalcCard
            title="AB Bank Rwanda"
            subtitle="Our competitive rate"
            rate={12}
            rateNote="ABR special"
            accent="#0ea5e9"
            icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}><path d="M3 21V7l9-4 9 4v14" /><path d="M9 21V11h6v10" /><path d="M12 11V7" /></svg>}
          />
        </div>

        {/* savings callout */}
        <div style={{
          marginTop: 40, textAlign: 'center',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            background: 'linear-gradient(135deg, #0c4a6e, #0284c7, #0ea5e9)',
            borderRadius: 14, padding: '16px 28px',
            boxShadow: '0 12px 40px rgba(14,165,233,0.25)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bae6fd" strokeWidth={2.5}>
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>
              Save up to 4.01% annually with AB Bank Rwanda
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .calc-grid { flex-direction: column !important; }
        }
      `}</style>
    </section>
  )
}
