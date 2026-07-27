import { useMemo, useState } from 'react'
import { IconBriefcase, IconMapPin, IconCalendar, IconArrowRight, IconSend } from '../components/Icons'
import PageHero from '../components/page/PageHero'
import { Card, Chip, EmptyState, FilterBar, Meta, Section } from '../components/page/ui'
import { JOBS, daysUntil, formatDate, type Job } from '../data/site'

const CAREERS_EMAIL = 'careers@abr.rw'
const DEPARTMENTS = ['All', 'Business', 'IT & Digital', 'Risk & Compliance', 'Operations', 'Human Resources'] as const

function closingTone(job: Job) {
  const d = daysUntil(job.closes)
  if (d < 0) return { tone: 'grey' as const, label: 'Closed' }
  if (d <= 7) return { tone: 'amber' as const, label: `Closes in ${d} day${d === 1 ? '' : 's'}` }
  return { tone: 'green' as const, label: `Open · closes ${formatDate(job.closes)}` }
}

/* ── Application form ──
   There is no backend, so this does not pretend to submit anywhere.
   It validates, then hands a fully composed application off to the
   applicant's own mail client addressed to careers@abr.rw. That is a
   real, working route to a real inbox — and it keeps the CV attachment
   in the applicant's hands, which is where it has to be without a
   file-upload endpoint. */
function ApplyForm({ job, onClose }: { job: Job; onClose: () => void }) {
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
  }
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11.5,
    fontWeight: 800,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: '#647080',
    marginBottom: 6,
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 22, borderTop: '1px solid rgba(14,165,233,0.14)', paddingTop: 22 }}>
      <h4 style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>Apply for this role</h4>
      <p style={{ fontSize: 12.5, color: '#647080', marginBottom: 18, lineHeight: 1.6 }}>
        Completing this form opens your email application to <strong>{CAREERS_EMAIL}</strong> with the details filled
        in. Attach your CV and academic documents before you send it.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={labelStyle} htmlFor={`name-${job.id}`}>
            Full name
          </label>
          <input
            id={`name-${job.id}`}
            style={field}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            aria-invalid={touched && !!errors.name}
          />
          {touched && errors.name && <ErrorText>{errors.name}</ErrorText>}
        </div>
        <div>
          <label style={labelStyle} htmlFor={`email-${job.id}`}>
            Email
          </label>
          <input
            id={`email-${job.id}`}
            type="email"
            style={field}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            aria-invalid={touched && !!errors.email}
          />
          {touched && errors.email && <ErrorText>{errors.email}</ErrorText>}
        </div>
        <div>
          <label style={labelStyle} htmlFor={`phone-${job.id}`}>
            Phone
          </label>
          <input
            id={`phone-${job.id}`}
            type="tel"
            style={field}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            aria-invalid={touched && !!errors.phone}
          />
          {touched && errors.phone && <ErrorText>{errors.phone}</ErrorText>}
        </div>
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
            background: '#0ea5e9',
            color: '#fff',
            border: 'none',
            borderRadius: 9,
            padding: '11px 22px',
            fontWeight: 800,
            fontSize: 14,
            cursor: 'pointer',
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
            borderRadius: 9,
            padding: '11px 18px',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
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
  const status = closingTone(job)
  const closed = daysUntil(job.closes) < 0

  return (
    <Card style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
        <Chip tone="blue">{job.department}</Chip>
        <Chip tone="grey">{job.type}</Chip>
        <Chip tone={status.tone}>{status.label}</Chip>
      </div>

      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: '#0284c7', margin: '0 0 8px' }}>
        {job.title}
      </h3>
      <p style={{ fontSize: 14, color: '#647080', lineHeight: 1.7, margin: '0 0 18px', maxWidth: 720 }}>{job.summary}</p>

      <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', marginBottom: 18 }}>
        <Meta
          label="Location"
          value={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <IconMapPin size={14} color="#0ea5e9" strokeWidth={2} />
              {job.location}
            </span>
          }
        />
        <Meta label="Level" value={job.level} />
        <Meta
          label="Closing date"
          value={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <IconCalendar size={14} color="#0ea5e9" strokeWidth={2} />
              {formatDate(job.closes)}
            </span>
          }
        />
        <Meta label="Reference" value={job.id.toUpperCase()} />
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
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
              background: '#0ea5e9',
              border: 'none',
              color: '#fff',
              borderRadius: 9,
              padding: '9px 18px',
              fontWeight: 800,
              fontSize: 13.5,
              cursor: 'pointer',
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
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#0ea5e9', marginBottom: 10 }}>
                Key responsibilities
              </h4>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#647080', fontSize: 13.5, lineHeight: 1.85 }}>
                {job.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#0ea5e9', marginBottom: 10 }}>
                Requirements
              </h4>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#647080', fontSize: 13.5, lineHeight: 1.85 }}>
                {job.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
          {applying && <ApplyForm job={job} onClose={() => setApplying(false)} />}
        </div>
      )}
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
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(186,230,253,0.72)', marginTop: 5 }}>
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
          <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Nothing matching your skills?</h3>
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
