import { motion } from 'framer-motion'
import { IconStar, IconUsers, IconCheckCircle, IconArrowRight } from '../components/Icons'
import PageHero from '../components/page/PageHero'
import SmartImage from '../components/page/SmartImage'
import { Chip, Section } from '../components/page/ui'
import { useSingleton } from '../lib/content'
import { useT } from '../lib/i18n'
import {
  AWARD_CRITERIA,
  EMPLOYEE_OF_THE_MONTH,
  EMPLOYEE_OF_THE_YEAR,
  PAST_MONTHLY,
  type Award,
  type PastAward,
} from '../data/site'

const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'

/* The CMS holds the two live winners in named slots rather than a collection —
   there is only ever one of each — and every metric carries its own id so the
   editor can reorder them. */
type Winner = Omit<Award, 'id' | 'metrics'> & {
  metrics: { id: string; value: string; label: string }[]
}

interface AwardsDocument {
  employeeOfYear: Winner
  employeeOfMonth: Winner
  pastMonthly: PastAward[]
}

const withMetricIds = ({ id: _id, ...award }: Award): Winner => ({
  ...award,
  metrics: award.metrics.map((m, i) => ({ ...m, id: `m-${String(i + 1)}` })),
})

/** Shown only until the CMS responds, and if it never does. */
const FALLBACK_AWARDS: AwardsDocument = {
  employeeOfYear: withMetricIds(EMPLOYEE_OF_THE_YEAR),
  employeeOfMonth: withMetricIds(EMPLOYEE_OF_THE_MONTH),
  pastMonthly: PAST_MONTHLY,
}

/* Laurel used as the award seal on both spotlight cards. */
function Laurel({ size = 22, color = '#0c4a6e' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} aria-hidden="true">
      <path d="M12 3v18" strokeLinecap="round" />
      <path d="M12 6c-3 0-5 2-5 4.5S9 15 12 15M12 6c3 0 5 2 5 4.5S15 15 12 15" strokeLinecap="round" />
      <path d="M12 10c-2 0-3.4 1.2-3.4 3S10 16 12 16M12 10c2 0 3.4 1.2 3.4 3S14 16 12 16" strokeLinecap="round" />
    </svg>
  )
}

/* Spotlight card. `tier` changes the whole treatment: the year award is a
   dark, ceremonial panel; the month award is a lighter, more immediate one.
   They deliberately do not look like the same card twice. */
