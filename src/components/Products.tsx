import { useState, useRef, useEffect } from 'react'
import { IconCoin, IconTrendUp, IconLeaf, IconBank, IconCreditCard, IconExchange, IconGlobe, IconShield, IconMobile, IconZap, IconPercent, IconUsers } from './Icons'
type IconComp = React.FC<{size?:number;color?:string;strokeWidth?:number}>

type Cat = 'Loans' | 'Accounts' | 'Banking Services' | 'Bancassurance' | 'Digital Solutions'
const cats: Cat[] = ['Loans', 'Accounts', 'Banking Services', 'Bancassurance', 'Digital Solutions']

const catIcons: Record<Cat, IconComp> = {
  Loans: IconCoin,
  Accounts: IconBank,
  'Banking Services': IconExchange,
  Bancassurance: IconShield,
  'Digital Solutions': IconMobile,
}

const data: Record<Cat, { Icon: IconComp; title: string; tag: string; bullets: string[]; highlight?: boolean }[]> = {
  Loans: [
    {
      Icon: IconCoin, title: 'Micro Loan', tag: 'RWF 200K – 5M',
      bullets: ['Up to 24 months maturity', 'Disbursed in under 3 days', 'No collateral registration', 'Flexible documentation'],
    },
    {
      Icon: IconTrendUp, title: 'Super Micro Loan', tag: 'RWF 5M – 30M', highlight: true,
      bullets: ['Up to 36 months maturity', 'Disbursed in under 10 days', 'No mandatory savings required', 'RDB collateral registration'],
    },
    {
      Icon: IconLeaf, title: 'Agro Loan', tag: 'RWF 200K – 5M',
      bullets: ['Up to 12 months maturity', 'Disbursed in under 3 days', 'Quarterly or biannual repayment', 'Land plot as collateral'],
    },
  ],
  Accounts: [
    {
      Icon: IconPercent, title: 'IGIRE Term Deposit', tag: '6% – 9% per annum', highlight: true,
      bullets: ['Min. RWF 50,000 individual', 'Min. RWF 100,000 entity', 'Automatic rollover available', 'Free account statements'],
    },
    {
      Icon: IconBank, title: 'Ongera Savings', tag: '3.5% per annum',
      bullets: ['Open with just RWF 1,000', 'Unlimited monthly withdrawals', 'SMS transaction alerts', 'No hidden fees'],
    },
    {
      Icon: IconCreditCard, title: 'ISANGE Current Account', tag: 'RWF 800/month',
      bullets: ['Payroll & standing orders', 'Cheque book provided', 'AB IBAKWE push/pull', 'MTN MoMo integration'],
    },
  ],
  'Banking Services': [
    {
      Icon: IconExchange, title: 'Local Fund Transfers', tag: 'Fast & Reliable',
      bullets: ['Instant inter-bank transfers', 'Fees from RWF 200', 'Mobile & branch channels', 'SMS confirmation'],
    },
    {
      Icon: IconGlobe, title: 'International Transfers', tag: 'Global Reach', highlight: true,
      bullets: ['SWIFT international wires', 'Competitive FX rates', 'MoneyGram cash pickup', 'Full tariff guide available'],
    },
  ],
  Bancassurance: [
    {
      Icon: IconShield, title: 'NGOBOKA — Individual', tag: 'From RWF 400/month',
      bullets: ['Life insurance with Sanlam Vie', 'Benefits beyond life expectancy', 'Protection for life events', 'Affordable monthly premiums'],
    },
    {
      Icon: IconUsers, title: 'NGOBOKA — Family', tag: 'From RWF 900/month', highlight: true,
      bullets: ['Covers spouse + 4 children', 'Children covered to age 25', 'Sanlam Vie underwriting', 'Branch or mobile enrolment'],
    },
  ],
  'Digital Solutions': [
    {
      Icon: IconMobile, title: 'eKash (AB Mobile)', tag: 'Dial *540#', highlight: true,
      bullets: ['Works on all phone types', 'Balance checks & statements', 'Kinyarwanda & English', 'Inter-bank & MoMo transfers'],
    },
    {
      Icon: IconZap, title: 'AB IBAKWE', tag: 'Dial *182*4#',
      bullets: ['MTN MoMo ↔ AB account', 'Remote loan repayments', 'No branch visit needed', '24/7 availability'],
    },
  ],
}

