import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, type MotionValue } from 'framer-motion'
import { IconBuilding, IconCalendar, IconMap, IconCoin, IconBank, IconMapPin, IconMobile, IconCpu, IconZap, IconLeaf } from './Icons'

/* ── data — sourced & paraphrased from abr.rw/who-we-are/ "Our History" ── */
const timeline = [
  {
    year: '2014', quarter: 'Q1', category: 'Founded', CategoryIcon: IconBank,
    headline: 'Born in Nyamirambo',
    text: 'AB Rwanda opens its very first branch in Nyamirambo. Before the year is out, two more branches follow in Nyarugenge and Gisozi — bringing accessible credit to micro-entrepreneurs from day one.',
    stat: '3', statLabel: 'Branches', highlight: true,
  },
  {
    year: '2015', quarter: 'Q2', category: 'Expansion', CategoryIcon: IconMapPin,
    headline: 'Kimironko Opens',
    text: 'The fourth branch launches in Kimironko, making AB Rwanda the fastest-growing microfinance bank in its segment.',
    stat: '4', statLabel: 'Branches', highlight: false,
  },
  {
    year: '2016', quarter: 'Q3', category: 'Growth', CategoryIcon: IconMap,
    headline: 'First Upcountry Branch',
    text: "Musanze branch opens as the bank's fifth and first branch outside Kigali — extending responsible financial services to the Northern Province.",
    stat: '5', statLabel: 'Branches', highlight: false,
  },
  {
    year: '2018', quarter: 'Q2', category: 'Network', CategoryIcon: IconBuilding,
    headline: 'Nyabugogo & First Outlets',
    text: 'Nyabugogo branch opens in Kigali while the original Nyamirambo branch merges into Nyarugenge. The same year, AB Rwanda opens its first three credit outlets — Muhanga, Rwamagana and Kabarondo — beginning its rural push.',
    stat: '3', statLabel: 'New Outlets', highlight: true,
  },
  {
    year: '2019', quarter: 'Q1', category: 'Rural', CategoryIcon: IconLeaf,
    headline: 'Reaching the Regions',
    text: 'Three more credit outlets open in Nyagatare, Gicumbi and Huye, bringing the network to six outlets across the Eastern, Northern and Southern Provinces.',
    stat: '6', statLabel: 'Outlets Total', highlight: false,
  },
  {
    year: '2020', quarter: 'Q3', category: 'Digital', CategoryIcon: IconMobile,
    headline: 'AB IBAKWE Goes Live',
    text: 'Eight further credit outlets open nationwide (including Nyamagabe, Nyamata, Rubavu, Rusizi, Nyanza and Karongi) and AB IBAKWE launches with MTN Rwanda — a push-and-pull mobile transaction service. The bank also introduces new bancassurance products and agri-value-chain loans.',
    stat: '*182*4#', statLabel: 'AB IBAKWE', highlight: false,
  },
  {
    year: '2021', quarter: 'Q2', category: 'Innovation', CategoryIcon: IconCpu,
    headline: 'Contact Centre & Chatbot',
    text: 'A fully-fledged customer contact centre launches alongside a chatbot solution, as the bank explores further digital channels to widen its service reach and efficiency.',
    stat: '24/7', statLabel: 'Support', highlight: true,
  },
  {
    year: '2023', quarter: 'Q1', category: 'Digital', CategoryIcon: IconZap,
    headline: 'E-kash Platform Launches',
    text: 'E-kash goes live — a digital payment system that transforms how customers send and receive funds between mobile network operators, banks and telcos, accessible via *540# on any handset.',
    stat: '*540#', statLabel: 'E-kash', highlight: false,
  },
]

