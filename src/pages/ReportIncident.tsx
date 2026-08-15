import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  IconAlert,
  IconShield,
  IconGavel,
  IconCheckCircle,
  IconUpload,
  IconSend,
  IconClock,
  IconArrowRight,
} from '../components/Icons'
import PageHero from '../components/page/PageHero'
import { Card, Chip, Section } from '../components/page/ui'
import {
  submitIncident,
  uploadIncidentAttachment,
  IncidentApiError,
  type IncidentTrack,
  type Severity,
} from '../lib/incidents'

/* ═══════════════════════════════════════════════════════════════
   REPORT AN INCIDENT

   Deliberately not a single long form. The two things people bring
   here — "the app charged me twice" and "a colleague is taking
   bribes" — have opposite needs: one wants a callback, the other
   may be endangered by being identified. A track chooser up front
   means the rest of the form only ever asks for what that track
   actually requires, instead of showing an anonymity toggle to
   someone reporting a failed ATM withdrawal.

   Every request goes straight to the API — there is no mock mode —
   because a report a nervous person spent ten minutes writing must
   never silently vanish into a demo.
   ═══════════════════════════════════════════════════════════════ */

const SERVICE_CATEGORIES = [
  'Card / ATM',
  'Mobile or Internet Banking',
  'Branch service',
  'Fees or charges',
  'Loan or account issue',
  'Something else',
]

const MISCONDUCT_CATEGORIES = [
  'Bribery or corruption',
  'Fraud',
  'Harassment or discrimination',
  'Conflict of interest',
  'Policy or procedure violation',
  'Something else',
]

const SEVERITIES: { value: Severity; label: string; hint: string }[] = [
  { value: 'low', label: 'Low', hint: 'No urgency — a suggestion or minor issue' },
  { value: 'medium', label: 'Medium', hint: 'Affects you, no immediate risk' },
  { value: 'high', label: 'High', hint: 'Ongoing harm or financial loss' },
  { value: 'critical', label: 'Critical', hint: 'Active danger or money being lost right now' },
]

const MIN_DESCRIPTION = 30
const MIN_PASSPHRASE = 4

type Step = 'track' | 'details' | 'identity' | 'review'

interface FormState {
  track: IncidentTrack | null
  category: string
  severity: Severity
  occurredAt: string
  location: string
  department: string
  description: string
  anonymous: boolean | null
  name: string
  email: string
  phone: string
  passphrase: string
  passphraseConfirm: string
  attachmentKeys: string[]
  /** Honeypot: invisible to a real visitor. A bot that fills every field it
   *  can find puts something here, and the backend rejects on sight. */
  website: string
}

const BLANK: FormState = {
  track: null,
  category: '',
  severity: 'medium',
  occurredAt: '',
  location: '',
  department: '',
  description: '',
  anonymous: null,
  name: '',
  email: '',
  phone: '',
  passphrase: '',
  passphraseConfirm: '',
  attachmentKeys: [],
  website: '',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 10,
  border: '1px solid rgba(14,165,233,0.22)',
  fontSize: 14.5,
  color: '#0f172a',
  background: '#ffffff',
  fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12.5,
  fontWeight: 700,
  color: '#334155',
  marginBottom: 6,
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p style={{ marginTop: 6, fontSize: 12, color: '#b91c1c', fontWeight: 600 }}>{message}</p>
}

