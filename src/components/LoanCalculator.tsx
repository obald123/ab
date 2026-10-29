import { useEffect, useRef, useState } from 'react'
import { useT } from '../lib/i18n'
import { API_ROOT, useCollection } from '../lib/content'

/* ══════════════════════════════════════════════
   LOAN CALCULATOR

   Split panel: inputs on the light side, the answer on the dark side.

   Everything that decides the answer comes from the CMS ("Loan Calculator"
   section): which loans exist, their amount and term limits, the interest
   rate and how it is charged, the repayment frequency and the fees. The
   schedule itself is computed by the backend (`/loan-quote`) — the same
   calculation the CMS preview uses — so the site never does its own
   arithmetic that could drift from what the bank configured.

   You choose a loan, type the amount and term, then press Calculate. The
   figures hold still until you do: `draft` is what is typed, `quote` is
   what was calculated, and a line under the button says when the two have
   diverged, so an edited field is never mistaken for an updated answer.
══════════════════════════════════════════════ */

/* Chart colours. Validated for the dark panel surface (#0b3a5c) against the
   OKLCH lightness band, chroma floor, colour-vision separation and contrast —
   worst adjacent pair ΔE 24.2 under protanopia, well clear of the threshold.
   Do not nudge these by eye; re-run the validator if they must change. */
const PRINCIPAL = '#0d8fd4'
const INTEREST = '#c9821a'
const PANEL = '#0b3a5c'

/** A loan product as the CMS publishes it (penalty settings are never public). */
interface LoanProduct {
  id: string
  code: string
  name: string
  description: string
  minimumAmount: number
  maximumAmount: number
  minimumMaturity: number
  maximumMaturity: number
  interestRate: number
  interestRateType: 'declining' | 'flat'
  installmentFrequency: number
  effectiveDate: string
  active: boolean
}

/** The backend's payment plan — the fields this page shows. */
interface PaymentPlan {
  installments: {
    installmentNumber: number
    plannedDate: string
    installmentAmount: number
    principal: number
    interest: number
    instalmentFee: number
    remaining: number
  }[]
  paymentPlanTotals: {
    totalPrincipal: number
    disbursementAmount: number
    totalInterest: number
    totalDisbursementFee: number
    totalInstalmentFees: number
    totalRepaymentAmount: number
    instalmentAmount: number
    instalmentNumber: number
  }
}

/** Nothing is invented while the CMS loads or if it cannot be reached. */
const NO_PRODUCTS: LoanProduct[] = []

interface Terms {
  productId: string
  amount: number
  months: number
}

interface Quote {
  terms: Terms
  plan: PaymentPlan
}

const rwf = (n: number) => n.toLocaleString('en-RW', { maximumFractionDigits: 0 })

const pct1 = (n: number) =>
  n.toLocaleString('en-RW', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** Short form for the range hint. Zero stays "0" rather than becoming "0K". */
const compactRwf = (n: number): string => {
  if (n === 0) return '0'
  if (n >= 1_000_000) return `${String(n / 1_000_000)}M`
  if (n >= 1000) return `${String(n / 1000)}K`
  return String(n)
}

/** A sensible starting point inside the product's limits: RWF 1 million and
 *  a one-year term where the product allows them. */
function defaultTerms(product: LoanProduct): Terms {
  const step = product.installmentFrequency
  const amount = Math.min(product.maximumAmount, Math.max(product.minimumAmount, 1_000_000))
  const lowest = step * Math.ceil(product.minimumMaturity / step)
  const highest = product.maximumMaturity - (product.maximumMaturity % step)
  const months = Math.min(highest, Math.max(lowest, step * Math.round(12 / step)))
  return { productId: product.id, amount, months }
}

const sameTerms = (a: Terms, b: Terms) =>
  a.productId === b.productId && a.amount === b.amount && a.months === b.months

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
  note,
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
  note?: string
}) {
  const id = `calc-${label.replace(/\W+/g, '-').toLowerCase()}`
  /* Floored at 0, not at the product minimum: a field that silently refuses
     to go below a threshold reads as broken while you clear it to type a new
     figure. The backend rejects an out-of-range request with a message. */
  const clamp = (n: number) => Math.min(max, Math.max(0, n))

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
        {note && <span style={{ marginLeft: 8 }}>· {note}</span>}
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
        gap: 16,
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
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </span>
    </div>
  )
}

