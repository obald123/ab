import PageHero from '../components/page/PageHero'
import { Section } from '../components/page/ui'
import { IconFileText, IconShield } from '../components/Icons'
import { useSingleton } from '../lib/content'
import { useT } from '../lib/i18n'
import { richTextProps } from '../lib/sanitize'
import './news-article.css'

/* /privacy, /cookies and /terms. The texts are managed in the CMS ("Legal
   Pages") and approved there; nothing legal is hardcoded here. A document
   that is not yet published — or a CMS that cannot be reached — shows a
   plain "being updated" note with a contact route, never an old or invented
   text. */

export type LegalDocKey = 'privacy' | 'cookies' | 'terms'

interface LegalDocument {
  title: string
  body: string
  effectiveDate: string
  version: string
  published: boolean
}

type LegalDocuments = Partial<Record<LegalDocKey, LegalDocument>>

const NONE: LegalDocuments = {}

export default function LegalPage({ doc }: { doc: LegalDocKey }) {
  const t = useT()
  const { data, loading } = useSingleton<LegalDocuments>('legal', NONE)
  const document = data[doc]
  const ready = document?.published && document.body.trim().length > 0
  const fallbackTitle = t.legal[doc]

  return (
    <>
      <PageHero
        Icon={doc === 'terms' ? IconFileText : IconShield}
        eyebrow={t.legal.eyebrow}
        title={ready ? document.title : fallbackTitle}
        lead={
          ready
            ? `${t.legal.effective} ${document.effectiveDate}${document.version ? ` · ${t.legal.version} ${document.version}` : ''}`
            : t.legal.leadPending
        }
      />
      <Section>
        {loading ? null : ready ? (
          <article className="news-article-body" style={{ maxWidth: 820, margin: '0 auto' }} {...richTextProps(document.body)} />
        ) : (
          <div role="status" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', color: '#647080', fontSize: 15, lineHeight: 1.65 }}>
            <p style={{ margin: 0 }}>{t.legal.pending}</p>
            <p style={{ margin: '10px 0 0' }}>
              {t.legal.contact}{' '}
              <a href="mailto:info@abr.rw" style={{ color: '#0284c7', fontWeight: 700 }}>
                info@abr.rw
              </a>
            </p>
          </div>
        )}
      </Section>
    </>
  )
}
