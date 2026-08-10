import { useCallback, useEffect, useRef, useState } from 'react'
import { mediaUrl, useSingleton } from '../lib/content'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
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
const BD = '#0284c7'
const GL = '#9fa8b8'

/* ══════════════════════════════════════════════
   SCROLL CHOREOGRAPHY
   One normalised progress value (0 → 1 across the
   hero) drives everything. These are its phase
   boundaries:

     0.00 → 0.30   ASSEMBLE  cards converge into a stack
     0.30 → 0.45   LOCKED    one solid object
     0.45 → 0.85   REVEAL    fans open into three views

   Every animated property is keyed to these same four
   stops so the whole scene moves as one system.
══════════════════════════════════════════════ */
const STOPS = [0, 0.3, 0.45, 0.85] as const
type Quad = [number, number, number, number]

/* ── The living sky ──
   Four stacked layers, all animated by CSS keyframes in index.css.
   No JS touches this: it runs on the compositor and keeps drifting
   whether or not React ever renders again. */
function SkyBg() {
  return (
    <div className="hero-sky" aria-hidden="true">
      <div className="hero-sky__base" />
      <div className="hero-sky__cloud hero-sky__cloud--a" />
      <div className="hero-sky__cloud hero-sky__cloud--b" />
      <div className="hero-sky__cloud hero-sky__cloud--c" />
      <div className="hero-sky__stars">
        <div className="hero-sky__twinkle" />
      </div>
      <div className="hero-sky__grid" />
      {/* Scrim sits above the sky and below the copy — it is what keeps
          white text legible through the light phase of the cycle. */}
      <div className="hero-sky__scrim" />
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.035 }}
        preserveAspectRatio="none"
      >
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={`${i * 15}%`} y1="0" x2={`${i * 15 + 40}%`} y2="100%" stroke={GL} strokeWidth="1" />
        ))}
      </svg>
    </div>
  )
}

/* ── One card of the 3D stack ──
   Receives the shared progress value and maps it onto its own
   depth, offset and rotation. Every property below is either a
   transform or a filter, so no frame ever triggers layout. */
type CardConfig = {
  src: string
  alt: string
  width: number
  height: number
  widthPct: string
  zIndex: number
  x: Quad
  y: Quad
  z: Quad
  rotateY: Quad
  rotateZ: Quad
  brightness: Quad
  shadowY: Quad
  shadowBlur: Quad
  shadowAlpha: Quad
}

/** One beat of the CMS-authored story, painted onto a card in the stack. */
export interface StoryPanel {
  id: string
  image: string
  alt: string
  kicker: string
  title: string
  caption: string
}

