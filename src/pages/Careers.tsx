import { useMemo, useState } from 'react'
import { IconBriefcase, IconMapPin, IconCalendar, IconArrowRight, IconSend } from '../components/Icons'
import PageHero from '../components/page/PageHero'
import { Card, Chip, DeadlineRing, EmptyState, FilterBar, Section } from '../components/page/ui'
import { JOBS, daysUntil, formatDate, type Job } from '../data/site'

const CAREERS_EMAIL = 'careers@abr.rw'
const DEPARTMENTS = ['All', 'Business', 'IT & Digital', 'Risk & Compliance', 'Operations', 'Human Resources'] as const

/* Each department carries its own colour, so the board scans by hue before
   you read a single word — you find "the IT roles" instantly. This is what
   separates a hiring board from a stack of identical cards. */
const DEPT_COLOR: Record<string, string> = {
  Business: '#0ea5e9',
  'IT & Digital': '#7c3aed',
  'Risk & Compliance': '#b45309',
  Operations: '#0d9488',
  'Human Resources': '#db2777',
}

function closingTone(job: Job) {
  const d = daysUntil(job.closes)
  if (d < 0) return { tone: 'grey' as const, label: 'Closed' }
  if (d <= 7) return { tone: 'amber' as const, label: 'Closing soon' }
  return { tone: 'green' as const, label: 'Open' }
}

/* ── Application form ──
   There is no backend, so this does not pretend to submit anywhere.
   It validates, then hands a fully composed application off to the
   applicant's own mail client addressed to careers@abr.rw. That is a
   real, working route to a real inbox — and it keeps the CV attachment
   in the applicant's hands, which is where it has to be without a
   file-upload endpoint. */
function ApplyForm({ job, accent, onClose }: { job: Job; accent: string; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [touched, setTouched] = useState(false)

  const errors = {
    name: form.name.trim().length < 2 ? 'Enter your full name' : '',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email address',
    phone: form.phone.trim().length < 8 ? 'Enter a contact phone number' : '',
    message: form.message.trim().length < 40 ? 'Tell us at least a sentence or two about your fit (40+ characters)' : '',
  }
  const valid = Object.values(errors).every((e) => !e)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!valid) return

    const subject = `Application — ${job.title} (${job.id})`
    const body = [
      `Position: ${job.title}`,
      `Reference: ${job.id}`,
      `Location: ${job.location}`,
      '',
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      '',
      'Cover note:',
      form.message,
      '',
      '— Please attach your CV and academic documents to this email before sending. —',
    ].join('\n')

    window.location.href = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const field: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 9,
    border: '1px solid rgba(14,165,233,0.22)',
    fontSize: 14,
    color: '#0f172a',
    fontFamily: 'inherit',
    background: '#fff',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#647080',
    marginBottom: 6,
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: 24,
        background: '#f8fbfe',
        border: '1px solid rgba(14,165,233,0.14)',
        borderRadius: 14,
        padding: 24,
      }}
    >
      <h4 style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>Apply for this role</h4>
      <p style={{ fontSize: 12.5, color: '#647080', margin: '0 0 18px', lineHeight: 1.65 }}>
        Completing this form opens your email application to <strong>{CAREERS_EMAIL}</strong> with the details filled
        in. Attach your CV and academic documents before you send it.
      </p>

      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, marginBottom: 14 }}
      >
        {(
          [
            ['name', 'Full name', 'text'],
            ['email', 'Email', 'email'],
            ['phone', 'Phone', 'tel'],
          ] as const
        ).map(([key, label, type]) => (
          <div key={key}>
            <label style={labelStyle} htmlFor={`${key}-${job.id}`}>
              {label}
            </label>
            <input
              id={`${key}-${job.id}`}
              type={type}
              style={field}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              aria-invalid={touched && !!errors[key]}
            />
            {touched && errors[key] && <ErrorText>{errors[key]}</ErrorText>}
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle} htmlFor={`msg-${job.id}`}>
          Why you fit this role
        </label>
        <textarea
          id={`msg-${job.id}`}
          rows={5}
          style={{ ...field, resize: 'vertical' }}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          aria-invalid={touched && !!errors.message}
        />
        {touched && errors.message && <ErrorText>{errors.message}</ErrorText>}
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="submit"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: accent,
            color: '#fff',
            border: 'none',
            borderRadius: 100,
            padding: '11px 22px',
            fontWeight: 800,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <IconSend size={15} strokeWidth={2} color="#fff" />
          Compose application
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '1px solid rgba(14,165,233,0.24)',
            color: '#0284c7',
            borderRadius: 100,
            padding: '11px 18px',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" style={{ margin: '5px 0 0', fontSize: 11.5, fontWeight: 700, color: '#b91c1c' }}>
      {children}
    </p>
  )
}

