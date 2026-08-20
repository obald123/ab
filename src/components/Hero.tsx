import { useCallback, useEffect, useRef, useState } from 'react'
import { isVideoSource, mediaUrl, useSingleton } from '../lib/content'
import storyPhoto from '../imports/story/story-photo.webp'
import storyClip from '../imports/story/story-clip.mp4'
import starOutline from '../imports/landing/Star 17.png'
import starFilled from '../imports/landing/Star 17 (1).png'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { useT } from '../lib/i18n'

/* ══════════════════════════════════════════════
   BRAND TOKENS  (from logo exactly)
   AB blue  : #0ea5e9   Rwanda grey : #647080
   Globe hi : #bae6fd   Globe deep  : #0284c7
══════════════════════════════════════════════ */
const BD = '#0284c7'
const GL = '#9fa8b8'

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

/** One beat of the CMS-authored story. */
export interface StoryPanel {
  id: string
  image: string
  alt: string
  kicker: string
  title: string
  caption: string
}

/** How long each beat holds before the reel advances. */
const DWELL_MS = 5200

/* ── The story reel ──
   One beat at a time in a single frame: the picture drifts slowly behind the
   words while a segmented bar shows how many beats there are and how long the
   current one has left.

   Chosen over a fixed card arrangement because it takes however many beats the
   CMS supplies — one or nine — instead of being built around a set number, and
   because it plays on its own rather than waiting for the visitor to scroll. */
