import { useEffect, useRef, useState, useCallback } from 'react'
import { IconMobile, IconMapPin, IconCalculator, IconExchange, IconPen, IconCheckCircle, IconTrendUp, IconShield } from './Icons'

/* ══════════════════════════════════════════════
   BRAND TOKENS  (from logo exactly)
   AB blue  : #2879bf   Rwanda grey : #647080
   Globe hi : #aad4f2   Globe deep  : #003d70
══════════════════════════════════════════════ */
const B  = '#2879bf'
const BD = '#003d70'
const BM = '#1a5c96'
const GL = '#aad4f2'

/* ── Animated mesh background ── */
function MeshBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Base gradient */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(145deg, ${BD} 0%, #061e3c 40%, #020e1e 100%)` }} />
      {/* Radial light sources */}
      <div style={{ position: 'absolute', top: '-20%', left: '-5%',  width: '70vw', height: '70vw', borderRadius: '50%', background: `radial-gradient(circle, rgba(40,121,191,0.28) 0%, transparent 65%)` }} />
      <div style={{ position: 'absolute', top: '30%',  right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: `radial-gradient(circle, rgba(170,212,242,0.10) 0%, transparent 65%)` }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '30%', width: '40vw', height: '40vw', borderRadius: '50%', background: `radial-gradient(circle, rgba(26,92,150,0.20) 0%, transparent 65%)` }} />
      {/* Fine grid */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(170,212,242,1) 1px, transparent 1px), linear-gradient(90deg, rgba(170,212,242,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      {/* Diagonal lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03 }} preserveAspectRatio="none">
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={`${i * 15}%`} y1="0" x2={`${i * 15 + 40}%`} y2="100%" stroke={GL} strokeWidth="1" />
        ))}
      </svg>
    </div>
  )
}

/* ── Floating debit card ── */
function DebitCard3D({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      width: 320, height: 190,
      borderRadius: 20,
      background: `linear-gradient(135deg, ${BD} 0%, ${BM} 45%, ${B} 100%)`,
      padding: '24px 26px',
      boxShadow: `0 40px 80px rgba(0,10,30,0.6), 0 0 0 1px rgba(170,212,242,0.12), inset 0 1px 0 rgba(255,255,255,0.1)`,
      position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      {/* Card sheen */}
      <div style={{ position: 'absolute', top: '-60%', left: '-20%', width: '60%', height: '200%', background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.07), transparent)', transform: 'rotate(20deg)', pointerEvents: 'none' }} />
      {/* Logo area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        {/* EMV chip */}
        <div style={{ width: 38, height: 28, borderRadius: 5, background: 'linear-gradient(135deg, #c8a84a, #e8c870)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 26, height: 18, borderRadius: 3, border: '1px solid rgba(0,0,0,0.15)', background: 'linear-gradient(135deg, #d4af55, #f0d080)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: 3 }}>
            {[0,1,2,3].map(i => <div key={i} style={{ background: 'rgba(0,0,0,0.12)', borderRadius: 1 }} />)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: '#fff', fontSize: 15, letterSpacing: '0.04em' }}>AB</div>
          <div style={{ fontSize: 8, color: GL, letterSpacing: '0.12em', fontWeight: 600 }}>RWANDA</div>
        </div>
      </div>
      {/* Card number */}
      <div style={{ fontSize: 14, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.85)', fontWeight: 700, marginBottom: 18, fontFamily: 'monospace' }}>
        •••• &nbsp;&nbsp;•••• &nbsp;&nbsp;•••• &nbsp;&nbsp;4821
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: 2 }}>CARD HOLDER</div>
          <div style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>Marie Claire Uwase</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: 2 }}>EXPIRES</div>
          <div style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>09 / 30</div>
        </div>
        <div style={{ fontStyle: 'italic', fontWeight: 900, color: 'rgba(255,255,255,0.9)', fontSize: 20 }}>VISA</div>
      </div>
    </div>
  )
}

/* ── Balance widget ── */
function BalanceWidget({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      width: 220,
      background: 'rgba(255,255,255,0.06)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(170,212,242,0.18)',
      borderRadius: 18, padding: '18px 20px',
      boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `rgba(40,121,191,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconTrendUp size={15} color={GL} />
        </div>
        <div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.08em' }}>SAVINGS BALANCE</div>
          <div style={{ fontSize: 9, color: '#4ade80', fontWeight: 700 }}>↑ 8.2% this month</div>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '-0.01em' }}>
        RWF 482,500
      </div>
      <div style={{ height: 44, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
        {[0.4, 0.6, 0.5, 0.8, 0.7, 1.0, 0.9].map((h, i) => (
          <div key={i} style={{ flex: 1, borderRadius: 3, height: `${h * 100}%`, background: i === 5 ? B : `rgba(40,121,191,0.3)`, transition: 'height 0.3s' }} />
        ))}
      </div>
    </div>
  )
}

/* ── Transaction notification ── */
function TxNotif({ icon, label, amount, positive, style }: { icon: React.ReactNode; label: string; amount: string; positive: boolean; style?: React.CSSProperties }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(170,212,242,0.12)',
      borderRadius: 14, padding: '12px 16px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
      minWidth: 220,
      ...style,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: positive ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Just now</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, color: positive ? '#4ade80' : '#f87171' }}>{amount}</div>
    </div>
  )
}

/* ── 3D right panel scene ── */
function Scene3D({ mouse }: { mouse: { x: number; y: number } }) {
  const rx = (mouse.y - 0.5) * -8
  const ry = (mouse.x - 0.5) * 12

  return (
    <div style={{ position: 'relative', height: 560, perspective: 1400, perspectiveOrigin: '50% 50%' }}>
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
        transition: 'transform 0.12s ease-out',
      }}>

        {/* ── Debit card — main focal point ── */}
        <div style={{ position: 'absolute', top: 40, left: '5%', animation: 'float3d-1 7s ease-in-out infinite', transformStyle: 'preserve-3d' }}>
          <DebitCard3D />
          {/* Card shadow plane */}
          <div style={{ position: 'absolute', bottom: -30, left: '10%', width: '80%', height: 20, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(40,121,191,0.3) 0%, transparent 70%)', filter: 'blur(8px)', transform: 'translateZ(-20px)' }} />
        </div>

        {/* ── Balance widget ── */}
        <div style={{ position: 'absolute', bottom: 100, left: '8%', animation: 'float3d-3 8s ease-in-out 1s infinite', transformStyle: 'preserve-3d' }}>
          <BalanceWidget />
        </div>

        {/* ── Transaction notifications ── */}
        <div style={{ position: 'absolute', top: 30, right: '2%', animation: 'float3d-2 6s ease-in-out 0.5s infinite', transformStyle: 'preserve-3d' }}>
          <TxNotif icon={<IconCheckCircle size={16} color="#4ade80" />} label="Salary Received" amount="+450,000" positive={true} />
        </div>
        <div style={{ position: 'absolute', top: 120, right: '2%', animation: 'float3d-2 6s ease-in-out 1.5s infinite', transformStyle: 'preserve-3d' }}>
          <TxNotif icon={<IconMobile size={16} color="#f87171" />} label="eKash Transfer" amount="-25,000" positive={false} />
        </div>
        <div style={{ position: 'absolute', bottom: 80, right: '2%', animation: 'float3d-2 7s ease-in-out 2s infinite', transformStyle: 'preserve-3d' }}>
          <TxNotif icon={<IconShield size={16} color="#a78bfa" />} label="Insurance Premium" amount="-4,500" positive={false} />
        </div>

        {/* ── eKash badge ── */}
        <div style={{
          position: 'absolute', top: 80, right: '30%',
          background: `linear-gradient(135deg, ${B}, ${BD})`,
          border: `1px solid rgba(170,212,242,0.2)`,
          borderRadius: 16, padding: '14px 18px',
          boxShadow: `0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(170,212,242,0.1)`,
          textAlign: 'center',
          animation: 'float3d-1 5s ease-in-out 0.3s infinite',
          transformStyle: 'preserve-3d',
        }}>
          <div style={{ marginBottom: 6 }}><IconMobile size={28} color="#fff" /></div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>*540#</div>
          <div style={{ fontSize: 8, color: GL, fontWeight: 700, letterSpacing: '0.1em', marginTop: 3 }}>EKASH</div>
        </div>

        {/* ── Decorative floating orbs ── */}
        {[
          { size: 6, top: '20%', left: '55%', delay: '0s', col: GL },
          { size: 4, top: '60%', left: '70%', delay: '1s', col: '#fff' },
          { size: 8, top: '75%', left: '40%', delay: '2s', col: B },
          { size: 5, top: '15%', left: '80%', delay: '0.5s', col: GL },
        ].map((o, i) => (
          <div key={i} style={{
            position: 'absolute', top: o.top, left: o.left,
            width: o.size, height: o.size, borderRadius: '50%',
            background: o.col, opacity: 0.5,
            animation: `floatY ${4 + i}s ease-in-out ${o.delay} infinite`,
          }} />
        ))}

        {/* ── Decorative rings ── */}
        {[200, 320, 440].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '35%',
            transform: 'translate(-50%, -50%)',
            width: s, height: s, borderRadius: '50%',
            border: `1px solid rgba(170,212,242,${0.07 - i * 0.02})`,
            pointerEvents: 'none',
          }} />
        ))}
      </div>
    </div>
  )
}

/* ── Quick access bar ── */
const quickLinks = [
  { label: 'Find Branch',  Icon: IconMapPin },
  { label: 'Calculate',    Icon: IconCalculator },
  { label: 'FX Rates',     Icon: IconExchange },
  { label: 'Apply Online', Icon: IconPen },
  { label: 'eKash',        Icon: IconMobile },
  { label: 'Insurance',    Icon: IconShield },
]

/* ── Count-up ── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect()
      let cur = 0; const step = to / (1100 / 16)
      const id = setInterval(() => { cur += step; if (cur >= to) { setVal(to); clearInterval(id) } else setVal(Math.floor(cur)) }, 16)
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to])
  return <span ref={ref}>{val}{suffix}</span>
}

export default function Hero() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const sectionRef = useRef<HTMLElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const r = sectionRef.current?.getBoundingClientRect(); if (!r) return
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
  }, [])

  return (
    <section ref={sectionRef} onMouseMove={onMouseMove} style={{
      position: 'relative', minHeight: '100vh',
      paddingTop: 112, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <MeshBg />

      {/* ── Main 2-col grid ── */}
      <div style={{
        position: 'relative', zIndex: 2, flex: 1,
        maxWidth: 1280, margin: '0 auto', width: '100%',
        padding: '48px 32px 80px',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 40, alignItems: 'center',
      }}>

        {/* ── LEFT: copy ── */}
        <div>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(40,121,191,0.18)', border: `1px solid rgba(170,212,242,0.25)`,
            borderRadius: 100, padding: '6px 18px', marginBottom: 30,
            animation: 'fadeUp 0.6s ease both',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: GL, display: 'block', animation: 'blink 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: GL, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Member of Access Group</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(42px, 5.5vw, 74px)',
            fontWeight: 700, lineHeight: 1.04,
            color: '#ffffff', margin: '0 0 6px',
            letterSpacing: '-0.025em',
            animation: 'fadeUp 0.7s ease 0.1s both',
          }}>Banking Built</h1>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(42px, 5.5vw, 74px)',
            fontWeight: 700, lineHeight: 1.04,
            margin: '0 0 6px', letterSpacing: '-0.025em',
            backgroundImage: `linear-gradient(100deg, ${GL} 0%, #fff 50%, ${GL} 100%)`,
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            animation: 'fadeUp 0.7s ease 0.15s both, shimmer 4s linear 1s infinite',
          } as React.CSSProperties}>for Rwanda</h1>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(42px, 5.5vw, 74px)',
            fontWeight: 700, lineHeight: 1.04,
            color: 'rgba(255,255,255,0.75)', margin: '0 0 28px',
            letterSpacing: '-0.025em',
            animation: 'fadeUp 0.7s ease 0.2s both',
          }}>& Beyond</h1>

          <p style={{
            fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.78,
            maxWidth: 430, marginBottom: 44,
            animation: 'fadeUp 0.7s ease 0.3s both',
          }}>
            Responsible, inclusive financial services for entrepreneurs, families, and businesses — accessible from any branch or by dialling <strong style={{ color: GL }}>*540#</strong>.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 52, animation: 'fadeUp 0.7s ease 0.4s both' } as React.CSSProperties}>
            <a href="#products" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#ffffff', color: BD,
              padding: '15px 32px', borderRadius: 10,
              fontWeight: 800, fontSize: 15, textDecoration: 'none',
              boxShadow: '0 6px 30px rgba(0,0,0,0.25)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.35)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = '0 6px 30px rgba(0,0,0,0.25)' }}
            >
              Open an Account
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke={BD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a href="#products" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: `2px solid rgba(170,212,242,0.4)`, color: GL,
              padding: '15px 32px', borderRadius: 10,
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
              background: 'rgba(170,212,242,0.06)',
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(170,212,242,0.7)'; el.style.background = 'rgba(170,212,242,0.12)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(170,212,242,0.4)'; el.style.background = 'rgba(170,212,242,0.06)' }}
            >
              Explore Products
            </a>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(170,212,242,0.12)',
            borderRadius: 16, overflow: 'hidden',
            backdropFilter: 'blur(12px)',
            animation: 'fadeUp 0.7s ease 0.5s both',
          } as React.CSSProperties}>
            {[
              { v: 47,  s: '+',   l: 'Branches' },
              { v: 200, s: 'K+',  l: 'Customers' },
              { v: 9,   s: '+',   l: 'Years' },
              { v: 15,  s: '+',   l: 'Products' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '18px 12px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(170,212,242,0.08)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 4 }}>
                  <Counter to={s.v} suffix={s.s} />
                </div>
                <div style={{ fontSize: 10, color: 'rgba(170,212,242,0.5)', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: 3D scene ── */}
        <div style={{ animation: 'fadeUp 0.9s ease 0.3s both' } as React.CSSProperties}>
          <Scene3D mouse={mouse} />
        </div>
      </div>

      {/* ── Quick access strip ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        borderTop: '1px solid rgba(170,212,242,0.10)',
        background: 'rgba(0,0,0,0.25)',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'stretch' }}>
          {quickLinks.map((q, i) => (
            <a key={i} href="#products" style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '18px 8px', textDecoration: 'none',
              borderRight: i < quickLinks.length - 1 ? '1px solid rgba(170,212,242,0.08)' : 'none',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(40,121,191,0.15)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
              <q.Icon size={18} color={GL} strokeWidth={1.75} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.03em' }}>{q.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
