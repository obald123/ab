import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../../lib/i18n'

type IconComp = (p: { size?: number; color?: string; strokeWidth?: number }) => ReactNode

/* Masthead shared by every standalone page. Clears the 112px of fixed
   chrome (36px ticker + 76px navbar) the same way the hero does. */
export default function PageHero({
  Icon,
  eyebrow,
  title,
  lead,
  meta,
}: {
  Icon: IconComp
  eyebrow: string
  title: string
  lead: string
  meta?: ReactNode
}) {
  const t = useT()
  return (
    <header
      style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #0c4a6e 0%, #0c4a6e 28%, #0284c7 62%, #0ea5e9 95%)',
        padding: '152px 48px 72px',
        overflow: 'hidden',
      }}
      className="page-hero edge-curve-b"
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            'linear-gradient(rgba(186,230,253,1) 1px, transparent 1px), linear-gradient(90deg, rgba(186,230,253,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', maxWidth: 1180, margin: '0 auto' }}>
        <nav aria-label={t.page.breadcrumb} style={{ marginBottom: 18 }}>
          <Link
            to="/"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(186,230,253,0.7)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
            }}
          >
            {t.page.home}
          </Link>
          <span style={{ color: 'rgba(186,230,253,0.4)', margin: '0 8px', fontSize: 12 }}>/</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#bae6fd', letterSpacing: '0.04em' }}>{eyebrow}</span>
        </nav>

        <span
          className="section-pill section-pill--icon"
          style={{
            background: 'rgba(186,230,253,0.1)',
            border: '1.5px solid rgba(186,230,253,0.22)',
            color: '#bae6fd',
          }}
        >
          <Icon size={14} strokeWidth={2} color="#bae6fd" />
          {eyebrow}
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: 'clamp(30px, 5vw, 58px)',
            color: '#ffffff',
            lineHeight: 1.06,
            letterSpacing: '-0.03em',
            margin: '16px 0 16px',
            maxWidth: 760,
          }}
        >
          {title}
        </h1>

        <p style={{ fontSize: 16.5, color: 'rgba(224,242,254,0.78)', lineHeight: 1.75, maxWidth: 620, margin: 0 }}>
          {lead}
        </p>

        {meta && <div style={{ marginTop: 28 }}>{meta}</div>}
      </div>
    </header>
  )
}
