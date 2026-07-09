import { useEffect, useRef } from 'react'
import logo from '../imports/logo1.png'

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

  return (
    <section id="contact" style={{ fontFamily: 'var(--font-sans)' }}>

      {/* SMART Campaign band */}
      <div style={{
        background: 'linear-gradient(135deg, #003d70 0%, #2879bf 50%, #3a8fd0 100%)',
        padding: '72px 28px',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }} ref={containerRef}>
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
                  textShadow: '0 2px 12px rgba(40,121,191,0.4)',
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
      <div style={{ background: '#ffffff', padding: '80px 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div data-reveal style={{ textAlign: 'center', marginBottom: 52 }}>
            <span className="section-pill">Get in Touch</span>
            <h2 style={{
              fontWeight: 800, fontSize: 'clamp(24px, 3.5vw, 40px)',
              color: '#003d70', lineHeight: 1.1, letterSpacing: '-0.02em',
            }}>
              We Are Here for You
            </h2>
          </div>

          <div className="contact-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>

            {/* Address */}
            <div data-reveal style={{
              background: '#f8fbfe', border: '1px solid rgba(40,121,191,0.1)',
              borderRadius: 18, padding: '36px 32px',
              transition: 'box-shadow 0.25s, border-color 0.25s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = '0 12px 40px rgba(40,121,191,0.1)'
                el.style.borderColor = 'rgba(40,121,191,0.25)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = 'none'
                el.style.borderColor = 'rgba(40,121,191,0.1)'
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'linear-gradient(135deg, #2879bf, #3a8fd0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#003d70', marginBottom: 12 }}>Our Location</h3>
              <p style={{ fontSize: 14, color: '#647080', lineHeight: 1.7 }}>
                Nyarugenge Avenue<br />
                KN 78 St<br />
                Kigali, Rwanda
              </p>
              <p style={{ fontSize: 12.5, color: '#8fa0aa', marginTop: 12 }}>47+ branches nationwide</p>
            </div>

            {/* Phone & Email */}
            <div data-reveal style={{
              background: '#f8fbfe', border: '1px solid rgba(40,121,191,0.1)',
              borderRadius: 18, padding: '36px 32px',
              transition: 'box-shadow 0.25s, border-color 0.25s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = '0 12px 40px rgba(40,121,191,0.1)'
                el.style.borderColor = 'rgba(40,121,191,0.25)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = 'none'
                el.style.borderColor = 'rgba(40,121,191,0.1)'
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'linear-gradient(135deg, #2879bf, #3a8fd0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#003d70', marginBottom: 12 }}>Call or Write</h3>
              <p style={{ fontSize: 14.5, color: '#2879bf', fontWeight: 700, marginBottom: 6 }}>
                +(250) 78 819 83 00
              </p>
              <p style={{ fontSize: 14.5, color: '#2879bf', fontWeight: 700, marginBottom: 14 }}>
                info@abr.rw
              </p>
              <p style={{ fontSize: 12.5, color: '#8fa0aa' }}>Mon – Fri: 8:00 – 17:00 · Sat: 9:00 – 13:00</p>
            </div>

            {/* Digital / eKash */}
            <div data-reveal style={{
              background: 'linear-gradient(135deg, #2879bf, #3a8fd0)',
              borderRadius: 18, padding: '36px 32px',
              transition: 'box-shadow 0.25s, transform 0.25s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = '0 16px 48px rgba(40,121,191,0.3)'
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

          {/* Branch list */}
          <div data-reveal style={{ marginTop: 48 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#003d70', marginBottom: 20 }}>Key Branches</h3>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {branches.map(b => (
                <div key={b.name} style={{
                  flex: '1 1 220px',
                  background: '#f8fbfe', border: '1px solid rgba(40,121,191,0.08)',
                  borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#2879bf',
                    flexShrink: 0, marginTop: 5,
                  }} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#003d70' }}>{b.name}</div>
                    <div style={{ fontSize: 12.5, color: '#8fa0aa', marginTop: 3 }}>{b.address}<br />{b.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#003d70', padding: '48px 28px 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, marginBottom: 40 }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 18 }}>
                <img src={logo} alt="AB Bank Rwanda" style={{ height: 46, width: 'auto' }} />
              </div>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 320 }}>
                The Bank Which Cares For You. Providing accessible, responsible financial services to micro, small and medium entrepreneurs across Rwanda since 2014.
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
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                National Bank of Rwanda (BNR)<br />
                Licence No. BNR/D&LIC/000020<br /><br />
                Rwanda Financial Intelligence Unit<br />
                (RFICA Member)
              </p>
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
              {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map(t => (
                <span key={t} style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'color 0.2s' }}
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
    </section>
  )
}