function JobRow({ job }: { job: Job }) {
  const [open, setOpen] = useState(false)
  const [applying, setApplying] = useState(false)
  const [hover, setHover] = useState(false)
  const status = closingTone(job)
  const left = daysUntil(job.closes)
  const closed = left < 0
  const accent = DEPT_COLOR[job.department] ?? '#0ea5e9'

  return (
    <Card
      style={{
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        borderColor: hover ? `${accent}66` : undefined,
        boxShadow: hover ? '0 18px 40px rgba(2,30,60,0.13)' : undefined,
        transform: hover ? 'translateY(-3px)' : undefined,
        transition: 'transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease',
        opacity: closed ? 0.74 : 1,
      }}
    >
      { }
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ display: 'flex', width: '100%', minWidth: 0 }}
      >
        {/* Department rail — widens on hover */}
        <div
          aria-hidden="true"
          style={{
            width: hover ? 10 : 6,
            flexShrink: 0,
            background: `linear-gradient(180deg, ${accent}, ${accent}55)`,
            transition: 'width 0.24s ease',
          }}
        />

        <div style={{ flex: 1, minWidth: 0, padding: '24px 26px' }}>
          {/* Reference line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
            <span
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: '#94a3b8',
              }}
            >
              {job.id.toUpperCase()}
            </span>
            <span aria-hidden="true" style={{ width: 1, height: 12, background: 'rgba(14,165,233,0.24)' }} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: accent,
              }}
            >
              {job.department}
            </span>
            <span style={{ marginLeft: 'auto' }}>
              <Chip tone={status.tone}>{status.label}</Chip>
            </span>
          </div>

          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(20px, 2.1vw, 26px)',
                  fontWeight: 700,
                  color: '#0f172a',
                  margin: '0 0 10px',
                  lineHeight: 1.22,
                  letterSpacing: '-0.02em',
                }}
              >
                {job.title}
              </h3>
              <p style={{ fontSize: 14, color: '#647080', lineHeight: 1.7, margin: '0 0 18px', maxWidth: 640 }}>
                {job.summary}
              </p>

              {/* Spec strip */}
              <div
                className="job-spec"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  background: '#f8fbfe',
                  border: '1px solid rgba(14,165,233,0.1)',
                  borderRadius: 11,
                  padding: '12px 0',
                  marginBottom: 18,
                }}
              >
                {[
                  { label: 'Location', value: job.location, Icon: IconMapPin },
                  { label: 'Contract', value: job.type, Icon: IconBriefcase },
                  { label: 'Level', value: job.level, Icon: null },
                  { label: 'Closes', value: formatDate(job.closes), Icon: IconCalendar },
                ].map((m, i) => (
                  <div
                    key={m.label}
                    style={{
                      flex: '1 1 128px',
                      padding: '0 16px',
                      borderLeft: i > 0 ? '1px solid rgba(14,165,233,0.12)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 9.5,
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#94a3b8',
                        marginBottom: 4,
                      }}
                    >
                      {m.label}
                    </div>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 800,
                        color: '#0f172a',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {m.Icon && <m.Icon size={13} color={accent} strokeWidth={2.2} />}
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Countdown dial */}
            <div className="job-dial" style={{ display: 'grid', placeItems: 'center', paddingTop: 4 }}>
              <DeadlineRing daysLeft={left} windowDays={30} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              style={{
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
              {open ? 'Hide details' : 'View full description'}
            </button>
            {!closed && !applying && (
              <button
                onClick={() => {
                  setOpen(true)
                  setApplying(true)
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  background: accent,
                  border: 'none',
                  color: '#fff',
                  borderRadius: 100,
                  padding: '9px 20px',
                  fontWeight: 800,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: `0 8px 20px ${accent}44`,
                }}
              >
                Apply now
                <IconArrowRight size={14} strokeWidth={2.4} color="#fff" />
              </button>
            )}
          </div>

          {open && (
            <div style={{ marginTop: 22, borderTop: '1px solid rgba(14,165,233,0.14)', paddingTop: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
                {[
                  { heading: 'Key responsibilities', items: job.responsibilities },
                  { heading: 'Requirements', items: job.requirements },
                ].map(({ heading, items }) => (
                  <div key={heading}>
                    <h4
                      style={{
                        fontSize: 11,
                        fontWeight: 900,
                        letterSpacing: '0.09em',
                        textTransform: 'uppercase',
                        color: accent,
                        margin: '0 0 12px',
                      }}
                    >
                      {heading}
                    </h4>
                    <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                      {items.map((r) => (
                        <li
                          key={r}
                          style={{
                            position: 'relative',
                            paddingLeft: 20,
                            marginBottom: 9,
                            color: '#647080',
                            fontSize: 13.5,
                            lineHeight: 1.7,
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 8,
                              width: 7,
                              height: 7,
                              borderRadius: 2,
                              transform: 'rotate(45deg)',
                              background: accent,
                              opacity: 0.55,
                            }}
                          />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {applying && <ApplyForm job={job} accent={accent} onClose={() => setApplying(false)} />}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function Careers() {
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState<string>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return JOBS.filter(
      (j) =>
        (dept === 'All' || j.department === dept) &&
        (!q || `${j.title} ${j.summary} ${j.location} ${j.level}`.toLowerCase().includes(q)),
    )
  }, [query, dept])

  const openCount = JOBS.filter((j) => daysUntil(j.closes) >= 0).length

  return (
    <main>
      <PageHero
        Icon={IconBriefcase}
        eyebrow="Careers"
        title="Build a career in inclusive finance"
        lead="We are hiring across credit, digital, risk and branch operations. Every role at AB Bank Rwanda exists to widen access to responsible financial services for Rwandan entrepreneurs and their families."
        meta={
          <div style={{ display: 'flex', gap: 26, flexWrap: 'wrap' }}>
            {[
              [`${openCount}`, 'Open positions'],
              ['47+', 'Branches & outlets'],
              ['5', 'Provinces'],
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
        <FilterBar
          query={query}
          onQuery={setQuery}
          placeholder="Search roles by title, location or level"
          options={DEPARTMENTS}
          active={dept}
          onSelect={setDept}
        />

        <p style={{ fontSize: 13, color: '#647080', marginBottom: 20 }}>
          Showing <strong>{filtered.length}</strong> of {JOBS.length} positions
        </p>

        {filtered.length === 0 ? (
          <EmptyState message="No positions match that search. Try a different department or clear the filters." />
        ) : (
          <div style={{ display: 'grid', gap: 18 }}>
            {filtered.map((j) => (
              <JobRow key={j.id} job={j} />
            ))}
          </div>
        )}

        <Card style={{ marginTop: 40, padding: 28, background: '#f8fbfe' }}>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>
            Nothing matching your skills?
          </h3>
          <p style={{ fontSize: 13.5, color: '#647080', lineHeight: 1.75, margin: '0 0 14px', maxWidth: 640 }}>
            We keep speculative applications on file for six months and review them whenever a relevant vacancy opens.
            Send your CV with a short note about the kind of role you are looking for.
          </p>
          <a
            href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent('Speculative application')}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#0284c7',
              fontWeight: 800,
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            {CAREERS_EMAIL}
            <IconArrowRight size={15} strokeWidth={2.4} color="#0284c7" />
          </a>
        </Card>
      </Section>
    </main>
  )
}
