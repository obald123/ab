import { useMemo, useState } from 'react'
import { IconFileText, IconDownload, IconMapPin } from '../components/Icons'
import PageHero from '../components/page/PageHero'
import { Card, Chip, EmptyState, FilterBar, Section } from '../components/page/ui'
import { FORMS, FORM_CATEGORIES, formatDate, type FormDoc } from '../data/site'

const CATEGORIES = ['All', ...FORM_CATEGORIES] as const

const TYPE_COLOR: Record<FormDoc['fileType'], string> = {
  PDF: '#b91c1c',
  DOCX: '#0284c7',
  XLSX: '#15803d',
}

function FormRow({ doc }: { doc: FormDoc }) {
  return (
    <Card interactive style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: 46,
          height: 46,
          borderRadius: 12,
          display: 'grid',
          placeItems: 'center',
          background: 'rgba(14,165,233,0.08)',
          border: '1px solid rgba(14,165,233,0.16)',
        }}
      >
        <IconFileText size={21} strokeWidth={2} color="#0284c7" />
      </span>

      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', gap: 9, alignItems: 'center', marginBottom: 7, flexWrap: 'wrap' }}>
          <Chip tone="blue">{doc.category}</Chip>
          <span
            style={{
              fontSize: 10,
              fontWeight: 900,
              letterSpacing: '0.07em',
              color: TYPE_COLOR[doc.fileType],
              border: `1px solid ${TYPE_COLOR[doc.fileType]}33`,
              borderRadius: 5,
              padding: '2px 6px',
            }}
          >
            {doc.fileType}
          </span>
          <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 700 }}>{doc.size}</span>
        </div>

        <h3 style={{ fontSize: 15.5, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', lineHeight: 1.35 }}>
          {doc.title}
        </h3>
        <p style={{ fontSize: 13, color: '#647080', lineHeight: 1.7, margin: '0 0 12px' }}>{doc.description}</p>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>Updated {formatDate(doc.updated)}</span>
      </div>

      <button
        type="button"
        aria-label={`Download ${doc.title}`}
        style={{
          flexShrink: 0,
          alignSelf: 'center',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          background: 'rgba(14,165,233,0.08)',
          border: '1px solid rgba(14,165,233,0.2)',
          color: '#0284c7',
          borderRadius: 9,
          padding: '9px 15px',
          fontWeight: 800,
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        <IconDownload size={15} strokeWidth={2} color="#0284c7" />
        Download
      </button>
    </Card>
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

  return (
    <main>
      <PageHero
        Icon={IconFileText}
        eyebrow="Forms & Downloads"
        title="Bank forms, tariffs & statements"
        lead="Every form you need to open an account, apply for a loan, enrol in insurance or update your records — plus our published tariff guide, terms and audited financial statements."
      />

      <Section>
        <FilterBar
          query={query}
          onQuery={setQuery}
          placeholder="Search forms and documents"
          options={CATEGORIES}
          active={category}
          onSelect={setCategory}
        />

        <p style={{ fontSize: 13, color: '#647080', marginBottom: 20 }}>
          Showing <strong>{filtered.length}</strong> of {FORMS.length} documents
        </p>

        {filtered.length === 0 ? (
          <EmptyState message="No documents match that search. Try another category or clear the filters." />
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            {filtered.map((f) => (
              <FormRow key={f.id} doc={f} />
            ))}
          </div>
        )}

        <Card style={{ marginTop: 40, padding: 28, background: '#f8fbfe', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
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
        </Card>
      </Section>
    </main>
  )
}
