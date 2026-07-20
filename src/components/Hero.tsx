import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { IconMobile, IconMapPin, IconCalculator, IconExchange, IconPen, IconCheckCircle, IconTrendUp, IconShield } from './Icons'
import cardTop from '../imports/landing/card.png'
import cardMiddle from '../imports/landing/card (1).png'
import cardBottom from '../imports/landing/card (2).png'
import starOutline from '../imports/landing/Star 17.png'
import starFilled from '../imports/landing/Star 17 (1).png'

/* ══════════════════════════════════════════════
   BRAND TOKENS  (from logo exactly)
   AB blue  : #0ea5e9   Rwanda grey : #647080
   Globe hi : #bae6fd   Globe deep  : #0284c7
══════════════════════════════════════════════ */
const B  = '#0ea5e9'
const BD = '#0284c7'
const BM = '#1a5c96'
const GL = '#9fa8b8'
const AG = '#3ccc5f'

/* ── Animated mesh background ── */
function MeshBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Base gradient */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(145deg, #0ea5e9 0%, #0369a1 40%, #082f49 100%)` }} />
      {/* Radial light sources */}
      <div style={{ position: 'absolute', top: '-20%', left: '-5%',  width: '70vw', height: '70vw', borderRadius: '50%', background: `radial-gradient(circle, rgba(14,165,233,0.24) 0%, transparent 65%)` }} />
      <div style={{ position: 'absolute', top: '30%',  right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: `radial-gradient(circle, rgba(140,170,210,0.12) 0%, transparent 65%)` }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '30%', width: '40vw', height: '40vw', borderRadius: '50%', background: `radial-gradient(circle, rgba(120,135,160,0.18) 0%, transparent 65%)` }} />
      {/* Fine grid */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(140,170,210,1) 1px, transparent 1px), linear-gradient(90deg, rgba(140,170,210,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
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
    <div className="hero-card-3d" style={{
      width: 320, height: 190,
      borderRadius: 20,
      background: `linear-gradient(135deg, ${BD} 0%, ${BM} 45%, ${B} 100%)`,
      padding: '24px 26px',
      boxShadow: `0 40px 80px rgba(0,10,30,0.6), 0 0 0 1px rgba(140,170,210,0.12), inset 0 1px 0 rgba(255,255,255,0.1)`,
      position: 'relative', overflow: 'hidden',
      ...style,
    }}>
      {/* Card sheen */}
      <div style={{ position: 'absolute', top: '-60%', left: '-20%', width: '60%', height: '200%', background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.07), transparent)', transform: 'rotate(20deg)', pointerEvents: 'none' }} />
      {/* Logo area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        {/* EMV chip */}
        <div style={{ width: 38, height: 28, borderRadius: 5, background: 'linear-gradient(135deg, rgba(102,132,184,1), rgba(78,109,170,1))', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.24)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 26, height: 18, borderRadius: 3, border: '1px solid rgba(255,255,255,0.12)', background: 'linear-gradient(135deg, rgba(148,176,221,1), rgba(110,142,206,1))', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, padding: 3 }}>
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
      border: '1px solid rgba(140,170,210,0.18)',
      borderRadius: 18, padding: '18px 20px',
      boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `rgba(14,165,233,0.18)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconTrendUp size={15} color={BD} />
        </div>
        <div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.08em' }}>SAVINGS BALANCE</div>
          <div style={{ fontSize: 9, color: '#9fcaff', fontWeight: 700 }}>↑ 8.2% this month</div>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '-0.01em' }}>
        RWF 482,500
      </div>
      <div style={{ height: 44, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
        {[0.4, 0.6, 0.5, 0.8, 0.7, 1.0, 0.9].map((h, i) => (
          <div key={i} style={{ flex: 1, borderRadius: 3, height: `${h * 100}%`, background: i === 5 ? B : `rgba(14,165,233,0.3)`, transition: 'height 0.3s' }} />
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
      border: '1px solid rgba(186,230,253,0.12)',
      borderRadius: 14, padding: '12px 16px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
      minWidth: 220,
      ...style,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: positive ? 'rgba(14,165,233,0.15)' : 'rgba(119,137,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Just now</div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, color: positive ? '#9fcaff' : '#c5d2de' }}>{amount}</div>
    </div>
  )
}

/* ── 3D right panel scene ── */
function LandingCards({ mouse, spread, compact }: { mouse: { x: number; y: number }; spread: number; compact: boolean }) {
  const rx = (mouse.y - 0.5) * -6
  const ry = (mouse.x - 0.5) * 10
  const size = compact ? 0.95 : 1.3
  const topOffset = compact ? 14 + spread * 18 : 10 + spread * 20
  const middleOffset = compact ? 34 + spread * 30 : 30 + spread * 35
  const bottomOffset = compact ? 54 + spread * 43 : 52 + spread * 50
  const cardWidth = compact ? '94%' : '84%'
  const leftBase = compact ? 12 : 24
  const leftStep = compact ? 0 : 6
  const topStep = compact ? 0 : 2

  return (
    <div style={{
      position: 'relative', width: '100%', minHeight: compact ? 520 : 620,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: compact ? 12 : 32,
      perspective: 1400, perspectiveOrigin: '50% 50%',
      flexWrap: 'wrap',
      marginTop: 18,
    }}>
      <div style={{
        position: 'relative', width: compact ? '100%' : 'calc(55% - 16px)', minWidth: compact ? 0 : 320, minHeight: compact ? 420 : 520,
        transformStyle: 'preserve-3d',
        transform: `scale(${size}) rotateX(${rx}deg) rotateY(${ry}deg)`,
        transition: 'transform 0.12s ease-out',
      }}>
        {!compact && (
          <svg viewBox="0 0 80 520" width={8} height="100%" style={{
            position: 'absolute', top: '10%', left: '18%', bottom: '10%',
            pointerEvents: 'none', overflow: 'visible', zIndex: 6,
            filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.14))',
          }}>
            <path d="M8 10 C 14 120, 12 240, 18 360 C 26 428, 10 480, 8 510"
              fill="none"
              stroke="rgba(255,255,255,0.96)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M8 10 C 14 120, 12 240, 18 360 C 26 428, 10 480, 8 510"
              fill="none"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 16"
            />
          </svg>
        )}
        <img
          src={starOutline}
          alt="Decorative white star"
          style={{
            display: compact ? 'none' : 'block',
            position: 'absolute', top: '14%', left: '19.4%', width: 30,
            filter: 'brightness(0) invert(1)',
            opacity: 0.95,
            zIndex: 4,
          }}
        />
        <img
          src={starFilled}
          alt="Decorative white star"
          style={{
            display: compact ? 'none' : 'block',
            position: 'absolute', top: '44%', left: '19.4%', width: 26,
            filter: 'brightness(0) invert(1)',
            opacity: 0.9,
            zIndex: 4,
          }}
        />
        <img
          src={starOutline}
          alt="Decorative white star"
          style={{
            display: compact ? 'none' : 'block',
            position: 'absolute', top: '72%', left: '19.4%', width: 22,
            filter: 'brightness(0) invert(1)',
            opacity: 0.9,
            zIndex: 4,
          }}
        />
        <img
          src={cardBottom}
          alt="Bottom card stack"
          style={{
            position: 'absolute', top: `${bottomOffset}%`, left: `${leftBase + spread * leftStep}%`, width: cardWidth, height: 'auto',
            transform: `rotate(${6 + spread * 2}deg)`,
            boxShadow: '0 40px 90px rgba(0,0,0,0.35)',
            borderRadius: 28,
            filter: 'grayscale(1) brightness(1.04) contrast(1.08)',
            zIndex: 1,
          }}
        />
        <img
          src={cardMiddle}
          alt="Middle card stack"
          style={{
            position: 'absolute', top: `${middleOffset}%`, left: `${14 + spread * 6}%`, width: compact ? '92%' : '86%', height: 'auto',
            transform: `rotate(${4 + spread * 1.5}deg)`,
            boxShadow: '0 44px 88px rgba(0,0,0,0.34)',
            borderRadius: 28,
            filter: 'grayscale(1) brightness(1.06) contrast(1.1)',
            zIndex: 2,
          }}
        />
        <img
          src={cardTop}
          alt="Top card stack"
          style={{
            position: 'absolute', top: `${topOffset}%`, left: `${12 + spread * 8}%`, width: compact ? '96%' : '88%', height: 'auto',
            transform: `rotate(${2 + spread * 1}deg)`,
            boxShadow: '0 50px 96px rgba(0,0,0,0.38)',
            borderRadius: 28,
            filter: 'grayscale(1) brightness(1.08) contrast(1.12)',
            zIndex: 3,
          }}
        />
      </div>

      <img
        src={starOutline}
        alt="Decorative star"
        style={{
          display: compact ? 'none' : 'block',
          position: 'absolute', top: '12%', right: '-6%', width: 88,
          opacity: 0.75,
          animation: 'floatY 6s ease-in-out infinite',
          zIndex: 4,
        }}
      />
      <img
        src={starFilled}
        alt="Decorative star"
        style={{
          display: compact ? 'none' : 'block',
          position: 'absolute', bottom: '8%', left: '-8%', width: 80,
          opacity: 0.85,
          animation: 'floatY2 7s ease-in-out 0.5s infinite',
          zIndex: 4,
        }}
      />
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
  const [stackSpread, setStackSpread] = useState(1)
  const [lineProgress, setLineProgress] = useState(0)
  const [isCompact, setIsCompact] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return
      const progress = Math.min(Math.max(-rect.top / 220, 0), 1)
      const lineReveal = Math.min(Math.max((window.scrollY + 260 - rect.top) / (rect.height + 260), 0), 1)
      setStackSpread(0.2 + 0.8 * (1 - progress))
      setLineProgress(lineReveal)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 900px)')
    const update = () => setIsCompact(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

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
      {!isCompact && (
        <div aria-hidden="true" style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '52%',
          transform: `translateX(-50%) translateY(${lineProgress * 12}px)`,
          width: 240,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.76,
          filter: 'drop-shadow(0 0 8px rgba(14,165,233,0.04))',
          transition: 'transform 0.2s ease-out',
        }}>
          <svg viewBox="0 0 350 1400" preserveAspectRatio="none" width="100%" height="100%">
            <defs>
              <linearGradient id="hero-white-to-blue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={lineProgress < 0.3 ? '#ffffff' : `rgba(${Math.round(255 - lineProgress * 255 * 1.5)}, ${Math.round(200 - lineProgress * 100)}, 255, 0.8)`} />
                <stop offset="40%" stopColor={lineProgress < 0.5 ? '#f5fbff' : `rgba(${Math.round(180 - lineProgress * 100)}, ${Math.round(190 - lineProgress * 80)}, 255, 0.72)`} />
                <stop offset="100%" stopColor={lineProgress < 0.7 ? '#e8f4ff' : `rgba(40, 121, 191, ${0.64 + lineProgress * 0.2})`} />
              </linearGradient>
            </defs>
            <path d="M175 -20 C 320 120, 340 240, 100 360 C -80 440, -100 580, 200 720 C 340 800, 330 950, 50 1080 C -80 1150, -60 1280, 220 1380 C 300 1420, 175 1400, 175 1400"
              fill="none"
              stroke="url(#hero-white-to-blue-gradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: 'all 0.3s ease-out' }}
            />
            <path d="M175 -20 C 320 120, 340 240, 100 360 C -80 440, -100 580, 200 720 C 340 800, 330 950, 50 1080 C -80 1150, -60 1280, 220 1380 C 300 1420, 175 1400, 175 1400"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="24 20"
            />
          </svg>
        </div>
      )}

      {/* ── Main 2-col grid ── */}
      <div className="hero-grid" style={{
        position: 'relative', zIndex: 2, flex: 1,
        margin: '0 auto', width: '100%',
        padding: '48px 48px 80px',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 40, alignItems: 'center',
      }}>

        {/* ── LEFT: copy ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-200px' }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.12)', border: `1px solid rgba(186,230,253,0.24)`,
              borderRadius: 100, padding: '6px 18px', marginBottom: 24,
              boxShadow: '0 8px 24px rgba(0,0,0,0.16)',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: GL, display: 'block', animation: 'blink 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#f2f8ff', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Member of Access Group</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            viewport={{ once: true }}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(42px, 5.5vw, 74px)',
              fontWeight: 700, lineHeight: 1.04,
              color: '#ffffff', margin: '0 0 6px',
              letterSpacing: '-0.025em',
            }}
          >Banking Built</motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(42px, 5.5vw, 74px)',
              fontWeight: 700, lineHeight: 1.04,
              margin: '0 0 6px', letterSpacing: '-0.025em',
              backgroundImage: `linear-gradient(100deg, ${GL} 0%, #fff 50%, ${GL} 100%)`,
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              animation: 'shimmer 4s linear 1s infinite',
            } as React.CSSProperties}
          >for Rwanda</motion.h1>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            viewport={{ once: true }}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(42px, 5.5vw, 74px)',
              fontWeight: 700, lineHeight: 1.04,
              color: 'rgba(255,255,255,0.75)', margin: '0 0 28px',
              letterSpacing: '-0.025em',
            }}
          >& Beyond</motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            style={{
              fontSize: 17, color: 'rgba(255,255,255,0.72)', lineHeight: 1.78,
              maxWidth: 470, marginBottom: 18,
            }}
          >
            Responsible, inclusive financial services for entrepreneurs, families, and businesses — accessible from any branch or by dialling <strong style={{ color: '#ffffff' }}>*540#</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            viewport={{ once: true }}
            style={{
              display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28,
            }}
          >
            {['24/7 digital access', '47 branches', 'Fast account opening'].map((item, i) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
                viewport={{ once: true }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 12px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(186,230,253,0.16)',
                  color: '#eaf5ff', fontSize: 12, fontWeight: 700,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: GL, display: 'block' }} />
                {item}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 36 } as React.CSSProperties}
          >
            <a href="#products" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #ffffff 0%, #f2f8ff 100%)', color: BD,
              padding: '15px 30px', borderRadius: 999,
              fontWeight: 800, fontSize: 15, textDecoration: 'none',
              boxShadow: '0 12px 35px rgba(0,0,0,0.22)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-3px)'; el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.28)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ''; el.style.boxShadow = '0 12px 35px rgba(0,0,0,0.22)' }}
            >
              Open an Account
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke={BD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a href="#products" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: `1px solid rgba(186,230,253,0.34)`, color: '#f5fbff',
              padding: '15px 30px', borderRadius: 999,
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
              background: 'rgba(255,255,255,0.08)',
              transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.62)'; el.style.background = 'rgba(255,255,255,0.14)'; el.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(186,230,253,0.34)'; el.style.background = 'rgba(255,255,255,0.08)'; el.style.transform = '' }}
            >
              Explore Products
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            viewport={{ once: true }}
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(186,230,253,0.16)',
              borderRadius: 18, overflow: 'hidden',
              backdropFilter: 'blur(14px)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.16)',
            } as React.CSSProperties}
          >
            {[
              { v: 47,  s: '+',   l: 'Branches' },
              { v: 200, s: 'K+',  l: 'Customers' },
              { v: 9,   s: '+',   l: 'Years' },
              { v: 15,  s: '+',   l: 'Products' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '18px 12px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(186,230,253,0.08)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: 4 }}>
                  <Counter to={s.v} suffix={s.s} />
                </div>
                <div style={{ fontSize: 10, color: 'rgba(220,237,255,0.7)', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT: landing cards scene ── */}
        <motion.div
          className="hero-scene"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          style={{ position: 'relative', zIndex: 2 } as React.CSSProperties}
        >
          <LandingCards mouse={mouse} spread={stackSpread} compact={isCompact} />
        </motion.div>
      </div>

      {/* ── Quick access strip ── */}
      <motion.div
        className="hero-quick-links"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        style={{
          position: 'relative', zIndex: 2,
          borderTop: '1px solid rgba(140,170,210,0.10)',
          background: 'rgba(2, 10, 26, 0.32)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div style={{ margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}>
            {quickLinks.map((q, i) => (
            <motion.a
              key={i}
              href="#products"
              className="hero-quick-link"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.06 }}
              viewport={{ once: true }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '18px 8px', textDecoration: 'none', minHeight: 86,
                borderRight: i < quickLinks.length - 1 ? '1px solid rgba(140,170,210,0.08)' : 'none',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(14,165,233,0.12)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent' }}
            >
              <q.Icon size={18} color={GL} strokeWidth={1.75} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.74)', letterSpacing: '0.03em', textAlign: 'center' }}>{q.label}</span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