function StoryReel({
  story,
  driftX,
  driftY,
}: {
  story: StoryPanel[]
  driftX: MotionValue<number>
  driftY: MotionValue<number>
}) {
  const t = useT()
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const count = story.length
  // Modulo rather than a stored clamp, so the reel survives the CMS returning
  // fewer beats than it did a moment ago.
  const active = count > 0 ? index % count : 0
  const beat = story[active]

  useEffect(() => {
    // A single beat is not a slideshow, and reduced motion means no autoplay.
    if (reduce || paused || count < 2) return
    const timer = setTimeout(() => {
      setIndex((i) => i + 1)
    }, DWELL_MS)
    return () => {
      clearTimeout(timer)
    }
  }, [index, paused, reduce, count])

  if (!beat) return null

  const hold = () => {
    setPaused(true)
  }
  const release = () => {
    setPaused(false)
  }

  return (
    <div
      className="hero-reel"
      role="group"
      aria-roledescription="carousel"
      aria-label={t.home.heroStory}
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocusCapture={hold}
      onBlurCapture={release}
    >
      {/* Brand marks that framed the previous scene and still frame this one.
          Pure CSS keyframes, so they drift whether or not React re-renders. */}
      <img
        src={starOutline}
        alt=""
        aria-hidden="true"
        className="hero-reel__star hero-reel__star--tr"
      />
      <img
        src={starFilled}
        alt=""
        aria-hidden="true"
        className="hero-reel__star hero-reel__star--bl"
      />
      <motion.div className="hero-reel__frame" style={{ x: driftX, y: driftY }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={beat.id}
            className="hero-reel__slide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          >
            {beat.image && isVideoSource(beat.image) ? (
              /* Muted and inline so it is allowed to autoplay at all, and
                 `poster`-less on purpose: the frame is already dark, so a
                 flash of empty background is less jarring than a still that
                 does not match the first frame. Reduced motion gets controls
                 and no autoplay instead. */
              <video
                key={beat.id}
                className="hero-reel__img"
                src={mediaUrl(beat.image)}
                aria-label={beat.alt}
                autoPlay={!reduce}
                muted
                loop
                playsInline
                controls={reduce === true}
                preload={active === 0 ? 'auto' : 'metadata'}
              />
            ) : beat.image ? (
              <img
                className={`hero-reel__img${reduce ? '' : ' hero-reel__img--drift'}`}
                src={mediaUrl(beat.image)}
                alt={beat.alt}
                loading={active === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            ) : (
              /* A beat with words but no picture still has to fill the frame,
                 or the reel collapses while an editor is mid-edit. */
              <div className="hero-reel__img hero-reel__img--empty" aria-hidden="true" />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="hero-reel__scrim" aria-hidden="true" />

        <div className="hero-reel__copy">
          <AnimatePresence mode="wait">
            <motion.div
              key={beat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              {beat.kicker && <span className="hero-reel__kicker">{beat.kicker}</span>}
              {beat.title && <span className="hero-reel__title">{beat.title}</span>}
              {beat.caption && <span className="hero-reel__caption">{beat.caption}</span>}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Doubles as the control: each segment says how many beats there are,
            which one is showing, and how long it has left. */}
        {count > 1 && (
          <div className="hero-reel__track">
            {story.map((panel, i) => (
              <button
                key={panel.id}
                type="button"
                className="hero-reel__seg"
                aria-label={`Show ${panel.title || `beat ${String(i + 1)}`}`}
                aria-current={i === active}
                onClick={() => {
                  setIndex(i)
                }}
              >
                <span
                  className="hero-reel__segfill"
                  style={{
                    /* Past beats read as complete, the current one fills over
                       its dwell, and the rest stay empty. */
                    width: i < active ? '100%' : i === active ? undefined : '0%',
                    animation:
                      i === active && !reduce
                        ? `heroSegFill ${String(DWELL_MS)}ms linear forwards`
                        : undefined,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

/* Placeholder story, shown until an editor publishes real panels in
   Admin → Hero → Animated Story. It carries no pictures on purpose: each card
   falls back to the brand gradient, so the hero reads as intentional rather
   than as three broken image frames. The copy describes what the bank
   actually offers, so it is presentable in the meantime. */
const FALLBACK_STORY: StoryPanel[] = [
  {
    id: 'placeholder-1',
    image: storyPhoto,
    alt: 'Sample artwork: the AB Rwanda globe over a blue horizon.',
    kicker: '01',
    title: 'Apply in minutes',
    caption: 'At any of our branches and outlets across all five provinces.',
  },
  {
    // Exercises the video path, so the reel is not only ever proven with stills.
    id: 'placeholder-2',
    image: storyClip,
    alt: 'Sample clip: the AB Rwanda globe turning.',
    kicker: '02',
    title: 'Approved in 48 hours',
    caption: "Collateral-light lending built for Rwanda's entrepreneurs.",
  },
  {
    // Left bare on purpose: keeps the no-picture path visible, which is what an
    // editor sees between adding a beat and uploading its media.
    id: 'placeholder-3',
    image: '',
    alt: '',
    kicker: '03',
    title: 'Your business grows',
    caption: 'Repay on terms that match how your business actually earns.',
  },
]

/* ── Count-up figure ──
   Animates from zero to `to` the first time it scrolls into view, once. The
   easing is cubic-out over 1.1s, which lands the number rather than letting it
   creep. Reduced motion skips straight to the value. */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el) return

    let frame = 0
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        obs.disconnect()
        const started = performance.now()
        const step = (now: number) => {
          const t = Math.min((now - started) / 1100, 1)
          setValue(Math.round(to * (1 - (1 - t) ** 3)))
          if (t < 1) frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)
      },
      { threshold: 0.5 },
    )
    obs.observe(el)
    return () => {
      obs.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [to, reduce])

  return (
    <span ref={ref}>
      {reduce ? to : value}
      {suffix}
    </span>
  )
}

/** A rotating headline. `sub` is a node so a line can carry emphasis. */
interface HeroSlide {
  line1: string
  line2: string
  line3: string
  sub: React.ReactNode
}

/** Shown until the CMS hero document supplies slides. */
const FALLBACK_SLIDES: HeroSlide[] = [
  {
    line1: 'Banking Built',
    line2: 'for Rwanda',
    line3: '& Beyond',
    sub: (
      <>
        Responsible, inclusive financial services for entrepreneurs, families, and businesses —
        accessible from any branch or by dialling{' '}
        <strong style={{ color: '#ffffff' }}>*540#</strong>.
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
  const t = useT()
  const [heroSlide, setHeroSlide] = useState(0)

  /* A `null` fallback distinguishes the two cases precisely: no document yet
     means show the built-in slides, while a document that exists is used
     exactly — including an empty slide list, which is an editorial choice
     rather than a failure. */
  const { data: hero } = useSingleton<HeroDocument | null>('hero', null)
  const HERO_SLIDES: HeroSlide[] = hero ? hero.slides : FALLBACK_SLIDES

  /* A beat with neither picture nor headline would animate an empty card, so
     only panels with something to show reach the stack. */
  /* A beat with neither picture nor headline would animate an empty card, so
     only panels with something to show reach the stack. With none published,
     the placeholder stands in. */
  const published = (hero?.story ?? []).filter((b) => b.image || b.title)
  const story: StoryPanel[] = published.length > 0 ? published : FALLBACK_STORY

  /* Clamped during render rather than corrected in an effect: if the CMS
     returns fewer slides than the index currently held, reading past the end
     must not survive even one frame. */
  const activeSlide = HERO_SLIDES.length > 0 ? heroSlide % HERO_SLIDES.length : 0
  /* Only the active slide is ever mounted (see the headline/subtitle blocks
     below) — a translated line can wrap to more lines than its English
     original, and a box sized in advance for one language overflows into
     whatever sits below it for another. Letting the box size itself to
     whichever slide is actually showing fixes that for any language, not
     just the ones a fixed height happened to have been tuned for. */
  const currentSlide: HeroSlide | undefined = HERO_SLIDES[activeSlide]
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
  /* Pointer parallax, now a drift rather than a tilt — the reel is a frame
     you look through, so nudging it reads better than rotating it. */
  const sceneDriftX = useTransform(px, [0, 1], [-14, 14])
  const sceneDriftY = useTransform(py, [0, 1], [-10, 10])

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
          /* The reel carries the pictures, so it takes the larger share. The
             copy column stays wide enough for the headline to break where it
             is meant to rather than becoming a narrow ribbon. */
          gridTemplateColumns: 'minmax(0, 0.85fr) minmax(0, 1.15fr)',
          gap: 44,
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
          {/* Headline — rotating, crossfaded to match the subtitle.
              Only the active slide is mounted (AnimatePresence swaps it
              rather than the old approach of stacking every slide absolutely
              inside a fixed-height box), and `layout` animates the box
              smoothly to whatever height that slide's own text actually
              needs — so a language whose lines wrap to more rows than the
              English original grows the box instead of spilling out of it. */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <AnimatePresence mode="wait">
              {currentSlide && (
                <motion.div
                  key={activeSlide}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  <h1 style={{ ...HEADLINE_STYLE, color: '#ffffff' }}>{currentSlide.line1}</h1>
                  {currentSlide.line2 && (
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
                      {currentSlide.line2}
                    </h1>
                  )}
                  <h1 style={{ ...HEADLINE_STYLE, color: 'rgba(255,255,255,0.78)' }}>{currentSlide.line3}</h1>
                </motion.div>
              )}
            </AnimatePresence>
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

          {/* Subtitle — rotating, same fix as the headline above: only the
              active slide is mounted, and `layout` grows the box to match
              its real height instead of a fixed reservation that a longer
              translation could overflow into the CTA row below. */}
          <div style={{ position: 'relative', marginBottom: 34 }}>
            <AnimatePresence mode="wait">
              {currentSlide && (
                <motion.p
                  key={activeSlide}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
                  style={{
                    fontSize: 17,
                    color: 'rgba(255,255,255,0.82)',
                    lineHeight: 1.78,
                    maxWidth: 470,
                    margin: 0,
                  }}
                >
                  {currentSlide.sub}
                </motion.p>
              )}
            </AnimatePresence>
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
              {t.home.heroOpenAccount}
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
              {t.home.heroExploreProducts}
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
              { v: 47, s: '+', l: t.home.statBranches },
              { v: 200, s: 'K+', l: t.home.statCustomers },
              { v: 9, s: '+', l: t.home.statYears },
              { v: 15, s: '+', l: t.home.statProducts },
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
            <StoryReel story={story} driftX={sceneDriftX} driftY={sceneDriftY} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
