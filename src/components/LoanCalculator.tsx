import { useEffect, useMemo, useRef, useState } from 'react'

/* ══════════════════════════════════════════════
   LOAN CALCULATOR

   Split panel: inputs on the light side, the answer on the dark side.

   You type the amount, term and rate, then press Calculate. The figures hold
   still until you do — `draft` is what is typed, `applied` is what has been
   quoted, and the results read only from `applied`. A line under the button
   says when the two have diverged, so an edited field is never mistaken for
   an updated answer.

   Beyond the arithmetic it also shows:

     - what the loan actually costs, as a principal-versus-interest split,
       which is the figure people are usually surprised by;
     - the saving against the national average rate, recomputed from the same
       terms rather than asserted as a fixed number;
     - a year-by-year schedule, which doubles as the table view of the split.
══════════════════════════════════════════════ */

/* Chart colours. Validated for the dark panel surface (#0b3a5c) against the
   OKLCH lightness band, chroma floor, colour-vision separation and contrast —
   worst adjacent pair ΔE 24.2 under protanopia, well clear of the threshold.
   Do not nudge these by eye; re-run the validator if they must change. */
const PRINCIPAL = '#0d8fd4'
const INTEREST = '#c9821a'
const PANEL = '#0b3a5c'

/** National average lending rate, for the side-by-side saving. */
const MARKET_RATE = 16.01

interface Preset {
  label: string
  rate: number
  months: number
  amount: number
}

/* Rates mirror the published product list. Picking a product fills in a
   plausible term and amount too, so the first useful answer costs one click
   rather than three decisions. */
const PRESETS: Preset[] = [
  { label: 'Micro Loan', rate: 18, months: 24, amount: 2_000_000 },
  { label: 'SME Boost', rate: 17.5, months: 36, amount: 15_000_000 },
  { label: 'Personal', rate: 19, months: 18, amount: 3_000_000 },
  { label: 'Mortgage', rate: 15.5, months: 120, amount: 45_000_000 },
]

const rwf = (n: number) =>
  n.toLocaleString('en-RW', { maximumFractionDigits: 0 })

const pct1 = (n: number) =>
  n.toLocaleString('en-RW', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** Standard amortising payment. Falls back to straight division at 0%. */
function monthlyPayment(amount: number, annualRate: number, months: number): number {
  if (amount <= 0 || months <= 0) return 0
  const r = annualRate / 100 / 12
  if (r === 0) return amount / months
  const growth = Math.pow(1 + r, months)
  return (amount * r * growth) / (growth - 1)
}

interface YearRow {
  year: number
  principal: number
  interest: number
  balance: number
}

/** Year-by-year rollup of the amortisation, for the schedule table. */
function schedule(amount: number, annualRate: number, months: number): YearRow[] {
  const payment = monthlyPayment(amount, annualRate, months)
  if (payment === 0) return []

  const r = annualRate / 100 / 12
  const rows: YearRow[] = []
  let balance = amount
  let principalYear = 0
  let interestYear = 0

  for (let m = 1; m <= months; m += 1) {
    const interest = balance * r
    // The final instalment clears whatever rounding has left behind.
    const principal = Math.min(payment - interest, balance)
    balance = Math.max(0, balance - principal)
    principalYear += principal
    interestYear += interest

    if (m % 12 === 0 || m === months) {
      rows.push({
        year: Math.ceil(m / 12),
        principal: principalYear,
        interest: interestYear,
        balance,
      })
      principalYear = 0
      interestYear = 0
    }
  }
  return rows
}

/* ── A labelled number field ──
   Typed directly, with the accepted range stated underneath. */
function Control({
  label,
  suffix,
  value,
  min,
  max,
  step,
  onChange,
  format,
  onSubmit,
}: {
  label: string
  suffix?: string
  value: number
  min: number
  max: number
  step: number
  onChange: (next: number) => void
  format?: (n: number) => string
  /** Enter in any field should do what the button does. */
  onSubmit?: () => void
}) {
  const id = `calc-${label.replace(/\W+/g, '-').toLowerCase()}`
  const clamp = (n: number) => Math.min(max, Math.max(min, n))

  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <label htmlFor={id} style={{ fontSize: 12.5, fontWeight: 700, color: '#647080', letterSpacing: '0.02em' }}>
          {label}
        </label>
        {suffix && (
          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#94a3b8' }}>{suffix}</span>
        )}
      </div>

      <input
        id={id}
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(clamp(Number(e.target.value) || 0))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onSubmit?.()
          }
        }}
        style={{
          width: '100%',
          fontSize: 22,
          fontWeight: 800,
          color: '#0284c7',
          background: '#f6fbff',
          border: '1.5px solid rgba(14,165,233,0.16)',
          borderRadius: 12,
          padding: '12px 14px',
          fontFamily: 'inherit',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#0ea5e9'
          e.currentTarget.style.boxShadow = '0 0 0 4px rgba(14,165,233,0.12)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(14,165,233,0.16)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      />

      {/* The accepted range, stated rather than implied by a slider's ends. */}
      <div style={{ marginTop: 6, fontSize: 10.5, color: '#94a3b8', fontWeight: 600 }}>
        {format ? format(min) : min} – {format ? format(max) : max}
      </div>
    </div>
  )
}

