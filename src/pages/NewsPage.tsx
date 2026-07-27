import { useState } from 'react'
import { IconNews, IconAlert, IconArrowRight, IconCalendar } from '../components/Icons'
import PageHero from '../components/page/PageHero'
import SmartImage from '../components/page/SmartImage'
import { Chip, Section, type Tone } from '../components/page/ui'
import { NOTICES, formatDate, type NoticeLevel } from '../data/site'

const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'

/* Press releases mirror the seed data used by the home-page News section.
   Kept here so this page reads as the full archive rather than the
   three-item teaser the one-pager shows. */
const PRESS = [
  {
    id: 'p1',
    category: 'Bancassurance',
    tag: 'New Product',
    date: '2026-07-12',
    title: 'NGOBOKA Life Insurance Now Available at All AB Rwanda Branches',
    excerpt:
      'In partnership with Sanlam Vie, AB Rwanda launches NGOBOKA — an accessible life insurance scheme offering individual coverage from RWF 400/month and family protection for spouse and up to four children from RWF 900/month.',
    image: 'https://images.unsplash.com/photo-1678225894217-ec0de2dc0548?w=1200&h=700&fit=crop&auto=format',
  },
  {
    id: 'p2',
    category: 'Digital',
    tag: 'Milestone',
    date: '2026-05-30',
    title: 'E-kash Surpasses 50,000 Active Users Across All Networks',
    excerpt:
      'Our digital payment platform E-kash — accessible via *540# — now covers all major mobile network operators and partner banks, bringing seamless mobile banking to every corner of Rwanda.',
    image: 'https://images.unsplash.com/photo-1708772565599-2c4e4b3ed9db?w=600&h=400&fit=crop&auto=format',
  },
  {
    id: 'p3',
    category: 'Network',
    tag: 'Expansion',
    date: '2026-04-08',
    title: 'AB Rwanda Opens Its 47th Service Point in Ngoma',
    excerpt:
      'The new credit outlet extends the bank network deeper into the Eastern Province, serving agri-businesses and traders across the Ngoma catchment area.',
    image: 'https://images.unsplash.com/photo-1585540083814-ea6ee8af9e4f?w=600&h=400&fit=crop&auto=format',
  },
  {
    id: 'p4',
    category: 'Corporate',
    tag: 'Results',
    date: '2026-04-05',
    title: 'AB Bank Rwanda Publishes Audited FY2025 Financial Statements',
    excerpt:
      'The bank reports continued portfolio growth and improved asset quality for the financial year ended 31 December 2025. Full statements are available on the Forms & Downloads page.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&auto=format',
  },
]

const LEVEL: Record<NoticeLevel, { tone: Tone; band: string; ink: string; wash: string }> = {
  Information: { tone: 'blue', band: '#0ea5e9', ink: '#0284c7', wash: 'rgba(14,165,233,0.05)' },
  Important: { tone: 'amber', band: '#d97706', ink: '#b45309', wash: 'rgba(217,119,6,0.05)' },
  Urgent: { tone: 'red', band: '#dc2626', ink: '#b91c1c', wash: 'rgba(220,38,38,0.05)' },
}

/** Big day / month-year rail — the archive's spine. */
function DateRail({ iso }: { iso: string }) {
  const d = new Date(iso + 'T00:00:00')
  return (
    <div style={{ textAlign: 'center', flexShrink: 0, width: 66 }}>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 34, fontWeight: 700, color: '#0284c7', lineHeight: 1 }}>
        {d.getDate()}
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#94a3b8',
          marginTop: 5,
        }}
      >
        {d.toLocaleDateString('en-GB', { month: 'short' })}
        <br />
        {d.getFullYear()}
      </div>
    </div>
  )
}

type Tab = 'press' | 'notices'

