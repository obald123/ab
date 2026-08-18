import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSingleton } from '../lib/content'
import logo from '../imports/logo1-transparent.png'
import LanguageSwitcher from './LanguageSwitcher'
import { useT } from '../lib/i18n'

/* `hash` links scroll to a section of the home one-pager; `to` links are
   real routes. Anything with `children` renders as a dropdown. */
type NavItem =
  | { label: string; hash: string }
  | { label: string; to: string }
  | { label: string; children: { label: string; to: string; desc: string }[] }

/** What the CMS stores: a flat href, plus optional dropdown children. */
interface CmsNavLink {
  id: string
  label: string
  href: string
  children: { id: string; label: string; href: string; desc: string }[]
}

interface NavDocument {
  links: CmsNavLink[]
  cta: { ekashLabel: string; ekashCode: string; ctaLabel: string; ctaLink: string }
}

/* One href field has to cover both kinds of destination, because that is what
   an editor can reasonably be asked to type. A leading "#" — or a "/#" for a
   section reached from another route — means a section of the home one-pager
   and is scrolled to; anything else is a real route. */
function toNavItem(link: CmsNavLink): NavItem {
  if (link.children.length > 0) {
    return {
      label: link.label,
      children: link.children.map((child) => ({
        label: child.label,
        to: child.href,
        desc: child.desc,
      })),
    }
  }

  const hashIndex = link.href.indexOf('#')
  if (hashIndex !== -1) return { label: link.label, hash: link.href.slice(hashIndex) }
  return { label: link.label, to: link.href }
}

/** Shown only until the CMS responds, and if it never does. */
const FALLBACK_NAV: NavItem[] = [
  { label: 'Who We Are', to: '/who-we-are' },
  { label: 'Products', hash: '#products' },
  { label: 'Branches', hash: '#branches' },
  {
    label: 'Media',
    children: [
      { label: 'News & Notices', to: '/media/news', desc: 'Press releases and public notices' },
      { label: 'Articles & Insights', to: '/media/articles', desc: 'Financial guidance from our teams' },
      { label: 'Tenders', to: '/tenders', desc: 'Open procurement opportunities' },
      { label: 'Forms & Downloads', to: '/forms', desc: 'Account forms, tariffs and statements' },
    ],
  },
  {
    label: 'Careers',
    children: [
      { label: 'Open Positions', to: '/careers', desc: 'Roles across the network' },
      { label: 'Our People & Awards', to: '/awards', desc: 'Employee of the month & year' },
    ],
  },
  { label: 'Contact', hash: '#contact' },
]

function ABLogo() {
  return (
    <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
      <img src={logo} alt="AB Bank Rwanda" style={{ height: 50, width: 'auto' }} />
    </Link>
  )
}

const linkBase: React.CSSProperties = {
  fontSize: 13.5,
  fontWeight: 600,
  color: '#647080',
  textDecoration: 'none',
  padding: '7px 13px',
  borderRadius: 6,
  transition: 'color 0.2s, background 0.2s',
  letterSpacing: '0.01em',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
}

function hoverIn(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.color = '#0ea5e9'
  e.currentTarget.style.background = 'rgba(14,165,233,0.06)'
}
function hoverOut(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.color = '#647080'
  e.currentTarget.style.background = 'transparent'
}