const management = [
  {
    name: 'Zachary Raymond', role: 'Chief Executive Officer',
    image: 'https://abr.rw/wp-content/uploads/2023/02/CEO_Zach.jpg',
    detail: 'MBA · University of Cape Town',
    bio: 'Zach joined AB Rwanda as CEO in September 2022. Prior to joining AB Rwanda, he served as Chief Business Officer at Access Microfinance Bank Tanzania and spent 2012–2020 in senior roles at The Small Enterprise Foundation in South Africa.',
    color: '#0284c7',
  },
  {
    name: 'Joas Ndikumana', role: 'Chief Business Officer',
    image: 'https://abr.rw/wp-content/uploads/2021/05/Jerry-Joas.jpg',
    detail: 'With AB Rwanda since 2013',
    bio: 'Joas has led multiple business, microcredit and branch teams since joining AB Rwanda in November 2013. He holds a Master’s degree in Economics and a First Class Honors Bachelor’s degree in Management.',
    color: '#0ea5e9',
  },
  {
    name: 'Celestin Karera', role: 'Chief Finance Officer',
    image: 'https://abr.rw/wp-content/uploads/2022/12/Celestin-Pictures-150x150.jpg',
    detail: 'M.A. · Jomo Kenyatta University',
    bio: 'Celestin joined AB Rwanda in July 2022 as Head of Finance. Before that he spent seven years as Senior Manager – Financial Reporting at NCBA and five years as Chief Accountant for Access Bank and Volcanoes Safaris Rwanda.',
    color: '#38bdf8',
  },
  {
    name: 'Joselyne Bivugire', role: 'Chief Risk Officer',
    image: 'https://abr.rw/wp-content/uploads/2022/12/joselyne-Picture-2-150x150.jpg',
    detail: 'Certified microfinance expert',
    bio: 'Joselyne joined AB Rwanda in 2013 and has served in credit, compliance and risk leadership roles. She holds a Master’s degree in Finance and Accounting, a Bachelor’s degree in Computer Science, and multiple risk management certifications.',
    color: '#1a7ab5',
  },
]

const board = [
  {
    name: 'Dianne Dusaidi', role: 'Chairperson',
    image: 'https://abr.rw/wp-content/uploads/2021/05/Dianne_Dusaidi.jpg',
    detail: 'MBA · Maastricht School of Management',
    bio: 'Dianne is a Program Manager at the Mastercard Foundation, leading programs for financial inclusion, women’s e-commerce and youth employment. She joined AB Rwanda’s board in September 2020.',
    color: '#0284c7',
  },
  {
    name: 'Susan Mutoni', role: 'Board Member',
    image: 'https://abr.rw/wp-content/uploads/2023/02/Susan_Use-2.jpg',
    detail: 'CPA K & R · Audit Partner',
    bio: 'Susan is a Certified Public Accountant and Audit Partner at RUMA CPA. She has experience in auditing, UN HACT assessments, EU and USAID reviews, and holds a bachelor’s degree in Business Management majoring in Accounting.',
    color: '#0ea5e9',
  },
  {
    name: 'Bernd Zattler', role: 'Board Member',
    image: 'https://abr.rw/wp-content/uploads/2021/05/bernd_zattler-2.jpg',
    detail: 'PhD · Economics',
    bio: 'Bernd joined AB Rwanda’s board in September 2018 and also chairs several AccessHolding investees. He founded LFS Advisory GmbH and has extensive experience in development finance across Europe and Africa.',
    color: '#38bdf8',
  },
  {
    name: 'Gregor Taistra', role: 'Board Member',
    image: 'https://abr.rw/wp-content/uploads/2021/05/gregor_taistra.jpg',
    detail: 'PhD · Goethe University Frankfurt',
    bio: 'Gregor is Principal Project Manager at KfW Development Bank Germany. He is a financial specialist focused on policy, credit risk and microfinance with over 20 years of experience across Central Africa.',
    color: '#1a7ab5',
  },
  {
    name: 'Albert Kinuma', role: 'Board Member',
    image: 'https://abr.rw/wp-content/uploads/2021/05/albert_Kinuma.jpg',
    detail: 'Payments & remittance leader',
    bio: 'Albert is African Partnerships Lead at Segovia and led Rwanda’s first mobile money deployment at MTN Mobile Money. He previously served at IFC and Visa on digital financial services and interoperable banking solutions.',
    color: '#006494',
  },
]