function StackCard({
  p,
  config,
  panel,
  index,
}: {
  p: MotionValue<number>
  config: CardConfig
  /** When present the card carries a story beat instead of the stock artwork. */
  panel?: StoryPanel
  index: number
}) {
  const stops = STOPS as unknown as number[]
  const x = useTransform(p, stops, config.x)
  const y = useTransform(p, stops, config.y)
  const z = useTransform(p, stops, config.z)
  const rotateY = useTransform(p, stops, config.rotateY)
  const rotateZ = useTransform(p, stops, config.rotateZ)

  /* Depth-linked brightness. Cheap fake ambient occlusion — it does more for
     perceived depth than the transforms themselves. The stock artwork is
     desaturated to sit behind the copy, but an editor's photograph keeps its
     colour: greyscaling someone's chosen image would be the wrong call. */
  const brightness = useTransform(p, stops, config.brightness)
  const litFilter = useMotionTemplate`brightness(${brightness}) contrast(1.04)`
  const stockFilter = useMotionTemplate`grayscale(1) brightness(${brightness}) contrast(1.08)`
  const filter = panel ? litFilter : stockFilter

  // Shadow tightens as the stack closes and softens as it opens.
  const shadowY = useTransform(p, stops, config.shadowY)
  const shadowBlur = useTransform(p, stops, config.shadowBlur)
  const shadowAlpha = useTransform(p, stops, config.shadowAlpha)
  const boxShadow = useMotionTemplate`0 ${shadowY}px ${shadowBlur}px rgba(2, 14, 28, ${shadowAlpha})`

  // Specular sweep driven by the card's own rotation, so light reads
  // as catching a real surface as it turns rather than as a decal.
  const sheenX = useTransform(rotateY, [-40, 0, 40], ['10%', '120%', '250%'])
  const sheenOpacity = useTransform(rotateY, [-40, -10, 0, 10, 40], [0.95, 0.3, 0.16, 0.3, 0.95])

  /* The words are held back until the stack has finished opening — while the
     cards are still converging they overlap, and copy laid over copy is
     unreadable. They fade in over the tail of the REVEAL phase. */
  const copyOpacity = useTransform(p, [0.5, 0.72], [0, 1])
  const copyY = useTransform(p, [0.5, 0.72], [14, 0])

  return (
    <div className="hero-stack__layer" style={{ zIndex: config.zIndex }}>
      <motion.div
        className="hero-stack__card"
        style={{ x, y, z, rotateY, rotateZ, filter, boxShadow, width: config.widthPct }}
      >
        {panel ? (
          <div className="hero-story">
            {panel.image ? (
              <img
                className="hero-story__img"
                src={mediaUrl(panel.image)}
                alt={panel.alt}
                width={config.width}
                height={config.height}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            ) : (
              /* A panel with words but no picture yet still has to hold its
                 shape, or the stack collapses while an editor is mid-edit. */
              <div className="hero-story__img hero-story__img--empty" aria-hidden="true" />
            )}
            <div className="hero-story__scrim" aria-hidden="true" />
            <motion.div className="hero-story__copy" style={{ opacity: copyOpacity, y: copyY }}>
              {panel.kicker && <span className="hero-story__kicker">{panel.kicker}</span>}
              {panel.title && <span className="hero-story__title">{panel.title}</span>}
              {panel.caption && <span className="hero-story__caption">{panel.caption}</span>}
            </motion.div>
          </div>
        ) : (
          <img
            src={config.src}
            alt={config.alt}
            width={config.width}
            height={config.height}
            decoding="async"
          />
        )}
        <motion.div className="hero-stack__sheen" style={{ x: sheenX, opacity: sheenOpacity }} />
      </motion.div>
    </div>
  )
}

const CARDS: CardConfig[] = [
  {
    // Back card — rests high-right, swings out to the right on the reveal.
    src: cardBottom,
    alt: '',
    width: 552,
    height: 302,
    widthPct: '74%',
    zIndex: 1,
    x: [34, 12, 12, 238],
    y: [-124, -28, -28, -44],
    z: [-230, -55, -55, -95],
    rotateY: [3, 1.5, 1.5, -38],
    rotateZ: [-7, -3.5, -3.5, 3],
    brightness: [0.6, 0.7, 0.7, 0.88],
    shadowY: [40, 20, 20, 34],
    shadowBlur: [92, 44, 44, 80],
    shadowAlpha: [0.34, 0.5, 0.5, 0.3],
  },
  {
    // Middle card — stays centred and comes forward on the reveal.
    src: cardMiddle,
    alt: '',
    width: 530,
    height: 261,
    widthPct: '76%',
    zIndex: 2,
    x: [0, 0, 0, 0],
    y: [-14, -2, -2, 8],
    z: [-110, -26, -26, 34],
    rotateY: [0, 0, 0, 0],
    rotateZ: [-4.5, -2, -2, 0],
    brightness: [0.8, 0.86, 0.86, 1.02],
    shadowY: [38, 20, 20, 40],
    shadowBlur: [88, 46, 46, 86],
    shadowAlpha: [0.34, 0.46, 0.46, 0.32],
  },
  {
    // Front card — rests low-left, swings out to the left, mirroring the back.
    src: cardTop,
    alt: '',
    width: 530,
    height: 261,
    widthPct: '78%',
    zIndex: 3,
    x: [-30, -10, -10, -238],
    y: [112, 26, 26, -36],
    z: [0, 0, 0, -95],
    rotateY: [-3, -1.5, -1.5, 38],
    rotateZ: [-2, -1, -1, -3],
    brightness: [1.02, 1.04, 1.04, 0.9],
    shadowY: [42, 22, 22, 34],
    shadowBlur: [96, 48, 48, 80],
    shadowAlpha: [0.38, 0.52, 0.52, 0.3],
  },
]

