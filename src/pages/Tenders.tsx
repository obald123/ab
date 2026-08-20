import { useMemo, useState } from 'react'
import { IconGavel, IconDownload, IconAlert } from '../components/Icons'
import PageHero from '../components/page/PageHero'
import { Card, Chip, DeadlineRing, EmptyState, FilterBar, Section, Stamp, type Tone } from '../components/page/ui'
import { mediaUrl, useCollection } from '../lib/content'
import { TENDERS, daysUntil, formatDate, type Tender, type TenderStatus } from '../data/site'
import { useT } from '../lib/i18n'

const PROCUREMENT_EMAIL = 'procurement@abr.rw'
const STATUSES = ['All', 'Open', 'Closing soon', 'Closed', 'Awarded'] as const

/* As stored in the CMS: `id` is the row id, `reference` the procurement code
   printed on the notice, and each document carries its own id. */
type Notice = Omit<Tender, 'id' | 'ref' | 'documents'> & {
  id: string
  reference: string
  documents: {
    id: string
    label: string
    size: string
    /** Media key/URL from the upload pipeline. Absent on a row created
     *  before this field existed, or one nobody has attached a file to yet. */
    file?: string
  }[]
}

/** Shown only until the CMS responds, and if it never does. */
const FALLBACK_TENDERS: Notice[] = TENDERS.map((tender) => ({
  ...tender,
  reference: tender.ref,
  documents: tender.documents.map((doc, i) => ({ ...doc, id: `doc-${String(i + 1)}` })),
}))

/* Maps the schema's enum value (stored, filtered on, sent to the API) to its
   translated label (shown). Keeping them separate means a filter click still
   sends 'Open' even under a Kinyarwanda interface. */
function statusLabel(t: ReturnType<typeof useT>, status: TenderStatus): string {
  return {
    Open: t.tenders.statusOpen,
    'Closing soon': t.tenders.statusClosingSoon,
    Closed: t.tenders.statusClosed,
    Awarded: t.tenders.statusAwarded,
  }[status]
}

const STATUS_TONE: Record<TenderStatus, Tone> = {
  Open: 'green',
  'Closing soon': 'amber',
  Closed: 'grey',
  Awarded: 'blue',
}

const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'

/* A tender notice is a formal document, not a blog post — so this reads as
   a procurement register entry: a monospaced reference heading the card, a
   rubber-stamped status, a tear-off deadline block, and a perforated left
   edge to sell the paper metaphor. */