export default function Navbar() {
  const t = useT()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState<string | null>(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)

  const { data: navDoc } = useSingleton<NavDocument | null>('nav', null)
  /* A saved document with no links is an editorial choice and shows as empty;
     no document at all means the CMS has never been written to, so the
     built-in menu stands in rather than leaving the site unnavigable. */
  const NAV = useMemo(
    () => (navDoc ? navDoc.links.map(toNavItem) : FALLBACK_NAV),
    [navDoc],
  )

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h, { passive: true })
    h()
    return () => window.removeEventListener('scroll', h)
  }, [])

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    if (!menu) return
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenu(null)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [menu])

  /* Menus close from the handlers that navigate, not from an effect on
     `pathname` — resetting state in an effect costs an extra render pass. */
  const closeMenus = () => {
    setMenu(null)
    setOpen(false)
  }

  /* Section anchors only exist on the home page. From any other route,
     go home first and let the browser resolve the hash after paint. */
  function goToSection(hash: string) {
    if (pathname === '/') {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/' + hash)
      requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }))
    }
    setOpen(false)
  }

  return (
    <header
      style={{
        position: 'fixed',
        // 36px clears the ticker; the offset is non-zero only in staging preview.
        top: 'calc(var(--abr-preview-offset, 0px) + 36px)',
        left: 0,
        right: 0,
        zIndex: 200,
        background: 'rgba(255,255,255,0.98)',
        boxShadow: scrolled
          ? '0 1px 0 rgba(14,165,233,0.12), 0 4px 24px rgba(0,0,0,0.07)'
          : '0 1px 0 rgba(14,165,233,0.08)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        transition: 'box-shadow 0.3s',
      }}
    >
      <div style={{ margin: '0 auto', padding: '0 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 76 }}>
          <ABLogo />

          {/* Desktop nav */}
          <nav className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 0 }} ref={menuRef}>
            {NAV.map((item) => {
              if ('children' in item) {
                const isOpen = menu === item.label
                return (
                  <div key={item.label} style={{ position: 'relative' }}>
                    <button
                      onClick={() => setMenu(isOpen ? null : item.label)}
                      aria-expanded={isOpen}
                      aria-haspopup="true"
                      style={{ ...linkBase, display: 'inline-flex', alignItems: 'center', gap: 5 }}
                      onMouseEnter={hoverIn}
                      onMouseLeave={hoverOut}
                    >
                      {item.label}
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path
                          d="M2.5 4.5 6 8l3.5-3.5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transformOrigin: '50% 50%', transition: 'transform 0.2s' }}
                        />
                      </svg>
                    </button>
                    {isOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 10px)',
                          left: 0,
                          minWidth: 290,
                          background: '#fff',
                          border: '1px solid rgba(14,165,233,0.14)',
                          borderRadius: 14,
                          boxShadow: '0 18px 44px rgba(2,30,60,0.16)',
                          padding: 8,
                          animation: 'fadeUp 0.18s ease-out',
                        }}
                      >
                        {item.children.map((c) => (
                          <Link
                            key={c.to}
                            to={c.to}
                            onClick={closeMenus}
                            style={{
                              display: 'block',
                              padding: '10px 12px',
                              borderRadius: 9,
                              textDecoration: 'none',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(14,165,233,0.06)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent'
                            }}
                          >
                            <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0284c7', marginBottom: 2 }}>{c.label}</div>
                            <div style={{ fontSize: 11.5, color: '#94a3b8', lineHeight: 1.5 }}>{c.desc}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              if ('to' in item) {
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    onClick={closeMenus}
                    style={{ ...linkBase, color: pathname === item.to ? '#0ea5e9' : '#647080' }}
                    onMouseEnter={hoverIn}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = pathname === item.to ? '#0ea5e9' : '#647080'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {item.label}
                  </Link>
                )
              }

              return (
                <button
                  key={item.label}
                  onClick={() => goToSection(item.hash)}
                  style={linkBase}
                  onMouseEnter={hoverIn}
                  onMouseLeave={hoverOut}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="nav-lang-desktop" style={{ marginLeft: 14 }}>
            <LanguageSwitcher />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="nav-hamburger"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 2.5,
                  borderRadius: 2,
                  marginBottom: i < 2 ? 5 : 0,
                  background: '#0ea5e9',
                  transform: open
                    ? i === 0
                      ? 'rotate(45deg) translate(5px, 5px)'
                      : i === 1
                        ? 'scaleX(0)'
                        : 'rotate(-45deg) translate(5px, -5px)'
                    : 'none',
                  transition: 'transform 0.3s',
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="nav-mobile-menu"
          style={{ background: '#fff', borderTop: '1px solid rgba(14,165,233,0.08)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
        >
          <div style={{ padding: '12px 32px 24px', maxHeight: '70vh', overflowY: 'auto' }}>
            {NAV.map((item) => {
              const rowStyle: React.CSSProperties = {
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                padding: '14px 0',
                fontSize: 15,
                fontWeight: 600,
                color: '#647080',
                textDecoration: 'none',
                borderBottom: '1px solid #f0f4f8',
                minHeight: 48,
                background: 'none',
                border: 'none',
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: '#f0f4f8',
                textAlign: 'left',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }

              if ('children' in item) {
                return (
                  <div key={item.label}>
                    <div
                      style={{
                        padding: '16px 0 8px',
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: '#94a3b8',
                      }}
                    >
                      {item.label}
                    </div>
                    {item.children.map((c) => (
                      <Link key={c.to} to={c.to} onClick={closeMenus} style={{ ...rowStyle, paddingLeft: 12, color: '#0284c7', fontWeight: 700 }}>
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )
              }
              if ('to' in item) {
                return (
                  <Link key={item.label} to={item.to} onClick={closeMenus} style={rowStyle}>
                    {item.label}
                  </Link>
                )
              }
              return (
                <button key={item.label} onClick={() => goToSection(item.hash)} style={rowStyle}>
                  {item.label}
                </button>
              )
            })}
            <LanguageSwitcher compact />
          </div>
        </div>
      )}
    </header>
  )
}
