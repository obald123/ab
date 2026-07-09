import { useEffect, useRef, useState, useCallback } from 'react'
import { IconBuilding, IconCalendar, IconMap, IconCoin, IconBank, IconMapPin, IconMobile, IconCpu, IconZap, IconLeaf } from './Icons'

/* ── data ── */
const timeline = [
  {
    year: '2014', quarter: 'Q1', category: 'Founded', CategoryIcon: IconBank,
    headline: 'Born in Nyamirambo',
    text: 'AB Rwanda opens its doors in Kigali, establishing three branches in Nyamirambo, Nyarugenge and Gisozi — bringing accessible credit to micro-entrepreneurs from day one.',
    stat: '3', statLabel: 'Branches', highlight: true,
  },
  {
    year: '2015', quarter: 'Q2', category: 'Expansion', CategoryIcon: IconMapPin,
    headline: 'Kimironko Opens',
    text: 'The fourth branch launches in Kimironko, extending the AB Rwanda network across the eastern corridor of Kigali.',
    stat: '4', statLabel: 'Branches', highlight: false,
  },
  {
    year: '2016', quarter: 'Q3', category: 'Growth', CategoryIcon: IconMap,
    headline: 'First Upcountry Step',
    text: "Musanze branch marks the bank's first expansion beyond Kigali — taking responsible financial services to the Northern Province.",
    stat: '5', statLabel: 'Provinces', highlight: false,
  },
  {
    year: '2018', quarter: 'Q2', category: 'Network', CategoryIcon: IconBuilding,
    headline: 'Nationwide Reach',
    text: 'Nyabugogo flagship branch plus three rural credit outlets. AB Rwanda now spans multiple provinces serving thousands of entrepreneurs.',
    stat: '9', statLabel: 'Outlets', highlight: true,
  },
  {
    year: '2019', quarter: 'Q1', category: 'Rural', CategoryIcon: IconLeaf,
    headline: 'Into the Heartland',
    text: 'Credit outlets open in Nyagatare, Gicumbi and Huye — reaching rural entrepreneurs and agri-businesses across the Eastern, Northern and Southern Provinces.',
    stat: '12', statLabel: 'Outlets', highlight: false,
  },
  {
    year: '2020', quarter: 'Q3', category: 'Digital', CategoryIcon: IconMobile,
    headline: 'AB IBAKWE Goes Live',
    text: 'Eight more outlets nationwide and the launch of AB IBAKWE with MTN Rwanda — push and pull funds via *182*4# anytime.',
    stat: '*182*4#', statLabel: 'USSD Code', highlight: false,
  },
  {
    year: '2021', quarter: 'Q2', category: 'Innovation', CategoryIcon: IconCpu,
    headline: 'AI & Contact Centre',
    text: 'A dedicated customer contact centre launches alongside AI-powered chatbot solutions, raising service standards dramatically.',
    stat: '24/7', statLabel: 'Support', highlight: true,
  },
  {
    year: '2023', quarter: 'Q1', category: 'Digital', CategoryIcon: IconZap,
    headline: 'E-kash Platform Launches',
    text: 'The E-kash digital payment platform goes live across all MNOs and partner banks in Rwanda — accessible via *540# on any handset.',
    stat: '*540#', statLabel: 'eKash', highlight: false,
  },
]

const management = [
  { initials: 'ZR', name: 'Zachary Raymond', role: 'Chief Executive Officer', detail: 'MBA · University of Cape Town', color: '#003d70' },
  { initials: 'JN', name: 'Joas Ndikumana', role: 'Chief Business Officer', detail: 'With AB Rwanda since 2013', color: '#2879bf' },
  { initials: 'CK', name: 'Celestin Karera', role: 'Chief Finance Officer', detail: 'Masters · Jomo Kenyatta University', color: '#3a8fd0' },
  { initials: 'JB', name: 'Joselyne Bivugire', role: 'Chief Risk Officer', detail: 'Certified Microfinance Expert', color: '#1a7ab5' },
]