function Spotlight({ award, tier, index }: { award: Winner; tier: 'year' | 'month'; index: number }) {
  const t = useT()
  const isYear = tier === 'year'

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        borderRadius: 22,
        overflow: 'hidden',
        background: isYear
          ? 'linear-gradient(152deg, #0c4a6e 0%, #075985 48%, #0369a1 100%)'
          : 'linear-gradient(152deg, #ffffff 0%, #f0f9ff 60%, #e0f2fe 100%)',
        border: `1px solid ${isYear ? 'rgba(186,230,253,0.2)' : 'rgba(14,165,233,0.18)'}`,
        boxShadow: isYear ? '0 30px 70px rgba(2,25,50,0.28)' : '0 18px 44px rgba(2,30,60,0.1)',
      }}
    >
      <div className="award-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 300px) minmax(0, 1fr)' }}>
        {/* Portrait */}
        <div style={{ position: 'relative', minHeight: 380 }}>
          <SmartImage src={award.photo} alt={`${award.name}, ${award.role}`} />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: isYear
                ? 'linear-gradient(90deg, rgba(12,74,110,0.1) 40%, rgba(12,74,110,0.92) 100%)'
                : 'linear-gradient(90deg, rgba(255,255,255,0) 45%, rgba(240,249,255,0.95) 100%)',
            }}
          />
          {/* Award seal */}
          <div
            style={{
              position: 'absolute',
              top: 18,
              left: 18,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: isYear ? '#bae6fd' : '#0ea5e9',
              color: isYear ? '#0c4a6e' : '#ffffff',
              borderRadius: 100,
              padding: '6px 14px 6px 10px',
              fontSize: 10.5,
              fontWeight: 900,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              boxShadow: '0 8px 22px rgba(2,25,50,0.28)',
            }}
          >
            <Laurel size={16} color={isYear ? '#0c4a6e' : '#ffffff'} />
            {isYear ? t.awards.employeeOfYear : t.awards.employeeOfMonth}
          </div>
        </div>

        {/* Citation */}
        <div style={{ padding: '34px 36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: isYear ? 'rgba(186,230,253,0.72)' : '#0ea5e9',
              marginBottom: 10,
            }}
          >
            {award.periodShort.toUpperCase()}
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              fontWeight: 700,
              color: isYear ? '#ffffff' : '#0f172a',
              lineHeight: 1.1,
              letterSpacing: '-0.028em',
              margin: '0 0 8px',
            }}
          >
            {award.name}
          </h2>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            <span
              style={{
                fontSize: 13.5,
                fontWeight: 800,
                color: isYear ? '#bae6fd' : '#0284c7',
              }}
            >
              {award.role}
            </span>
            <span aria-hidden="true" style={{ color: isYear ? 'rgba(186,230,253,0.4)' : '#94a3b8' }}>
              ·
            </span>
            <span style={{ fontSize: 13.5, color: isYear ? 'rgba(224,242,254,0.7)' : '#647080' }}>
              {award.branch}
            </span>
          </div>

          <p
            style={{
              fontSize: 14.5,
              lineHeight: 1.82,
              color: isYear ? 'rgba(224,242,254,0.78)' : '#647080',
              margin: '0 0 22px',
            }}
          >
            {award.citation}
          </p>

          {/* Their own words — this is what stops it reading as an HR notice */}
          <blockquote
            style={{
              margin: '0 0 24px',
              paddingLeft: 18,
              borderLeft: `3px solid ${isYear ? 'rgba(186,230,253,0.45)' : '#0ea5e9'}`,
              fontFamily: 'var(--font-serif)',
              fontSize: 16.5,
              fontStyle: 'italic',
              lineHeight: 1.65,
              color: isYear ? '#ffffff' : '#0f172a',
            }}
          >
            “{award.quote}”
          </blockquote>

          {/* Measured results */}
          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
            {award.metrics.map((m, i) => (
              <div
                key={m.id}
                style={{
                  flex: '1 1 110px',
                  padding: '0 16px',
                  borderLeft:
                    i > 0
                      ? `1px solid ${isYear ? 'rgba(186,230,253,0.2)' : 'rgba(14,165,233,0.18)'}`
                      : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 23,
                    fontWeight: 700,
                    color: isYear ? '#ffffff' : '#0284c7',
                    lineHeight: 1,
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    fontSize: 9.5,
                    fontWeight: 800,
                    letterSpacing: '0.09em',
                    textTransform: 'uppercase',
                    color: isYear ? 'rgba(186,230,253,0.62)' : '#94a3b8',
                    marginTop: 5,
                  }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default function Awards() {
  const t = useT()
  const { data: awards } = useSingleton<AwardsDocument>('award', FALLBACK_AWARDS)

  return (
    <main>
      <PageHero
        Icon={IconStar}
        eyebrow={t.heroes.peopleEyebrow}
        title={t.heroes.peopleTitle}
        lead={t.heroes.peopleLead}
        meta={
          <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap' }}>
            {[
              ['12', t.awards.awardsAYear],
              ['700+', t.awards.colleaguesEligible],
              ['2018', t.awards.runningSince],
            ].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  {v}
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(186,230,253,0.72)',
                    marginTop: 5,
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
        }
      />

      <Section style={{ paddingBottom: 40 }}>
        <div style={{ display: 'grid', gap: 26 }}>
          <Spotlight award={awards.employeeOfYear} tier="year" index={0} />
          <Spotlight award={awards.employeeOfMonth} tier="month" index={1} />
        </div>
      </Section>

      {/* ── Roll of honour ── */}
      <Section style={{ padding: '20px 0 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 24,
              fontWeight: 700,
              color: '#0284c7',
              margin: 0,
              whiteSpace: 'nowrap',
              letterSpacing: '-0.015em',
            }}
          >
            {t.awards.rollOfHonour}
          </h2>
          <span aria-hidden="true" style={{ flex: 1, height: 1, background: 'rgba(14,165,233,0.18)' }} />
          <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>
            {String(awards.pastMonthly.length).padStart(2, '0')}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {awards.pastMonthly.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: 'easeOut' }}
              style={{
                display: 'flex',
                gap: 14,
                padding: '18px 20px',
                background: '#ffffff',
                border: '1px solid rgba(14,165,233,0.13)',
                borderRadius: 14,
                boxShadow: '0 2px 12px rgba(2,30,60,0.04)',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'rgba(14,165,233,0.09)',
                  border: '1px solid rgba(14,165,233,0.16)',
                }}
              >
                <Laurel size={19} color="#0284c7" />
              </span>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#94a3b8',
                    marginBottom: 5,
                  }}
                >
                  {p.period}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#0284c7', fontWeight: 700, marginBottom: 7 }}>
                  {p.role} · {p.branch}
                </div>
                <p style={{ fontSize: 12.5, color: '#647080', lineHeight: 1.65, margin: 0 }}>{p.reason}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── How winners are chosen ── */}
      <div style={{ background: '#f8fbfe', borderTop: '1px solid rgba(14,165,233,0.12)' }}>
        <Section style={{ padding: '56px 0 72px' }}>
          <div style={{ maxWidth: 620, marginBottom: 30 }}>
            <Chip tone="blue">{t.awards.howChosen}</Chip>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(24px, 3vw, 34px)',
                fontWeight: 700,
                color: '#0f172a',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                margin: '14px 0 12px',
              }}
            >
              {t.awards.howChosenHeading}
            </h2>
            <p style={{ fontSize: 15, color: '#647080', lineHeight: 1.78, margin: 0 }}>
              Any colleague can nominate any other. Nominations go to a panel drawn from branch management, HR and the
              previous year's winner. Sales numbers alone have never won it.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {AWARD_CRITERIA.map((c, i) => (
              <div
                key={c.title}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(14,165,233,0.13)',
                  borderRadius: 14,
                  padding: '22px 22px 24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <IconCheckCircle size={17} strokeWidth={2.2} color="#0ea5e9" />
                  <span style={{ fontFamily: MONO, fontSize: 10.5, fontWeight: 700, color: '#94a3b8' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 7px' }}>{c.title}</h3>
                <p style={{ fontSize: 13, color: '#647080', lineHeight: 1.68, margin: 0 }}>{c.body}</p>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 30,
              padding: '24px 28px',
              background: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 20,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
              <IconUsers size={26} strokeWidth={1.8} color="#bae6fd" />
              <div>
                <div style={{ fontSize: 16.5, fontWeight: 800, color: '#ffffff', marginBottom: 3 }}>
                  {t.awards.hiringTitle}
                </div>
                <div style={{ fontSize: 13.5, color: 'rgba(224,242,254,0.75)' }}>
                  {t.awards.hiringBody}
                </div>
              </div>
            </div>
            <a
              href="/careers"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#bae6fd',
                color: '#0c4a6e',
                borderRadius: 100,
                padding: '12px 24px',
                fontWeight: 800,
                fontSize: 14,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {t.awards.seeOpenRoles}
              <IconArrowRight size={15} strokeWidth={2.4} color="#0c4a6e" />
            </a>
          </div>
        </Section>
      </div>
    </main>
  )
}
