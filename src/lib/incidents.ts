/* ═══════════════════════════════════════════════════════════════
   INCIDENT REPORTING — public API client

   Unlike lib/content.ts, this talks to the one write surface the
   public API exposes. No cookies, no CSRF token (there is no session
   to protect) — the reference + passphrase pair the reporter chooses
   is the entire credential for everything after submission.
   ═══════════════════════════════════════════════════════════════ */

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000'
const API = `${BASE_URL}/api/v1`

export type IncidentTrack = 'service' | 'misconduct'
export type Severity = 'low' | 'medium' | 'high' | 'critical'

export interface IncidentApiErrorBody {
  error: { code: string; message: string; details?: { path: string; message: string }[] }
}

export class IncidentApiError extends Error {
  readonly code: string
  readonly status: number
  readonly fieldErrors: Record<string, string>

  constructor(status: number, body: Partial<IncidentApiErrorBody['error']>) {
    super(body.message ?? 'Something went wrong. Please try again.')
    this.name = 'IncidentApiError'
    this.status = status
    this.code = body.code ?? 'UNKNOWN'
    this.fieldErrors = Object.fromEntries((body.details ?? []).map((d) => [d.path, d.message]))
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const parsed = (await response.json().catch(() => ({}))) as Partial<IncidentApiErrorBody>
    throw new IncidentApiError(response.status, parsed.error ?? {})
  }
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

export interface SubmitIncidentInput {
  track: IncidentTrack
  category: string
  severity: Severity
  occurredAt?: string
  location?: string
  department?: string
  description: string
  anonymous: boolean
  contact?: { name?: string; email?: string; phone?: string }
  passphrase: string
  attachmentKeys: string[]
  /** Honeypot — always sent empty by this client; a real form field for bots. */
  website: string
  openedAt: number
}

export function submitIncident(input: SubmitIncidentInput): Promise<{ reference: string }> {
  return post('/incidents', input)
}

export async function uploadIncidentAttachment(file: File): Promise<{ key: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API}/incidents/attachments`, { method: 'POST', body: formData })
  if (!response.ok) {
    const parsed = (await response.json().catch(() => ({}))) as Partial<IncidentApiErrorBody>
    throw new IncidentApiError(response.status, parsed.error ?? {})
  }
  return (await response.json()) as { key: string }
}

export interface IncidentMessageView {
  fromBank: boolean
  body: string
  createdAt: string
}

export interface IncidentStatusView {
  reference: string
  track: IncidentTrack
  category: string
  severity: Severity
  status: 'received' | 'under_review' | 'action_taken' | 'closed'
  createdAt: string
  updatedAt: string
  closedAt: string | null
  messages: IncidentMessageView[]
}

export function lookupIncident(reference: string, passphrase: string): Promise<{ incident: IncidentStatusView }> {
  return post('/incidents/lookup', { reference, passphrase })
}

export function addIncidentMessage(reference: string, passphrase: string, body: string): Promise<void> {
  return post('/incidents/message', { reference, passphrase, body })
}