/* ── A figure row on the dark panel ── */
function Figure({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        padding: '13px 0',
        borderTop: '1px solid rgba(186,230,253,0.14)',
      }}
    >
      <span style={{ fontSize: 13.5, color: 'rgba(186,230,253,0.72)', fontWeight: 600 }}>{label}</span>
      <span
        style={{
          fontSize: strong ? 17 : 15.5,
          fontWeight: strong ? 900 : 700,
          color: '#ffffff',
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </span>
    </div>
  )
}

/** The three numbers a quote is made of. */
interface Terms {
  amount: number
  months: number
  rate: number
}

const INITIAL: Terms = { amount: 5_000_000, months: 24, rate: 12 }

export default function LoanCalculator() {
  /* What is typed and what has been calculated are held apart, so the figures
     on the right keep describing the quote you actually asked for while you
     are still editing the fields on the left. */
  const [draft, setDraft] = useState<Terms>(INITIAL)
  const [applied, setApplied] = useState<Terms>(INITIAL)

  const [unit, setUnit] = useState<'months' | 'years'>('months')
  const [showSchedule, setShowSchedule] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  const { amount, months, rate } = applied

  const pending =
    draft.amount !== applied.amount ||
    draft.months !== applied.months ||
    draft.rate !== applied.rate

  function calculate() {
    setApplied(draft)
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
    }
  }, [])

  /* Derived from `applied`, never from `draft` — the results change when you
     press Calculate and at no other time. */
  const result = useMemo(() => {
    const payment = monthlyPayment(amount, rate, months)
    const total = payment * months
    const interest = Math.max(0, total - amount)

    // The same loan at the national average, for the side-by-side saving.
    const marketTotal = monthlyPayment(amount, MARKET_RATE, months) * months
    const saving = Math.max(0, marketTotal - total)

    return { payment, total, interest, saving }
  }, [amount, rate, months])

  const rows = useMemo(
    () => (showSchedule ? schedule(amount, rate, months) : []),
    [showSchedule, amount, rate, months],
  )

  // Segment widths for the proportion bar; guarded so a zero loan cannot divide by zero.
  const principalShare = result.total > 0 ? (amount / result.total) * 100 : 100
  const interestShare = 100 - principalShare

  const tenureMax = unit === 'months' ? 120 : 10
  const tenureValue =
    unit === 'months' ? draft.months : Math.max(1, Math.round(draft.months / 12))

  return (
    <section
      id="calculator"
      ref={ref}
      style={{ padding: '96px 48px', background: '#f4f8fc', position: 'relative', overflow: 'hidden' }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(14,165,233,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative' }}>
        {/* Section header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 44,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <span className="section-pill">Loan Calculator</span>
          <h2
            style={{
              fontWeight: 900,
              fontSize: 'clamp(26px, 3.5vw, 42px)',
              color: '#0284c7',
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
            }}
          >
            Know the cost <span style={{ color: '#0ea5e9' }}>before you borrow</span>
          </h2>
          <p style={{ fontSize: 15, color: '#647080', maxWidth: 540, margin: '14px auto 0', lineHeight: 1.65 }}>
            Adjust the amount, term and rate — the repayment updates as you go. Estimates only; your
            final offer depends on assessment.
          </p>
        </div>

        <div
          className="calc-shell"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 18px 60px rgba(14,165,233,0.12)',
            border: '1px solid rgba(14,165,233,0.1)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(26px)',
            transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
          }}
        >
          {/* ── Inputs ── */}
          <div style={{ background: '#ffffff', padding: '38px 36px' }}>
            {/* Product presets */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#647080', marginBottom: 10 }}>
                Start from a product
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {PRESETS.map((preset) => {
                  const active = draft.rate === preset.rate && draft.months === preset.months
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        /* A preset is a complete set of terms chosen deliberately,
                           so it both fills the form and produces the quote — there
                           is nothing left for the reader to decide. */
                        const next: Terms = {
                          amount: preset.amount,
                          months: preset.months,
                          rate: preset.rate,
                        }
                        setDraft(next)
                        setApplied(next)
                        setUnit(preset.months % 12 === 0 && preset.months >= 24 ? 'years' : 'months')
                      }}
                      aria-pressed={active}
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        padding: '8px 14px',
                        borderRadius: 100,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        border: active ? '1.5px solid #0ea5e9' : '1.5px solid rgba(14,165,233,0.18)',
                        background: active ? 'rgba(14,165,233,0.1)' : '#ffffff',
                        color: active ? '#0284c7' : '#647080',
                        transition: 'all 0.18s',
                      }}
                    >
                      {preset.label}
                      <span style={{ marginLeft: 6, opacity: 0.65, fontWeight: 600 }}>
                        {pct1(preset.rate)}%
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <Control
              label="Loan amount"
              suffix="RWF"
              value={draft.amount}
              min={100_000}
              max={100_000_000}
              step={100_000}
              onChange={(next) => setDraft((d) => ({ ...d, amount: next }))}
              format={(n) => (n >= 1_000_000 ? `${String(n / 1_000_000)}M` : `${String(n / 1000)}K`)}
              onSubmit={calculate}
            />

            {/* Tenure, with a months/years toggle */}
            <div style={{ marginBottom: 4 }}>
              <div
                role="tablist"
                aria-label="Tenure unit"
                style={{ display: 'inline-flex', gap: 4, background: '#f1f7fc', borderRadius: 10, padding: 4, marginBottom: 14 }}
              >
                {(['months', 'years'] as const).map((option) => (
                  <button
                    key={option}
                    role="tab"
                    type="button"
                    aria-selected={unit === option}
                    onClick={() => {
                      setUnit(option)
                      // Snap to a whole number of years so the two views agree.
                      if (option === 'years') {
                        setDraft((d) => ({
                          ...d,
                          months: Math.max(12, Math.round(d.months / 12) * 12),
                        }))
                      }
                    }}
                    style={{
                      fontSize: 11.5,
                      fontWeight: 800,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '7px 16px',
                      borderRadius: 7,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      background: unit === option ? '#ffffff' : 'transparent',
                      color: unit === option ? '#0284c7' : '#94a3b8',
                      boxShadow: unit === option ? '0 1px 4px rgba(2,132,199,0.14)' : 'none',
                      transition: 'all 0.18s',
                    }}
                  >
                    In {option}
                  </button>
                ))}
              </div>
            </div>

            <Control
              label="Loan tenure"
              suffix={unit === 'months' ? 'Months' : 'Years'}
              value={tenureValue}
              min={1}
              max={tenureMax}
              step={1}
              onChange={(next) => {
                setDraft((d) => ({ ...d, months: unit === 'months' ? next : next * 12 }))
              }}
              onSubmit={calculate}
            />

            <Control
              label="Interest rate"
              suffix="% per year"
              value={draft.rate}
              min={1}
              max={30}
              step={0.5}
              onChange={(next) => setDraft((d) => ({ ...d, rate: next }))}
              format={(n) => `${pct1(n)}%`}
              onSubmit={calculate}
            />

            <button
              type="button"
              onClick={calculate}
              style={{
                width: '100%',
                marginTop: 6,
                padding: '15px 0',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: '0.01em',
                color: '#ffffff',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                boxShadow: '0 8px 24px rgba(2,132,199,0.28)',
                transition: 'transform 0.18s, box-shadow 0.18s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(2,132,199,0.36)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(2,132,199,0.28)'
              }}
            >
              Calculate loan
            </button>

            {/* Says plainly that the figures shown are for the previous terms,
                so a changed field is never mistaken for a changed answer. */}
            <div
              aria-live="polite"
              style={{
                marginTop: 10,
                minHeight: 16,
                fontSize: 11.5,
                fontWeight: 600,
                textAlign: 'center',
                color: pending ? '#b45309' : 'transparent',
              }}
            >
              {pending ? 'Terms changed — press Calculate to update the figures.' : ' '}
            </div>
          </div>

          {/* ── Result ── */}
          <div
            style={{
              background: `linear-gradient(155deg, ${PANEL} 0%, #0c4a6e 55%, #075985 100%)`,
              padding: '38px 36px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(186,230,253,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Your monthly repayment
            </div>

            {/* Hero number — the one figure people came for. */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '10px 0 4px' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'rgba(186,230,253,0.7)' }}>RWF</span>
              <span
                style={{
                  fontSize: 'clamp(32px, 4.6vw, 46px)',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {rwf(result.payment)}
              </span>
            </div>
            <div style={{ fontSize: 12.5, color: 'rgba(186,230,253,0.5)', marginBottom: 22 }}>
              every month for {months} month{months === 1 ? '' : 's'}
            </div>

            <Figure label="Total amount to pay" value={`RWF ${rwf(result.total)}`} strong />
            <Figure label="Total interest" value={`RWF ${rwf(result.interest)}`} />

            {/* ── Cost breakdown ──
                Two categories, so a single proportion bar is the right form:
                it reads as "how much of what I hand over is the loan itself". */}
            <div style={{ marginTop: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(186,230,253,0.72)', marginBottom: 9 }}>
                What you repay
              </div>

              <div
                role="img"
                aria-label={`Of the total repayment, ${pct1(principalShare)} percent is principal and ${pct1(interestShare)} percent is interest.`}
                style={{ display: 'flex', gap: 2, height: 14, marginBottom: 11 }}
              >
                <div
                  style={{
                    width: `${String(principalShare)}%`,
                    background: PRINCIPAL,
                    borderRadius: '7px 2px 2px 7px',
                    transition: 'width 0.35s ease',
                  }}
                />
                <div
                  style={{
                    width: `${String(interestShare)}%`,
                    background: INTEREST,
                    borderRadius: '2px 7px 7px 2px',
                    transition: 'width 0.35s ease',
                  }}
                />
              </div>

              {/* Legend doubles as the direct labels, so identity never rests
                  on colour alone. */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { key: 'Principal', color: PRINCIPAL, share: principalShare, value: amount },
                  { key: 'Interest', color: INTEREST, share: interestShare, value: result.interest },
                ].map((series) => (
                  <div key={series.key} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span
                      aria-hidden="true"
                      style={{ width: 10, height: 10, borderRadius: 3, background: series.color, flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 12, color: 'rgba(186,230,253,0.72)', fontWeight: 600 }}>
                      {series.key}
                    </span>
                    <span style={{ fontSize: 12, color: '#ffffff', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                      {pct1(series.share)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live saving against the national average. */}
            {result.saving > 0 && (
              <div
                style={{
                  marginTop: 22,
                  padding: '13px 16px',
                  borderRadius: 12,
                  background: 'rgba(186,230,253,0.09)',
                  border: '1px solid rgba(186,230,253,0.16)',
                }}
              >
                <div style={{ fontSize: 12, color: 'rgba(186,230,253,0.7)', marginBottom: 3 }}>
                  Against the {pct1(MARKET_RATE)}% national average
                </div>
                <div style={{ fontSize: 15.5, fontWeight: 900, color: '#bae6fd' }}>
                  You keep RWF {rwf(result.saving)}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowSchedule((s) => !s)}
              aria-expanded={showSchedule}
              style={{
                marginTop: 22,
                alignSelf: 'flex-start',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 700,
                color: '#bae6fd',
                padding: 0,
              }}
            >
              {showSchedule ? 'Hide' : 'Show'} repayment schedule
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                style={{ transform: showSchedule ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Amortisation schedule ──
            Also the table view of the breakdown above, so the split is
            readable without relying on the bar. */}
        {showSchedule && (
          <div
            style={{
              marginTop: 18,
              background: '#ffffff',
              borderRadius: 18,
              border: '1px solid rgba(14,165,233,0.1)',
              boxShadow: '0 8px 30px rgba(14,165,233,0.07)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '18px 24px 12px', fontSize: 13.5, fontWeight: 800, color: '#0284c7' }}>
              Year-by-year breakdown
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <caption className="sr-only">
                  Principal and interest paid each year, with the remaining balance.
                </caption>
                <thead>
                  <tr style={{ background: '#f6fbff' }}>
                    {['Year', 'Principal paid', 'Interest paid', 'Balance remaining'].map((head, i) => (
                      <th
                        key={head}
                        scope="col"
                        style={{
                          textAlign: i === 0 ? 'left' : 'right',
                          padding: '10px 24px',
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: '#647080',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.year} style={{ borderTop: '1px solid rgba(14,165,233,0.08)' }}>
                      <td style={{ padding: '11px 24px', fontWeight: 700, color: '#0284c7' }}>{row.year}</td>
                      <td style={{ padding: '11px 24px', textAlign: 'right', color: '#334155', fontVariantNumeric: 'tabular-nums' }}>
                        {rwf(row.principal)}
                      </td>
                      <td style={{ padding: '11px 24px', textAlign: 'right', color: '#334155', fontVariantNumeric: 'tabular-nums' }}>
                        {rwf(row.interest)}
                      </td>
                      <td style={{ padding: '11px 24px', textAlign: 'right', fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                        {rwf(row.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* Spinner arrows are tiny hit targets that crowd a large figure; the
           field accepts typing and the stated range does the rest. */
        .calc-shell input[type=number]::-webkit-outer-spin-button,
        .calc-shell input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none; margin: 0;
        }
        .calc-shell input[type=number] { -moz-appearance: textfield; }

        @media (max-width: 880px) {
          .calc-shell { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
