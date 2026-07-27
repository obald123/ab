import { useMemo, useState } from 'react'
import { IconBookOpen, IconClock, IconArrowRight } from '../components/Icons'
import PageHero from '../components/page/PageHero'
import { Card, Chip, EmptyState, FilterBar, Section } from '../components/page/ui'
import { ARTICLES, formatDate, type Article } from '../data/site'

const TOPICS = ['All', 'SME Guidance', 'Financial Literacy', 'Security', 'Agriculture', 'Financial Inclusion'] as const

function Byline({ article, light = false }: { article: Article; light?: boolean }) {
  const initials = article.author
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span
        aria-hidden="true"
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          background: light ? 'rgba(255,255,255,0.18)' : 'linear-gradient(135deg,#0ea5e9,#0284c7)',
          color: '#fff',
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: '0.02em',
        }}
      >
        {initials}
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: light ? '#fff' : '#0f172a' }}>{article.author}</div>
        <div style={{ fontSize: 11, color: light ? 'rgba(224,242,254,0.7)' : '#94a3b8' }}>{article.authorRole}</div>
      </div>
    </div>
  )
}

function ReadTime({ mins, light = false }: { mins: number; light?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11.5,
        fontWeight: 700,
        color: light ? 'rgba(224,242,254,0.8)' : '#94a3b8',
      }}
    >
      <IconClock size={13} strokeWidth={2} color={light ? 'rgba(224,242,254,0.8)' : '#94a3b8'} />
      {mins} min read
    </span>
  )
}

export default function Articles() {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState<string>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ARTICLES.filter(
      (a) =>
        (topic === 'All' || a.topic === topic) &&
        (!q || `${a.title} ${a.excerpt} ${a.author} ${a.topic}`.toLowerCase().includes(q)),
    )
  }, [query, topic])

  const [lead, ...rest] = filtered

  return (
    <main>
      <PageHero
        Icon={IconBookOpen}
        eyebrow="Insights"
        title="Articles & financial guidance"
        lead="Practical explainers written by our own credit, risk and finance teams. Not bank news — this is the reading that helps you make a better decision about borrowing, saving and protecting your money."
      />

      <Section>
        <FilterBar
          query={query}
          onQuery={setQuery}
          placeholder="Search articles by title, topic or author"
          options={TOPICS}
          active={topic}
          onSelect={setTopic}
        />

        {filtered.length === 0 ? (
          <EmptyState message="No articles match that search. Try another topic or clear the filters." />
        ) : (
          <>
            {/* Lead article */}
            <article style={{ marginBottom: 44 }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,1fr)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  background: 'linear-gradient(150deg, #0c4a6e 0%, #0284c7 78%, #0ea5e9 100%)',
                  boxShadow: '0 18px 44px rgba(2,30,60,0.16)',
                }}
                className="article-lead"
              >
                <div style={{ padding: '38px 38px 34px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        background: 'rgba(186,230,253,0.16)',
                        border: '1px solid rgba(186,230,253,0.3)',
                        color: '#bae6fd',
                        borderRadius: 100,
                        padding: '3px 11px',
                        fontSize: 10.5,
                        fontWeight: 800,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {lead.topic}
                    </span>
                    <ReadTime mins={lead.readMins} light />
                  </div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 'clamp(24px, 3vw, 34px)',
                      fontWeight: 700,
                      color: '#fff',
                      lineHeight: 1.18,
                      letterSpacing: '-0.02em',
                      margin: '0 0 14px',
                    }}
                  >
                    {lead.title}
                  </h2>
                  <p style={{ fontSize: 14.5, color: 'rgba(224,242,254,0.8)', lineHeight: 1.75, margin: '0 0 22px' }}>
                    {lead.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <Byline article={lead} light />
                    <span style={{ fontSize: 12, color: 'rgba(224,242,254,0.62)', fontWeight: 700 }}>
                      {formatDate(lead.published)}
                    </span>
                  </div>
                </div>
                <div style={{ position: 'relative', minHeight: 280 }}>
                  <img
                    src={lead.image}
                    alt=""
                    loading="lazy"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
            </article>

            {/* Remaining articles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 24 }}>
              {rest.map((a) => (
                <Card key={a.id} interactive style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <img
                    src={a.image}
                    alt=""
                    loading="lazy"
                    style={{ width: '100%', height: 178, objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{ padding: 22, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
                      <Chip tone="blue">{a.topic}</Chip>
                      <ReadTime mins={a.readMins} />
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 18.5,
                        fontWeight: 700,
                        color: '#0284c7',
                        lineHeight: 1.3,
                        margin: '0 0 10px',
                      }}
                    >
                      {a.title}
                    </h3>
                    <p style={{ fontSize: 13.5, color: '#647080', lineHeight: 1.7, margin: '0 0 20px', flex: 1 }}>
                      {a.excerpt}
                    </p>
                    <div style={{ borderTop: '1px solid rgba(14,165,233,0.12)', paddingTop: 16 }}>
                      <Byline article={a} />
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 14,
                        }}
                      >
                        <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 700 }}>{formatDate(a.published)}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 800, color: '#0ea5e9' }}>
                          Read article
                          <IconArrowRight size={13} strokeWidth={2.4} color="#0ea5e9" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </Section>
    </main>
  )
}
