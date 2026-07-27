import { useMemo, useState } from 'react'
import { IconGavel, IconDownload, IconCalendar, IconAlert } from '../components/Icons'
import PageHero from '../components/page/PageHero'
import { Card, Chip, EmptyState, FilterBar, Meta, Section, type Tone } from '../components/page/ui'
import { TENDERS, daysUntil, formatDate, type Tender, type TenderStatus } from '../data/site'

const PROCUREMENT_EMAIL = 'procurement@abr.rw'
const STATUSES = ['All', 'Open', 'Closing soon', 'Closed', 'Awarded'] as const

const STATUS_TONE: Record<TenderStatus, Tone> = {
  Open: 'green',
  'Closing soon': 'amber',
  Closed: 'grey',
  Awarded: 'blue',
}

function TenderRow({ tender }: { tender: Tender }) {
  const [open, setOpen] = useState(false)
  const remaining = daysUntil(tender.deadline)
  const live = tender.status === 'Open' || tender.status === 'Closing soon'

  return (
    <Card style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
        <Chip tone={STATUS_TONE[tender.status]}>{tender.status}</Chip>
        <Chip tone="grey">{tender.category}</Chip>
        {live && remaining >= 0 && (
          <span style={{ fontSize: 12, fontWeight: 700, color: remaining <= 7 ? '#b45309' : '#647080' }}>
            {remaining === 0 ? 'Closes today' : `${remaining} day${remaining === 1 ? '' : 's'} remaining`}
          </span>
        )}
      </div>

      <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 6 }}>
        {tender.ref}
      </div>
      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 21, fontWeight: 700, color: '#0284c7', margin: '0 0 10px', lineHeight: 1.25 }}>
        {tender.title}
      </h3>
      <p style={{ fontSize: 14, color: '#647080', lineHeight: 1.7, margin: '0 0 18px', maxWidth: 760 }}>{tender.summary}</p>

      <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', marginBottom: 18 }}>
        <Meta label="Published" value={formatDate(tender.published)} />
        <Meta
          label="Submission deadline"
          value={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <IconCalendar size={14} color="#0ea5e9" strokeWidth={2} />
              {formatDate(tender.deadline)}
            </span>
          }
        />
        <Meta label="Documents" value={`${tender.documents.length} file${tender.documents.length === 1 ? '' : 's'}`} />
      </div>

      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          background: 'rgba(14,165,233,0.08)',
          border: '1px solid rgba(14,165,233,0.2)',
          color: '#0284c7',
          borderRadius: 9,
          padding: '9px 16px',
          fontWeight: 700,
          fontSize: 13.5,
          cursor: 'pointer',
        }}
      >
        {open ? 'Hide documents' : 'Tender documents & how to bid'}
      </button>

      {open && (
        <div style={{ marginTop: 20, borderTop: '1px solid rgba(14,165,233,0.14)', paddingTop: 18 }}>
          <div style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
            {tender.documents.map((d) => (
              <div
                key={d.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  background: '#f8fbfe',
                  border: '1px solid rgba(14,165,233,0.12)',
                  borderRadius: 10,
                }}
              >
                <IconDownload size={17} color="#0ea5e9" strokeWidth={2} />
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>{d.label}</span>
                <span style={{ fontSize: 11.5, color: '#94a3b8', fontWeight: 700 }}>PDF · {d.size}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: '#647080', lineHeight: 1.75, margin: 0 }}>
            {live ? (
              <>
                Sealed bids must reach the Procurement Committee, AB Bank Rwanda Plc, Nyarugenge Avenue, KN 78 St,
                Kigali, before <strong>{formatDate(tender.deadline)}</strong>, clearly marked with the reference{' '}
                <strong>{tender.ref}</strong>. Queries to{' '}
                <a href={`mailto:${PROCUREMENT_EMAIL}`} style={{ color: '#0284c7', fontWeight: 700 }}>
                  {PROCUREMENT_EMAIL}
                </a>
                .
              </>
            ) : (
              <>This tender is no longer accepting submissions. Documents are retained here for reference.</>
            )}
          </p>
        </div>
      )}
    </Card>
  )
}

export default function Tenders() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<string>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TENDERS.filter(
      (t) =>
        (status === 'All' || t.status === status) &&
        (!q || `${t.title} ${t.ref} ${t.category} ${t.summary}`.toLowerCase().includes(q)),
    )
  }, [query, status])

  return (
    <main>
      <PageHero
        Icon={IconGavel}
        eyebrow="Tenders"
        title="Procurement & tender opportunities"
        lead="AB Bank Rwanda Plc procures goods and services through open, competitive tender. All live opportunities are published here and remain available for reference after closing."
      />

      <Section>
        <Card
          style={{
            padding: '18px 22px',
            marginBottom: 30,
            background: 'rgba(217,119,6,0.06)',
            border: '1px solid rgba(217,119,6,0.22)',
            display: 'flex',
            gap: 14,
            alignItems: 'flex-start',
          }}
        >
          <span style={{ flexShrink: 0, marginTop: 1 }}>
            <IconAlert size={19} color="#b45309" strokeWidth={2} />
          </span>
          <p style={{ margin: 0, fontSize: 13.5, color: '#7c4a06', lineHeight: 1.7 }}>
            <strong>AB Bank Rwanda never charges a fee to bid.</strong> We do not use agents or intermediaries to
            solicit tender participation. Report any request for payment to {PROCUREMENT_EMAIL} or call 5500.
          </p>
        </Card>

        <FilterBar
          query={query}
          onQuery={setQuery}
          placeholder="Search by title, reference or category"
          options={STATUSES}
          active={status}
          onSelect={setStatus}
        />

        <p style={{ fontSize: 13, color: '#647080', marginBottom: 20 }}>
          Showing <strong>{filtered.length}</strong> of {TENDERS.length} tenders
        </p>

        {filtered.length === 0 ? (
          <EmptyState message="No tenders match that search. Try a different status or clear the filters." />
        ) : (
          <div style={{ display: 'grid', gap: 18 }}>
            {filtered.map((t) => (
              <TenderRow key={t.id} tender={t} />
            ))}
          </div>
        )}
      </Section>
    </main>
  )
}