const shareholders = [
  { name: 'AccessHolding', abbr: 'AH', color: '#003d70', desc: 'Majority shareholder — public-private partnership specialising in early-stage microfinance institutions globally.' },
  { name: 'KFW Development Bank', abbr: 'KFW', color: '#2879bf', desc: 'German federal promotional bank financing development in emerging markets.' },
  { name: 'IFC (World Bank Group)', abbr: 'IFC', color: '#3a8fd0', desc: 'Private sector arm of the World Bank focused on sustainable growth in developing countries.' },
]

/* ── reveal ── */
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.opacity = '0'; el.style.transform = 'translateY(30px)'
    el.style.transition = `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}
function R({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return <div ref={useReveal(delay)} style={style}>{children}</div>
}

/* ── animated counter ── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      obs.disconnect()
      let start = 0; const step = target / 55
      const iv = setInterval(() => {
        start = Math.min(start + step, target)
        setVal(Math.round(start))
        if (start >= target) clearInterval(iv)
      }, 20)
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ── 3D tilt hook ── */
function use3DTilt(strength = 12) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * strength}deg) rotateX(${y * -strength}deg) translateZ(10px)`
  }, [strength])
  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return
    el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
  }, [])
  return { ref, onMove, onLeave }
}

/* ── floating 3D orbs canvas ── */
function OrbCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize, { passive: true })

    type Orb = { x: number; y: number; r: number; vx: number; vy: number; phase: number; opacity: number }
    const orbs: Orb[] = Array.from({ length: 18 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 60 + Math.random() * 120,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.03 + Math.random() * 0.06,
    }))

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const orb of orbs) {
        orb.x += orb.vx; orb.y += orb.vy
        if (orb.x < -orb.r) orb.x = canvas.width + orb.r
        if (orb.x > canvas.width + orb.r) orb.x = -orb.r
        if (orb.y < -orb.r) orb.y = canvas.height + orb.r
        if (orb.y > canvas.height + orb.r) orb.y = -orb.r
        const pulse = Math.sin(t * 0.001 + orb.phase) * 0.3 + 0.7
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r * pulse)
        g.addColorStop(0, `rgba(170,212,242,${orb.opacity * 2})`)
        g.addColorStop(0.5, `rgba(40,121,191,${orb.opacity})`)
        g.addColorStop(1, `rgba(40,121,191,0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(orb.x, orb.y, orb.r * pulse, 0, Math.PI * 2); ctx.fill()
      }
      raf = requestAnimationFrame(tt => draw(tt))
    }
    draw(0)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
}

/* ── 3D floating card (timeline) ── */
function TimelineCard({ item, index }: { item: typeof timeline[0]; index: number }) {
  const { ref, onMove, onLeave } = use3DTilt(8)
  return (
    <R delay={index * 70}>
      <div className="about-timeline-card" style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 0, marginBottom: 6 }}>
        {/* Node column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 26 }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%', zIndex: 1,
            background: item.highlight
              ? 'linear-gradient(135deg, #aad4f2, #2879bf)'
              : '#ffffff',
            border: `3px solid ${item.highlight ? '#aad4f2' : '#2879bf'}`,
            boxShadow: item.highlight
              ? '0 0 0 6px rgba(40,121,191,0.18), 0 4px 16px rgba(40,121,191,0.4)'
              : '0 0 0 4px rgba(40,121,191,0.1)',
            flexShrink: 0,
          }} />
        </div>

        {/* Card */}
        <div style={{ paddingLeft: 24, paddingBottom: 28 }}>
          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 10.5, fontWeight: 900, color: '#2879bf', letterSpacing: '0.14em' }}>
              {item.year} · {item.quarter}
            </span>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(40,121,191,0.07)', border: '1px solid rgba(40,121,191,0.14)',
              borderRadius: 100, padding: '2px 10px',
              fontSize: 10, fontWeight: 800, color: '#2879bf', letterSpacing: '0.08em',
            }}>
              <item.CategoryIcon size={11} color="#2879bf" strokeWidth={2.2} /> {item.category}
            </div>
          </div>

          {/* 3D card */}
          <div
            ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
              borderRadius: 20, cursor: 'default',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              background: item.highlight
                ? 'linear-gradient(145deg, #021e3c 0%, #003d70 35%, #2879bf 65%, #3a8fd0 100%)'
                : '#ffffff',
              border: item.highlight
                ? '1px solid rgba(170,212,242,0.18)'
                : '1.5px solid rgba(40,121,191,0.1)',
              borderRadius: 20,
              padding: '26px 28px',
              boxShadow: item.highlight
                ? '0 16px 48px rgba(40,121,191,0.28), inset 0 1px 0 rgba(255,255,255,0.08)'
                : '0 6px 28px rgba(40,121,191,0.07), inset 0 1px 0 rgba(255,255,255,0.8)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Diagonal shine */}
              <div style={{
                position: 'absolute', top: '-60%', right: '-10%',
                width: '55%', height: '220%',
                background: `linear-gradient(105deg, transparent, rgba(255,255,255,${item.highlight ? 0.05 : 0.4}), transparent)`,
                transform: 'rotate(10deg)', pointerEvents: 'none',
              }} />

              {/* Dot grid */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `radial-gradient(${item.highlight ? 'rgba(255,255,255,0.05)' : 'rgba(40,121,191,0.04)'} 1px, transparent 1px)`,
                backgroundSize: '22px 22px', pointerEvents: 'none',
              }} />

              {/* Watermark year */}
              <div style={{
                position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)',
                fontSize: 68, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em',
                color: item.highlight ? 'rgba(170,212,242,0.08)' : 'rgba(40,121,191,0.05)',
                userSelect: 'none', pointerEvents: 'none',
              }}>
                {item.year}
              </div>

              <div style={{ position: 'relative', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: 19, fontWeight: 900, letterSpacing: '-0.015em', lineHeight: 1.2,
                    color: item.highlight ? '#ffffff' : '#003d70',
                    marginBottom: 9,
                  }}>
                    {item.headline}
                  </h3>
                  <p style={{
                    fontSize: 14, lineHeight: 1.75, margin: 0,
                    color: item.highlight ? 'rgba(255,255,255,0.68)' : '#647080',
                  }}>
                    {item.text}
                  </p>
                </div>

                {/* 3D stat cube */}
                <div style={{
                  flexShrink: 0, minWidth: 76, textAlign: 'center',
                  padding: '14px 16px', borderRadius: 14,
                  background: item.highlight ? 'rgba(255,255,255,0.1)' : 'rgba(40,121,191,0.06)',
                  border: `1px solid ${item.highlight ? 'rgba(255,255,255,0.18)' : 'rgba(40,121,191,0.12)'}`,
                  boxShadow: item.highlight
                    ? 'inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 12px rgba(0,0,0,0.2)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 12px rgba(40,121,191,0.06)',
                  transform: 'translateZ(16px)',
                }}>
                  <div style={{
                    fontSize: 16, fontWeight: 900, lineHeight: 1.1,
                    color: item.highlight ? '#aad4f2' : '#2879bf',
                    letterSpacing: '-0.01em',
                  }}>
                    {item.stat}
                  </div>
                  <div style={{
                    fontSize: 9, fontWeight: 700, marginTop: 3,
                    color: item.highlight ? 'rgba(170,212,242,0.6)' : 'rgba(40,121,191,0.5)',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}>
                    {item.statLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </R>
  )
}

/* ── 3D management card ── */
function ManagementCard({ m, i }: { m: typeof management[0]; i: number }) {
  const { ref, onMove, onLeave } = use3DTilt(14)
  return (
    <R delay={i * 90}>
      <div
        ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
          borderRadius: 22, cursor: 'default',
        }}
      >
        <div style={{
          background: '#ffffff', border: '1.5px solid rgba(40,121,191,0.1)',
          borderRadius: 22, padding: '32px 22px 28px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 6px 28px rgba(40,121,191,0.08), inset 0 1px 0 rgba(255,255,255,1)',
        }}>
          {/* Top gradient bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 4,
            background: `linear-gradient(90deg, ${m.color}, #3a8fd0)`,
            borderRadius: '22px 22px 0 0',
          }} />
          {/* Dot grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(40,121,191,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px', pointerEvents: 'none',
          }} />

          {/* Avatar — floats forward on z-axis */}
          <div style={{ transform: 'translateZ(24px)', marginBottom: 16, position: 'relative' }}>
            <div style={{
              width: 68, height: 68, borderRadius: '50%',
              background: `linear-gradient(145deg, ${m.color}, #3a8fd0)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto',
              fontSize: 19, fontWeight: 900, color: '#ffffff',
              boxShadow: `0 12px 32px ${m.color}55, 0 4px 8px rgba(0,0,0,0.15)`,
            }}>
              {m.initials}
            </div>
            {/* Ring glow */}
            <div style={{
              position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)',
              width: 76, height: 76, borderRadius: '50%',
              border: `2px solid ${m.color}33`,
            }} />
          </div>

          <div style={{ position: 'relative', transform: 'translateZ(8px)' }}>
            <p style={{ fontWeight: 900, fontSize: 15, color: '#003d70', marginBottom: 5, lineHeight: 1.25 }}>{m.name}</p>
            <p style={{ fontSize: 10.5, color: m.color, fontWeight: 800, marginBottom: 8, letterSpacing: '0.05em' }}>{m.role}</p>
            <div style={{
              display: 'inline-block', background: 'rgba(40,121,191,0.06)',
              border: '1px solid rgba(40,121,191,0.1)', borderRadius: 100,
              padding: '3px 10px', fontSize: 11, color: '#647080',
            }}>
              {m.detail}
            </div>
          </div>
        </div>
      </div>
    </R>
  )
}

/* ── 3D shareholder card ── */
function ShareholderCard({ s, i }: { s: typeof shareholders[0]; i: number }) {
  const { ref, onMove, onLeave } = use3DTilt(10)
  return (
    <R delay={i * 100}>
      <div
        ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
          borderRadius: 22, cursor: 'default',
        }}
      >
        <div style={{
          background: 'linear-gradient(160deg, #f8fbfe 0%, #ffffff 100%)',
          border: '1.5px solid rgba(40,121,191,0.1)',
          borderRadius: 22, padding: '36px 32px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(40,121,191,0.07), inset 0 1px 0 rgba(255,255,255,1)',
        }}>
          {/* Corner watermark */}
          <div style={{
            position: 'absolute', right: 16, bottom: 12,
            fontSize: 56, fontWeight: 900, letterSpacing: '-0.03em',
            color: `${s.color}0a`, userSelect: 'none', lineHeight: 1,
          }}>
            {s.abbr}
          </div>
          {/* Side accent bar */}
          <div style={{
            position: 'absolute', left: 0, top: 20, bottom: 20, width: 4,
            background: `linear-gradient(180deg, ${s.color}, #3a8fd0)`,
            borderRadius: '0 4px 4px 0',
          }} />

          {/* Icon cube — floats forward */}
          <div style={{ transform: 'translateZ(20px)', marginBottom: 20, position: 'relative', display: 'inline-block' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: `linear-gradient(145deg, ${s.color}, #3a8fd0)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 10px 28px ${s.color}44, 0 4px 8px rgba(0,0,0,0.1)`,
            }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>{s.abbr}</span>
            </div>
            {/* Shadow plane */}
            <div style={{
              position: 'absolute', bottom: -6, left: '10%', right: '10%', height: 8,
              background: `${s.color}28`, borderRadius: '50%',
              filter: 'blur(6px)',
            }} />
          </div>

          <div style={{ position: 'relative', transform: 'translateZ(8px)' }}>
            <p style={{ fontWeight: 900, fontSize: 16.5, color: '#003d70', marginBottom: 10, lineHeight: 1.25 }}>
              {s.name}
            </p>
            <p style={{ fontSize: 14, color: '#647080', lineHeight: 1.72, margin: 0 }}>
              {s.desc}
            </p>
          </div>
        </div>
      </div>
    </R>
  )
}