const panelStyle = {
  background: `linear-gradient(155deg, ${PANEL} 0%, #0c4a6e 55%, #075985 100%)`,
  padding: '38px 36px',
  display: 'flex',
  flexDirection: 'column',
} as const

export default function LoanCalculator() {
  const t = useT()
  const { data, loading } = useCollection<LoanProduct>('loan_product', NO_PRODUCTS)
  const products = data.filter((product) => product.active)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  /* The typed terms, kept per product: switching loans starts that loan from
     its own sensible defaults rather than carrying over an amount it may not
     allow. */
  const [draftTerms, setDraftTerms] = useState<Terms | null>(null)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState<string | null>(null)
  const [showSchedule, setShowSchedule] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const inflight = useRef<AbortController | null>(null)

  const selected = products.find((product) => product.id === selectedId) ?? products[0]
  const draft: Terms | null = selected
    ? draftTerms?.productId === selected.id
      ? draftTerms
      : defaultTerms(selected)
    : null

  const pending = quote !== null && draft !== null && !sameTerms(quote.terms, draft)

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
      inflight.current?.abort()
    }
  }, [])

  async function calculate(terms: Terms | null = draft) {
    if (!terms) return
    inflight.current?.abort()
    const controller = new AbortController()
    inflight.current = controller

    setBusy(true)
    setFailed(null)
    try {
      const params = new URLSearchParams({
        product: terms.productId,
        amount: String(terms.amount),
        maturity: String(terms.months),
      })
      const response = await fetch(`${API_ROOT}/loan-quote?${params.toString()}`, { signal: controller.signal })
      if (!response.ok) {
        // The backend explains a refused request ("The term must be…").
        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null
        throw new Error(body?.error?.message ?? t.calculator.quoteFailed)
      }
      setQuote({ terms, plan: (await response.json()) as PaymentPlan })
    } catch (error) {
      if (controller.signal.aborted) return
      setFailed(error instanceof Error && error.message ? error.message : t.calculator.quoteFailed)
    } finally {
      if (inflight.current === controller) setBusy(false)
    }
  }

  function chooseProduct(product: LoanProduct) {
    setSelectedId(product.id)
    const terms = defaultTerms(product)
    setDraftTerms(terms)
    setShowSchedule(false)
    // Choosing a loan is a complete decision, so it also produces the quote.
    void calculate(terms)
  }

  const update = (patch: Partial<Omit<Terms, 'productId'>>) => {
    if (draft) setDraftTerms({ ...draft, ...patch })
  }

  const frequencyLabel = (months: number) =>
    months === 3
      ? t.calculator.everyQuarter
      : months === 6
        ? t.calculator.everySixMonths
        : months === 12
          ? t.calculator.everyYear
          : t.calculator.everyMonth

  const header = (
    <div
      style={{
        textAlign: 'center',
        marginBottom: 44,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <span className="section-pill">{t.calculator.eyebrow}</span>
      <h2
        style={{
          fontWeight: 900,
          fontSize: 'clamp(26px, 3.5vw, 42px)',
          color: '#0284c7',
          letterSpacing: '-0.025em',
          lineHeight: 1.1,
        }}
      >
        {t.calculator.heading}
      </h2>
      <p style={{ fontSize: 15, color: '#647080', maxWidth: 540, margin: '14px auto 0', lineHeight: 1.65 }}>
        {t.calculator.lead}
      </p>
    </div>
  )

  const plan = quote && selected && quote.terms.productId === selected.id ? quote.plan : null
  const totals = plan?.paymentPlanTotals
  const principalShare =
    totals && totals.totalPrincipal + totals.totalInterest > 0
      ? (totals.totalPrincipal / (totals.totalPrincipal + totals.totalInterest)) * 100
      : 100
  const interestShare = 100 - principalShare

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
        {header}

        {!selected || !draft ? (
          /* No published product (or the CMS is unreachable): say so plainly
             rather than show a calculator with invented rates. */
          !loading && (
            <div
              role="status"
              style={{
                maxWidth: 560,
                margin: '0 auto',
                textAlign: 'center',
                background: '#ffffff',
                borderRadius: 20,
                padding: '32px 28px',
                border: '1px solid rgba(14,165,233,0.1)',
                boxShadow: '0 12px 40px rgba(14,165,233,0.08)',
              }}
            >
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0284c7' }}>{t.calculator.unavailableTitle}</div>
              <p style={{ fontSize: 14, color: '#647080', margin: '8px 0 18px', lineHeight: 1.6 }}>
                {t.calculator.unavailableBody}
              </p>
              <a
                href="#contact"
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  borderRadius: 100,
                  fontSize: 13.5,
                  fontWeight: 800,
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  textDecoration: 'none',
                }}
              >
                {t.calculator.contactUs}
              </a>
            </div>
          )
        ) : (
          <>
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
                <div style={{ marginBottom: 26 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#647080', marginBottom: 10 }}>
                    {t.calculator.chooseProduct}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {products.map((product) => {
                      const active = product.id === selected.id
                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => chooseProduct(product)}
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
                          {product.name}
                          <span style={{ marginLeft: 6, opacity: 0.65, fontWeight: 600 }}>
                            {pct1(product.interestRate)}%
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  {selected.description && (
                    <p style={{ fontSize: 12.5, color: '#647080', margin: '12px 0 0', lineHeight: 1.55 }}>
                      {selected.description}
                    </p>
                  )}
                </div>

                <Control
                  label={t.calculator.loanAmount}
                  suffix="RWF"
                  value={draft.amount}
                  min={selected.minimumAmount}
                  max={selected.maximumAmount}
                  step={50_000}
                  onChange={(next) => update({ amount: next })}
                  format={compactRwf}
                  onSubmit={() => void calculate()}
                />

                <Control
                  label={t.calculator.tenure}
                  suffix={t.calculator.months}
                  value={draft.months}
                  min={selected.minimumMaturity}
                  max={selected.maximumMaturity}
                  step={selected.installmentFrequency}
                  onChange={(next) => update({ months: next })}
                  onSubmit={() => void calculate()}
                  note={
                    selected.installmentFrequency > 1
                      ? t.calculator.termSteps.replace('{n}', String(selected.installmentFrequency))
                      : undefined
                  }
                />

                {/* The rate is the bank's, from the CMS — shown, not typed. */}
                <div
                  style={{
                    marginBottom: 22,
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: '#f6fbff',
                    border: '1.5px solid rgba(14,165,233,0.12)',
                  }}
                >
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#647080' }}>{t.calculator.interestRate}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0284c7', marginTop: 2 }}>
                    {pct1(selected.interestRate)}
                    {t.calculator.perYear}
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#647080', marginLeft: 6 }}>
                      {selected.interestRateType === 'flat'
                        ? t.calculator.onOriginalAmount
                        : t.calculator.onReducingBalance}
                    </span>
                  </div>
                  <div style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 600, marginTop: 4 }}>
                    {t.calculator.ratesEffective} {selected.effectiveDate}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void calculate()}
                  disabled={busy}
                  style={{
                    width: '100%',
                    marginTop: 6,
                    padding: '15px 0',
                    borderRadius: 12,
                    border: 'none',
                    cursor: busy ? 'wait' : 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 15,
                    fontWeight: 800,
                    letterSpacing: '0.01em',
                    color: '#ffffff',
                    background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                    boxShadow: '0 8px 24px rgba(2,132,199,0.28)',
                    opacity: busy ? 0.75 : 1,
                    transition: 'transform 0.18s, box-shadow 0.18s',
                  }}
                >
                  {busy ? t.calculator.calculating : t.calculator.calculate}
                </button>

                {/* Says plainly when the figures shown are for other terms, or
                    why a request was refused. */}
                <div
                  aria-live="polite"
                  style={{
                    marginTop: 10,
                    minHeight: 16,
                    fontSize: 11.5,
                    fontWeight: 600,
                    textAlign: 'center',
                    color: failed ? '#b91c1c' : pending ? '#b45309' : 'transparent',
                  }}
                >
                  {failed ?? (pending ? t.calculator.termsChanged : ' ')}
                </div>
              </div>

              {/* ── Result ── */}
              <div style={panelStyle}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(186,230,253,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {t.calculator.regularRepayment}
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
                    {totals ? rwf(totals.instalmentAmount) : '—'}
                  </span>
                </div>
                <div style={{ fontSize: 12.5, color: 'rgba(186,230,253,0.5)', marginBottom: 22 }}>
                  {totals
                    ? `${frequencyLabel(selected.installmentFrequency)} · ${String(totals.instalmentNumber)} ${t.calculator.instalments}`
                    : ' '}
                </div>

                {totals && (
                  <>
                    <Figure label={t.calculator.totalToPay} value={`RWF ${rwf(totals.totalRepaymentAmount)}`} strong />
                    <Figure label={t.calculator.totalInterest} value={`RWF ${rwf(totals.totalInterest)}`} />
                    {totals.totalInstalmentFees > 0 && (
                      <Figure label={t.calculator.instalmentFees} value={`RWF ${rwf(totals.totalInstalmentFees)}`} />
                    )}
                    {totals.totalDisbursementFee > 0 && (
                      <Figure label={t.calculator.feesAtDisbursement} value={`RWF ${rwf(totals.totalDisbursementFee)}`} />
                    )}
                    <Figure label={t.calculator.amountReceived} value={`RWF ${rwf(totals.disbursementAmount)}`} />

                    {/* ── Cost breakdown ──
                        Two categories, so a single proportion bar is the right
                        form: how much of what you repay is the loan itself. */}
                    <div style={{ marginTop: 22 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(186,230,253,0.72)', marginBottom: 9 }}>
                        {t.calculator.whatYouRepay}
                      </div>
                      <div
                        role="img"
                        aria-label={`${t.calculator.principal} ${pct1(principalShare)}%, ${t.calculator.interest} ${pct1(interestShare)}%`}
                        style={{ display: 'flex', gap: 2, height: 14, marginBottom: 11 }}
                      >
                        <div style={{ width: `${String(principalShare)}%`, background: PRINCIPAL, borderRadius: '7px 2px 2px 7px', transition: 'width 0.35s ease' }} />
                        <div style={{ width: `${String(interestShare)}%`, background: INTEREST, borderRadius: '2px 7px 7px 2px', transition: 'width 0.35s ease' }} />
                      </div>
                      {/* Legend doubles as the direct labels, so identity never
                          rests on colour alone. */}
                      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        {[
                          { key: t.calculator.principal, color: PRINCIPAL, share: principalShare },
                          { key: t.calculator.interest, color: INTEREST, share: interestShare },
                        ].map((series) => (
                          <div key={series.key} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 3, background: series.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: 'rgba(186,230,253,0.72)', fontWeight: 600 }}>{series.key}</span>
                            <span style={{ fontSize: 12, color: '#ffffff', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                              {pct1(series.share)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

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
                      {showSchedule ? t.calculator.hideSchedule : t.calculator.showSchedule}
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
                  </>
                )}
              </div>
            </div>

            {/* ── Repayment schedule, one row per instalment ── */}
            {showSchedule && plan && (
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
                <div style={{ padding: '18px 24px 4px', fontSize: 13.5, fontWeight: 800, color: '#0284c7' }}>
                  {t.calculator.scheduleTitle}
                </div>
                <p style={{ padding: '0 24px 10px', margin: 0, fontSize: 12.5, color: '#647080' }}>
                  {t.calculator.scheduleLead}
                </p>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <caption className="sr-only">{t.calculator.scheduleTitle}</caption>
                    <thead>
                      <tr style={{ background: '#f6fbff' }}>
                        {[
                          t.calculator.colNumber,
                          t.calculator.colDate,
                          t.calculator.colInstalment,
                          t.calculator.colPrincipal,
                          t.calculator.colInterest,
                          t.calculator.colFees,
                          t.calculator.colBalance,
                        ].map((head, i) => (
                          <th
                            key={head}
                            scope="col"
                            style={{
                              textAlign: i < 2 ? 'left' : 'right',
                              padding: '10px 16px',
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
                      {plan.installments.map((row) => (
                        <tr key={row.installmentNumber} style={{ borderTop: '1px solid rgba(14,165,233,0.08)' }}>
                          <td style={{ padding: '9px 16px', fontWeight: 700, color: '#0284c7' }}>{row.installmentNumber}</td>
                          <td style={{ padding: '9px 16px', color: '#334155', whiteSpace: 'nowrap' }}>{row.plannedDate}</td>
                          {[row.installmentAmount, row.principal, row.interest, row.instalmentFee].map((value, i) => (
                            <td key={i} style={{ padding: '9px 16px', textAlign: 'right', color: '#334155', fontVariantNumeric: 'tabular-nums' }}>
                              {rwf(value)}
                            </td>
                          ))}
                          <td style={{ padding: '9px 16px', textAlign: 'right', fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                            {rwf(row.remaining)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
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
