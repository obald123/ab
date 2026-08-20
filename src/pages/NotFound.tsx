import { Link } from 'react-router-dom'
import PageHero from '../components/page/PageHero'
import { Section } from '../components/page/ui'
import { IconArrowRight, IconSearch } from '../components/Icons'
import { useT } from '../lib/i18n'

/* An unknown route used to silently redirect to "/" — indistinguishable from
   a broken link that happened to work, and useless for actually finding what
   the visitor was after. This renders in place instead, at whatever URL was
   requested, so the address bar and the page agree with each other. */
export default function NotFound() {
  const t = useT()

  return (
    <>
      <PageHero Icon={IconSearch} eyebrow={t.notFound.eyebrow} title={t.notFound.title} lead={t.notFound.lead} />
      <Section>
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div
            aria-hidden="true"
            style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 900,
              fontSize: 'clamp(64px, 12vw, 140px)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              backgroundImage: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 60%, #bae6fd 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 20,
            }}
          >
            404
          </div>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              color: '#ffffff',
              padding: '15px 30px',
              borderRadius: 999,
              fontWeight: 800,
              fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 12px 30px rgba(14,165,233,0.28)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.transform = 'translateY(-3px)'
              el.style.boxShadow = '0 16px 38px rgba(14,165,233,0.36)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.transform = ''
              el.style.boxShadow = '0 12px 30px rgba(14,165,233,0.28)'
            }}
          >
            {t.notFound.cta}
            <IconArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>
      </Section>
    </>
  )
}