/* ── 3D right-hand scene ── */
function LandingCards({
  p,
  rotateX,
  rotateY,
  story,
}: {
  p: MotionValue<number>
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  /** CMS story beats. Empty falls back to the stock card artwork. */
  story: StoryPanel[]
}) {
  // The small guide line draws itself just after the cards settle, so
  // the line and the stack read as one connected system.
  const innerDraw = useTransform(p, [0.08, 0.6], [0, 1])

  return (
    <div
      className="hero-stack"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 620,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Sits low in the column on purpose: the fan-out happens late in the
        // scroll, and starting lower keeps it inside the viewport long enough
        // to actually read.
        marginTop: 76,
      }}
    >
      <motion.div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: 520,
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
        }}
      >
        <svg
          viewBox="0 0 80 520"
          width={8}
          height="100%"
          style={{
            position: 'absolute',
            top: '10%',
            left: '18%',
            bottom: '10%',
            pointerEvents: 'none',
            overflow: 'visible',
            zIndex: 6,
            filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.14))',
          }}
          aria-hidden="true"
        >
          <motion.path
            d="M8 10 C 14 120, 12 240, 18 360 C 26 428, 10 480, 8 510"
            fill="none"
            stroke="rgba(255,255,255,0.96)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: innerDraw }}
          />
          <motion.path
            d="M8 10 C 14 120, 12 240, 18 360 C 26 428, 10 480, 8 510"
            fill="none"
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 16"
            style={{ pathLength: innerDraw }}
          />
        </svg>

        {[
          { src: starOutline, top: '14%', size: 30, opacity: 0.95 },
          { src: starFilled, top: '44%', size: 26, opacity: 0.9 },
          { src: starOutline, top: '72%', size: 22, opacity: 0.9 },
        ].map((s, i) => (
          <img
            key={i}
            src={s.src}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: s.top,
              left: '19.4%',
              width: s.size,
              filter: 'brightness(0) invert(1)',
              opacity: s.opacity,
              zIndex: 4,
            }}
          />
        ))}

        {/* The stack is three cards deep, so it renders the first three beats.
            They are assigned back-to-front so the first beat sits on top. */}
        {CARDS.map((config, i) => {
          const panel = story[CARDS.length - 1 - i]
          return (
            <StackCard
              key={panel?.id ?? config.src}
              p={p}
              config={config}
              index={i}
              {...(panel ? { panel } : {})}
            />
          )
        })}
      </motion.div>

      <img
        src={starOutline}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '12%',
          right: '-6%',
          width: 88,
          opacity: 0.75,
          animation: 'floatY 6s ease-in-out infinite',
          zIndex: 4,
        }}
      />
      <img
        src={starFilled}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '8%',
          left: '-8%',
          width: 80,
          opacity: 0.85,
          animation: 'floatY2 7s ease-in-out 0.5s infinite',
          zIndex: 4,
        }}
      />
    </div>
  )
}