function Card({ item }: { item: typeof data.Loans[0] }) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${y * -7}deg) translateY(-8px)`
    el.style.boxShadow = item.highlight
      ? `${-x * 16}px ${-y * 8}px 60px rgba(40,121,191,0.35), 0 30px 70px rgba(40,121,191,0.2)`
      : `${-x * 14}px ${-y * 6}px 50px rgba(40,121,191,0.14), 0 20px 50px rgba(40,121,191,0.08)`
  }
  const onLeave = () => {
    const el = ref.current; if (!el) return
    el.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)'
    el.style.boxShadow = item.highlight ? '0 8px 32px rgba(40,121,191,0.25)' : '0 4px 24px rgba(40,121,191,0.07)'
  }

  if (item.highlight) {
    return (
      <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{
        background: 'linear-gradient(145deg, #003d70 0%, #2879bf 45%, #3a8fd0 100%)',
        borderRadius: 20, padding: 30, cursor: 'default',
        transition: 'transform 0.14s ease-out, box-shadow 0.14s ease-out',
        boxShadow: '0 8px 32px rgba(40,121,191,0.25)',
        transformStyle: 'preserve-3d', position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(170,212,242,0.15)',
      }}>
        <div style={{
          position: 'absolute', top: '-40%', right: '-20%',
          width: '70%', height: '160%',
          background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.06), transparent)',
          transform: 'rotate(15deg)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px', pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-block', background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 100, padding: '3px 12px', fontSize: 9.5,
          fontWeight: 800, color: '#ffffff', letterSpacing: '0.12em', marginBottom: 18,
        }}>
          ★ POPULAR CHOICE
        </div>

        <div style={{
          width: 52, height: 52, borderRadius: 14, marginBottom: 20,
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <item.Icon size={24} color="#aad4f2" strokeWidth={1.75} />
        </div>

        <div style={{
          display: 'inline-block', fontSize: 10, fontWeight: 800,
          color: 'rgba(170,212,242,0.85)', background: 'rgba(170,212,242,0.12)',
          borderRadius: 100, padding: '3px 11px', letterSpacing: '0.06em', marginBottom: 12,
        }}>
          {item.tag}
        </div>

        <h3 style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', marginBottom: 18, letterSpacing: '-0.01em' }}>
          {item.title}
        </h3>

        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {item.bullets.map(b => (
            <li key={b} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'rgba(255,255,255,0.75)', alignItems: 'flex-start' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(170,212,242,0.85)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {b}
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <a href="https://abr.rw/what-we-offer/" target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            fontSize: 13.5, fontWeight: 800, color: '#ffffff', textDecoration: 'none',
            transition: 'gap 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '12px' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '7px' }}
          >
            Learn more
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{
      background: '#ffffff', border: '1.5px solid rgba(40,121,191,0.1)',
      borderRadius: 20, padding: 30, cursor: 'default',
      transition: 'transform 0.14s ease-out, box-shadow 0.14s ease-out',
      boxShadow: '0 4px 24px rgba(40,121,191,0.07)',
      transformStyle: 'preserve-3d', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, #2879bf, #3a8fd0)',
        borderRadius: '20px 20px 0 0',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(40,121,191,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px', pointerEvents: 'none',
      }} />

      <div style={{
        width: 52, height: 52, borderRadius: 14, marginBottom: 18,
        background: 'linear-gradient(135deg, #e6f2fa 0%, #c8e4f5 100%)',
        border: '1px solid rgba(40,121,191,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <item.Icon size={22} color="#2879bf" strokeWidth={1.75} />
      </div>

      <div style={{
        display: 'inline-block', fontSize: 10, fontWeight: 800,
        color: '#2879bf', background: 'rgba(40,121,191,0.06)',
        border: '1px solid rgba(40,121,191,0.12)',
        borderRadius: 100, padding: '3px 11px', letterSpacing: '0.06em', marginBottom: 12,
      }}>
        {item.tag}
      </div>

      <h3 style={{ fontSize: 19, fontWeight: 900, color: '#003d70', marginBottom: 18, letterSpacing: '-0.01em', position: 'relative' }}>
        {item.title}
      </h3>

      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 9, position: 'relative' }}>
        {item.bullets.map(b => (
          <li key={b} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: '#647080', alignItems: 'flex-start' }}>
            <div style={{
              width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
              background: 'rgba(40,121,191,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2879bf' }} />
            </div>
            {b}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid #f0f7fc', position: 'relative' }}>
        <a href="https://abr.rw/what-we-offer/" target="_blank" rel="noopener noreferrer" style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          fontSize: 13.5, fontWeight: 800, color: '#2879bf', textDecoration: 'none',
          transition: 'gap 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '12px' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '7px' }}
        >
          Learn more
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default function Products() {
  const [active, setActive] = useState<Cat>('Loans')
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    const items = el.querySelectorAll<HTMLElement>('[data-reveal]')
    items.forEach(i => { i.style.opacity = '0'; i.style.transform = 'translateY(24px)' })
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        items.forEach((item, i) => {
          setTimeout(() => {
            item.style.transition = `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms`
            item.style.opacity = '1'; item.style.transform = 'translateY(0)'
          }, 0)
        })
        obs.disconnect()
      }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="products" style={{
      background: '#f8fbfe', padding: '108px 0',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative rings */}
      <div style={{
        position: 'absolute', top: -200, right: -200, width: 700, height: 700,
        borderRadius: '50%', pointerEvents: 'none',
        border: '1px solid rgba(40,121,191,0.05)',
        background: 'radial-gradient(circle, rgba(40,121,191,0.03) 0%, transparent 65%)',
      }} />
      <div style={{
        position: 'absolute', bottom: -150, left: -100, width: 500, height: 500,
        borderRadius: '50%', pointerEvents: 'none',
        border: '1px solid rgba(40,121,191,0.04)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(40,121,191,0.04) 1px, transparent 1px)',
        backgroundSize: '40px 40px', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', position: 'relative' }}>
        {/* Asymmetric header: heading left, stats right */}
        <div data-reveal style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'end', marginBottom: 64 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 2, background: '#2879bf', borderRadius: 2 }} />
              <span style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: '0.18em', color: '#2879bf', textTransform: 'uppercase' }}>What We Offer</span>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700, fontSize: 'clamp(30px, 4.2vw, 52px)',
              color: '#003d70', lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: 18,
            }}>
              Tailored Financial Solutions<br />
              <span className="text-gradient-product">for Every Rwandan</span>
            </h2>
            <p style={{ fontSize: 16, color: '#647080', maxWidth: 480, lineHeight: 1.78 }}>
              Accessible, transparent, and responsible — built for entrepreneurs and families across all provinces.
            </p>
          </div>
          {/* Side stats panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: '#ffffff', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(40,121,191,0.09)', boxShadow: '0 4px 20px rgba(40,121,191,0.07)', minWidth: 200 }}>
            {[
              { value: '47+', label: 'Branches', color: '#2879bf' },
              { value: '15+', label: 'Products', color: '#003d70' },
              { value: '200K+', label: 'Customers', color: '#3a8fd0' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '18px 24px', borderBottom: i < 2 ? '1px solid rgba(40,121,191,0.07)' : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 3, height: 32, background: s.color, borderRadius: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#8fa0aa', fontWeight: 600, marginTop: 3 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div data-reveal style={{ display: 'flex', justifyContent: 'center', marginBottom: 52 }}>
          <div style={{
            display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center',
            padding: '6px', background: '#ffffff', borderRadius: 16,
            border: '1.5px solid rgba(40,121,191,0.09)',
            boxShadow: '0 4px 20px rgba(40,121,191,0.07)',
          }}>
            {cats.map(cat => (
              <button key={cat} onClick={() => setActive(cat)} style={{
                padding: '10px 22px', borderRadius: 11, fontSize: 13.5, fontWeight: 800,
                border: 'none', cursor: 'pointer', transition: 'all 0.22s ease',
                display: 'flex', alignItems: 'center', gap: 7,
                background: active === cat
                  ? 'linear-gradient(135deg, #003d70, #2879bf)'
                  : 'transparent',
                color: active === cat ? '#ffffff' : '#647080',
                boxShadow: active === cat ? '0 6px 20px rgba(40,121,191,0.3)' : 'none',
              }}>
                {(() => { const CatIcon = catIcons[cat]; return <CatIcon size={14} color={active === cat ? '#ffffff' : '#647080'} strokeWidth={2} /> })()}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(data[active].length, 3)}, 1fr)`,
          gap: 24,
        }}>
          {data[active].map(item => <Card key={item.title} item={item} />)}
        </div>

        {/* CTA band */}
        <div data-reveal style={{
          marginTop: 60, borderRadius: 22, overflow: 'hidden',
          background: 'linear-gradient(135deg, #021e3c 0%, #003d70 40%, #2879bf 70%, #3a8fd0 100%)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '60%', height: '200%',
            background: 'radial-gradient(ellipse, rgba(0,106,174,0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', padding: '44px 56px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <div>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', marginBottom: 8, letterSpacing: '-0.01em' }}>
                Ready to get started?
              </p>
              <p style={{ fontSize: 15, color: 'rgba(170,212,242,0.65)' }}>
                Visit any of our 47+ branches or dial <strong style={{ color: '#aad4f2' }}>*540#</strong> to access eKash.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#contact" style={{
                padding: '13px 30px', borderRadius: 11, background: '#ffffff',
                color: '#003d70', fontWeight: 900, fontSize: 14, textDecoration: 'none',
                boxShadow: '0 8px 28px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.transform = 'translateY(-2px)'
                  el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.28)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.transform = 'none'
                  el.style.boxShadow = '0 8px 28px rgba(0,0,0,0.2)'
                }}
              >
                Find a Branch
              </a>
              <a href="https://abr.rw/what-we-offer/" target="_blank" rel="noopener noreferrer" style={{
                padding: '13px 30px', borderRadius: 11,
                border: '1.5px solid rgba(170,212,242,0.35)', color: '#ffffff',
                fontWeight: 700, fontSize: 14, textDecoration: 'none',
                background: 'rgba(170,212,242,0.06)',
                transition: 'border-color 0.2s, background 0.2s',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(170,212,242,0.6)'
                  el.style.background = 'rgba(170,212,242,0.12)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(170,212,242,0.35)'
                  el.style.background = 'rgba(170,212,242,0.06)'
                }}
              >
                All Products →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