const shareholders = [
  {
    name: 'AccessHolding', abbr: 'AH', color: '#0284c7',
    logo: 'https://abr.rw/wp-content/uploads/2021/04/AH-Logo-rgb-e1618829595587-1024x189.png',
    shareIcon: 'https://abr.rw/wp-content/uploads/2021/07/AHshare.svg',
    desc: 'AccessHolding is a public-private partnership established in 2016 with the aim to make equity investments in start-up and early stage MFIs in developing and transitional countries.',
  },
  {
    name: 'KFW Development Bank', abbr: 'KFW', color: '#0ea5e9',
    logo: 'https://abr.rw/wp-content/uploads/2021/04/KfW_RGB-e1618829694683.jpg',
    shareIcon: 'https://abr.rw/wp-content/uploads/2021/07/KFWshare-1.svg',
    desc: 'KFW Development Bank is a member of KfW Bankengruppe, a promotional bank under the ownership of the Federal Republic of Germany and its federal states.',
  },
  {
    name: 'International Finance Corporation', abbr: 'IFC', color: '#38bdf8',
    logo: 'https://abr.rw/wp-content/uploads/2021/04/IFC-1024x206.png',
    shareIcon: 'https://abr.rw/wp-content/uploads/2021/07/IFCshare.svg',
    desc: 'International Finance Corporation (IFC) is the private sector arm of the World Bank, which creates opportunity for people to escape poverty and improve their lives. IFC fosters sustainable economic growth in developing countries by supporting private sector development, mobilizing private capital and providing advisory and risk mitigation services to business and governments.',
  },
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
        g.addColorStop(0, `rgba(186,230,253,${orb.opacity * 2})`)
        g.addColorStop(0.5, `rgba(14,165,233,${orb.opacity})`)
        g.addColorStop(1, `rgba(14,165,233,0)`)
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

/* ── SVG curved journey path ── */
const JOURNEY_PATH = 'M60,280 C180,100 320,460 480,280 C640,100 780,460 940,280 C1100,100 1240,460 1400,280 C1560,100 1700,460 1860,280'

/* ── single milestone marker — scroll-linked reveal + hover for full detail ── */
function PathMarker({ pt, item, index, total, progress, active, onEnter, onLeave }: {
  pt: { x: number; y: number }
  item: typeof timeline[0]
  index: number
  total: number
  progress: MotionValue<number>
  active: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  const start = (index / total) * 0.82
  const end = start + 0.16
  const opacity = useTransform(progress, [start, end], [0, 1])
  const scale = useTransform(progress, [start, end], [0.25, 1])
  const isTop = index % 2 === 0

  return (
    <motion.g
      style={{ opacity, scale, transformOrigin: `${pt.x}px ${pt.y}px`, cursor: 'pointer' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* invisible larger hit-area for easier hover/tap */}
      <circle cx={pt.x} cy={pt.y} r={26} fill="transparent" />
      <motion.circle
        cx={pt.x} cy={pt.y} r={item.highlight ? 18 : 14}
        fill="none" stroke={item.highlight ? 'rgba(14,165,233,0.25)' : 'rgba(14,165,233,0.12)'} strokeWidth={1}
        animate={active ? { r: (item.highlight ? 18 : 14) + 6, opacity: 0 } : { r: item.highlight ? 18 : 14, opacity: 1 }}
        transition={active ? { duration: 1.1, repeat: Infinity, ease: 'easeOut' } : { duration: 0.3 }}
      />
      <circle cx={pt.x} cy={pt.y} r={item.highlight ? 9 : 7} fill={item.highlight ? '#0ea5e9' : '#ffffff'} stroke="#0ea5e9" strokeWidth={2.5} />
      <circle cx={pt.x} cy={pt.y} r={item.highlight ? 3.5 : 3} fill={item.highlight ? '#bae6fd' : '#0ea5e9'} />
      <text x={pt.x} y={isTop ? pt.y - 28 : pt.y + 38} textAnchor="middle" fill="#0284c7" fontSize={14} fontWeight={900} letterSpacing="-0.02em">
        {item.year}
      </text>
      <text x={pt.x} y={isTop ? pt.y - 48 : pt.y + 58} textAnchor="middle" fill="#647080" fontSize={10.5} fontWeight={700}>
        {item.headline}
      </text>
      <text x={pt.x} y={isTop ? pt.y - 64 : pt.y + 74} textAnchor="middle" fill="#0ea5e9" fontSize={9} fontWeight={800} letterSpacing="0.06em">
        {item.stat} {item.statLabel}
      </text>
    </motion.g>
  )
}

/* ── detail card shown on hover/tap of a marker, positioned via the SVG viewBox % ── */
function JourneyDetailCard({ item, pt, isTop }: { item: typeof timeline[0]; pt: { x: number; y: number }; isTop: boolean }) {
  const leftPct = Math.min(Math.max((pt.x / 1920) * 100, 12), 88)
  const topPct = (pt.y / 560) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: isTop ? 10 : -10, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: isTop ? 10 : -10, scale: 0.94 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: `${leftPct}%`,
        top: isTop ? undefined : `calc(${topPct}% + 30px)`,
        bottom: isTop ? `calc(${100 - topPct}% + 30px)` : undefined,
        transform: 'translateX(-50%)',
        width: 280, zIndex: 20, pointerEvents: 'none',
      }}
    >
      <div style={{
        background: '#ffffff', borderRadius: 16, padding: '16px 18px',
        border: '1px solid rgba(14,165,233,0.14)',
        boxShadow: '0 20px 48px rgba(2,30,60,0.18)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 26, height: 26, borderRadius: 8,
            background: item.highlight ? '#0ea5e9' : 'rgba(14,165,233,0.1)',
          }}>
            <item.CategoryIcon size={14} color={item.highlight ? '#fff' : '#0284c7'} />
          </span>
          <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0ea5e9' }}>
            {item.category} · {item.year}
          </span>
        </div>
        <div style={{ fontWeight: 900, fontSize: 15, color: '#0284c7', marginBottom: 6 }}>{item.headline}</div>
        <p style={{ fontSize: 12.5, color: '#647080', lineHeight: 1.65, margin: 0 }}>{item.text}</p>
      </div>
    </motion.div>
  )
}

