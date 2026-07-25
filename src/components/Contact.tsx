import { useEffect, useRef, useState } from 'react'
import { PersonStanding, Accessibility, TextCursor, AlignJustify, Type, ImageOff, Contrast, Eye, Compass, Target, X, Link, MousePointer2, PauseCircle, BookOpen, Focus } from 'lucide-react'
import { OPEN_EVENT } from './CookieConsent'

const smartValues = [
  { letter: 'S', word: 'Simple', desc: 'Easy to understand products and processes' },
  { letter: 'M', word: 'Meaningful', desc: 'Solutions with real impact on clients\' lives' },
  { letter: 'A', word: 'Appropriate', desc: 'Tailored to client needs, not one-size-fits-all' },
  { letter: 'R', word: 'Responsive', desc: 'Respectful, timely and relevant service' },
  { letter: 'T', word: 'Transparent', desc: 'Clear pricing and honest communication' },
]

const branches = [
  { name: 'Head Office – Kigali', address: 'Nyarugenge Avenue, KN 78 St', city: 'Kigali, Rwanda' },
  { name: 'Remera Branch', address: 'Gasabo District, Remera', city: 'Kigali, Rwanda' },
  { name: 'Nyamirambo Branch', address: 'Nyamirambo, KN 43 St', city: 'Kigali, Rwanda' },
]

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // In this demo we simply show a success state; integrate with backend as needed
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setFormState({ name: '', email: '', message: '' })
  }

  // Accessibility widget state hooks
  const [a11yOpen, setA11yOpen] = useState(false)
  const [a11yState, setA11yState] = useState({
    highContrast: false,
    largeText: false,
    hideImages: false,
    lineHeight: false,
    letterSpacing: false,
    readingMask: false,
    grayscale: false,
    highlightLinks: false,
    bigCursor: false,
    pauseAnimations: false,
    dyslexiaFriendly: false,
    highlightFocus: false,
  })

  useEffect(() => {
    const saved = localStorage.getItem('a11y-state')
    if (saved) {
      const parsed = JSON.parse(saved)
      setA11yState(parsed)
      applyA11yClasses(parsed)
    }
  }, [])

  function applyA11yClasses(state: typeof a11yState) {
    const root = document.documentElement
    root.classList.toggle('a11y-high-contrast', state.highContrast)
    root.classList.toggle('a11y-large-text', state.largeText)
    root.classList.toggle('a11y-hide-images', state.hideImages)
    root.classList.toggle('a11y-line-height', state.lineHeight)
    root.classList.toggle('a11y-letter-spacing', state.letterSpacing)
    root.classList.toggle('a11y-reading-mask', state.readingMask)
    root.classList.toggle('a11y-grayscale', state.grayscale)
    root.classList.toggle('a11y-highlight-links', state.highlightLinks)
    root.classList.toggle('a11y-big-cursor', state.bigCursor)
    root.classList.toggle('a11y-pause-animations', state.pauseAnimations)
    root.classList.toggle('a11y-dyslexia-friendly', state.dyslexiaFriendly)
    root.classList.toggle('a11y-highlight-focus', state.highlightFocus)
  }

  function toggleA11yOption(option: keyof typeof a11yState) {
    setA11yState((current) => {
      const next = { ...current, [option]: !current[option] }
      localStorage.setItem('a11y-state', JSON.stringify(next))
      applyA11yClasses(next)
      return next
    })
  }

  function applyProfile(profile: 'vision' | 'navigation' | 'focus') {
    if (profile === 'vision') {
      const next = {
        highContrast: true,
        largeText: true,
        hideImages: false,
        lineHeight: true,
        letterSpacing: true,
        readingMask: false,
        grayscale: false,
        highlightLinks: true,
        bigCursor: false,
        pauseAnimations: false,
        dyslexiaFriendly: true,
        highlightFocus: true,
      }
      setA11yState(next)
      localStorage.setItem('a11y-state', JSON.stringify(next))
      applyA11yClasses(next)
    }
    if (profile === 'navigation') {
      const next = {
        highContrast: false,
        largeText: true,
        hideImages: false,
        lineHeight: true,
        letterSpacing: false,
        readingMask: true,
        grayscale: false,
        highlightLinks: true,
        bigCursor: true,
        pauseAnimations: true,
        dyslexiaFriendly: false,
        highlightFocus: true,
      }
      setA11yState(next)
      localStorage.setItem('a11y-state', JSON.stringify(next))
      applyA11yClasses(next)
    }
    if (profile === 'focus') {
      const next = {
        highContrast: true,
        largeText: false,
        hideImages: true,
        lineHeight: true,
        letterSpacing: false,
        readingMask: true,
        grayscale: false,
        highlightLinks: false,
        bigCursor: false,
        pauseAnimations: true,
        dyslexiaFriendly: false,
        highlightFocus: true,
      }
      setA11yState(next)
      localStorage.setItem('a11y-state', JSON.stringify(next))
      applyA11yClasses(next)
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
              Our Commitment
            </div>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700, fontSize: 'clamp(24px, 3.5vw, 40px)',
              color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.01em',
            }}>
              The SMART Campaign
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.68)', marginTop: 12, maxWidth: 460, margin: '12px auto 0' }}>
              AB Rwanda is a proud signatory of the SMART Campaign — our pledge to put client protection at the heart of every product and service.
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
            <span className="section-pill">Get in Touch</span>
            <h2 style={{
              fontWeight: 800, fontSize: 'clamp(24px, 3.5vw, 40px)',
              color: '#0284c7', lineHeight: 1.1, letterSpacing: '-0.02em',
            }}>
              We Are Here for You
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
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0284c7', marginBottom: 12 }}>Our Location</h3>
              <p style={{ fontSize: 14, color: '#647080', lineHeight: 1.7 }}>
                Nyarugenge Avenue<br />
                KN 78 St<br />
                Kigali, Rwanda
              </p>
              <p style={{ fontSize: 12.5, color: '#8fa0aa', marginTop: 12 }}>47+ branches nationwide</p>
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
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0284c7', marginBottom: 12 }}>Call or Write</h3>
              <p style={{ fontSize: 15, color: '#0ea5e9', fontWeight: 800, marginBottom: 6 }}>
                5500
              </p>
              <p style={{ fontSize: 14.5, color: '#0ea5e9', fontWeight: 700, marginBottom: 6 }}>
                +(250) 78 819 83 00
              </p>
              <p style={{ fontSize: 14.5, color: '#0ea5e9', fontWeight: 700, marginBottom: 14 }}>
                info@abr.rw
              </p>
              <p style={{ fontSize: 12.5, color: '#8fa0aa' }}>Mon – Fri: 8:00 – 17:00 · Sat: 9:00 – 13:00</p>
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
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 12 }}>Bank Digitally</h3>
              <p style={{ fontSize: 26, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 6 }}>
                *540#
              </p>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: 18 }}>
                Dial to access eKash on any phone, any network — anytime, anywhere in Rwanda.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  flex: 1, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8, padding: '8px 12px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>MTN MoMo</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>*182*4#</div>
                </div>
                <div style={{
                  flex: 1, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 8, padding: '8px 12px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>WhatsApp</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>78 819 83 00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div data-reveal style={{ marginTop: 40, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <form onSubmit={handleSubmit} style={{ flex: 1, background: '#ffffff', border: '1px solid rgba(14,165,233,0.06)', borderRadius: 12, padding: 22 }} aria-label="Contact form">
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <label style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#647080', marginBottom: 6 }}>Name</div>
                  <input name="name" value={formState.name} onChange={handleChange} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e6eef8' }} />
                </label>
                <label style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#647080', marginBottom: 6 }}>Email</div>
                  <input name="email" type="email" value={formState.email} onChange={handleChange} required style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #e6eef8' }} />
                </label>
              </div>
              <label style={{ display: 'block', marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: '#647080', marginBottom: 6 }}>Message</div>
                <textarea name="message" value={formState.message} onChange={handleChange} rows={5} required style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #e6eef8' }} />
              </label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button type="submit" style={{ background: '#0ea5e9', color: '#fff', padding: '10px 18px', borderRadius: 10, border: 'none', fontWeight: 800 }}>Send Message</button>
                {submitted && <div role="status" aria-live="polite" style={{ color: '#2b7a3a', fontWeight: 700 }}>Message sent — thank you.</div>}
              </div>
            </form>

            {/* right column intentionally left for other content or images */}
            <div style={{ width: 320 }} />
          </div>

          {/* Branch list */}
          <div data-reveal style={{ marginTop: 48 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0284c7', marginBottom: 20 }}>Key Branches</h3>
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

      {/* Footer */}
      <footer style={{ background: '#0284c7', padding: '48px 48px 28px' }}>
        <div style={{ margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, marginBottom: 40 }}>

            {/* Brand */}
            <div>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 320, marginTop: 0 }}>
                The Bank Which Cares For You. Providing accessible, responsible financial services to micro, small and medium entrepreneurs across Rwanda since 2014.
              </p>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 800, marginTop: 12 }}>
                Dial 5500
              </p>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                {[
                  { label: 'Facebook', href: 'https://facebook.com/', d: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                  { label: 'LinkedIn', href: 'https://linkedin.com/', d: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.14)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.background = 'rgba(255,255,255,0.2)'
                      el.style.color = '#ffffff'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.background = 'rgba(255,255,255,0.1)'
                      el.style.color = 'rgba(255,255,255,0.65)'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.d}/></svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
                Quick Links
              </h4>
              {['Who We Are', 'What We Offer', 'Media & News', 'Our Branches', 'Careers'].map(label => (
                <a key={label} href="#" style={{
                  display: 'block', fontSize: 13.5, color: 'rgba(255,255,255,0.55)',
                  textDecoration: 'none', padding: '6px 0', transition: 'color 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)' }}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Regulators */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
                Regulated By
              </h4>
              {[
                { href: 'https://www.bnr.rw/', lines: ['National Bank of Rwanda (BNR)', 'Licence No. BNR/D&LIC/000020'] },
                { href: 'https://www.fic.gov.rw/', lines: ['Rwanda Financial Intelligence Unit', '(RFICA Member)'] },
              ].map(({ href, lines }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block', fontSize: 13.5, color: 'rgba(255,255,255,0.55)',
                    lineHeight: 1.7, textDecoration: 'none', marginBottom: 16,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.55)' }}
                >
                  {lines[0]}<br />{lines[1]}
                </a>
              ))}
              <div style={{ marginTop: 16, display: 'inline-block', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 8, padding: '8px 14px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Member</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>AccessGroup · SMART Campaign</div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom" style={{
            paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.35)' }}>
              © {new Date().getFullYear()} AB Bank Rwanda Ltd. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Cookie Settings'].map(t => (
                <span key={t} style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'color 0.2s' }}
                  onClick={t === 'Cookie Settings' ? () => window.dispatchEvent(new Event(OPEN_EVENT)) : undefined}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
      {/* Floating accessibility FAB + panel */}
      <div className="a11y-fab" aria-hidden={false}>
        <button aria-label="Toggle accessibility menu" onClick={() => setA11yOpen(s => !s)} className="a11y-fab-button">
          <PersonStanding size={26} />
        </button>
        {a11yOpen && (
          <>
            <div className="a11y-backdrop" onClick={() => setA11yOpen(false)} />
            <div role="dialog" aria-modal="true" aria-label="Accessibility menu" className="a11y-panel" onClick={(e) => e.stopPropagation()}>
              <div className="a11y-panel-header">
                <div className="a11y-panel-header-title">
                  <div className="a11y-panel-header-icon"><PersonStanding size={16} /></div>
                  <span className="a11y-panel-header-text">Accessibility</span>
                </div>
                <button type="button" onClick={() => setA11yOpen(false)} aria-label="Close" className="a11y-panel-close">
                  <X size={16} />
                </button>
              </div>

              <div className="a11y-panel-section">
                <div className="a11y-panel-section-title">Content</div>
                {[
                  { key: 'largeText' as const, label: 'Bigger Text', Icon: Type },
                  { key: 'lineHeight' as const, label: 'Line Height', Icon: AlignJustify },
                  { key: 'letterSpacing' as const, label: 'Letter Spacing', Icon: TextCursor },
                  { key: 'hideImages' as const, label: 'Hide Images', Icon: ImageOff },
                ].map(({ key, label, Icon }) => (
                  <label key={key} className="a11y-toggle-row" data-active={String(a11yState[key])}>
                    <div className="a11y-toggle-info">
                      <div className="a11y-toggle-icon"><Icon size={16} /></div>
                      <span className="a11y-toggle-label">{label}</span>
                    </div>
                    <div className="a11y-switch">
                      <input type="checkbox" checked={a11yState[key]} onChange={() => toggleA11yOption(key)} />
                      <div className="a11y-switch-track" />
                      <div className="a11y-switch-thumb" />
                    </div>
                  </label>
                ))}
              </div>

              <div className="a11y-panel-section">
                <div className="a11y-panel-section-title">Colors</div>
                {[
                  { key: 'highContrast' as const, label: 'High Contrast', Icon: Contrast },
                  { key: 'grayscale' as const, label: 'Grayscale', Icon: Accessibility },
                  { key: 'readingMask' as const, label: 'Reading Mask', Icon: Eye },
                ].map(({ key, label, Icon }) => (
                  <label key={key} className="a11y-toggle-row" data-active={String(a11yState[key])}>
                    <div className="a11y-toggle-info">
                      <div className="a11y-toggle-icon"><Icon size={16} /></div>
                      <span className="a11y-toggle-label">{label}</span>
                    </div>
                    <div className="a11y-switch">
                      <input type="checkbox" checked={a11yState[key]} onChange={() => toggleA11yOption(key)} />
                      <div className="a11y-switch-track" />
                      <div className="a11y-switch-thumb" />
                    </div>
                  </label>
                ))}
              </div>

              <div className="a11y-panel-section">
                <div className="a11y-panel-section-title">Navigation & Motor</div>
                {[
                  { key: 'highlightLinks' as const, label: 'Highlight Links', Icon: Link },
                  { key: 'bigCursor' as const, label: 'Big Cursor', Icon: MousePointer2 },
                  { key: 'highlightFocus' as const, label: 'Focus Outlines', Icon: Focus },
                  { key: 'pauseAnimations' as const, label: 'Pause Animations', Icon: PauseCircle },
                ].map(({ key, label, Icon }) => (
                  <label key={key} className="a11y-toggle-row" data-active={String(a11yState[key])}>
                    <div className="a11y-toggle-info">
                      <div className="a11y-toggle-icon"><Icon size={16} /></div>
                      <span className="a11y-toggle-label">{label}</span>
                    </div>
                    <div className="a11y-switch">
                      <input type="checkbox" checked={a11yState[key]} onChange={() => toggleA11yOption(key)} />
                      <div className="a11y-switch-track" />
                      <div className="a11y-switch-thumb" />
                    </div>
                  </label>
                ))}
              </div>

              <div className="a11y-panel-section">
                <div className="a11y-panel-section-title">Reading</div>
                <label className="a11y-toggle-row" data-active={String(a11yState.dyslexiaFriendly)}>
                  <div className="a11y-toggle-info">
                    <div className="a11y-toggle-icon"><BookOpen size={16} /></div>
                    <span className="a11y-toggle-label">Dyslexia Friendly</span>
                  </div>
                  <div className="a11y-switch">
                    <input type="checkbox" checked={a11yState.dyslexiaFriendly} onChange={() => toggleA11yOption('dyslexiaFriendly')} />
                    <div className="a11y-switch-track" />
                    <div className="a11y-switch-thumb" />
                  </div>
                </label>
              </div>

              <div className="a11y-panel-section">
                <div className="a11y-panel-section-title">Quick Presets</div>
                <div className="a11y-profiles">
                  {[
                    { id: 'vision' as const, label: 'Vision', Icon: Eye },
                    { id: 'navigation' as const, label: 'Navigation', Icon: Compass },
                    { id: 'focus' as const, label: 'Focus', Icon: Target },
                  ].map(({ id, label, Icon }) => (
                    <button key={id} type="button" className="a11y-profile-btn" onClick={() => applyProfile(id)}>
                      <div className="a11y-profile-icon"><Icon size={14} /></div>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="a11y-panel-footer">
                <button type="button" className="a11y-panel-reset" onClick={() => {
                  const resetState = {
                    highContrast: false,
                    largeText: false,
                    hideImages: false,
                    lineHeight: false,
                    letterSpacing: false,
                    readingMask: false,
                    grayscale: false,
                    highlightLinks: false,
                    bigCursor: false,
                    pauseAnimations: false,
                    dyslexiaFriendly: false,
                    highlightFocus: false,
                  }
                  setA11yState(resetState)
                  applyA11yClasses(resetState)
                  localStorage.setItem('a11y-state', JSON.stringify(resetState))
                }}>Reset All</button>
                <span className="a11y-panel-status">12 options</span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
