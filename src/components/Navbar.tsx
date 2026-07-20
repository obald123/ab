import { useState, useEffect } from 'react'
import logo from '../imports/logo1-transparent.png'

const links = [
  { label: 'Who We Are', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Branches', href: '#contact' },
  { label: 'Media', href: '#news' },
  { label: 'Careers', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

function ABLogo() {
  return (
    <a href="#" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
      <img src={logo} alt="AB Bank Rwanda" style={{ height: 50, width: 'auto' }} />
    </a>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    h()
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <header style={{
      position: 'fixed', top: 36, left: 0, right: 0, zIndex: 200,
      background: 'rgba(255,255,255,0.98)',
      boxShadow: scrolled
        ? '0 1px 0 rgba(14,165,233,0.12), 0 4px 24px rgba(0,0,0,0.07)'
        : '0 1px 0 rgba(14,165,233,0.08)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      transition: 'box-shadow 0.3s',
    }}>
      <div style={{ margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>

          <ABLogo />

          {/* Desktop nav */}
          <nav className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {links.map(l => (
              <a key={l.label} href={l.href} style={{
                fontSize: 13.5, fontWeight: 600, color: '#647080',
                textDecoration: 'none', padding: '7px 13px', borderRadius: 6,
                transition: 'color 0.2s, background 0.2s', letterSpacing: '0.01em',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.color = '#0ea5e9'
                  el.style.background = 'rgba(14,165,233,0.06)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.color = '#647080'
                  el.style.background = 'transparent'
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="nav-desktop-cta" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 14px', borderRadius: 100,
              border: '1.5px solid rgba(14,165,233,0.2)',
              background: 'rgba(14,165,233,0.04)',
            }}>
              <span style={{
                display: 'block', width: 6, height: 6, borderRadius: '50%',
                background: '#0ea5e9', animation: 'blink 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.05em' }}>*540#</span>
            </div>
            <a href="#products" style={{
              fontSize: 13.5, fontWeight: 700,
              background: '#0ea5e9',
              color: '#ffffff', padding: '10px 22px', borderRadius: 8, textDecoration: 'none',
              transition: 'background 0.2s, transform 0.2s',
              letterSpacing: '0.01em',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = '#0284c7'
                el.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = '#0ea5e9'
                el.style.transform = 'none'
              }}
            >
              Open Account
            </a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="nav-hamburger"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 22, height: 2.5, borderRadius: 2, marginBottom: i < 2 ? 5 : 0,
                background: '#0ea5e9',
                transform: open
                  ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                  : i === 1 ? 'scaleX(0)'
                  : 'rotate(-45deg) translate(5px, -5px)'
                  : 'none',
                transition: 'transform 0.3s',
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="nav-mobile-menu" style={{
          background: '#fff', borderTop: '1px solid rgba(14,165,233,0.08)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        }}>
          <div style={{ padding: '12px 32px 24px' }}>
            {links.map(l => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} style={{
                display: 'flex', alignItems: 'center', padding: '14px 0', fontSize: 15, fontWeight: 600, color: '#647080',
                textDecoration: 'none', borderBottom: '1px solid #f0f4f8',
                minHeight: 48,
              }}>
                {l.label}
              </a>
            ))}
            <a href="#products" style={{
              display: 'block', marginTop: 16, padding: '15px 0', textAlign: 'center',
              background: '#0ea5e9', color: '#fff', borderRadius: 8,
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
            }}>
              Open Account
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
