import { Link } from 'react-router-dom'
import { OPEN_EVENT } from './CookieConsent'
import logo from '../imports/logo1-transparent.png'

/* The site's single footer.

   This is the design that previously lived inside Contact.tsx and only
   ever appeared on the home page. It is now the shared footer rendered by
   PageShell on every route, so the old Tailwind-token footer (which never
   rendered — its `bank-*` colours were undefined) is gone and there is
   exactly one footer again.

   `to` is a route; `hash` is a section of the home one-pager. */
type QuickLink = { label: string; to?: string; hash?: string }

const QUICK_LINKS: QuickLink[] = [
  { label: 'Who We Are', to: '/who-we-are' },
  { label: 'What We Offer', hash: '/#products' },
  { label: 'News & Notices', to: '/media/news' },
  { label: 'Articles & Insights', to: '/media/articles' },
  { label: 'Our Branches', hash: '/#branches' },
  { label: 'Tenders', to: '/tenders' },
  { label: 'Forms & Downloads', to: '/forms' },
  { label: 'Careers', to: '/careers' },
]

const SOCIALS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/ABBankRwanda',
    d: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  },
  {
    label: 'LinkedIn',
    href: 'https://rw.linkedin.com/company/ab-bank-rwanda-limited',
    d: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z',
  },
]

const REGULATORS = [
  { href: 'https://www.bnr.rw/', lines: ['National Bank of Rwanda (BNR)', 'Licence No. BNR/D&LIC/000020'] },
  { href: 'https://www.fic.gov.rw/', lines: ['Rwanda Financial Intelligence Unit', '(RFICA Member)'] },
]

const linkStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13.5,
  color: 'rgba(255,255,255,0.55)',
  textDecoration: 'none',
  padding: '6px 0',
  transition: 'color 0.2s',
}

function lighten(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.color = '#ffffff'
}
function dim(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
}

export default function Footer() {
  return (
    <footer className="edge-curve-t" style={{ background: '#0284c7', padding: '104px 48px 28px' }}>
      <div style={{ margin: '0 auto' }}>
        <div
          className="footer-grid"
          style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, marginBottom: 40 }}
        >
          {/* Brand */}
          <div>
            {/* The logo keeps its real colours here — same globe, same navy
                wordmark as the navbar. Those colours have no contrast against
                the #0284c7 footer on their own, so the mark sits on a white
                plate instead of being reversed to flat white, which was
                flattening the globe into a silhouette. */}
            <Link
              to="/"
              aria-label="AB Bank Rwanda — home"
              style={{
                display: 'inline-block',
                marginBottom: 22,
                background: '#ffffff',
                borderRadius: 12,
                padding: '12px 20px',
                boxShadow: '0 6px 18px rgba(2,30,60,0.16)',
              }}
            >
              <img
                src={logo}
                alt="AB Bank Rwanda"
                width={1352}
                height={402}
                style={{ height: 44, width: 'auto', display: 'block' }}
              />
            </Link>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 320, marginTop: 0 }}>
              The Bank Which Cares For You. Providing accessible, responsible financial services to micro, small and
              medium entrepreneurs across Rwanda since 2014.
            </p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 800, marginTop: 12 }}>Dial 5500</p>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.65)',
                    textDecoration: 'none',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.color = '#ffffff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={s.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 20,
              }}
            >
              Quick Links
            </h4>
            {QUICK_LINKS.map((l) =>
              l.to ? (
                <Link key={l.label} to={l.to} style={linkStyle} onMouseEnter={lighten} onMouseLeave={dim}>
                  {l.label}
                </Link>
              ) : (
                <a key={l.label} href={l.hash} style={linkStyle} onMouseEnter={lighten} onMouseLeave={dim}>
                  {l.label}
                </a>
              ),
            )}
          </div>

          {/* Regulators */}
          <div>
            <h4
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 20,
              }}
            >
              Regulated By
            </h4>
            {REGULATORS.map(({ href, lines }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...linkStyle, lineHeight: 1.7, marginBottom: 16, padding: 0 }}
                onMouseEnter={lighten}
                onMouseLeave={dim}
              >
                {lines[0]}
                <br />
                {lines[1]}
              </a>
            ))}
            <div
              style={{
                marginTop: 16,
                display: 'inline-block',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 8,
                padding: '8px 14px',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                Member
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.75)' }}>
                AccessGroup · SMART Campaign
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="footer-bottom"
          style={{
            paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            © {new Date().getFullYear()} AB Bank Rwanda Ltd. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {/* These were plain <span>s with a click handler — now real links
                to the published documents, and a real button for the one that
                opens the cookie dialog. */}
            {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map((t) => (
              <Link
                key={t}
                to="/forms"
                style={{
                  fontSize: 12,
                  color: 'rgba(255,255,255,0.3)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.3)'
                }}
              >
                {t}
              </Link>
            ))}
            <button
              onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.3)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.3)'
              }}
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