export default function NewsPage() {
  const [tab, setTab] = useState<Tab>('press')
  const [openNotice, setOpenNotice] = useState<string | null>(NOTICES[0]?.id ?? null)
  const [lead, ...rest] = PRESS

  return (
    <main>
      <PageHero
        Icon={IconNews}
        eyebrow="Media"
        title="News, press releases & public notices"
        lead="Official announcements from AB Bank Rwanda Plc — product launches, network milestones, corporate results, and the regulatory notices that may affect your account."
      />

      <Section>
        {/* Tabs — press releases and notices are both "media", but one is
            promotional and one is contractual, so they are kept apart. */}
        <div role="tablist" aria-label="Media type" style={{ display: 'flex', gap: 8, marginBottom: 34, flexWrap: 'wrap' }}>
          {(
            [
              ['press', 'Press releases', PRESS.length],
              ['notices', 'Public notices', NOTICES.length],
            ] as const
          ).map(([id, label, count]) => {
            const on = tab === id
            return (
              <button
                key={id}
                role="tab"
                aria-selected={on}
                onClick={() => setTab(id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: on ? '#0ea5e9' : 'rgba(14,165,233,0.07)',
                  color: on ? '#fff' : '#0284c7',
                  border: `1px solid ${on ? '#0ea5e9' : 'rgba(14,165,233,0.18)'}`,
                  borderRadius: 100,
                  padding: '9px 20px',
                  fontSize: 13.5,
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.18s, color 0.18s',
                }}
              >
                {label}
                <span
                  style={{
                    background: on ? 'rgba(255,255,255,0.22)' : 'rgba(14,165,233,0.14)',
                    borderRadius: 100,
                    padding: '1px 8px',
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {tab === 'press' ? (
          <>
            {/* ── Lead story: copy sits on the image, newsroom style ── */}
            <article className="news-lead" style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ position: 'relative', minHeight: 440 }}>
                <SmartImage src={lead.image} />
                {/* Scrim: strong at the bottom so the headline always has a ground */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(2,30,60,0.16) 0%, rgba(2,30,60,0.36) 42%, rgba(4,26,48,0.88) 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    minHeight: 440,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '40px 44px 36px',
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        background: '#0ea5e9',
                        color: '#fff',
                        borderRadius: 100,
                        padding: '4px 13px',
                        fontSize: 10.5,
                        fontWeight: 900,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {lead.category}
                    </span>
                    <span
                      style={{
                        background: 'rgba(255,255,255,0.16)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: '#fff',
                        borderRadius: 100,
                        padding: '4px 13px',
                        fontSize: 10.5,
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {lead.tag}
                    </span>
                  </div>

                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(24px, 3.2vw, 42px)',
                      fontWeight: 700,
                      color: '#fff',
                      lineHeight: 1.14,
                      letterSpacing: '-0.025em',
                      margin: '0 0 14px',
                      maxWidth: 780,
                      textShadow: '0 2px 20px rgba(2,20,40,0.4)',
                    }}
                  >
                    {lead.title}
                  </h2>
                  <p
                    style={{
                      fontSize: 15,
                      color: 'rgba(224,242,254,0.86)',
                      lineHeight: 1.75,
                      margin: '0 0 20px',
                      maxWidth: 660,
                    }}
                  >
                    {lead.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 7,
                        fontFamily: MONO,
                        fontSize: 11.5,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        color: 'rgba(224,242,254,0.7)',
                      }}
                    >
                      <IconCalendar size={13} strokeWidth={2} color="rgba(224,242,254,0.7)" />
                      {formatDate(lead.date)}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 7,
                        fontSize: 13.5,
                        fontWeight: 800,
                        color: '#bae6fd',
                      }}
                    >
                      Read the full release
                      <IconArrowRight size={14} strokeWidth={2.4} color="#bae6fd" />
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* ── Archive index: date rail + thumbnail + copy, hairline rows ── */}
            <div style={{ borderTop: '1px solid rgba(14,165,233,0.16)' }}>
              {rest.map((n) => (
                <PressRow key={n.id} item={n} />
              ))}
            </div>
          </>
        ) : (
          /* ── Public notices: a formal register, not a feed ── */
          <div style={{ display: 'grid', gap: 14 }}>
            {NOTICES.map((notice) => {
              const L = LEVEL[notice.level]
              const open = openNotice === notice.id
              return (
                <article
                  key={notice.id}
                  style={{
                    display: 'flex',
                    background: open ? L.wash : '#ffffff',
                    border: '1px solid rgba(14,165,233,0.14)',
                    borderRadius: 14,
                    overflow: 'hidden',
                    transition: 'background 0.24s ease',
                  }}
                >
                  {/* Severity band */}
                  <div aria-hidden="true" style={{ width: 6, flexShrink: 0, background: L.band }} />

                  <div style={{ flex: 1, minWidth: 0, padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                      <span
                        style={{
                          fontFamily: MONO,
                          fontSize: 11.5,
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          color: L.ink,
                          background: L.wash,
                          border: `1px solid ${L.band}33`,
                          borderRadius: 5,
                          padding: '3px 9px',
                        }}
                      >
                        {notice.ref}
                      </span>
                      <Chip tone={L.tone}>{notice.level}</Chip>
                      {notice.level === 'Urgent' && (
                        <span style={{ display: 'inline-flex' }}>
                          <IconAlert size={16} strokeWidth={2.2} color={L.band} />
                        </span>
                      )}
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: 10.5,
                          fontWeight: 800,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: '#94a3b8',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Effective {formatDate(notice.effective)}
                      </span>
                    </div>

                    <button
                      onClick={() => setOpenNotice(open ? null : notice.id)}
                      aria-expanded={open}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: 17,
                        fontWeight: 800,
                        color: '#0f172a',
                        lineHeight: 1.38,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {notice.title}
                    </button>

                    {open && (
                      <p
                        style={{
                          fontSize: 13.5,
                          color: '#647080',
                          lineHeight: 1.8,
                          margin: '12px 0 0',
                          paddingLeft: 14,
                          borderLeft: `2px solid ${L.band}44`,
                          maxWidth: 780,
                        }}
                      >
                        {notice.body}
                      </p>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </Section>
    </main>
  )
}

function PressRow({ item }: { item: (typeof PRESS)[number] }) {
  const [hover, setHover] = useState(false)
  return (
    <article
      className="press-row"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        padding: '26px 16px 26px 8px',
        borderBottom: '1px solid rgba(14,165,233,0.16)',
        background: hover ? 'rgba(14,165,233,0.035)' : 'transparent',
        transition: 'background 0.2s ease',
      }}
    >
      <DateRail iso={item.date} />

      <div
        style={{
          position: 'relative',
          width: 148,
          height: 96,
          flexShrink: 0,
          borderRadius: 12,
          overflow: 'hidden',
        }}
        className="press-thumb"
      >
        <SmartImage src={item.image} style={{ transform: hover ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          <Chip tone="blue">{item.category}</Chip>
          <Chip tone="grey">{item.tag}</Chip>
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 19,
            fontWeight: 700,
            color: hover ? '#0ea5e9' : '#0f172a',
            lineHeight: 1.3,
            margin: '0 0 7px',
            letterSpacing: '-0.015em',
            transition: 'color 0.2s ease',
          }}
        >
          {item.title}
        </h3>
        <p style={{ fontSize: 13.5, color: '#647080', lineHeight: 1.7, margin: 0, maxWidth: 720 }}>{item.excerpt}</p>
      </div>

      <span
        aria-hidden="true"
        className="press-chevron"
        style={{
          flexShrink: 0,
          width: 38,
          height: 38,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          border: `1.5px solid ${hover ? '#0ea5e9' : 'rgba(14,165,233,0.24)'}`,
          background: hover ? '#0ea5e9' : 'transparent',
          transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
          transform: hover ? 'translateX(4px)' : 'none',
        }}
      >
        <IconArrowRight size={15} strokeWidth={2.4} color={hover ? '#fff' : '#0ea5e9'} />
      </span>
    </article>
  )
}