function JourneyPath() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  /* scroll through the section drives the path drawing + marker reveal */
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 0.85', 'end 0.5'] })
  const drawProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 })
  const endOpacity = useTransform(drawProgress, [0.88, 1], [0, 1])

  /* position markers along the SVG path */
  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path) return
    const total = path.getTotalLength()
    const pct = timeline.length > 1
      ? timeline.map((_, i) => (i / (timeline.length - 1)) * 0.92 + 0.04)
      : [0.5]
    setPoints(pct.map(p => path.getPointAtLength(total * p)))
  }, [])

  return (
    <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'visible' }}>
        {/* Subtle grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(14,165,233,0.035) 1px, transparent 1px)',
          backgroundSize: '32px 32px', pointerEvents: 'none',
        }} />

        <svg
          viewBox="0 0 1920 560"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="journey-path-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <filter id="journey-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ghost path (full trail, very faint) */}
          <path d={JOURNEY_PATH} fill="none" stroke="rgba(14,165,233,0.08)" strokeWidth={3} strokeLinecap="round" />

          {/* Animated drawing path — pathLength is scroll-linked via drawProgress */}
          <motion.path
            ref={pathRef}
            d={JOURNEY_PATH}
            fill="none"
            stroke="url(#journey-path-grad)"
            strokeWidth={3.5}
            strokeLinecap="round"
            filter="url(#journey-glow)"
            style={{ pathLength: drawProgress }}
          />

          {/* Milestone markers */}
          {points.map((pt, i) => (
            <PathMarker
              key={i} pt={pt} item={timeline[i]} index={i} total={timeline.length}
              progress={drawProgress}
              active={activeIndex === i}
              onEnter={() => setActiveIndex(i)}
              onLeave={() => setActiveIndex(null)}
            />
          ))}
        </svg>

        {/* Hover/tap detail card — full milestone description */}
        <AnimatePresence>
          {activeIndex !== null && points[activeIndex] && (
            <JourneyDetailCard
              key={activeIndex}
              item={timeline[activeIndex]}
              pt={points[activeIndex]}
              isTop={activeIndex % 2 === 0}
            />
          )}
        </AnimatePresence>

        {/* Title overlay */}
        <div style={{ position: 'absolute', top: 28, left: 32, zIndex: 10, pointerEvents: 'none' }}>
          <span className="section-pill" style={{
            background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(14,165,233,0.15)', color: '#0284c7',
            boxShadow: '0 2px 12px rgba(14,165,233,0.08)',
          }}>
            Our Journey
          </span>
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(24px, 3.5vw, 42px)', color: '#0284c7', lineHeight: 1.1, letterSpacing: '-0.02em', marginTop: 10 }}>
            Tracing Our<br /><span style={{ color: '#0ea5e9' }}>Growth & Impact</span>
          </h2>
          <p style={{ fontSize: 12.5, color: '#647080', marginTop: 8, maxWidth: 220 }}>
            Hover or tap a milestone to read the full story.
          </p>
        </div>

        {/* End cap pill — fades in as the path finishes drawing */}
        <motion.div style={{
          position: 'absolute', bottom: 32, right: 32, zIndex: 10,
          opacity: endOpacity,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '11px 22px',
            background: 'linear-gradient(135deg, #0c4a6e, #0284c7, #0ea5e9)', borderRadius: 100,
            boxShadow: '0 8px 24px rgba(14,165,233,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            border: '1px solid rgba(186,230,253,0.15)',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#bae6fd', animation: 'blink 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: '#ffffff' }}>47+ branches today</span>
          </div>
        </motion.div>
      </div>
    </div>
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
          background: '#ffffff', border: '1.5px solid rgba(14,165,233,0.1)',
          borderRadius: 22, padding: '26px 22px 28px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 6px 28px rgba(14,165,233,0.08), inset 0 1px 0 rgba(255,255,255,1)',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 4,
            background: `linear-gradient(90deg, ${m.color}, #38bdf8)`,
            borderRadius: '22px 22px 0 0',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(14,165,233,0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px', pointerEvents: 'none',
          }} />

          <div style={{ transform: 'translateZ(24px)', marginBottom: 18, position: 'relative' }}>
            <div style={{
              width: 110, height: 110, borderRadius: 24, overflow: 'hidden',
              margin: '0 auto', boxShadow: `0 20px 48px ${m.color}22, 0 8px 18px rgba(0,0,0,0.12)`,
            }}>
              <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          </div>

          <div style={{ position: 'relative', transform: 'translateZ(8px)' }}>
            <p style={{ fontWeight: 900, fontSize: 16, color: '#0284c7', marginBottom: 8, lineHeight: 1.2 }}>{m.name}</p>
            <p style={{ fontSize: 11.5, color: m.color, fontWeight: 800, marginBottom: 12, letterSpacing: '0.05em' }}>{m.role}</p>
            <p style={{ fontSize: 13.5, color: '#647080', lineHeight: 1.8, margin: 0 }}>{m.bio}</p>
            <div style={{
              display: 'inline-block', background: 'rgba(14,165,233,0.06)',
              border: '1px solid rgba(14,165,233,0.1)', borderRadius: 100,
              padding: '6px 14px', fontSize: 11, color: '#647080', marginTop: 16,
            }}>
              {m.detail}
            </div>
          </div>
        </div>
      </div>
    </R>
  )
}

