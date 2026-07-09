import { useEffect, useRef, useState, useCallback } from 'react'
import { IconMobile, IconTrendUp, IconHeart } from './Icons'

/* ── Countdown ── */
function useCountdown(target: Date) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now())
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) })
    }
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [target])
  return t
}

/* ── 3D tilt ── */
function use3DTilt(strength = 10) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(1000px) rotateY(${x * strength}deg) rotateX(${y * -strength}deg) translateZ(8px)`
  }, [strength])
  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return
    el.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
  }, [])
  return { ref, onMove, onLeave }
}

/* ── Stat block (avoids hook-in-loop) ── */
function StatBlock({ value, suffix, label, trigger, delay }: { value: number, suffix: string, label: string, trigger: boolean, delay: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let cur = 0; const step = value / (1800 / 16)
    const id = setInterval(() => { cur += step; if (cur >= value) { setCount(value); clearInterval(id) } else setCount(Math.floor(cur)) }, 16)
    return () => clearInterval(id)
  }, [trigger, value])
  return (
    <div style={{ background: '#ffffff', padding: '36px 28px', textAlign: 'center', opacity: trigger ? 1 : 0, transform: trigger ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: 40, fontWeight: 900, color: '#2879bf', lineHeight: 1, marginBottom: 8 }}>{count}{suffix}</div>
      <div style={{ fontSize: 13, color: '#6a7880', fontWeight: 600 }}>{label}</div>
    </div>
  )
}

const LAUNCH = new Date('2026-08-15T09:00:00')

const products = [
  {
    id: 'ekash-plus', badge: 'NEW LAUNCH', badgeColor: '#e8f400', badgeText: '#021e3c',
    name: 'eKash Plus', tagline: 'Super-charged mobile money',
    description: 'Instant transfers, merchant payments, savings pockets, and cross-border remittance — all from your phone. No branch visit needed.',
    features: ['Zero transfer fees for 3 months', 'Earn 8% p.a. on savings pocket', 'Send to 12 African countries', 'USSD *540# or app'],
    accent: '#2879bf', accentLight: '#e8f6ff', Icon: IconMobile, stat: '50,000+', statLabel: 'Active users',
  },
  {
    id: 'sme-boost', badge: 'LIMITED OFFER', badgeColor: '#ff6b35', badgeText: '#ffffff',
    name: 'SME Boost Loan', tagline: 'Fuel your business growth',
    description: "Collateral-light business loans up to RWF 50M approved in 48 hours. Designed for Rwanda's entrepreneurs and growing enterprises.",
    features: ['Up to RWF 50 million', '48-hour approval', 'Flexible 12–60 month terms', 'Grace period available'],
    accent: '#c24a00', accentLight: '#fff4ee', Icon: IconTrendUp, stat: 'RWF 50M', statLabel: 'Max loan amount',
  },
  {
    id: 'umugore', badge: 'CAMPAIGN', badgeColor: '#8b5cf6', badgeText: '#ffffff',
    name: 'Umugore Savings', tagline: 'Savings built for women',
    description: "A dedicated savings account celebrating Rwanda's women entrepreneurs. Higher interest, financial coaching, and community benefits.",
    features: ['9.5% interest p.a.', 'Monthly financial coaching', 'Free accident insurance', "Women-only networking events"],
    accent: '#6d28d9', accentLight: '#f5f0ff', Icon: IconHeart, stat: '9.5%', statLabel: 'Interest p.a.',
  },
]

/* ── Campaign countdown banner ── */
function CampaignBanner() {
  const cd = useCountdown(LAUNCH)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#021e3c 0%,#2879bf 55%,#3a8fd0 100%)', borderRadius: 28, padding: '52px', boxShadow: '0 32px 80px rgba(40,121,191,0.30)' }}>
      {[200,300,400].map((s, i) => <div key={i} style={{ position: 'absolute', right: -s/2.5, top: '50%', transform: 'translateY(-50%)', width: s, height: s, borderRadius: '50%', border: `1px solid rgba(255,255,255,${0.07-i*0.02})`, pointerEvents: 'none' }} />)}
      <div style={{ position: 'absolute', right: '6%', top: '8%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(170,212,242,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div className="campaign-banner" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'center', position: 'relative' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(232,244,0,0.15)', border: '1px solid rgba(232,244,0,0.40)', borderRadius: 100, padding: '5px 18px', marginBottom: 22 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8f400', display: 'block', animation: 'blink 1.4s ease-in-out infinite' }} />
            <span style={{ fontSize: 10.5, fontWeight: 900, color: '#e8f400', letterSpacing: '0.14em' }}>GRAND CAMPAIGN · LAUNCH 15 AUGUST 2026</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 700, color: '#ffffff', lineHeight: 1.1, marginBottom: 16 }}>
            Empowering Rwanda,<br /><span style={{ color: '#aad4f2' }}>One Account at a Time</span>
          </h2>
          <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.62)', lineHeight: 1.75, maxWidth: 480, marginBottom: 32 }}>
            Open any new account before August 15 and get 3 months of zero fees, a free debit card, and exclusive campaign rewards.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e8f400', color: '#021e3c', padding: '13px 28px', borderRadius: 10, fontWeight: 900, fontSize: 14, textDecoration: 'none', boxShadow: '0 8px 24px rgba(232,244,0,0.35)', transition: 'transform 0.2s,box-shadow 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform='translateY(-2px)'; el.style.boxShadow='0 14px 36px rgba(232,244,0,0.5)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform=''; el.style.boxShadow='0 8px 24px rgba(232,244,0,0.35)' }}>
              Claim Your Offer
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 7.5h9M8.5 4l4 3.5-4 3.5" stroke="#021e3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a href="#about" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid rgba(255,255,255,0.28)', color: 'rgba(255,255,255,0.85)', padding: '13px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', background: 'rgba(255,255,255,0.06)', transition: 'border-color 0.2s,color 0.2s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(255,255,255,0.65)'; el.style.color='#ffffff' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='rgba(255,255,255,0.28)'; el.style.color='rgba(255,255,255,0.85)' }}>
              Learn More
            </a>
          </div>
        </div>
        {/* Countdown */}
        <div className="campaign-countdown" style={{ textAlign: 'center', minWidth: 230 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.40)', textTransform: 'uppercase', marginBottom: 14 }}>Offer ends in</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
            {([['d', cd.d], ['h', cd.h], ['m', cd.m], ['s', cd.s]] as [string, number][]).map(([lbl, val]) => (
              <div key={lbl} style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: 12, padding: '14px 6px', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{pad(val)}</div>
                <div style={{ fontSize: 8.5, fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 5 }}>{lbl}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 12 }}>Until campaign closes</p>
        </div>
      </div>
    </div>
  )
}

/* ── Product card ── */
function ProductCard({ p, index }: { p: typeof products[0], index: number }) {
  const tilt = use3DTilt(8)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current); return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)', transition: `opacity 0.65s ease ${index*0.14}s, transform 0.65s ease ${index*0.14}s`, height: '100%' }}>
      <div ref={tilt.ref} onMouseMove={tilt.onMove}
        style={{ background: '#ffffff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 32px rgba(40,121,191,0.09)', border: '1px solid rgba(40,121,191,0.07)', transition: 'box-shadow 0.25s', height: '100%', display: 'flex', flexDirection: 'column' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 24px 64px rgba(40,121,191,0.18)' }}
        onMouseLeave={e => { tilt.onLeave(); (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(40,121,191,0.09)' }}>
        {/* Header */}
        <div style={{ padding: '28px 28px 22px', background: p.accentLight, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${p.accent},${p.accent}88)` }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p.Icon size={26} color="#ffffff" />
            </div>
            <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.12em', background: p.badgeColor, color: p.badgeText, padding: '4px 12px', borderRadius: 100 }}>{p.badge}</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 21, fontWeight: 900, color: p.accent, marginTop: 14, marginBottom: 4 }}>{p.name}</h3>
          <p style={{ fontSize: 12.5, color: '#6a7880', fontWeight: 600 }}>{p.tagline}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: p.accent, color: '#fff', padding: '5px 14px', borderRadius: 100, marginTop: 14, fontSize: 12.5, fontWeight: 800 }}>
            {p.stat}<span style={{ opacity: 0.65, fontSize: 10.5 }}>{p.statLabel}</span>
          </div>
        </div>
        {/* Body */}
        <div style={{ padding: '22px 28px 28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontSize: 13.5, color: '#647080', lineHeight: 1.7, marginBottom: 18 }}>{p.description}</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
            {p.features.map((f, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: '#2a3540', fontWeight: 600, marginBottom: 10 }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', background: p.accentLight, border: `2px solid ${p.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4l2 2 3-3" stroke={p.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
          <a href="#contact" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, padding: '13px 0', borderRadius: 10, background: p.accent, color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none', boxShadow: `0 6px 20px ${p.accent}40`, transition: 'transform 0.2s,box-shadow 0.2s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform='translateY(-2px)'; el.style.boxShadow=`0 10px 28px ${p.accent}55` }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform=''; el.style.boxShadow=`0 6px 20px ${p.accent}40` }}>
            Apply Now
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </div>
    </div>
  )
}

