import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import {
  IconBank,
  IconCreditCard,
  IconMobile,
  IconGlobe,
  IconBuilding,
  IconChart,
  IconBriefcase,
  IconHandshake,
  IconHome,
  IconCar,
  IconGraduate,
  IconBulb,
  IconGrid,
} from './Icons'
import { useCollection } from '../lib/content'

type IconComp = React.FC<{ size?: number; color?: string; strokeWidth?: number }>
type Service = { title: string; description: string; Icon: IconComp; highlight?: string }

/* ══════════════════════════════════════════════════════════════
   Each tab is a "chapter" with its own palette. Scrolling the
   section advances chapter by chapter while the panel stays
   pinned, so the three audiences read as three separate adverts
   rather than three states of one grid.

   Personal → pale daylight   Business → deep navy   Loans → bright blue
   ══════════════════════════════════════════════════════════════ */
type Chapter = {
  tab: string
  kicker: string
  title: string
  titleAccent: string
  lead: string
  bg: string
  fg: string
  sub: string
  accent: string
  cardBg: string
  cardBorder: string
  dark: boolean
  services: Service[]
}

/* Presentation — gradients, colours and icons — stays in code; only the
   service list inside each chapter is editorial and comes from the CMS. */
const CHAPTERS: Chapter[] = [
  {
    tab: 'Personal',
    kicker: 'For you and your family',
    title: 'Everyday banking,',
    titleAccent: 'built around your life',
    lead: 'Save, spend and send money on terms that work whether you are in Kigali, upcountry, or abroad.',
    bg: 'linear-gradient(150deg, #f0f9ff 0%, #e0f2fe 52%, #dbeafe 100%)',
    fg: '#0c4a6e',
    sub: '#436c8b',
    accent: '#0ea5e9',
    cardBg: '#ffffff',
    cardBorder: 'rgba(14,165,233,0.16)',
    dark: false,
    services: [
      {
        Icon: IconBank,
        title: 'Savings Account',
        description: 'Earn up to 7.5% per annum on your savings. Minimum balance of RWF 5,000 with no monthly fees.',
        highlight: '7.5% p.a.',
      },
      {
        Icon: IconCreditCard,
        title: 'Current Account',
        description: 'Manage your daily finances with unlimited transactions, a Visa debit card, and free internet banking.',
      },
      {
        Icon: IconMobile,
        title: 'Mobile Banking',
        description: 'Transfer money, pay bills and check balances 24/7 from any handset on *540# — no smartphone needed.',
        highlight: '*540#',
      },
      {
        Icon: IconGlobe,
        title: 'Diaspora Banking',
        description: 'Send money home to Rwanda with competitive exchange rates and no hidden fees for Rwandans abroad.',
      },
    ],
  },
  {
    tab: 'Business',
    kicker: 'For enterprises of every size',
    title: 'Capital and cash management',
    titleAccent: 'that keep you moving',
    lead: 'From a market stall to a cross-border importer — the accounts, financing and treasury tools to run it properly.',
    bg: 'linear-gradient(150deg, #0c4a6e 0%, #075985 52%, #0369a1 100%)',
    fg: '#ffffff',
    sub: 'rgba(224,242,254,0.76)',
    accent: '#38bdf8',
    cardBg: 'rgba(255,255,255,0.07)',
    cardBorder: 'rgba(186,230,253,0.18)',
    dark: true,
    services: [
      {
        Icon: IconBuilding,
        title: 'Business Current Account',
        description: 'Dedicated account for SMEs and corporates with bulk payment capabilities and cash management tools.',
      },
      {
        Icon: IconChart,
        title: 'Trade Finance',
        description: 'Letters of credit, bank guarantees and import/export financing to support your cross-border trade.',
        highlight: 'From 8% p.a.',
      },
      {
        Icon: IconBriefcase,
        title: 'Corporate Treasury',
        description: 'Optimise liquidity with sweep accounts, term deposits and FX solutions tailored to your business cycle.',
      },
      {
        Icon: IconHandshake,
        title: 'SME Banking',
        description: 'Specialised products for small and medium enterprises — from working capital to equipment financing.',
        highlight: '48h approval',
      },
    ],
  },
  {
    tab: 'Loans',
    kicker: 'For the step you are ready to take',
    title: 'Borrow with terms',
    titleAccent: 'that fit the plan',
    lead: 'Housing, vehicles, school fees or growth capital — structured around when the money actually comes in.',
    bg: 'linear-gradient(150deg, #0ea5e9 0%, #0284c7 55%, #075985 100%)',
    fg: '#ffffff',
    sub: 'rgba(224,242,254,0.82)',
    accent: '#bae6fd',
    cardBg: 'rgba(255,255,255,0.1)',
    cardBorder: 'rgba(255,255,255,0.22)',
    dark: true,
    services: [
      {
        Icon: IconHome,
        title: 'Home Loan',
        description: 'Finance your home in Rwanda with terms up to 20 years and competitive rates starting at 15%.',
        highlight: 'From 15% p.a.',
      },
      {
        Icon: IconCar,
        title: 'Auto Loan',
        description: 'Drive away in your new vehicle with financing up to 90% of the car value and 5-year repayment terms.',
      },
      {
        Icon: IconGraduate,
        title: 'Education Loan',
        description: "Invest in your future or your children's education with repayment aligned to academic calendars.",
        highlight: 'Grace period',
      },
      {
        Icon: IconBulb,
        title: 'Business Loan',
        description: 'Scale your business with working capital and term loans up to RWF 500M for qualifying enterprises.',
      },
    ],
  },
]