/* ── main component ── */
export default function About() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  const onHeroMouse = (e: React.MouseEvent) => {
    const el = heroRef.current; if (!el) return
    const r = el.getBoundingClientRect()
    setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height })
  }

  return (
    <section id="about" style={{ background: '#ffffff', overflow: 'hidden' }}>

      {/* ─── Vision / Mission ─── */}
      <div
        ref={heroRef} onMouseMove={onHeroMouse}
        style={{
          background: 'linear-gradient(135deg, #021e3c 0%, #003d70 40%, #2879bf 70%, #3a8fd0 100%)',
          padding: '88px 0 110px', position: 'relative', overflow: 'hidden',
          clipPath: 'polygon(0 0, 100% 0, 100% 94%, 0 100%)',
        }}
      >
        <OrbCanvas />

        {/* Parallax ring reacting to mouse */}
        {[520, 380, 250].map((size, i) => (
          <div key={size} style={{
            position: 'absolute',
            right: `${-size * 0.18 + (mousePos.x - 0.5) * (i + 1) * 18}px`,
            top: `${-size * 0.18 + (mousePos.y - 0.5) * (i + 1) * 12}px`,
            width: size, height: size, borderRadius: '50%',
            border: `1px solid rgba(170,212,242,${0.06 + i * 0.02})`,
            pointerEvents: 'none',
            transition: 'right 0.4s ease, top 0.4s ease',
          }} />
        ))}

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', position: 'relative' }}>
          <R>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="section-pill" style={{
                background: 'rgba(170,212,242,0.12)', border: '1.5px solid rgba(170,212,242,0.25)', color: '#aad4f2',
              }}>
                Who We Are
              </span>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 700, fontSize: 'clamp(30px, 4.5vw, 54px)',
                color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.01em',
              }}>
                Improving Financial Access<br />
                <span style={{ color: '#aad4f2' }}>Across All of Rwanda</span>
              </h2>
            </div>
          </R>

          {/* Vision/Mission 3D cards */}
          <div className="about-vm" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 36 }}>
            {[
              { label: 'VISION', icon: '◈', text: 'To be the leading provider of financial services to micro, small, and medium entrepreneurs and their families in Rwanda.' },
              { label: 'MISSION', icon: '◉', text: 'Improve access to broad financial services for the majority of Rwandan businesses in a sustainable, efficient manner.' },
            ].map((item, i) => {
              const { ref, onMove, onLeave } = use3DTilt(6)
              return (
                <R key={item.label} delay={i * 120}>
                  <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out', borderRadius: 22 }}>
                    <div className="about-vm-card" style={{
                      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(170,212,242,0.16)',
                      borderRadius: 22, padding: '38px 40px', backdropFilter: 'blur(16px)',
                      position: 'relative', overflow: 'hidden',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 48px rgba(0,0,0,0.15)',
                    }}>
                      <div style={{
                        position: 'absolute', bottom: -14, right: -10,
                        fontSize: 96, opacity: 0.04, userSelect: 'none', lineHeight: 1, color: '#aad4f2',
                      }}>
                        {item.icon}
                      </div>
                      <div style={{ transform: 'translateZ(20px)', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: 10,
                            background: 'rgba(170,212,242,0.15)', border: '1px solid rgba(170,212,242,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 16, color: '#aad4f2',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          }}>
                            {item.icon}
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', color: '#aad4f2' }}>
                            {item.label}
                          </span>
                        </div>
                        <p style={{ fontSize: 16.5, lineHeight: 1.8, color: 'rgba(255,255,255,0.78)', margin: 0 }}>
                          {item.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </R>
              )
            })}
          </div>

          {/* Photo + copy */}
          <R delay={200}>
            <div className="about-photo-copy" style={{
              display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 0,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(170,212,242,0.12)',
              borderRadius: 22, overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}>
              <div style={{ position: 'relative', minHeight: 280 }}>
                <img
                  src="https://images.unsplash.com/photo-1687422808311-a776f467a468?w=700&h=500&fit=crop&auto=format"
                  alt="AB Rwanda customer"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', inset: 0 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 55%, rgba(2,30,60,0.75) 100%)' }} />
              </div>
              <div className="about-photo-copy-content" style={{ padding: '40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <p style={{ fontSize: 15.5, lineHeight: 1.85, color: 'rgba(255,255,255,0.7)', marginBottom: 18 }}>
                  Established in 2014 and headquartered on Nyarugenge Avenue, Kigali, AB Rwanda Plc has grown from a single branch in Nyamirambo to a nationwide network of <strong style={{ color: '#aad4f2' }}>47+ branches</strong> and rural credit outlets spanning all five provinces.
                </p>
                <p style={{ fontSize: 15.5, lineHeight: 1.85, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                  Regulated by the National Bank of Rwanda and backed by AccessHolding, KFW and IFC, we are committed to Rwanda's financial inclusion agenda.
                </p>
              </div>
            </div>
          </R>
        </div>
      </div>

      {/* ─── JOURNEY ─── */}
      <div style={{ background: '#f8fbfe', padding: '0 0 110px', marginTop: -2, position: 'relative', overflow: 'hidden' }}>

        {/* Subtle background grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(40,121,191,0.04) 1px, transparent 1px)',
          backgroundSize: '36px 36px', pointerEvents: 'none',
        }} />

        {/* Journey header — full bleed dark 3D panel */}
        <div className="about-journey-header" style={{
          background: 'linear-gradient(160deg, #001e38 0%, #021e3c 30%, #003d70 60%, #2879bf 90%)',
          padding: '72px 28px 88px', position: 'relative', overflow: 'hidden',
          marginBottom: 72,
          clipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 100%)',
        }}>
          <OrbCanvas />

          {/* Giant watermark */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(70px, 13vw, 150px)', fontWeight: 900,
            color: 'rgba(170,212,242,0.04)', whiteSpace: 'nowrap', letterSpacing: '-0.04em',
            userSelect: 'none', pointerEvents: 'none', lineHeight: 1,
          }}>
            2014 → 2023
          </div>

          {/* Floating 3D accent squares */}
          {[['-8%', '10%', 48, 18, 0.06], ['85%', '15%', 32, 24, 0.04], ['75%', '70%', 56, 12, 0.05]].map(([left, top, size, rot, op], i) => (
            <div key={i} style={{
              position: 'absolute', left: left as string, top: top as string,
              width: size as number, height: size as number,
              border: '2px solid rgba(170,212,242,0.2)',
              borderRadius: 8,
              transform: `rotate(${rot}deg) perspective(400px) rotateX(35deg)`,
              opacity: op as number,
              animation: `floatY ${5 + i}s ease-in-out ${i}s infinite`,
              pointerEvents: 'none',
            }} />
          ))}

          <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
            <R>
              <span className="section-pill" style={{
                background: 'rgba(170,212,242,0.1)', border: '1.5px solid rgba(170,212,242,0.22)', color: '#aad4f2',
              }}>
                Our Journey
              </span>
              <h2 style={{
                fontWeight: 900, fontSize: 'clamp(34px, 5.5vw, 68px)',
                color: '#ffffff', lineHeight: 1.04, letterSpacing: '-0.03em', marginBottom: 18,
              }}>
                A Decade of<br />
                <span style={{ color: '#aad4f2' }}>Growth & Impact</span>
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(170,212,242,0.58)', maxWidth: 480, lineHeight: 1.75, marginBottom: 48 }}>
                From a single branch in Nyamirambo to a nationwide network — nine years of expanding financial access.
              </p>
            </R>

            {/* 3D stat blocks */}
            <R delay={140}>
            <div className="about-stat-blocks" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                  { value: 47, suffix: '+', label: 'Branches & Outlets', Icon: IconBuilding },
                  { value: 9, suffix: ' yrs', label: 'Years Operating', Icon: IconCalendar },
                  { value: 5, suffix: '', label: 'Provinces Covered', Icon: IconMap },
                  { value: 3, suffix: '', label: 'Loan Products', Icon: IconCoin },
                ].map((s) => {
                  const { ref, onMove, onLeave } = use3DTilt(16)
                  return (
                    <div key={s.label} ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
                      style={{
                        flex: '1 1 160px',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.15s ease-out',
                        borderRadius: 18,
                      }}
                    >
                      <div style={{
                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(170,212,242,0.15)',
                        borderRadius: 18, padding: '22px 24px',
                        backdropFilter: 'blur(12px)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.2)',
                      }}>
                        <div style={{ marginBottom: 10 }}><s.Icon size={22} color="rgba(170,212,242,0.7)" strokeWidth={1.5} /></div>
                        <div style={{
                          fontSize: 38, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em',
                          color: '#ffffff', marginBottom: 6, transform: 'translateZ(10px)',
                        }}>
                          <Counter target={s.value} suffix={s.suffix} />
                        </div>
                        <div style={{ fontSize: 10.5, color: 'rgba(170,212,242,0.5)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          {s.label}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </R>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 28px', position: 'relative' }}>
          {/* Spine */}
          <div className="about-spine" style={{
            position: 'absolute', left: 64, top: 0, bottom: 60, width: 2,
            background: 'linear-gradient(180deg, #2879bf 0%, #3a8fd0 60%, rgba(40,121,191,0.1) 100%)',
          }} />

          {timeline.map((item, i) => <TimelineCard key={item.year} item={item} index={i} />)}

          {/* End cap */}
          <R delay={timeline.length * 70}>
            <div className="about-timeline-node" style={{ marginLeft: 72, marginTop: -4 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '13px 24px',
                background: 'linear-gradient(135deg, #021e3c, #003d70, #2879bf)',
                borderRadius: 100,
                boxShadow: '0 12px 32px rgba(40,121,191,0.35), inset 0 1px 0 rgba(255,255,255,0.1)',
                border: '1px solid rgba(170,212,242,0.15)',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#aad4f2', animation: 'blink 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>
                  The journey continues — 47+ branches today
                </span>
              </div>
            </div>
          </R>
        </div>
      </div>

      {/* ─── Management ─── */}
      <div style={{ background: '#ffffff', padding: '88px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(40,121,191,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px', pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px' }}>
          <R style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="section-pill">Leadership</span>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 44px)', color: '#003d70', letterSpacing: '-0.025em' }}>
              Management Team
            </h2>
          </R>
          <div className="about-management" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 }}>
            {management.map((m, i) => <ManagementCard key={m.name} m={m} i={i} />)}
          </div>
        </div>
      </div>

      {/* ─── Shareholders ─── */}
      <div style={{
        background: 'linear-gradient(180deg, #f8fbfe 0%, #ffffff 100%)',
        padding: '80px 0 100px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative large rings */}
        {[600, 420].map((size, i) => (
          <div key={size} style={{
            position: 'absolute', left: -size * 0.35, bottom: -size * 0.35,
            width: size, height: size, borderRadius: '50%',
            border: `1px solid rgba(40,121,191,${0.04 + i * 0.02})`,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px' }}>
          <R style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-pill">Ownership</span>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 44px)', color: '#003d70', letterSpacing: '-0.025em' }}>
              Our Shareholders
            </h2>
          </R>
          <div className="about-shareholders" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {shareholders.map((s, i) => <ShareholderCard key={s.name} s={s} i={i} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