/* ── Stats strip ── */
function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current); return () => obs.disconnect()
  }, [])
  const statsData = [
    { value: 94, suffix: '%', label: 'Customer satisfaction' },
    { value: 48, suffix: 'h', label: 'Loan approval time' },
    { value: 12, suffix: '+', label: 'African corridors' },
    { value: 200, suffix: 'K+', label: 'Customers served' },
  ]
  return (
    <div ref={ref} className="campaign-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'rgba(40,121,191,0.08)', borderRadius: 20, overflow: 'hidden', marginTop: 56 }}>
      {statsData.map((s, i) => <StatBlock key={i} value={s.value} suffix={s.suffix} label={s.label} trigger={visible} delay={i * 0.12} />)}
    </div>
  )
}

export default function Campaign() {
  return (
    <section id="campaign" style={{ background: '#f4f8fc', padding: '96px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px' }}>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 36, height: 2, background: '#2879bf', borderRadius: 2 }} />
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', color: '#2879bf', textTransform: 'uppercase' }}>New Products &amp; Campaigns</span>
        </div>
        <div className="campaign-header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'end', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, color: '#021e3c', lineHeight: 1.1 }}>
            Built for Rwanda's<br /><span style={{ color: '#2879bf' }}>Next Chapter</span>
          </h2>
          <p style={{ fontSize: 16, color: '#647080', lineHeight: 1.75, maxWidth: 400, marginLeft: 'auto' }}>
            We're launching three powerful new products this August designed to serve more Rwandans — whether you're saving, growing a business, or sending money home.
          </p>
        </div>

        {/* Campaign banner with countdown */}
        <CampaignBanner />

        {/* Product cards */}
        <div className="campaign-products" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 48 }}>
          {products.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
        </div>

        {/* Stats strip */}
        <StatsStrip />

        {/* Bottom CTA */}
        <div className="campaign-bottom-cta" style={{ marginTop: 56, padding: '52px', background: 'linear-gradient(135deg,#021e3c,#2879bf)', borderRadius: 24, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 15% 50%,rgba(170,212,242,0.12) 0%,transparent 50%),radial-gradient(circle at 85% 50%,rgba(0,106,174,0.2) 0%,transparent 50%)', pointerEvents: 'none' }} />
          <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.42)', textTransform: 'uppercase', marginBottom: 16, position: 'relative' }}>Limited time offer</p>
          <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(22px,3vw,36px)', fontWeight: 900, color: '#ffffff', marginBottom: 12, position: 'relative' }}>Ready to get started?</h3>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.58)', marginBottom: 32, position: 'relative' }}>Visit any branch or dial *540# to open your account today.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', position: 'relative', flexWrap: 'wrap' }}>
            <a href="#contact" style={{ background: '#ffffff', color: '#2879bf', padding: '14px 34px', borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.18)', transition: 'transform 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-2px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='' }}>
              Find a Branch
            </a>
            <a href="tel:*540" style={{ border: '1.5px solid rgba(255,255,255,0.35)', color: '#ffffff', padding: '14px 34px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', background: 'rgba(255,255,255,0.08)', transition: 'border-color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.7)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.35)' }}>
              Dial *540#
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