/* ── Count-up ── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    // Reduced motion renders the final value directly — no counting, and
    // no setState from an effect just to skip the animation.
    if (reduce) return
    const node = ref.current
    if (!node) return

    let raf = 0
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        obs.disconnect()
        const start = performance.now()
        const duration = 1100
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          // easeOutCubic — lands softly instead of stopping dead
          setVal(Math.round(to * (1 - Math.pow(1 - t, 3))))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.5 },
    )
    obs.observe(node)
    return () => {
      obs.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to, reduce])

  return (
    <span ref={ref}>
      {reduce ? to : val}
      {suffix}
    </span>
  )
}

interface HeroSlide {
  line1: string
  line2: string
  line3: string
  sub: React.ReactNode
}

/** Shown only until the CMS responds, and if it never does. */
const FALLBACK_SLIDES: HeroSlide[] = [
  {
    line1: 'Banking Built',
    line2: 'for Rwanda',
    line3: '& Beyond',
    sub: (
      <>
        Responsible, inclusive financial services for entrepreneurs, families, and businesses — accessible from any
        branch or by dialling <strong style={{ color: '#ffffff' }}>*540#</strong>.
      </>
    ),
  },
  {
    line1: 'Your Dreams,',
    line2: 'Our',
    line3: 'Mission',
    sub: 'From savings accounts to business loans, we provide flexible financial solutions tailored to help you achieve your goals.',
  },
  {
    line1: 'Bank Anytime,',
    line2: '',
    line3: 'Anywhere',
    sub: 'Manage your finances on the go with our secure mobile banking platform — transfers, bill payments, and account management at your fingertips.',
  },
  {
    line1: 'Trusted for',
    line2: 'Over 9',
    line3: 'Years',
    sub: 'Serving over 200,000 customers across 47 branches with personalized service and innovative banking solutions.',
  },
]

const HEADLINE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-serif)',
  fontSize: 'clamp(32px, 5vw, 72px)',
  fontWeight: 700,
  lineHeight: 1,
  margin: 0,
  letterSpacing: '-0.025em',
}

interface HeroDocument {
  slides: { id: string; line1: string; line2: string; line3: string; sub: string }[]
  quickLinks: { id: string; label: string; icon: string }[]
  /** Optional: hero documents saved before the story existed omit it. */
  story?: StoryPanel[]
}