/* ── Card ── */
function ServiceCard({ service, chapter, index }: { service: Service; chapter: Chapter; index: number }) {
  const [hover, setHover] = useState(false)
  return (
    <motion.article
      initial={{ opacity: 0, y: 46, rotateX: -9 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, y: -26, transition: { duration: 0.26, delay: index * 0.03 } }}
      transition={{ duration: 0.55, delay: 0.16 + index * 0.075, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: chapter.cardBg,
        border: `1.5px solid ${hover ? chapter.accent : chapter.cardBorder}`,
        borderRadius: 18,
        padding: '24px 22px',
        position: 'relative',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        backdropFilter: chapter.dark ? 'blur(14px)' : undefined,
        WebkitBackdropFilter: chapter.dark ? 'blur(14px)' : undefined,
        boxShadow: hover
          ? `0 22px 46px rgba(2,25,50,${chapter.dark ? 0.34 : 0.14})`
          : `0 6px 22px rgba(2,25,50,${chapter.dark ? 0.2 : 0.06})`,
        transform: hover ? 'translateY(-7px)' : 'translateY(0)',
        transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1), box-shadow 0.28s, border-color 0.28s',
      }}
    >
      {/* Accent stripe fills across on hover */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 3,
          width: hover ? '100%' : '34%',
          background: `linear-gradient(90deg, ${chapter.accent}, transparent)`,
          transition: 'width 0.45s cubic-bezier(0.22,1,0.36,1)',
        }}
      />

      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 13,
          marginBottom: 15,
          background: chapter.dark ? 'rgba(255,255,255,0.1)' : 'rgba(14,165,233,0.09)',
          border: `1px solid ${chapter.dark ? 'rgba(255,255,255,0.16)' : 'rgba(14,165,233,0.14)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <service.Icon size={21} color={chapter.accent} strokeWidth={1.85} />
      </div>

      {service.highlight && (
        <div
          style={{
            display: 'inline-block',
            fontSize: 10,
            fontWeight: 800,
            color: chapter.dark ? '#0c4a6e' : '#0369a1',
            background: chapter.dark ? chapter.accent : 'rgba(14,165,233,0.12)',
            borderRadius: 100,
            padding: '2.5px 10px',
            letterSpacing: '0.05em',
            marginBottom: 9,
            textTransform: 'uppercase',
          }}
        >
          {service.highlight}
        </div>
      )}

      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 17.5,
          fontWeight: 700,
          color: chapter.fg,
          margin: '0 0 9px',
          lineHeight: 1.28,
          letterSpacing: '-0.01em',
        }}
      >
        {service.title}
      </h3>
      <p style={{ fontSize: 13.5, color: chapter.sub, lineHeight: 1.68, margin: 0 }}>{service.description}</p>

      <div
        style={{
          marginTop: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 12.5,
          fontWeight: 800,
          color: chapter.accent,
        }}
      >
        Learn more
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
          style={{ transform: hover ? 'translateX(4px)' : 'none', transition: 'transform 0.28s' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </motion.article>
  )
}

/** What the CMS stores for one service. */
interface CmsService {
  tab: string
  title: string
  description: string
  highlight: string
}

/* Merges CMS services into the hardcoded chapters. Icons are not modelled in
   the CMS, so each chapter reuses its own icons in order and repeats the last
   one if editors add more services than there are icons. */
function useChapters(): Chapter[] {
  const { data: services, degraded } = useCollection<CmsService>('service', [])

  return useMemo(() => {
    // Only an unreachable API falls back; a chapter the editors have left
    // empty renders empty rather than showing built-in services beside real
    // ones, which would be indistinguishable to a reader.
    if (degraded) return CHAPTERS

    return CHAPTERS.map((chapter) => {
      const forTab = services.filter((s) => s.tab === chapter.tab)

      return {
        ...chapter,
        services: forTab.map((s, i) => ({
          title: s.title,
          description: s.description,
          Icon:
            chapter.services[i]?.Icon ??
            chapter.services[chapter.services.length - 1]?.Icon ??
            IconBank,
          ...(s.highlight ? { highlight: s.highlight } : {}),
        })),
      }
    })
  }, [services, degraded])
}

/* ── The pinned chapter panel ── */
function PinnedServices() {
  const sectionRef = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const chapters = useChapters()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  /* Discrete chapter index. `useMotionValueEvent` runs outside React, so
     this only ever calls setState on an actual chapter change — three
     renders across the whole scroll, not one per frame. */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(Math.floor(v * chapters.length), chapters.length - 1)
    setIndex((prev) => (prev === next ? prev : next))
  })

  /* Position inside the current chapter, 0 → 1. Drives the continuous
     motion that keeps the panel alive while it is pinned. */
  const localP = useTransform(scrollYProgress, (v) => {
    const scaled = v * chapters.length
    return scaled - Math.min(Math.floor(scaled), chapters.length - 1)
  })

  const railFill = useTransform(scrollYProgress, [0, 1], [0, 1])
  const cardsDrift = useTransform(localP, [0, 1], [18, -18])
  const bgDrift = useTransform(localP, [0, 1], ['0%', '-6%'])
  const teaserOpacity = useTransform(localP, [0.5, 0.92], [0, 1])
  const teaserFill = useTransform(localP, [0.5, 1], [0, 1])

  const chapter = chapters[index]
  const next = chapters[index + 1]

  /* Clicking a tab or a rail dot scrolls to the middle of that chapter,
     so the section is navigable without hunting with the wheel. */
  const goTo = useCallback(
    (i: number) => {
      const el = sectionRef.current
      if (!el) return
      const top = el.offsetTop
      const range = el.offsetHeight - window.innerHeight
      window.scrollTo({ top: top + ((i + 0.5) / chapters.length) * range, behavior: 'smooth' })
    },
    // The chapter count drives the scroll maths, so a stale value would
    // scroll to the wrong offset once CMS services load.
    [chapters.length],
  )

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{ position: 'relative', height: `${chapters.length * 100}vh` }}
      aria-label="Our services"
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Chapter background — cross-fades between chapters */}
        <AnimatePresence initial={false}>
          <motion.div
            key={chapter.tab}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, background: chapter.bg }}
          />
        </AnimatePresence>

        {/* Drifting texture */}
        <motion.div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-10%',
            y: bgDrift,
            opacity: chapter.dark ? 0.06 : 0.05,
            backgroundImage:
              'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '34px 34px',
            color: chapter.dark ? '#bae6fd' : '#0ea5e9',
            pointerEvents: 'none',
          }}
        />

        {/* Giant chapter numeral */}
        <AnimatePresence initial={false}>
          <motion.div
            key={`num-${chapter.tab}`}
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1.25 }}
            animate={{ opacity: chapter.dark ? 0.07 : 0.05, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              right: '3%',
              bottom: '-6%',
              fontSize: 'clamp(200px, 34vw, 460px)',
              fontWeight: 900,
              lineHeight: 0.8,
              letterSpacing: '-0.06em',
              color: chapter.fg,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </motion.div>
        </AnimatePresence>

        {/* ── Content ── */}
        <div
          className="services-pinned"
          style={{
            position: 'relative',
            height: '100%',
            maxWidth: 1300,
            margin: '0 auto',
            padding: '128px 48px 40px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header row: pill + tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
              marginBottom: 26,
            }}
          >
            <span
              className="section-pill section-pill--icon"
              style={{
                background: chapter.dark ? 'rgba(186,230,253,0.12)' : 'rgba(14,165,233,0.09)',
                border: `1.5px solid ${chapter.dark ? 'rgba(186,230,253,0.24)' : 'rgba(14,165,233,0.2)'}`,
                color: chapter.accent,
              }}
            >
              <IconGrid size={14} strokeWidth={2} color={chapter.accent} />
              Our Services
            </span>

            <div role="tablist" aria-label="Service categories" style={{ display: 'flex', gap: 6 }}>
              {chapters.map((c, i) => {
                const on = i === index
                return (
                  <button
                    key={c.tab}
                    role="tab"
                    aria-selected={on}
                    onClick={() => goTo(i)}
                    style={{
                      position: 'relative',
                      padding: '9px 20px',
                      fontSize: 13.5,
                      fontWeight: 800,
                      border: `1.5px solid ${on ? chapter.accent : 'transparent'}`,
                      borderRadius: 100,
                      background: on
                        ? chapter.dark
                          ? 'rgba(255,255,255,0.12)'
                          : 'rgba(14,165,233,0.1)'
                        : 'transparent',
                      color: on ? chapter.accent : chapter.sub,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'color 0.25s, background 0.25s, border-color 0.25s',
                    }}
                  >
                    {c.tab}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Headline + lead, swapped per chapter */}
          <div style={{ position: 'relative', minHeight: 168, marginBottom: 12 }}>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={chapter.tab}
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -26 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 800,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: chapter.accent,
                    marginBottom: 12,
                  }}
                >
                  {chapter.kicker}
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 700,
                    fontSize: 'clamp(28px, 3.6vw, 50px)',
                    color: chapter.fg,
                    lineHeight: 1.08,
                    letterSpacing: '-0.025em',
                    margin: '0 0 12px',
                  }}
                >
                  {chapter.title}
                  <br />
                  <span style={{ color: chapter.accent }}>{chapter.titleAccent}</span>
                </h2>
                <p style={{ fontSize: 15.5, color: chapter.sub, lineHeight: 1.7, maxWidth: 560, margin: 0 }}>
                  {chapter.lead}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Cards */}
          <motion.div style={{ y: cardsDrift, flex: 1, minHeight: 0, perspective: 1100 }}>
            <div style={{ position: 'relative', height: '100%' }}>
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={chapter.tab}
                  className="services-cards"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 18,
                    alignContent: 'start',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {chapter.services.map((s, i) => (
                    <ServiceCard key={s.title} service={s} chapter={chapter} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Footer rail: progress + next-chapter teaser */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              flexWrap: 'wrap',
              paddingTop: 18,
              borderTop: `1px solid ${chapter.dark ? 'rgba(255,255,255,0.14)' : 'rgba(14,165,233,0.14)'}`,
            }}
          >
            {/* Rail */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  position: 'relative',
                  width: 132,
                  height: 3,
                  borderRadius: 3,
                  background: chapter.dark ? 'rgba(255,255,255,0.18)' : 'rgba(14,165,233,0.18)',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: chapter.accent,
                    transformOrigin: '0% 50%',
                    scaleX: railFill,
                  }}
                />
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: chapter.sub, letterSpacing: '0.06em' }}>
                {String(index + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}
              </span>
            </div>

            {/* Next-up teaser, or the CTA on the last chapter */}
            {next ? (
              <motion.button
                onClick={() => goTo(index + 1)}
                style={{
                  opacity: teaserOpacity,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 14,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: chapter.sub,
                    }}
                  >
                    Keep scrolling — next
                  </span>
                  <span style={{ display: 'block', fontSize: 16, fontWeight: 900, color: chapter.fg }}>
                    {next.tab} Banking
                  </span>
                </span>
                <span
                  style={{
                    position: 'relative',
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    border: `1.5px solid ${chapter.accent}`,
                    color: chapter.accent,
                    flexShrink: 0,
                  }}
                >
                  {/* Ring fills as the next chapter approaches */}
                  <motion.span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      inset: -1.5,
                      borderRadius: '50%',
                      background: chapter.accent,
                      opacity: 0.16,
                      scale: teaserFill,
                    }}
                  />
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.6}
                    aria-hidden="true"
                    style={{ position: 'relative', animation: 'floatY 2.2s ease-in-out infinite' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6" />
                  </svg>
                </span>
              </motion.button>
            ) : (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <a
                  href="#contact"
                  style={{
                    padding: '11px 24px',
                    borderRadius: 100,
                    background: chapter.accent,
                    color: '#0c4a6e',
                    fontWeight: 800,
                    fontSize: 13.5,
                    textDecoration: 'none',
                  }}
                >
                  Talk to an Advisor
                </a>
                <a
                  href="#products"
                  style={{
                    padding: '11px 24px',
                    borderRadius: 100,
                    border: `1.5px solid ${chapter.accent}`,
                    color: chapter.accent,
                    fontWeight: 700,
                    fontSize: 13.5,
                    textDecoration: 'none',
                  }}
                >
                  View All Products →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Fallback ──
   Pinning depends on a stable viewport height and a real scroll wheel.
   On narrow screens (where the mobile URL bar resizes the viewport) and
   under prefers-reduced-motion, the chapters render as plain stacked
   blocks with the same content and no scroll hijacking. */
function StackedServices() {
  const chapters = useChapters()

  return (
    <section id="services" style={{ background: '#ffffff' }} aria-label="Our services">
      {chapters.map((chapter, i) => (
        <div key={chapter.tab} style={{ background: chapter.bg, padding: '64px 24px' }}>
          <div style={{ maxWidth: 1180, margin: '0 auto' }}>
            <span
              className="section-pill section-pill--icon"
              style={{
                background: chapter.dark ? 'rgba(186,230,253,0.12)' : 'rgba(14,165,233,0.09)',
                border: `1.5px solid ${chapter.dark ? 'rgba(186,230,253,0.24)' : 'rgba(14,165,233,0.2)'}`,
                color: chapter.accent,
              }}
            >
              <IconGrid size={14} strokeWidth={2} color={chapter.accent} />
              {chapter.tab}
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 700,
                fontSize: 'clamp(26px, 6vw, 38px)',
                color: chapter.fg,
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
                margin: '14px 0 10px',
              }}
            >
              {chapter.title} <span style={{ color: chapter.accent }}>{chapter.titleAccent}</span>
            </h2>
            <p style={{ fontSize: 15, color: chapter.sub, lineHeight: 1.7, margin: '0 0 28px', maxWidth: 560 }}>
              {chapter.lead}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {chapter.services.map((s, si) => (
                <ServiceCard key={s.title} service={s} chapter={chapter} index={si} />
              ))}
            </div>
            {i === chapters.length - 1 && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 28 }}>
                <a
                  href="#contact"
                  style={{
                    padding: '12px 26px',
                    borderRadius: 100,
                    background: chapter.accent,
                    color: '#0c4a6e',
                    fontWeight: 800,
                    fontSize: 14,
                    textDecoration: 'none',
                  }}
                >
                  Talk to an Advisor
                </a>
                <a
                  href="#products"
                  style={{
                    padding: '12px 26px',
                    borderRadius: 100,
                    border: `1.5px solid ${chapter.accent}`,
                    color: chapter.accent,
                    fontWeight: 700,
                    fontSize: 14,
                    textDecoration: 'none',
                  }}
                >
                  View All Products →
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}

const PIN_QUERY = '(min-width: 1024px) and (min-height: 640px)'

/** Pin only where it works: wide viewport, enough height, motion allowed. */
function useCanPin() {
  const reduce = useReducedMotion()
  // Seeded from matchMedia during the first render — initialising to
  // `false` would flash the stacked fallback before the effect ran.
  const [wide, setWide] = useState(() => window.matchMedia(PIN_QUERY).matches)

  useEffect(() => {
    const q = window.matchMedia(PIN_QUERY)
    const update = () => setWide(q.matches)
    q.addEventListener('change', update)
    return () => q.removeEventListener('change', update)
  }, [])

  return wide && !reduce
}

export default function Services() {
  return useCanPin() ? <PinnedServices /> : <StackedServices />
}
