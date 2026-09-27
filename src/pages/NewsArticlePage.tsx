import DOMPurify from 'dompurify'
import { Link, useParams } from 'react-router-dom'
import { IconArrowRight, IconCalendar, IconNews } from '../components/Icons'
import PageHero from '../components/page/PageHero'
import SmartImage from '../components/page/SmartImage'
import { Chip, Section } from '../components/page/ui'
import { FALLBACK_PRESS, type NewsRelease } from '../data/news'
import { formatTimestamp } from '../data/site'
import { useCollection } from '../lib/content'
import { useT } from '../lib/i18n'
import './news-article.css'

export default function NewsArticlePage() {
  const t = useT()
  const { id } = useParams()
  const { data: releases, loading } = useCollection<NewsRelease>('news', FALLBACK_PRESS)
  const release = releases.find((item) => item.id === id)

  if (!release) {
    return (
      <Section>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 0', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 30, color: '#0f172a', marginBottom: 12 }}>
            {loading ? t.common.loading : 'News release not found'}
          </h1>
          {!loading && (
            <Link to="/media/news" style={{ color: '#0284c7', fontWeight: 800, textDecoration: 'none' }}>
              {t.common.back} to news
            </Link>
          )}
        </div>
      </Section>
    )
  }

  const safeBody = DOMPurify.sanitize(release.body ?? '')

  return (
    <article>
      <PageHero Icon={IconNews} eyebrow={release.category} title={release.title} lead={release.excerpt} />
      <Section>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link
            to="/media/news"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#0284c7', fontSize: 13, fontWeight: 800, textDecoration: 'none', marginBottom: 24 }}
          >
            <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>
              <IconArrowRight size={15} strokeWidth={2.4} />
            </span>
            {t.common.back} to news
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
            <Chip tone="blue">{release.category}</Chip>
            <Chip tone="grey">{release.tag}</Chip>
            {release.createdAt && (
              <time
                dateTime={release.createdAt}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: '#647080', fontSize: 12.5, fontWeight: 700, marginLeft: 'auto' }}
              >
                <IconCalendar size={14} strokeWidth={2} color="#0284c7" />
                {t.common.uploaded} {formatTimestamp(release.createdAt)}
              </time>
            )}
          </div>

          <div style={{ position: 'relative', height: 'min(52vw, 420px)', minHeight: 220, borderRadius: 14, overflow: 'hidden', marginBottom: 34 }}>
            <SmartImage src={release.image} alt={release.title} />
          </div>

          {safeBody ? (
            <div className="news-article-body" dangerouslySetInnerHTML={{ __html: safeBody }} />
          ) : (
            <p className="news-article-body">{release.excerpt}</p>
          )}
        </div>
      </Section>
    </article>
  )
}