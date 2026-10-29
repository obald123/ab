import { useEffect, useRef, useState } from 'react'
import { IconSend } from './Icons'
import { Link } from 'react-router-dom'
import { API_ROOT, useCollection, useSingleton } from '../lib/content'
import { useT } from '../lib/i18n'

const EMPTY_FORM = { name: '', email: '', phone: '', subject: '', message: '', website: '' }

interface ContactDocument {
  info: {
    address: string
    phone1: string
    phone2: string
    email: string
    hours: string
    ekashCode: string
    momoCode: string
    whatsapp: string
  }
  branches: { id: string; name: string; address: string; city: string }[]
  smartValues: { id: string; letter: string; word: string; desc: string }[]
}

/** Shown only until the CMS responds, and if it never does. */
const FALLBACK: ContactDocument = {
  info: {
    address: 'Nyarugenge Avenue, KN 78 St, Kigali, Rwanda',
    phone1: '5500',
    phone2: '+(250) 78 819 83 00',
    email: 'info@abr.rw',
    hours: 'Mon – Fri: 8:00 – 17:00 · Sat: 9:00 – 13:00',
    ekashCode: '*540#',
    momoCode: '*182*4#',
    whatsapp: '78 819 83 00',
  },
  branches: [
    { id: 'cb1', name: 'Head Office – Kigali', address: 'Nyarugenge Avenue, KN 78 St', city: 'Kigali, Rwanda' },
    { id: 'cb2', name: 'Remera Branch', address: 'Gasabo District, Remera', city: 'Kigali, Rwanda' },
    { id: 'cb3', name: 'Nyamirambo Branch', address: 'Nyamirambo, KN 43 St', city: 'Kigali, Rwanda' },
  ],
  smartValues: [
    { id: 'sv1', letter: 'S', word: 'Simple', desc: 'Easy to understand products and processes' },
    { id: 'sv2', letter: 'M', word: 'Meaningful', desc: "Solutions with real impact on clients' lives" },
    { id: 'sv3', letter: 'A', word: 'Appropriate', desc: 'Tailored to client needs, not one-size-fits-all' },
    { id: 'sv4', letter: 'R', word: 'Responsive', desc: 'Respectful, timely and relevant service' },
    { id: 'sv5', letter: 'T', word: 'Transparent', desc: 'Clear pricing and honest communication' },
  ],
}

