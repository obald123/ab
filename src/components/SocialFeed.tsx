import { useState, useRef, useEffect } from 'react'

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve) => {
    if (document.getElementById(id)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src; s.id = id; s.async = true; s.defer = true
    s.onload = () => resolve()
    document.body.appendChild(s)
  })
}

function FBFallback() {
  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth={1.5} style={{ marginBottom: 12 }}>
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
      <p style={{ fontSize: 13, color: '#647080', lineHeight: 1.6 }}>
        Follow us on Facebook for the latest updates, promotions and financial tips.
      </p>
      <a
        href="https://www.facebook.com/abbankrwanda"
        target="_blank" rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16,
          padding: '10px 24px', borderRadius: 10, textDecoration: 'none',
          background: '#0ea5e9', color: '#fff', fontSize: 13, fontWeight: 700,
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#0284c7' }}
        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#0ea5e9' }}
      >
        Visit Our Facebook Page
      </a>
    </div>
  )
}

export default function SocialFeed() {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  /* load social scripts when visible */
  useEffect(() => {
    if (!visible) return
    /* Facebook SDK */
    loadScript('https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0&appId=0', 'fb-sdk')
  }, [visible])

  return (
    <section ref={ref} style={{ padding: '96px 48px', background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(14,165,233,0.025) 1px, transparent 1px)',
        backgroundSize: '32px 32px', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        {/* header */}
        <div style={{
          textAlign: 'center', marginBottom: 56,
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}>
          <span style={{
            display: 'inline-block', background: 'rgba(186,230,253,0.12)', border: '1.5px solid rgba(186,230,253,0.25)',
            color: '#0284c7', borderRadius: 100, padding: '5px 18px', fontSize: 11.5, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18,
          }}>
            Stay Connected
          </span>
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(26px, 3.5vw, 44px)', color: '#0284c7', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            Follow Us on <span style={{ color: '#0ea5e9' }}>Social Media</span>
          </h2>
          <p style={{ fontSize: 15, color: '#647080', maxWidth: 520, margin: '14px auto 0', lineHeight: 1.65 }}>
            Stay up to date with our latest news, financial tips and community stories.
          </p>
        </div>

        {/* feed grid */}
        <div className="social-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Facebook feed */}
          <div style={{
            background: '#f8fbfe', borderRadius: 24, overflow: 'hidden',
            border: '1px solid rgba(14,165,233,0.08)',
            boxShadow: '0 4px 24px rgba(14,165,233,0.05)',
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s',
          }}>
            <div style={{ padding: '20px 24px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(14,165,233,0.06)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#0284c7' }}>AB Rwanda</span>
              <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 'auto' }}>Facebook</span>
            </div>
            <div style={{ minHeight: 480, position: 'relative' }}>
              <div
                className="fb-page"
                data-href="https://www.facebook.com/abbankrwanda"
                data-tabs="timeline"
                data-width="500"
                data-height="520"
                data-small-header="true"
                data-adapt-container-width="true"
                data-hide-cover="false"
                data-show-facepile="true"
                style={{ minHeight: 480 }}
              />
              <noscript>
                <FBFallback />
              </noscript>
            </div>
          </div>

          {/* LinkedIn */}
          <div style={{
            background: '#f8fbfe', borderRadius: 24, overflow: 'hidden',
            border: '1px solid rgba(14,165,233,0.08)',
            boxShadow: '0 4px 24px rgba(14,165,233,0.05)',
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '20px 24px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(14,165,233,0.06)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0a66c2">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#0284c7' }}>AB Rwanda PLC</span>
              <span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 'auto' }}>LinkedIn</span>
            </div>
            {/* LinkedIn CTA content */}
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '40px 32px', textAlign: 'center',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 18,
                background: 'linear-gradient(135deg, #0a66c2, #0077b5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20, boxShadow: '0 8px 24px rgba(10,102,194,0.2)',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0284c7', marginBottom: 8 }}>
                Connect with us on LinkedIn
              </h3>
              <p style={{ fontSize: 13.5, color: '#647080', lineHeight: 1.65, maxWidth: 280, marginBottom: 24 }}>
                Follow our professional updates, career opportunities and industry insights for Rwanda's financial sector.
              </p>
              <a
                href="https://rw.linkedin.com/company/ab-bank-rwanda-limited"
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '12px 28px', borderRadius: 12, textDecoration: 'none',
                  background: 'linear-gradient(135deg, #0a66c2, #0077b5)', color: '#fff',
                  fontSize: 14, fontWeight: 700,
                  boxShadow: '0 6px 20px rgba(10,102,194,0.25)',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.boxShadow = '0 8px 28px rgba(10,102,194,0.35)'; el.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.boxShadow = '0 6px 20px rgba(10,102,194,0.25)'; el.style.transform = 'none' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                Follow on LinkedIn
              </a>
              <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 14 }}>1,300+ followers</span>
            </div>
          </div>
        </div>

        {/* direct links bar */}
        <div style={{
          marginTop: 40, textAlign: 'center',
          opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s',
        }}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Facebook', href: 'https://www.facebook.com/abbankrwanda', color: '#1877f2', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
              { label: 'LinkedIn', href: 'https://rw.linkedin.com/company/ab-bank-rwanda-limited', color: '#0a66c2', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 22px', borderRadius: 12,
                background: '#ffffff', border: `1.5px solid ${s.color}22`,
                color: s.color, textDecoration: 'none', fontSize: 13, fontWeight: 700,
                boxShadow: '0 2px 8px rgba(14,165,233,0.06)',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.boxShadow = `0 4px 16px ${s.color}22`; el.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.boxShadow = '0 2px 8px rgba(14,165,233,0.06)'; el.style.transform = 'none' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d={s.icon}/></svg>
                Follow on {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .social-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