function TenderRow({ tender }: { tender: Notice }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const remaining = daysUntil(tender.deadline)
  const live = tender.status === 'Open' || tender.status === 'Closing soon'
  const deadline = new Date(tender.deadline + 'T00:00:00')

  return (
    <Card style={{ padding: 0, overflow: 'hidden', display: 'flex', opacity: live ? 1 : 0.78 }}>
      {/* Perforated edge */}
      <div
        aria-hidden="true"
        style={{
          width: 26,
          flexShrink: 0,
          background: '#f8fbfe',
          borderRight: '1px dashed rgba(14,165,233,0.28)',
          backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.16) 2px, transparent 2px)',
          backgroundSize: '26px 22px',
        }}
      />

      <div style={{ flex: 1, minWidth: 0, padding: '24px 26px' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 380px', minWidth: 0 }}>
            {/* Reference is the primary identifier on a tender, not the title */}
            <div
              style={{
                fontFamily: MONO,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#0284c7',
                background: 'rgba(14,165,233,0.07)',
                border: '1px solid rgba(14,165,233,0.16)',
                borderRadius: 6,
                padding: '4px 10px',
                display: 'inline-block',
                marginBottom: 12,
              }}
            >
              {tender.reference}
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(19px, 2vw, 24px)',
                fontWeight: 700,
                color: '#0f172a',
                margin: '0 0 10px',
                lineHeight: 1.25,
                letterSpacing: '-0.015em',
              }}
            >
              {tender.title}
            </h3>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
              <Chip tone={STATUS_TONE[tender.status]}>{statusLabel(t, tender.status)}</Chip>
              <Chip tone="grey">{tender.category}</Chip>
            </div>

            <p style={{ fontSize: 14, color: '#647080', lineHeight: 1.72, margin: 0, maxWidth: 660 }}>
              {tender.summary}
            </p>
          </div>

          {/* Tear-off deadline block + stamp */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <div
              style={{
                width: 96,
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid rgba(14,165,233,0.18)',
                textAlign: 'center',
                background: '#fff',
              }}
            >
              <div
                style={{
                  background: live ? '#0284c7' : '#94a3b8',
                  color: '#fff',
                  fontSize: 9.5,
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  padding: '5px 0',
                }}
              >
                {t.tenders.deadline}
              </div>
              <div style={{ padding: '8px 0 10px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 28,
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: 1,
                  }}
                >
                  {deadline.getDate()}
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#647080',
                    marginTop: 3,
                  }}
                >
                  {deadline.toLocaleDateString('en-GB', { month: 'short' })} {deadline.getFullYear()}
                </div>
              </div>
            </div>
            {live ? <DeadlineRing daysLeft={remaining} windowDays={30} size={62} /> : <Stamp label={statusLabel(t, tender.status)} tone={STATUS_TONE[tender.status]} />}
          </div>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          style={{
            marginTop: 18,
            background: 'transparent',
            border: '1px solid rgba(14,165,233,0.22)',
            color: '#0284c7',
            borderRadius: 100,
            padding: '9px 18px',
            fontWeight: 700,
            fontSize: 13.5,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {open ? t.tenders.hideDocuments : `${t.tenders.documentsAndBid} (${String(tender.documents.length)})`}
        </button>

        {open && (
          <div style={{ marginTop: 20, borderTop: '1px solid rgba(14,165,233,0.14)', paddingTop: 18 }}>
            <div style={{ display: 'grid', gap: 10, marginBottom: 18 }}>
              {tender.documents.map((d) => {
                /* A row created before the document-upload field existed, or
                   one nobody has attached a file to yet, has no `file` — shown
                   honestly rather than as a link to nothing. */
                const ready = Boolean(d.file)
                return (
                  <a
                    key={d.id}
                    href={ready ? mediaUrl(d.file) : undefined}
                    target={ready ? '_blank' : undefined}
                    rel={ready ? 'noopener noreferrer' : undefined}
                    aria-disabled={!ready}
                    onClick={(e) => {
                      if (!ready) e.preventDefault()
                    }}
                    aria-label={ready ? `${t.common.download} ${d.label}` : `${d.label} — ${t.common.notReady}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 14px',
                      background: '#f8fbfe',
                      border: '1px solid rgba(14,165,233,0.14)',
                      borderRadius: 10,
                      cursor: ready ? 'pointer' : 'default',
                      opacity: ready ? 1 : 0.62,
                      fontFamily: 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    <IconDownload size={17} color={ready ? '#0ea5e9' : '#94a3b8'} strokeWidth={2} />
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>{d.label}</span>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>
                      {ready ? `PDF · ${d.size}` : t.common.notReady}
                    </span>
                  </a>
                )
              })}
            </div>
            <p style={{ fontSize: 13, color: '#647080', lineHeight: 1.75, margin: 0 }}>
              {live ? (
                <>
                  Sealed bids must reach the Procurement Committee, AB Bank Rwanda Plc, Nyarugenge Avenue, KN 78 St,
                  Kigali, before <strong>{formatDate(tender.deadline)}</strong>, clearly marked with the reference{' '}
                  <strong style={{ fontFamily: MONO }}>{tender.reference}</strong>. Queries to{' '}
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
      </div>
    </Card>
  )
}

export default function Tenders() {
  const t = useT()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<string>('All')
  const { data: tenders } = useCollection<Notice>('tender', FALLBACK_TENDERS)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tenders.filter(
      (t) =>
        (status === 'All' || t.status === status) &&
        (!q || `${t.title} ${t.reference} ${t.category} ${t.summary}`.toLowerCase().includes(q)),
    )
  }, [query, status, tenders])

  const live = tenders.filter((t) => t.status === 'Open' || t.status === 'Closing soon').length

  return (
    <div>
      <PageHero
        Icon={IconGavel}
        eyebrow={t.heroes.tendersEyebrow}
        title={t.heroes.tendersTitle}
        lead={t.heroes.tendersLead}
        meta={
          <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap' }}>
            {[
              [`${live}`, t.tenders.acceptingBids],
              [`${tenders.length}`, t.tenders.inRegister],
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
            {t.heroes.tendersWarning.replace('{email}', PROCUREMENT_EMAIL)}
          </p>
        </Card>

        <FilterBar
          query={query}
          onQuery={setQuery}
          placeholder={t.tenders.searchPlaceholder}
          options={STATUSES}
          active={status}
          onSelect={setStatus}
          labelFor={(v) => (v === 'All' ? t.common.all : statusLabel(t, v as TenderStatus))}
        />

        <p style={{ fontSize: 13, color: '#647080', marginBottom: 20 }}>
          {t.list.showing
            .replace('{shown}', String(filtered.length))
            .replace('{total}', String(tenders.length))
            .replace('{noun}', t.list.tenders)}
        </p>

        {filtered.length === 0 ? (
          <EmptyState message={t.tenders.noMatch} />
        ) : (
          <div style={{ display: 'grid', gap: 18 }}>
            {filtered.map((t) => (
              <TenderRow key={t.id} tender={t} />
            ))}
          </div>
        )}
      </Section>
    </div>
  )
}
