import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconClock, IconSend, IconCheckCircle, IconShield } from '../components/Icons'
import PageHero from '../components/page/PageHero'
import { Card, Chip, Section, type Tone } from '../components/page/ui'
import {
  lookupIncident,
  addIncidentMessage,
  IncidentApiError,
  type IncidentStatusView,
} from '../lib/incidents'

/* Anonymous self-service: the reference + passphrase pair a reporter chose at
   submission is the entire credential here, and it never touches the CMS
   session system. A closed case is read-only in the UI as well as the API —
   there is nothing left to do with it besides read the outcome. */

const STATUS_LABEL: Record<IncidentStatusView['status'], string> = {
  received: 'Received',
  under_review: 'Under review',
  action_taken: 'Action taken',
  closed: 'Closed',
}

const STATUS_TONE: Record<IncidentStatusView['status'], Tone> = {
  received: 'blue',
  under_review: 'amber',
  action_taken: 'green',
  closed: 'grey',
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function LookupForm({ onFound }: { onFound: (incident: IncidentStatusView, passphrase: string) => void }) {
  const [reference, setReference] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { incident } = await lookupIncident(reference.trim(), passphrase)
      onFound(incident, passphrase)
    } catch (err) {
      setError(
        err instanceof IncidentApiError
          ? err.message
          : 'Could not check that report right now. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card style={{ padding: '32px 30px', maxWidth: 480, margin: '0 auto' }}>
      <form onSubmit={(e) => void handleSubmit(e)}>
        <label htmlFor="status-reference" style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
          Reference number
        </label>
        <input
          id="status-reference"
          type="text"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="ABR-XXXX-XXXX"
          style={{ ...inputStyle, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.03em', marginBottom: 16 }}
          autoCapitalize="characters"
          required
        />

        <label htmlFor="status-passphrase" style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
          Passphrase
        </label>
        <input
          id="status-passphrase"
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          style={{ ...inputStyle, marginBottom: 20 }}
          required
        />

        {error && (
          <p style={{ marginBottom: 16, fontSize: 12.5, color: '#b91c1c', fontWeight: 600 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 22px',
            borderRadius: 10,
            border: 'none',
            background: '#0ea5e9',
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 700,
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Checking…' : 'Check status'}
        </button>
      </form>

      <p style={{ marginTop: 18, fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 }}>
        Both were shown once, when you submitted your report. We cannot recover a lost passphrase —
        it exists only so you can prove this report is yours.
      </p>
    </Card>
  )
}

function IncidentThread({ incident, passphrase }: { incident: IncidentStatusView; passphrase: string }) {
  const [messages, setMessages] = useState(incident.messages)
  const [status, setStatus] = useState(incident.status)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const closed = status === 'closed'

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    if (!reply.trim()) return
    setSending(true)
    setError(null)
    try {
      await addIncidentMessage(incident.reference, passphrase, reply.trim())
      setMessages((m) => [...m, { fromBank: false, body: reply.trim(), createdAt: new Date().toISOString() }])
      setReply('')
      setSent(true)
      setTimeout(() => setSent(false), 2500)
    } catch (err) {
      if (err instanceof IncidentApiError && err.status === 400) {
        setStatus('closed')
      }
      setError(err instanceof IncidentApiError ? err.message : 'Could not send that message.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Card style={{ padding: '28px 28px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
          <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 18, fontWeight: 800, color: '#0284c7' }}>
            {incident.reference}
          </span>
          <Chip tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Chip>
        </div>
        <p style={{ fontSize: 13, color: '#647080' }}>
          {incident.category} · Submitted {formatDate(incident.createdAt)}
        </p>
        {closed && incident.closedAt && (
          <p style={{ fontSize: 12.5, color: '#94a3b8', marginTop: 6 }}>Closed {formatDate(incident.closedAt)}</p>
        )}
      </Card>

      <Card style={{ padding: '24px 28px' }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Messages</h3>

        {messages.length === 0 ? (
          <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20 }}>
            No messages yet. A reviewer will write here if they need more information.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.fromBank ? 'flex-start' : 'flex-end',
                  maxWidth: '82%',
                  background: m.fromBank ? '#f8fbfe' : 'rgba(14,165,233,0.1)',
                  border: `1px solid ${m.fromBank ? 'rgba(14,165,233,0.12)' : 'rgba(14,165,233,0.2)'}`,
                  borderRadius: 12,
                  padding: '10px 14px',
                }}
              >
                <div style={{ fontSize: 10.5, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  {m.fromBank ? 'AB Bank Rwanda' : 'You'}
                </div>
                <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{m.body}</p>
              </div>
            ))}
          </div>
        )}

        {closed ? (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              background: 'rgba(100,112,128,0.08)',
              fontSize: 12.5,
              color: '#647080',
              textAlign: 'center',
            }}
          >
            This case is closed. It no longer accepts new messages.
          </div>
        ) : (
          <form onSubmit={(e) => void handleReply(e)}>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={3}
              placeholder="Add more information, or answer a reviewer's question…"
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6, marginBottom: 10 }}
            />
            {error && <p style={{ marginBottom: 10, fontSize: 12.5, color: '#b91c1c', fontWeight: 600 }}>{error}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
              {sent && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: '#15803d', fontWeight: 700 }}>
                  <IconCheckCircle size={13} strokeWidth={2.2} /> Sent
                </span>
              )}
              <button
                type="submit"
                disabled={sending || !reply.trim()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 18px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#0ea5e9',
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: sending || !reply.trim() ? 'default' : 'pointer',
                  opacity: sending || !reply.trim() ? 0.6 : 1,
                }}
              >
                <IconSend size={13} strokeWidth={2.2} />
                {sending ? 'Sending…' : 'Send'}
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}

export default function ReportStatus() {
  const [found, setFound] = useState<{ incident: IncidentStatusView; passphrase: string } | null>(null)

  return (
    <>
      <PageHero
        Icon={IconClock}
        eyebrow="Support"
        title="Check a report's status"
        lead="Enter the reference number and passphrase you were given when you submitted a report."
      />

      <Section style={{ paddingTop: 56 }}>
        {found ? (
          <IncidentThread incident={found.incident} passphrase={found.passphrase} />
        ) : (
          <LookupForm onFound={(incident, passphrase) => setFound({ incident, passphrase })} />
        )}

        <p style={{ textAlign: 'center', fontSize: 12.5, color: '#94a3b8', marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <IconShield size={13} strokeWidth={2} />
          Haven't reported yet?{' '}
          <Link to="/report" style={{ color: '#0ea5e9', fontWeight: 700, textDecoration: 'none' }}>
            Start a report
          </Link>
        </p>
      </Section>
    </>
  )
}