/* ── Step 0: track chooser ── */
function TrackChoice({ onChoose }: { onChoose: (track: IncidentTrack) => void }) {
  return (
    <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
      <button
        type="button"
        onClick={() => onChoose('service')}
        className="page-card page-card--interactive"
        style={{
          textAlign: 'left',
          background: '#ffffff',
          border: '1.5px solid rgba(14,165,233,0.18)',
          borderRadius: 18,
          padding: '28px 26px',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(14,165,233,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <IconAlert size={22} color="#0284c7" strokeWidth={2} />
        </span>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
          A problem with a service
        </h3>
        <p style={{ fontSize: 13.5, color: '#647080', lineHeight: 1.6, marginBottom: 16 }}>
          A failed transaction, a card, the app, or something at a branch. We will need your
          details to look into it and get back to you.
        </p>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#0ea5e9' }}>
          Start this report <IconArrowRight size={14} strokeWidth={2.5} />
        </span>
      </button>

      <button
        type="button"
        onClick={() => onChoose('misconduct')}
        className="page-card page-card--interactive"
        style={{
          textAlign: 'left',
          background: '#ffffff',
          border: '1.5px solid rgba(14,165,233,0.18)',
          borderRadius: 18,
          padding: '28px 26px',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'rgba(180,83,9,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <IconGavel size={22} color="#b45309" strokeWidth={2} />
        </span>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>
          Misconduct or wrongdoing
        </h3>
        <p style={{ fontSize: 13.5, color: '#647080', lineHeight: 1.6, marginBottom: 16 }}>
          Fraud, bribery, harassment, or a conflict of interest involving anyone at the bank. You
          may report this without giving your name.
        </p>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#b45309' }}>
          Start this report <IconArrowRight size={14} strokeWidth={2.5} />
        </span>
      </button>
    </div>
  )
}

export default function ReportIncident() {
  const [step, setStep] = useState<Step>('track')
  const [form, setForm] = useState<FormState>(BLANK)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [reference, setReference] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [attachmentNames, setAttachmentNames] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // The min-time-on-form floor the backend enforces is measured from here.
  // Set in an effect, not during render, so the component stays pure —
  // Date.now() would otherwise be an impure call in the render body.
  const openedAtRef = useRef<number | null>(null)
  useEffect(() => {
    openedAtRef.current = Date.now()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [step])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  const categories = form.track === 'misconduct' ? MISCONDUCT_CATEGORIES : SERVICE_CATEGORIES

  function validateDetails(): boolean {
    const next: Record<string, string> = {}
    if (!form.category) next.category = 'Choose a category.'
    if (form.description.trim().length < MIN_DESCRIPTION) {
      next.description = `Tell us a bit more — at least ${String(MIN_DESCRIPTION)} characters.`
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function validateIdentity(): boolean {
    const next: Record<string, string> = {}
    if (form.anonymous === null) next.anonymous = 'Choose whether to include your details.'
    if (form.anonymous === false && !form.email.trim() && !form.phone.trim()) {
      next.contact = 'Add an email or phone number so we can reach you.'
    }
    if (form.passphrase.length < MIN_PASSPHRASE) {
      next.passphrase = `Use at least ${String(MIN_PASSPHRASE)} characters.`
    }
    if (form.passphrase !== form.passphraseConfirm) {
      next.passphraseConfirm = 'The two passphrases do not match.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleFileSelect(fileList: FileList | null) {
    const file = fileList?.[0]
    if (!file) return
    setUploading(true)
    setSubmitError(null)
    try {
      const { key } = await uploadIncidentAttachment(file)
      set('attachmentKeys', [...form.attachmentKeys, key])
      setAttachmentNames((names) => [...names, file.name])
    } catch (err) {
      setSubmitError(err instanceof IncidentApiError ? err.message : 'Could not attach that file.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function removeAttachment(index: number) {
    set(
      'attachmentKeys',
      form.attachmentKeys.filter((_, i) => i !== index),
    )
    setAttachmentNames((names) => names.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    if (!form.track) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await submitIncident({
        track: form.track,
        category: form.category,
        severity: form.severity,
        ...(form.occurredAt.trim() ? { occurredAt: form.occurredAt.trim() } : {}),
        ...(form.location.trim() ? { location: form.location.trim() } : {}),
        ...(form.department.trim() ? { department: form.department.trim() } : {}),
        description: form.description.trim(),
        anonymous: form.anonymous === true,
        ...(form.anonymous === false
          ? {
              contact: {
                ...(form.name.trim() ? { name: form.name.trim() } : {}),
                ...(form.email.trim() ? { email: form.email.trim() } : {}),
                ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
              },
            }
          : {}),
        passphrase: form.passphrase,
        attachmentKeys: form.attachmentKeys,
        website: form.website,
        // Falls back to now if the mount effect somehow hasn't run yet — the
        // backend floor only ever gets stricter from that, never looser.
        openedAt: openedAtRef.current ?? Date.now(),
      })
      setReference(result.reference)
    } catch (err) {
      setSubmitError(
        err instanceof IncidentApiError
          ? err.message
          : 'Something went wrong submitting your report. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const accent = form.track === 'misconduct' ? '#b45309' : '#0ea5e9'

  const stepIndex = useMemo(() => ({ track: 0, details: 1, identity: 2, review: 3 })[step], [step])

  if (reference) {
    return <SuccessScreen reference={reference} />
  }

  return (
    <>
      <PageHero
        Icon={IconAlert}
        eyebrow="Support"
        title="Report an incident"
        lead="Tell us what happened — a service problem, or something more serious. You choose how much of your identity to share."
        meta={
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(220,38,38,0.14)',
              border: '1px solid rgba(248,113,113,0.35)',
              borderRadius: 12,
              padding: '10px 16px',
            }}
          >
            <IconAlert size={16} color="#fecaca" strokeWidth={2.2} />
            <span style={{ fontSize: 13, color: '#fecaca', fontWeight: 700 }}>
              In danger, or money is being taken right now? Call{' '}
              <a href="tel:5500" style={{ color: '#ffffff', textDecoration: 'underline' }}>
                5500
              </a>{' '}
              — don't wait for this form.
            </span>
          </div>
        }
      />

      <Section style={{ paddingTop: 56 }}>
        {step !== 'track' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            {(['details', 'identity', 'review'] as const).map((s, i) => {
              const idx = i + 1
              const active = stepIndex >= idx
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 800,
                      flexShrink: 0,
                      background: active ? accent : 'rgba(100,112,128,0.12)',
                      color: active ? '#ffffff' : '#94a3b8',
                      transition: 'background 0.2s',
                    }}
                  >
                    {idx}
                  </div>
                  {i < 2 && (
                    <div
                      style={{
                        flex: 1,
                        height: 2,
                        background: stepIndex > idx ? accent : 'rgba(100,112,128,0.12)',
                        transition: 'background 0.2s',
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {step === 'track' && <TrackChoice onChoose={(t) => { set('track', t); setStep('details') }} />}

        {step === 'details' && form.track && (
          <Card style={{ padding: '32px 30px', maxWidth: 640, margin: '0 auto' }}>
            {/* Honeypot — off-screen, not display:none (which some scrapers skip),
                and out of the tab order and screen-reader tree for a sighted or
                assistive-tech visitor either way. A filled value fails the
                request server-side without saying why. */}
            <div style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
              <label htmlFor="incident-website">Leave this field blank</label>
              <input
                id="incident-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => set('website', e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <Chip tone={form.track === 'misconduct' ? 'amber' : 'blue'}>
                {form.track === 'misconduct' ? 'Misconduct report' : 'Service issue'}
              </Chip>
            </div>

            <label htmlFor="incident-category" style={labelStyle}>Category</label>
            <select
              id="incident-category"
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              style={{ ...inputStyle, marginBottom: 4 }}
            >
              <option value="">Choose one…</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <FieldError message={errors.category} />

            <div style={{ height: 18 }} />

            {/* A group of toggle buttons, not one control — a <label> here
                would have nothing valid to associate with, so this is a
                labelled group instead. */}
            <span id="severity-label" style={labelStyle}>How serious is this?</span>
            <div
              role="group"
              aria-labelledby="severity-label"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 22 }}
            >
              {SEVERITIES.map((s) => {
                const active = form.severity === s.value
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => set('severity', s.value)}
                    title={s.hint}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: 10,
                      border: `1.5px solid ${active ? accent : 'rgba(14,165,233,0.18)'}`,
                      background: active ? `${accent}14` : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 800, color: active ? accent : '#334155' }}>{s.label}</div>
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
              <div>
                <label htmlFor="incident-occurred-at" style={labelStyle}>When did this happen? (optional)</label>
                <input
                  id="incident-occurred-at"
                  type="text"
                  value={form.occurredAt}
                  onChange={(e) => set('occurredAt', e.target.value)}
                  placeholder="e.g. 12 August, around 3pm"
                  style={inputStyle}
                />
              </div>
              <div>
                <label htmlFor="incident-location" style={labelStyle}>Where? (optional)</label>
                <input
                  id="incident-location"
                  type="text"
                  value={form.location}
                  onChange={(e) => set('location', e.target.value)}
                  placeholder="e.g. Kimironko branch"
                  style={inputStyle}
                />
              </div>
            </div>

            {form.track === 'misconduct' && (
              <div style={{ marginBottom: 18 }}>
                <label htmlFor="incident-department" style={labelStyle}>Department or branch involved (optional)</label>
                <input
                  id="incident-department"
                  type="text"
                  value={form.department}
                  onChange={(e) => set('department', e.target.value)}
                  placeholder="If you know it"
                  style={inputStyle}
                />
              </div>
            )}

            <label htmlFor="incident-description" style={labelStyle}>What happened?</label>
            <textarea
              id="incident-description"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={6}
              placeholder="Describe what happened, as much detail as you can share."
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <FieldError message={errors.description} />
              <span style={{ fontSize: 11.5, color: '#94a3b8' }}>{form.description.trim().length} characters</span>
            </div>
            <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
              Please don't include your card number, PIN, password, or a one-time code — we never need
              them, and this form is not the place to send them.
            </p>

            <div style={{ height: 22 }} />

            {/* Not a <label>: it fronts the chip list and upload button below,
                not one control — the upload input has its own label further
                down. */}
            <span style={labelStyle}>Attach evidence (optional)</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              {attachmentNames.map((name, i) => (
                <span
                  key={`${name}-${String(i)}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'rgba(14,165,233,0.08)',
                    border: '1px solid rgba(14,165,233,0.2)',
                    borderRadius: 100,
                    padding: '5px 6px 5px 12px',
                    fontSize: 12.5,
                    color: '#0284c7',
                  }}
                >
                  {name}
                  <button
                    type="button"
                    onClick={() => removeAttachment(i)}
                    aria-label={`Remove ${name}`}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: 'none',
                      background: 'rgba(14,165,233,0.18)',
                      color: '#0284c7',
                      cursor: 'pointer',
                      fontSize: 12,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
              onChange={(e) => void handleFileSelect(e.target.files)}
              className="sr-only"
              id="incident-file-input"
            />
            <label
              htmlFor="incident-file-input"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
                borderRadius: 10,
                border: '1.5px dashed rgba(14,165,233,0.3)',
                fontSize: 13,
                fontWeight: 700,
                color: '#0284c7',
                cursor: uploading ? 'default' : 'pointer',
                opacity: uploading ? 0.6 : 1,
              }}
            >
              <IconUpload size={15} strokeWidth={2.2} />
              {uploading ? 'Uploading…' : 'Add a photo or short video'}
            </label>

            {submitError && <FieldError message={submitError} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
              <NavButton onClick={() => setStep('track')}>Back</NavButton>
              <NavButton
                primary
                accent={accent}
                onClick={() => {
                  if (validateDetails()) setStep('identity')
                }}
              >
                Continue
              </NavButton>
            </div>
          </Card>
        )}

        {step === 'identity' && form.track && (
          <Card style={{ padding: '32px 30px', maxWidth: 640, margin: '0 auto' }}>
            <span id="anonymous-label" style={labelStyle}>Do you want to include your details?</span>
            <div
              role="group"
              aria-labelledby="anonymous-label"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 8 }}
            >
              <button
                type="button"
                onClick={() => set('anonymous', false)}
                style={{
                  textAlign: 'left',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: `1.5px solid ${form.anonymous === false ? accent : 'rgba(14,165,233,0.18)'}`,
                  background: form.anonymous === false ? `${accent}14` : '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a', marginBottom: 3 }}>
                  Share my details
                </div>
                <div style={{ fontSize: 12, color: '#647080', lineHeight: 1.5 }}>
                  We can update you directly and reach you if we need more information.
                </div>
              </button>
              <button
                type="button"
                onClick={() => set('anonymous', true)}
                style={{
                  textAlign: 'left',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: `1.5px solid ${form.anonymous === true ? accent : 'rgba(14,165,233,0.18)'}`,
                  background: form.anonymous === true ? `${accent}14` : '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 800, color: '#0f172a', marginBottom: 3 }}>
                  <IconShield size={14} color={accent} strokeWidth={2.2} /> Stay anonymous
                </div>
                <div style={{ fontSize: 12, color: '#647080', lineHeight: 1.5 }}>
                  We never see who you are. You can still get updates using your reference below.
                </div>
              </button>
            </div>
            <FieldError message={errors.anonymous} />

            {form.anonymous === false && (
              <div style={{ marginTop: 22 }}>
                <div style={{ marginBottom: 14 }}>
                  <label htmlFor="incident-name" style={labelStyle}>Full name (optional)</label>
                  <input
                    id="incident-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label htmlFor="incident-email" style={labelStyle}>Email</label>
                    <input
                      id="incident-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="incident-phone" style={labelStyle}>Phone</label>
                    <input
                      id="incident-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <FieldError message={errors.contact} />
              </div>
            )}

            {form.anonymous === true && (
              <div
                style={{
                  marginTop: 18,
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'rgba(180,83,9,0.08)',
                  border: '1px solid rgba(180,83,9,0.18)',
                  fontSize: 12.5,
                  color: '#92400e',
                  lineHeight: 1.6,
                }}
              >
                We will not record your IP address, browser, or any other trace of who submitted
                this — that's true for the whole report, not just this page.
              </div>
            )}

            <div style={{ height: 24 }} />

            <label htmlFor="incident-passphrase" style={labelStyle}>Choose a passphrase</label>
            <p style={{ fontSize: 12.5, color: '#647080', marginBottom: 10, lineHeight: 1.6 }}>
              This — together with your reference number — is how you check on this report later.
              We cannot recover it if you lose it, so save it somewhere safe.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <input
                  id="incident-passphrase"
                  type="password"
                  value={form.passphrase}
                  onChange={(e) => set('passphrase', e.target.value)}
                  placeholder={`At least ${String(MIN_PASSPHRASE)} characters`}
                  style={inputStyle}
                  autoComplete="new-password"
                />
                <FieldError message={errors.passphrase} />
              </div>
              <div>
                <label htmlFor="incident-passphrase-confirm" className="sr-only">Confirm passphrase</label>
                <input
                  id="incident-passphrase-confirm"
                  type="password"
                  value={form.passphraseConfirm}
                  onChange={(e) => set('passphraseConfirm', e.target.value)}
                  placeholder="Confirm passphrase"
                  style={inputStyle}
                  autoComplete="new-password"
                />
                <FieldError message={errors.passphraseConfirm} />
              </div>
            </div>

            {submitError && <div style={{ marginTop: 16 }}><FieldError message={submitError} /></div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
              <NavButton onClick={() => setStep('details')}>Back</NavButton>
              <NavButton
                primary
                accent={accent}
                onClick={() => {
                  if (validateIdentity()) setStep('review')
                }}
              >
                Review
              </NavButton>
            </div>
          </Card>
        )}

        {step === 'review' && form.track && (
          <Card style={{ padding: '32px 30px', maxWidth: 640, margin: '0 auto' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 18 }}>
              Review before sending
            </h3>

            <ReviewRow label="Type" value={form.track === 'misconduct' ? 'Misconduct report' : 'Service issue'} />
            <ReviewRow label="Category" value={form.category} />
            <ReviewRow label="Severity" value={SEVERITIES.find((s) => s.value === form.severity)?.label ?? ''} />
            {form.occurredAt && <ReviewRow label="When" value={form.occurredAt} />}
            {form.location && <ReviewRow label="Where" value={form.location} />}
            <ReviewRow
              label="Identity"
              value={form.anonymous ? 'Anonymous — no details shared' : form.email || form.phone || 'Details shared'}
            />
            <ReviewRow label="Attachments" value={attachmentNames.length ? attachmentNames.join(', ') : 'None'} />

            <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: '#f8fbfe' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                Description
              </div>
              <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {form.description}
              </p>
            </div>

            {submitError && <div style={{ marginTop: 16 }}><FieldError message={submitError} /></div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
              <NavButton onClick={() => setStep('identity')} disabled={submitting}>
                Back
              </NavButton>
              <NavButton primary accent={accent} onClick={() => void handleSubmit()} disabled={submitting}>
                <IconSend size={14} strokeWidth={2.2} />
                {submitting ? 'Sending…' : 'Send report'}
              </NavButton>
            </div>
          </Card>
        )}

        <p style={{ textAlign: 'center', fontSize: 12.5, color: '#94a3b8', marginTop: 28 }}>
          Already reported something?{' '}
          <Link
            to="/report/status"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              color: '#0ea5e9',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Check its status <IconArrowRight size={11} strokeWidth={2.5} />
          </Link>
        </p>
      </Section>
    </>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '8px 0', borderBottom: '1px solid rgba(14,165,233,0.08)' }}>
      <span style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function NavButton({
  children,
  onClick,
  primary = false,
  accent = '#0ea5e9',
  disabled = false,
}: {
  children: React.ReactNode
  onClick: () => void
  primary?: boolean
  accent?: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '11px 22px',
        borderRadius: 10,
        border: primary ? 'none' : '1.5px solid rgba(14,165,233,0.2)',
        background: primary ? accent : 'transparent',
        color: primary ? '#ffffff' : '#647080',
        fontSize: 13.5,
        fontWeight: 700,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  )
}

function SuccessScreen({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false)

  function copyReference() {
    void navigator.clipboard.writeText(reference).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Section style={{ paddingTop: 152, paddingBottom: 120 }}>
      <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(22,163,74,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <IconCheckCircle size={30} color="#15803d" strokeWidth={2} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
          Report received
        </h1>
        <p style={{ fontSize: 14.5, color: '#647080', lineHeight: 1.7, marginBottom: 28 }}>
          Thank you. Save your reference number below — together with the passphrase you chose,
          it's the only way to check on this report or add more information later.
        </p>

        <Card style={{ padding: '24px 26px', textAlign: 'left' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Your reference number
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <span
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: 22,
                fontWeight: 800,
                color: '#0284c7',
                letterSpacing: '0.02em',
              }}
            >
              {reference}
            </span>
            <button
              type="button"
              onClick={copyReference}
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: copied ? '#15803d' : '#0ea5e9',
                background: 'rgba(14,165,233,0.08)',
                border: 'none',
                borderRadius: 8,
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(220,38,38,0.06)',
              border: '1px solid rgba(220,38,38,0.16)',
              fontSize: 12.5,
              color: '#991b1b',
              lineHeight: 1.6,
            }}
          >
            We do not store your passphrase in a form you or we can read back. If you lose either
            of these, there is no way to recover access to this report.
          </div>
        </Card>

        <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/report/status"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 10,
              background: '#0ea5e9',
              color: '#ffffff',
              fontSize: 13.5,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <IconClock size={15} strokeWidth={2.2} />
            Check status later
          </Link>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 22px',
              borderRadius: 10,
              border: '1.5px solid rgba(14,165,233,0.2)',
              color: '#647080',
              fontSize: 13.5,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Back to home
          </Link>
        </div>
      </div>
    </Section>
  )
}
