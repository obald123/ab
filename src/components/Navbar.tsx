import { useState, useEffect } from 'react'

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
    <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
      {/* Globe mark */}
      <svg viewBox="0 0 64 64" width={50} height={50} style={{ flexShrink: 0, overflow: 'visible' }}>
        <defs>
          <radialGradient id="gSphereN" cx="33%" cy="28%" r="68%">
            <stop offset="0%"   stopColor="#cce8f8" />
            <stop offset="18%"  stopColor="#90c8e8" />
            <stop offset="42%"  stopColor="#3a90d0" />
            <stop offset="70%"  stopColor="#2879bf" />
            <stop offset="100%" stopColor="#002850" />
          </radialGradient>
          <radialGradient id="gSpecN" cx="30%" cy="26%" r="32%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.9)" />
            <stop offset="40%"  stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <clipPath id="cSphereN">
            <circle cx="32" cy="32" r="17.5" />
          </clipPath>
        </defs>
        {/* Blue arc — left + bottom */}
        <path d="M 16.5 10 C 5 16, 1 26, 3 36 C 5 45, 11 52, 20 56"
          stroke="#2879bf" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <path d="M 17.5 55 L 20 56 L 19 52.5"
          stroke="#2879bf" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Grey arc — right + top */}
        <path d="M 47.5 54 C 59 48, 63 38, 61 28 C 59 19, 53 12, 44 8"
          stroke="#6a7880" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M 46.5 9 L 44 8 L 45 11.5"
          stroke="#6a7880" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* Sphere */}
        <circle cx="32" cy="32" r="17.5" fill="url(#gSphereN)" />
        <g clipPath="url(#cSphereN)" fill="none" strokeWidth="0.65">
          <ellipse cx="32" cy="28.5" rx="17"   ry="1.9"  stroke="rgba(255,255,255,0.28)" />
          <ellipse cx="32" cy="25"   rx="14.5" ry="1.6"  stroke="rgba(255,255,255,0.22)" />
          <ellipse cx="32" cy="22"   rx="11"   ry="1.3"  stroke="rgba(255,255,255,0.18)" />
          <ellipse cx="32" cy="19.5" rx="7"    ry="1.0"  stroke="rgba(255,255,255,0.14)" />
          <ellipse cx="32" cy="35.5" rx="17"   ry="1.9"  stroke="rgba(255,255,255,0.28)" />
          <ellipse cx="32" cy="39"   rx="14.5" ry="1.6"  stroke="rgba(255,255,255,0.22)" />
          <ellipse cx="32" cy="42"   rx="11"   ry="1.3"  stroke="rgba(255,255,255,0.18)" />
          <ellipse cx="32" cy="44.5" rx="7"    ry="1.0"  stroke="rgba(255,255,255,0.14)" />
        </g>
        <ellipse cx="32" cy="32" rx="17.5" ry="2.1" clipPath="url(#cSphereN)"
          fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.9" />
        <circle cx="32" cy="32" r="17.5" fill="none"
          stroke="rgba(40,121,191,0.2)" strokeWidth="0.8" />
        <circle cx="32" cy="32" r="17.5" fill="url(#gSpecN)" />
      </svg>

      {/* Wordmark — SERIF typeface as per brand guide */}
      <div style={{ lineHeight: 1, userSelect: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 26, fontWeight: 700,
            color: '#2879bf',
            letterSpacing: '-0.01em', lineHeight: 1,
          }}>AB</span>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 26, fontWeight: 400,
            color: '#647080',
            letterSpacing: '0.005em', lineHeight: 1,
          }}>Rwanda</span>
        </div>
        <div style={{
          fontSize: 7.5, letterSpacing: '0.2em',
          color: '#8a9296',
          textTransform: 'uppercase', marginTop: 5,
          fontFamily: 'var(--font-sans)', fontWeight: 700,
        }}>Access Group · Rwanda</div>
      </div>
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
        ? '0 1px 0 rgba(40,121,191,0.12), 0 4px 24px rgba(0,0,0,0.07)'
        : '0 1px 0 rgba(40,121,191,0.08)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      transition: 'box-shadow 0.3s',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>

          <ABLogo />

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {links.map(l => (
              <a key={l.label} href={l.href} style={{
                fontSize: 13.5, fontWeight: 600, color: '#647080',
                textDecoration: 'none', padding: '7px 13px', borderRadius: 6,
                transition: 'color 0.2s, background 0.2s', letterSpacing: '0.01em',
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.color = '#2879bf'
                  el.style.background = 'rgba(40,121,191,0.06)'
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
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 14px', borderRadius: 100,
              border: '1.5px solid rgba(40,121,191,0.2)',
              background: 'rgba(40,121,191,0.04)',
            }}>
              <span style={{
                display: 'block', width: 6, height: 6, borderRadius: '50%',
                background: '#2879bf', animation: 'blink 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: '#2879bf', letterSpacing: '0.05em' }}>*540#</span>
            </div>
            <a href="#products" style={{
              fontSize: 13.5, fontWeight: 700,
              background: '#2879bf',
              color: '#ffffff', padding: '10px 22px', borderRadius: 8, textDecoration: 'none',
              transition: 'background 0.2s, transform 0.2s',
              letterSpacing: '0.01em',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = '#003d70'
                el.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = '#2879bf'
                el.style.transform = 'none'
              }}
            >
              Open Account
            </a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 22, height: 2.5, borderRadius: 2, marginBottom: i < 2 ? 5 : 0,
                background: '#2879bf',
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
        <div style={{
          background: '#fff', borderTop: '1px solid rgba(40,121,191,0.08)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        }}>
          <div style={{ padding: '12px 32px 24px' }}>
            {links.map(l => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} style={{
                display: 'block', padding: '11px 0', fontSize: 14, fontWeight: 600, color: '#647080',
                textDecoration: 'none', borderBottom: '1px solid #f0f4f8',
              }}>
                {l.label}
              </a>
            ))}
            <a href="#products" style={{
              display: 'block', marginTop: 16, padding: '13px 0', textAlign: 'center',
              background: '#2879bf', color: '#fff', borderRadius: 8,
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
            }}>
              Open Account
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