export default function Contact() {
  const t = useT()
  const { data: contact } = useSingleton<ContactDocument>('contact', FALLBACK)
  const { smartValues, branches, info } = contact
  // The real network size, from the branch list — never a typed-in claim.
  const { data: allBranches } = useCollection<{ name: string }>('branch', [])
  const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`
  const whatsappHref = `https://wa.me/${info.whatsapp.replace(/\D/g, '').replace(/^0?(?=7)/, '250')}`
  const linkColor = { color: 'inherit', textDecoration: 'none' } as const
  const containerRef = useRef<HTMLDivElement>(null)
  const [formState, setFormState] = useState(EMPTY_FORM)
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [sendError, setSendError] = useState<string | null>(null)

  useEffect(() => {
    const el = containerRef.current; if (!el) return
    const items = el.querySelectorAll<HTMLElement>('[data-reveal]')
    items.forEach(item => {
      item.style.opacity = '0'
      item.style.transform = 'translateY(24px)'
    })
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        items.forEach((item, i) => {
          setTimeout(() => {
            item.style.transition = `opacity 0.6s ease ${i * 80}ms, transform 0.6s ease ${i * 80}ms`
            item.style.opacity = '1'
            item.style.transform = 'translateY(0)'
          }, 0)
        })
        obs.disconnect()
      }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  /* Sent to the API, which stores the message encrypted in the CMS inbox and
     emails it to the bank. Success is shown only after the API confirms —
     never optimistically, so nobody believes they wrote to the bank when the
     message was lost. */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSendState('sending')
    setSendError(null)
    try {
      const response = await fetch(`${API_ROOT}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: { message?: string; details?: { message: string }[] }
        } | null
        throw new Error(body?.error?.details?.[0]?.message ?? body?.error?.message ?? t.contact.sendFailed)
      }
      setSendState('sent')
      setFormState(EMPTY_FORM)
    } catch (error) {
      setSendState('error')
      setSendError(error instanceof Error && error.message ? error.message : t.contact.sendFailed)
    }
  }

  return (
    <section id="contact" style={{ fontFamily: 'var(--font-sans)' }}>

      {/* SMART Campaign band */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
        padding: '72px 48px',
      }}>
        <div style={{ margin: '0 auto' }} ref={containerRef}>
          <div data-reveal style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{
              display: 'inline-block', background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 100,
              padding: '5px 18px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)',
              letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16,
            }}>
              {t.contact.commitment}
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700, fontSize: 'clamp(24px, 3.5vw, 40px)',
              color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.01em',
            }}>
              {t.contact.smartCampaign}
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.68)', marginTop: 12, maxWidth: 460, margin: '12px auto 0' }}>
              {t.smart.pledge}
            </p>
          </div>

          {/* SMART letters */}
          <div className="contact-smart-cards" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
            {smartValues.map((v, i) => (
              <div key={v.letter} data-reveal style={{
                flex: '1 1 180px', maxWidth: 220,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 16, padding: '28px 22px',
                backdropFilter: 'blur(8px)',
                transition: `background 0.2s, border-color 0.2s, transform 0.2s ${i * 60}ms`,
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.background = 'rgba(255,255,255,0.16)'
                  el.style.borderColor = 'rgba(255,255,255,0.3)'
                  el.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.background = 'rgba(255,255,255,0.08)'
                  el.style.borderColor = 'rgba(255,255,255,0.14)'
                  el.style.transform = 'none'
                }}
              >
                <div style={{
                  fontSize: 38, fontWeight: 900, color: '#ffffff',
                  lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 6,
                  textShadow: '0 2px 12px rgba(14,165,233,0.4)',
                }}>
                  {v.letter}
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>
                  {v.word}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>
                  {v.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact info section */}
      <div style={{ background: '#ffffff', padding: '80px 48px' }}>
        <div style={{ margin: '0 auto' }}>
          <div data-reveal style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="section-pill section-pill--icon"><IconSend size={14} strokeWidth={2} color="#0ea5e9" />{t.contact.eyebrow}</span>
            <h2 style={{
              fontWeight: 800, fontSize: 'clamp(24px, 3.5vw, 40px)',
              color: '#0284c7', lineHeight: 1.1, letterSpacing: '-0.02em',
            }}>
              {t.contact.heading}
            </h2>
          </div>

          <div className="contact-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>

            {/* Address */}
            <div data-reveal style={{
              background: '#f8fbfe', border: '1px solid rgba(14,165,233,0.1)',
              borderRadius: 18, padding: '36px 32px',
              transition: 'box-shadow 0.25s, border-color 0.25s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = '0 12px 40px rgba(14,165,233,0.1)'
                el.style.borderColor = 'rgba(14,165,233,0.25)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = 'none'
                el.style.borderColor = 'rgba(14,165,233,0.1)'
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0284c7', marginBottom: 12 }}>{t.contact.location}</h3>
              <p style={{ fontSize: 14, color: '#647080', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {info.address.split(/,\s*/).join('\n')}
              </p>
              {allBranches.length > 0 && (
                <p style={{ fontSize: 12.5, color: '#8fa0aa', marginTop: 12 }}>
                  {allBranches.length} {t.contact.branchesNationwide}
                </p>
              )}
            </div>

            {/* Phone & Email */}
            <div data-reveal style={{
              background: '#f8fbfe', border: '1px solid rgba(14,165,233,0.1)',
              borderRadius: 18, padding: '36px 32px',
              transition: 'box-shadow 0.25s, border-color 0.25s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = '0 12px 40px rgba(14,165,233,0.1)'
                el.style.borderColor = 'rgba(14,165,233,0.25)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = 'none'
                el.style.borderColor = 'rgba(14,165,233,0.1)'
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0284c7', marginBottom: 12 }}>{t.contact.callOrWrite}</h3>
              {info.phone1 && (
                <p style={{ fontSize: 15, color: '#0ea5e9', fontWeight: 800, marginBottom: 6 }}>
                  <a href={telHref(info.phone1)} style={linkColor}>{info.phone1}</a>
                </p>
              )}
              {info.phone2 && (
                <p style={{ fontSize: 14.5, color: '#0ea5e9', fontWeight: 700, marginBottom: 6 }}>
                  <a href={telHref(info.phone2)} style={linkColor}>{info.phone2}</a>
                </p>
              )}
              <p style={{ fontSize: 14.5, color: '#0ea5e9', fontWeight: 700, marginBottom: 14 }}>
                <a href={`mailto:${info.email}`} style={linkColor}>{info.email}</a>
              </p>
              <p style={{ fontSize: 12.5, color: '#8fa0aa' }}>{info.hours}</p>
            </div>

            {/* Digital / eKash */}
            <div data-reveal style={{
              background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)',
              borderRadius: 18, padding: '36px 32px',
              transition: 'box-shadow 0.25s, transform 0.25s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = '0 16px 48px rgba(14,165,233,0.3)'
                el.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = 'none'
                el.style.transform = 'none'
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 12 }}>{t.contact.bankDigitally}</h3>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 6 }}>
                {info.ekashCode}
              </p>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 18 }}>
                {t.contact.dialDigital}
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  flex: 1, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8, padding: '8px 12px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>AB IBAKWE</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{info.momoCode}</div>
                </div>
                <div style={{
                  flex: 1, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8, padding: '8px 12px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>WhatsApp</div>
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>{info.whatsapp}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div data-reveal style={{ marginTop: 40, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <form onSubmit={handleSubmit} style={{ flex: 1, background: '#ffffff', border: '1px solid rgba(14,165,233,0.06)', borderRadius: 12, padding: 22 }} aria-label={t.contact.formLabel}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <label style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#647080', marginBottom: 6 }}>{t.contact.name}</div>
                  <input name="name" value={formState.name} onChange={handleChange} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e6eef8' }} />
                </label>
                <label style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#647080', marginBottom: 6 }}>{t.contact.email}</div>
                  <input name="email" type="email" value={formState.email} onChange={handleChange} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e6eef8' }} />
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <label style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#647080', marginBottom: 6 }}>{t.contact.phone}</div>
                  <input name="phone" type="tel" autoComplete="tel" value={formState.phone} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e6eef8' }} />
                </label>
                <label style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#647080', marginBottom: 6 }}>{t.contact.subject}</div>
                  <input name="subject" value={formState.subject} onChange={handleChange} required maxLength={150} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e6eef8' }} />
                </label>
              </div>
              {/* Honeypot: hidden from people and screen readers, filled by bots. */}
              <input
                name="website"
                value={formState.website}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }}
              />
              <label style={{ display: 'block', marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: '#647080', marginBottom: 6 }}>{t.contact.message}</div>
                <textarea name="message" value={formState.message} onChange={handleChange} rows={5} required minLength={10} maxLength={4000} style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #e6eef8' }} />
              </label>
              <p style={{ fontSize: 11.5, color: '#647080', margin: '0 0 12px', lineHeight: 1.55 }}>
                {t.contact.privacyNote}{' '}
                <Link to="/privacy" style={{ color: '#0284c7', fontWeight: 700 }}>{t.contact.privacyLink}</Link>
              </p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <button type="submit" disabled={sendState === 'sending'} style={{ background: '#0ea5e9', color: '#fff', padding: '10px 18px', borderRadius: 10, border: 'none', fontWeight: 800, opacity: sendState === 'sending' ? 0.7 : 1, cursor: sendState === 'sending' ? 'wait' : 'pointer' }}>
                  {sendState === 'sending' ? t.contact.sending : t.contact.send}
                </button>
                <div role="status" aria-live="polite" style={{ fontWeight: 700, color: sendState === 'error' ? '#b91c1c' : '#2b7a3a' }}>
                  {sendState === 'sent' ? t.contact.sent : sendState === 'error' ? sendError : ''}
                </div>
              </div>
            </form>

            {/* right column intentionally left for other content or images */}
            <div style={{ width: 320 }} />
          </div>

          {/* Branch list */}
          <div data-reveal style={{ marginTop: 48 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0284c7', marginBottom: 20 }}>{t.contact.keyBranches}</h3>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {branches.map(b => (
                <div key={b.name} style={{
                  flex: '1 1 220px',
                  background: '#f8fbfe', border: '1px solid rgba(14,165,233,0.08)',
                  borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#0ea5e9',
                    flexShrink: 0, marginTop: 5,
                  }} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0284c7' }}>{b.name}</div>
                    <div style={{ fontSize: 12.5, color: '#8fa0aa', marginTop: 3 }}>{b.address}<br />{b.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
