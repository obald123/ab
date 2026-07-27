import { useMemo, useState } from 'react'
import { IconFileText, IconDownload, IconMapPin } from '../components/Icons'
import PageHero from '../components/page/PageHero'
import { EmptyState, FilterBar, Section } from '../components/page/ui'
import { FORMS, FORM_CATEGORIES, formatDate, type FormDoc } from '../data/site'

const CATEGORIES = ['All', ...FORM_CATEGORIES] as const
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'

const TYPE_COLOR: Record<FormDoc['fileType'], string> = {
  PDF: '#b91c1c',
  DOCX: '#0284c7',
  XLSX: '#15803d',
}

/* A downloads page should look like a document shelf, not a feed. Each item
   is drawn as a sheet of paper with a folded corner and its file type
   printed on it — the thing you are about to receive is the thing you see. */
function FormTile({ doc }: { doc: FormDoc }) {
  const [hover, setHover] = useState(false)
  const color = TYPE_COLOR[doc.fileType]

  return (
    <a
      href="#forms"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={`Download ${doc.title}, ${doc.fileType}, ${doc.size}`}
      style={{
        display: 'flex',
        gap: 18,
        alignItems: 'flex-start',
        padding: '20px 22px',
        background: '#ffffff',
        border: `1px solid ${hover ? 'rgba(14,165,233,0.34)' : 'rgba(14,165,233,0.13)'}`,
        borderRadius: 14,
        textDecoration: 'none',
        boxShadow: hover ? '0 16px 34px rgba(2,30,60,0.11)' : '0 2px 12px rgba(2,30,60,0.04)',
        transform: hover ? 'translateY(-3px)' : 'none',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
      }}
    >
      {/* Paper sheet with a folded corner */}
      <span
        aria-hidden="true"
        style={{
          position: 'relative',
          width: 52,
          height: 64,
          flexShrink: 0,
          background: '#fff',
          border: `1.5px solid ${color}44`,
          borderRadius: '4px 14px 4px 4px',
          boxShadow: hover ? `0 8px 18px ${color}26` : `0 3px 8px ${color}1a`,
          transition: 'box-shadow 0.22s ease',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {/* The fold */}
        <span
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 15,
            height: 15,
            background: `linear-gradient(225deg, ${color}33 50%, transparent 50%)`,
            borderTopRightRadius: 13,
          }}
        />
        {/* Ruled lines */}
        <span
          style={{
            position: 'absolute',
            left: 8,
            right: 8,
            top: 22,
            height: 14,
            backgroundImage: `linear-gradient(${color}26 1.5px, transparent 1.5px)`,
            backgroundSize: '100% 6px',
          }}
        />
        <span
          style={{
            position: 'absolute',
            bottom: 6,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: MONO,
            fontSize: 8.5,
            fontWeight: 900,
            letterSpacing: '0.08em',
            color,
          }}
        >
          {doc.fileType}
        </span>
      </span>

      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: 'block',
            fontSize: 15.5,
            fontWeight: 800,
            color: '#0f172a',
            lineHeight: 1.35,
            marginBottom: 6,
          }}
        >
          {doc.title}
        </span>
        <span style={{ display: 'block', fontSize: 13, color: '#647080', lineHeight: 1.68, marginBottom: 12 }}>
          {doc.description}
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: MONO,
            fontSize: 10.5,
            fontWeight: 700,
            color: '#94a3b8',
            letterSpacing: '0.04em',
            flexWrap: 'wrap',
          }}
        >
          <span>{doc.size}</span>
          <span aria-hidden="true">·</span>
          <span>Updated {formatDate(doc.updated)}</span>
          <span
            style={{
              marginLeft: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'inherit',
              fontSize: 12.5,
              fontWeight: 800,
              color: '#0ea5e9',
              letterSpacing: 0,
              transform: hover ? 'translateX(3px)' : 'none',
              transition: 'transform 0.22s ease',
            }}
          >
            <IconDownload size={14} strokeWidth={2.2} color="#0ea5e9" />
            Download
          </span>
        </span>
      </span>
    </a>
  )
}

export default function Forms() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FORMS.filter(
      (f) =>
        (category === 'All' || f.category === category) &&
        (!q || `${f.title} ${f.description} ${f.category}`.toLowerCase().includes(q)),
    )
  }, [query, category])

  /* Grouped by category so the page reads as a shelf with labelled sections
     rather than one long undifferentiated list. */
  const groups = useMemo(() => {
    return FORM_CATEGORIES.map((c) => ({ category: c, docs: filtered.filter((f) => f.category === c) })).filter(
      (g) => g.docs.length > 0,
    )
  }, [filtered])

  return (
    <main>
      <PageHero
        Icon={IconFileText}
        eyebrow="Forms & Downloads"
        title="Bank forms, tariffs & statements"
        lead="Every form you need to open an account, apply for a loan, enrol in insurance or update your records — plus our published tariff guide, terms and audited financial statements."
        meta={
          <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap' }}>
            {[
              [`${FORMS.length}`, 'Documents'],
              [`${FORM_CATEGORIES.length}`, 'Categories'],
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

      <Section>
        <div id="forms">
          <FilterBar
            query={query}
            onQuery={setQuery}
            placeholder="Search forms and documents"
            options={CATEGORIES}
            active={category}
            onSelect={setCategory}
          />
        </div>

        {groups.length === 0 ? (
          <EmptyState message="No documents match that search. Try another category or clear the filters." />
        ) : (
          groups.map((g) => (
            <section key={g.category} style={{ marginBottom: 44 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#0284c7',
                    margin: 0,
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {g.category}
                </h2>
                <span aria-hidden="true" style={{ flex: 1, height: 1, background: 'rgba(14,165,233,0.18)' }} />
                <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>
                  {String(g.docs.length).padStart(2, '0')}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
                {g.docs.map((f) => (
                  <FormTile key={f.id} doc={f} />
                ))}
              </div>
            </section>
          ))
        )}

        <div
          style={{
            marginTop: 12,
            padding: 28,
            background: '#f8fbfe',
            border: '1px solid rgba(14,165,233,0.13)',
            borderRadius: 16,
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
          }}
        >
          <span style={{ flexShrink: 0, marginTop: 2 }}>
            <IconMapPin size={20} strokeWidth={2} color="#0ea5e9" />
          </span>
          <div>
            <h3 style={{ fontSize: 15.5, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
              Prefer to collect a form in person?
            </h3>
            <p style={{ fontSize: 13.5, color: '#647080', lineHeight: 1.75, margin: 0, maxWidth: 640 }}>
              Every form on this page is also available at any of our 47+ branches and credit outlets across the five
              provinces. Branch staff will help you complete it. Call <strong>5500</strong> if you are unsure which form
              applies to you.
            </p>
          </div>
        </div>
      </Section>
    </main>
  )
}