export default function Hero() {
  const [heroSlide, setHeroSlide] = useState(0)

  /* A `null` fallback distinguishes the two cases precisely: no document yet
     means show the built-in slides, while a document that exists is used
     exactly — including an empty slide list, which is an editorial choice
     rather than a failure. */
  const { data: hero } = useSingleton<HeroDocument | null>('hero', null)
  const HERO_SLIDES: HeroSlide[] = hero ? hero.slides : FALLBACK_SLIDES

  /* A beat with neither picture nor headline would animate an empty card, so
     only panels with something to show reach the stack. */
  const story: StoryPanel[] = (hero?.story ?? []).filter((b) => b.image || b.title)

  /* Clamped during render rather than corrected in an effect: if the CMS
     returns fewer slides than the index currently held, reading past the end
     must not survive even one frame. */
  const activeSlide = HERO_SLIDES.length > 0 ? heroSlide % HERO_SLIDES.length : 0
  const sectionRef = useRef<HTMLElement>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const reduce = useReducedMotion()

  /* ── The engine ──
     One scroll MotionValue, smoothed by a spring, feeds every
     animated property in this component. MotionValues write
     straight to the DOM, so none of this causes a React render —
     the component renders when `heroSlide` changes and at no
     other time. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const smoothed = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.35 })
  // Reduced motion: pin the scene to its assembled state.
  const frozen = useMotionValue(0.36)
  const p = reduce ? frozen : smoothed

  // Pointer parallax. Setting a MotionValue never re-renders.
  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)
  const px = useSpring(pointerX, { stiffness: 90, damping: 20, mass: 0.3 })
  const py = useSpring(pointerY, { stiffness: 90, damping: 20, mass: 0.3 })
  const sceneRotateX = useTransform(py, [0, 1], [5, -5])
  const sceneRotateY = useTransform(px, [0, 1], [-8, 8])

  // Content easing out as the hero leaves. The scene holds its
  // opacity far longer than the copy so the card reveal — which
  // happens late in the scroll — is actually visible.
  const textOpacity = useTransform(p, [0, 0.5, 0.95], [1, 1, 0.12])
  const textY = useTransform(p, [0, 1], [0, -46])
  const sceneOpacity = useTransform(p, [0, 0.86, 1], [1, 1, 0.35])

  // Background line: draws itself on, drifts down, and cross-fades
  // white → blue. A comet segment rides the same path.
  const lineDraw = useTransform(p, [0, 0.55], [0, 1])
  const lineBlue = useTransform(p, [0.15, 0.7], [0, 1])
  const cometOffset = useTransform(p, [0, 1], [0.12, 0.94])
  const cometOpacity = useTransform(p, [0, 0.06, 0.9, 1], [0, 1, 1, 0])
  const lineY = useTransform<number, number>([p, py], ([pv, pyv]) => pv * 110 + (pyv - 0.5) * 54)
  const lineOpacity = useTransform(p, [0, 0.9], [0.8, 0.55])

  /* Restarted when the slide count changes: the CMS may return a different
     number of slides than the fallback, and a stale modulus would either skip
     slides or index past the end. */
  useEffect(() => {
    if (HERO_SLIDES.length === 0) return
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [HERO_SLIDES.length])

  // Cache the section rect so pointer moves never force a layout read.
  useEffect(() => {
    const measure = () => {
      rectRef.current = sectionRef.current?.getBoundingClientRect() ?? null
    }
    measure()
    window.addEventListener('resize', measure, { passive: true })
    window.addEventListener('scroll', measure, { passive: true })
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure)
    }
  }, [])

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const r = rectRef.current
      if (!r) return
      pointerX.set((e.clientX - r.left) / r.width)
      pointerY.set((e.clientY - r.top) / r.height)
    },
    [pointerX, pointerY],
  )

  const onMouseLeave = useCallback(() => {
    pointerX.set(0.5)
    pointerY.set(0.5)
  }, [pointerX, pointerY])

  const linePath =
    'M175 -20 C 280 100, 320 220, 200 340 C 80 460, 60 580, 180 700 C 300 820, 320 940, 180 1060 C 40 1180, 60 1300, 175 1400'

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative',
        minHeight: '100vh',
        paddingTop: 5,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SkyBg />

      <motion.div
        className="hero-line"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '52%',
          x: '-50%',
          y: lineY,
          width: 240,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: lineOpacity,
        }}
      >
        <svg viewBox="0 0 350 1400" preserveAspectRatio="none" width="100%" height="100%">
          <defs>
            <linearGradient id="hero-line-white" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#f5fbff" />
              <stop offset="100%" stopColor="#e8f4ff" />
            </linearGradient>
            <linearGradient id="hero-line-blue" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="45%" stopColor="#60b8ec" />
              <stop offset="100%" stopColor="#2879bf" />
            </linearGradient>
          </defs>

          {/* White pass — draws itself on as you scroll */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#hero-line-white)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: lineDraw }}
          />
          {/* Blue pass — cross-fades over the white one. Two static
              gradients beat recomputing stop colours every frame. */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="url(#hero-line-blue)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pathLength: lineDraw, opacity: lineBlue }}
          />
          {/* Comet — a short lit segment travelling the path */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="rgba(255,255,255,0.95)"
            strokeWidth="5"
            strokeLinecap="round"
            style={{ pathLength: 0.05, pathOffset: cometOffset, opacity: cometOpacity }}
          />
        </svg>
      </motion.div>

      {/* ── Main 2-col grid ── */}
      <div
        className="hero-grid"
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          minHeight: 0,
          margin: '0 auto',
          width: '100%',
          // Top padding clears the fixed chrome: 36px ticker + 76px navbar
          // = 112px, plus breathing room. The rotating headline was sliding
          // under the navbar at the old 48px.
          padding: '140px 48px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 40,
          alignItems: 'center',
        }}
      >
        {/* ── LEFT: copy ── */}
        {/* Outer element owns the one-shot entrance; the inner one owns the
            scroll-linked MotionValues. Keeping them on separate nodes stops
            `whileInView` from trying to write into a derived MotionValue. */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-200px' }}
        >
          <motion.div style={{ opacity: textOpacity, y: textY }}>
          {/* Headline — rotating, crossfaded to match the subtitle */}
          <div
            style={{
              position: 'relative',
              minHeight: 'clamp(112px, 15.5vw, 224px)',
              marginBottom: 16,
            }}
          >
            {HERO_SLIDES.map((slide, i) => (
              <div
                key={i}
                aria-hidden={activeSlide !== i}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: activeSlide === i ? 1 : 0,
                  transform: activeSlide === i ? 'translateY(0)' : 'translateY(12px)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease',
                  pointerEvents: activeSlide === i ? 'auto' : 'none',
                }}
              >
                <h1 style={{ ...HEADLINE_STYLE, color: '#ffffff' }}>{slide.line1}</h1>
                {slide.line2 && (
                  <h1
                    style={{
                      ...HEADLINE_STYLE,
                      backgroundImage: `linear-gradient(100deg, ${GL} 0%, #fff 50%, ${GL} 100%)`,
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      animation: 'shimmer 4s linear 1s infinite',
                    }}
                  >
                    {slide.line2}
                  </h1>
                )}
                <h1 style={{ ...HEADLINE_STYLE, color: 'rgba(255,255,255,0.78)' }}>{slide.line3}</h1>
              </div>
            ))}
          </div>

          {/* Slide indicators */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Show slide ${i + 1}`}
                aria-current={activeSlide === i}
                onClick={() => setHeroSlide(i)}
                style={{
                  width: activeSlide === i ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  background: activeSlide === i ? '#ffffff' : 'rgba(255,255,255,0.3)',
                  transition: 'width 0.3s, background 0.3s',
                }}
              />
            ))}
          </div>

          {/* Subtitle — rotating. Absolutely positioned, so the wrapper
              reserves the height of the tallest slide or the CTA row
              rides up over the last line. */}
          <div style={{ position: 'relative', minHeight: 'clamp(92px, 8vw, 108px)', marginBottom: 34 }}>
            {HERO_SLIDES.map((slide, i) => (
              <p
                key={i}
                aria-hidden={activeSlide !== i}
                style={{
                  position: 'absolute',
                  inset: 0,
                  fontSize: 17,
                  color: 'rgba(255,255,255,0.82)',
                  lineHeight: 1.78,
                  maxWidth: 470,
                  margin: 0,
                  opacity: activeSlide === i ? 1 : 0,
                  transform: activeSlide === i ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s',
                  pointerEvents: activeSlide === i ? 'auto' : 'none',
                }}
              >
                {slide.sub}
              </p>
            ))}
          </div>

          {/* CTA buttons */}
          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}
          >
            <a
              href="#products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(135deg, #ffffff 0%, #f2f8ff 100%)',
                color: BD,
                padding: '15px 30px',
                borderRadius: 999,
                fontWeight: 800,
                fontSize: 15,
                textDecoration: 'none',
                boxShadow: '0 12px 35px rgba(0,0,0,0.22)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.transform = 'translateY(-3px)'
                el.style.boxShadow = '0 16px 40px rgba(0,0,0,0.28)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.transform = ''
                el.style.boxShadow = '0 12px 35px rgba(0,0,0,0.22)'
              }}
            >
              Open an Account
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke={BD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                border: '1px solid rgba(186,230,253,0.34)',
                color: '#f5fbff',
                padding: '15px 30px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.08)',
                transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(255,255,255,0.62)'
                el.style.background = 'rgba(255,255,255,0.14)'
                el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.borderColor = 'rgba(186,230,253,0.34)'
                el.style.background = 'rgba(255,255,255,0.08)'
                el.style.transform = ''
              }}
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
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(186,230,253,0.16)',
              borderRadius: 18,
              overflow: 'hidden',
              backdropFilter: 'blur(14px)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.16)',
            }}
          >
            {[
              { v: 47, s: '+', l: 'Branches' },
              { v: 200, s: 'K+', l: 'Customers' },
              { v: 9, s: '+', l: 'Years' },
              { v: 15, s: '+', l: 'Products' },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  padding: '18px 12px',
                  textAlign: 'center',
                  borderRight: i < 3 ? '1px solid rgba(186,230,253,0.08)' : 'none',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 26,
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  <Counter to={s.v} suffix={s.s} />
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: 'rgba(220,237,255,0.7)',
                    fontWeight: 700,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: landing cards scene ── */}
        <motion.div
          className="hero-scene"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          style={{ position: 'relative', zIndex: 2 }}
        >
          <motion.div style={{ opacity: sceneOpacity }}>
            <LandingCards p={p} rotateX={sceneRotateX} rotateY={sceneRotateY} story={story} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
