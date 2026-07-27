import { useState } from 'react'
import { IconNews, IconAlert, IconArrowRight } from '../components/Icons'
import PageHero from '../components/page/PageHero'
import { Card, Chip, Section, type Tone } from '../components/page/ui'
import { NOTICES, formatDate, type NoticeLevel } from '../data/site'

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
    image: 'https://images.unsplash.com/photo-1678225894217-ec0de2dc0548?w=800&h=500&fit=crop&auto=format',
    featured: true,
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
    featured: false,
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
    featured: false,
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
    featured: false,
  },
]

const LEVEL_TONE: Record<NoticeLevel, Tone> = {
  Information: 'blue',
  Important: 'amber',
  Urgent: 'red',
}

type Tab = 'press' | 'notices'

export default function NewsPage() {
  const [tab, setTab] = useState<Tab>('press')
  const [featured, ...others] = PRESS

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
        <div role="tablist" aria-label="Media type" style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
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
            <article style={{ marginBottom: 40 }}>
              <Card interactive style={{ overflow: 'hidden', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)' }} >
                <div style={{ position: 'relative', minHeight: 300 }}>
                  <img
                    src={featured.image}
                    alt=""
                    loading="lazy"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '34px 34px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                    <Chip tone="blue">{featured.category}</Chip>
                    <Chip tone="green">{featured.tag}</Chip>
                  </div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(22px, 2.6vw, 30px)',
                      fontWeight: 700,
                      color: '#0284c7',
                      lineHeight: 1.22,
                      margin: '0 0 12px',
                    }}
                  >
                    {featured.title}
                  </h2>
                  <p style={{ fontSize: 14.5, color: '#647080', lineHeight: 1.75, margin: '0 0 20px' }}>{featured.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
                    <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>{formatDate(featured.date)}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 800, color: '#0ea5e9' }}>
                      Read release
                      <IconArrowRight size={14} strokeWidth={2.4} color="#0ea5e9" />
                    </span>
                  </div>
                </div>
              </Card>
            </article>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {others.map((n) => (
                <Card key={n.id} interactive style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <img src={n.image} alt="" loading="lazy" style={{ width: '100%', height: 172, objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: 22, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                      <Chip tone="blue">{n.category}</Chip>
                      <Chip tone="grey">{n.tag}</Chip>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, color: '#0284c7', lineHeight: 1.3, margin: '0 0 10px' }}>
                      {n.title}
                    </h3>
                    <p style={{ fontSize: 13.5, color: '#647080', lineHeight: 1.7, margin: '0 0 18px', flex: 1 }}>{n.excerpt}</p>
                    <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 700 }}>{formatDate(n.date)}</span>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {NOTICES.map((notice) => (
              <Card key={notice.id} style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    display: 'grid',
                    placeItems: 'center',
                    background: notice.level === 'Urgent' ? 'rgba(220,38,38,0.1)' : 'rgba(14,165,233,0.1)',
                  }}
                >
                  <IconAlert size={20} strokeWidth={2} color={notice.level === 'Urgent' ? '#b91c1c' : '#0284c7'} />
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                    <Chip tone={LEVEL_TONE[notice.level]}>{notice.level}</Chip>
                    <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.06em', color: '#94a3b8' }}>{notice.ref}</span>
                  </div>
                  <h3 style={{ fontSize: 16.5, fontWeight: 900, color: '#0f172a', margin: '0 0 8px', lineHeight: 1.35 }}>
                    {notice.title}
                  </h3>
                  <p style={{ fontSize: 13.5, color: '#647080', lineHeight: 1.75, margin: '0 0 12px' }}>{notice.body}</p>
                  <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#0ea5e9' }}>
                    Effective {formatDate(notice.effective)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </main>
  )
}