function BoardCard({ b, i }: { b: typeof board[0]; i: number }) {
  const { ref, onMove, onLeave } = use3DTilt(10)
  return (
    <R delay={i * 90}>
      <div
        ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out', borderRadius: 22, cursor: 'default' }}
      >
        <div style={{
          background: '#ffffff', border: '1.5px solid rgba(14,165,233,0.1)',
          borderRadius: 22, padding: '24px', position: 'relative', overflow: 'hidden',
          boxShadow: '0 6px 28px rgba(14,165,233,0.08), inset 0 1px 0 rgba(255,255,255,1)',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${b.color}, #38bdf8)`, borderRadius: '22px 22px 0 0' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(14,165,233,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
            <div style={{ width: 106, height: 106, borderRadius: 22, overflow: 'hidden', boxShadow: `0 18px 42px ${b.color}22, 0 8px 18px rgba(0,0,0,0.1)` }}>
              <img src={b.image} alt={b.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 900, fontSize: 15.5, color: '#0284c7', marginBottom: 8 }}>{b.name}</p>
              <p style={{ fontSize: 11, color: b.color, fontWeight: 800, marginBottom: 12, letterSpacing: '0.05em' }}>{b.role}</p>
              <p style={{ fontSize: 13, color: '#647080', lineHeight: 1.75, margin: 0 }}>{b.bio}</p>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '7px 14px', background: 'rgba(14,165,233,0.08)', borderRadius: 100, border: '1px solid rgba(14,165,233,0.12)', fontSize: 11, color: '#647080' }}>
              {b.detail}
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
          border: '1.5px solid rgba(14,165,233,0.1)',
          borderRadius: 22, padding: '36px 32px',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(14,165,233,0.07), inset 0 1px 0 rgba(255,255,255,1)',
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
            background: `linear-gradient(180deg, ${s.color}, #38bdf8)`,
            borderRadius: '0 4px 4px 0',
          }} />

          {/* Logo — floats forward */}
          <div style={{ transform: 'translateZ(20px)', marginBottom: 20, position: 'relative', display: 'inline-block' }}>
            <div style={{
              width: 92, height: 48, borderRadius: 8, overflow: 'hidden',
              background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 10px 28px ${s.color}22, 0 4px 8px rgba(0,0,0,0.06)`,
            }}>
              {s.logo ? <img src={s.logo} alt={s.name + ' logo'} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} /> : <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{s.abbr}</span>}
            </div>
            {/* Shadow plane */}
            <div style={{
              position: 'absolute', bottom: -6, left: '6%', right: '6%', height: 8,
              background: `${s.color}22`, borderRadius: '50%',
              filter: 'blur(6px)',
            }} />
            {/* small shareholder badge */}
            {s.shareIcon && (
              <img src={s.shareIcon} alt={s.name + ' share icon'} style={{ position: 'absolute', top: -12, right: -12, width: 44, height: 44 }} />
            )}
          </div>

          <div style={{ position: 'relative', transform: 'translateZ(8px)' }}>
            <p style={{ fontWeight: 900, fontSize: 16.5, color: '#0284c7', marginBottom: 10, lineHeight: 1.25 }}>
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
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 40%, #0ea5e9 70%, #38bdf8 100%)',
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
            border: `1px solid rgba(186,230,253,${0.06 + i * 0.02})`,
            pointerEvents: 'none',
            transition: 'right 0.4s ease, top 0.4s ease',
          }} />
        ))}

        <div style={{ margin: '0 auto', padding: '0 48px', position: 'relative' }}>
          <R>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <span className="section-pill" style={{
                background: 'rgba(186,230,253,0.12)', border: '1.5px solid rgba(186,230,253,0.25)', color: '#bae6fd',
              }}>
                Who We Are
              </span>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 700, fontSize: 'clamp(30px, 4.5vw, 54px)',
                color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.01em',
              }}>
                Improving Financial Access<br />
                <span style={{ color: '#bae6fd' }}>Across All of Rwanda</span>
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
                      background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(186,230,253,0.16)',
                      borderRadius: 22, padding: '38px 40px', backdropFilter: 'blur(16px)',
                      position: 'relative', overflow: 'hidden',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 48px rgba(0,0,0,0.15)',
                    }}>
                      <div style={{
                        position: 'absolute', bottom: -14, right: -10,
                        fontSize: 96, opacity: 0.04, userSelect: 'none', lineHeight: 1, color: '#bae6fd',
                      }}>
                        {item.icon}
                      </div>
                      <div style={{ transform: 'translateZ(20px)', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: 10,
                            background: 'rgba(186,230,253,0.15)', border: '1px solid rgba(186,230,253,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 16, color: '#bae6fd',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          }}>
                            {item.icon}
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', color: '#bae6fd' }}>
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
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(186,230,253,0.12)',
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
                  Established in 2014 and headquartered on Nyarugenge Avenue, Kigali, AB Rwanda Plc has grown from a single branch in Nyamirambo to a nationwide network of <strong style={{ color: '#bae6fd' }}>47+ branches</strong> and rural credit outlets spanning all five provinces.
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
          backgroundImage: 'radial-gradient(rgba(14,165,233,0.04) 1px, transparent 1px)',
          backgroundSize: '36px 36px', pointerEvents: 'none',
        }} />

        {/* Journey header — full bleed dark 3D panel */}
        <div className="about-journey-header" style={{
          background: 'linear-gradient(160deg, #0c4a6e 0%, #0c4a6e 30%, #0284c7 60%, #0ea5e9 90%)',
          padding: '72px 28px 88px', position: 'relative', overflow: 'hidden',
          marginBottom: 72,
          clipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 100%)',
        }}>
          <OrbCanvas />

          {/* Giant watermark */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            fontSize: 'clamp(70px, 13vw, 150px)', fontWeight: 900,
            color: 'rgba(186,230,253,0.04)', whiteSpace: 'nowrap', letterSpacing: '-0.04em',
            userSelect: 'none', pointerEvents: 'none', lineHeight: 1,
          }}>
            2014 → 2023
          </div>

          {/* Floating 3D accent squares */}
          {[['-8%', '10%', 48, 18, 0.06], ['85%', '15%', 32, 24, 0.04], ['75%', '70%', 56, 12, 0.05]].map(([left, top, size, rot, op], i) => (
            <div key={i} style={{
              position: 'absolute', left: left as string, top: top as string,
              width: size as number, height: size as number,
              border: '2px solid rgba(186,230,253,0.2)',
              borderRadius: 8,
              transform: `rotate(${rot}deg) perspective(400px) rotateX(35deg)`,
              opacity: op as number,
              animation: `floatY ${5 + i}s ease-in-out ${i}s infinite`,
              pointerEvents: 'none',
            }} />
          ))}

          <div style={{ margin: '0 auto', padding: '0 48px', position: 'relative' }}>
            <R>
              <span className="section-pill" style={{
                background: 'rgba(186,230,253,0.1)', border: '1.5px solid rgba(186,230,253,0.22)', color: '#bae6fd',
              }}>
                Our Journey
              </span>
              <h2 style={{
                fontWeight: 900, fontSize: 'clamp(34px, 5.5vw, 68px)',
                color: '#ffffff', lineHeight: 1.04, letterSpacing: '-0.03em', marginBottom: 18,
              }}>
                A Decade of<br />
                <span style={{ color: '#bae6fd' }}>Growth & Impact</span>
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(186,230,253,0.58)', maxWidth: 480, lineHeight: 1.75, marginBottom: 48 }}>
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
                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(186,230,253,0.15)',
                        borderRadius: 18, padding: '22px 24px',
                        backdropFilter: 'blur(12px)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 24px rgba(0,0,0,0.2)',
                      }}>
                        <div style={{ marginBottom: 10 }}><s.Icon size={22} color="rgba(186,230,253,0.7)" strokeWidth={1.5} /></div>
                        <div style={{
                          fontSize: 38, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.03em',
                          color: '#ffffff', marginBottom: 6, transform: 'translateZ(10px)',
                        }}>
                          <Counter target={s.value} suffix={s.suffix} />
                        </div>
                        <div style={{ fontSize: 10.5, color: 'rgba(186,230,253,0.5)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
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

        {/* Winding Journey Path */}
        <JourneyPath />
      </div>

      {/* ─── Management ─── */}
      <div style={{ background: '#ffffff', padding: '88px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(14,165,233,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px', pointerEvents: 'none',
        }} />
        <div style={{ margin: '0 auto', padding: '0 48px' }}>
          <R style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="section-pill">Leadership</span>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 44px)', color: '#0284c7', letterSpacing: '-0.025em' }}>
              Management Team
            </h2>
          </R>
          <div className="about-management" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 22 }}>
            {management.map((m, i) => <ManagementCard key={m.name} m={m} i={i} />)}
          </div>
        </div>
      </div>

      {/* ─── Board of Directors ─── */}
      <div style={{ background: '#f8fbfe', padding: '88px 0 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(14,165,233,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px', pointerEvents: 'none',
        }} />
        <div style={{ margin: '0 auto', padding: '0 48px' }}>
          <R style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="section-pill">Board</span>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 44px)', color: '#0284c7', letterSpacing: '-0.025em' }}>
              Board of Directors
            </h2>
          </R>
          <div className="about-board" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 22 }}>
            {board.map((b, i) => <BoardCard key={b.name} b={b} i={i} />)}
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
            border: `1px solid rgba(14,165,233,${0.04 + i * 0.02})`,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ margin: '0 auto', padding: '0 48px' }}>
          <R style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section-pill">Ownership</span>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 44px)', color: '#0284c7', letterSpacing: '-0.025em' }}>
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
