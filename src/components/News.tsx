import { useEffect, useRef } from 'react'

const articles = [
  {
    category: 'Bancassurance',
    tag: 'New Product',
    date: 'July 2026',
    title: 'NGOBOKA Life Insurance Now Available at All AB Rwanda Branches',
    excerpt: 'In partnership with Sanlam Vie, AB Rwanda launches NGOBOKA — an accessible life insurance scheme offering individual coverage from RWF 400/month and family protection for spouse and up to four children from RWF 900/month.',
    image: 'https://images.unsplash.com/photo-1678225894217-ec0de2dc0548?w=800&h=500&fit=crop&auto=format',
    featured: true,
  },
  {
    category: 'Digital',
    tag: 'Milestone',
    date: 'June 2023',
    title: 'E-kash Expands Across All Mobile Networks in Rwanda',
    excerpt: 'Our digital payment platform E-kash — accessible via *540# — now covers all major MNOs and partner banks, bringing seamless mobile banking to every Rwandan.',
    image: 'https://images.unsplash.com/photo-1708772565599-2c4e4b3ed9db?w=600&h=400&fit=crop&auto=format',
    featured: false,
  },
  {
    category: 'Expansion',
    tag: 'Partnership',
    date: 'July 2020',
    title: 'AB IBAKWE Mobile Service Launches with MTN Rwanda',
    excerpt: 'Customers can now transfer between their MTN MoMo wallet and AB Rwanda account in both directions using *182*4# — no branch visit required.',
    image: 'https://images.unsplash.com/photo-1585540083814-ea6ee8af9e4f?w=600&h=400&fit=crop&auto=format',
    featured: false,
  },
]

export default function News() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current; if (!el) return
    const items = el.querySelectorAll<HTMLElement>('[data-reveal]')
    items.forEach(item => {
      item.style.opacity = '0'
      item.style.transform = 'translateY(28px)'
    })
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        items.forEach((item, i) => {
          setTimeout(() => {
            item.style.transition = `opacity 0.65s ease ${i * 100}ms, transform 0.65s ease ${i * 100}ms`
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
    <section id="news" style={{ background: '#f8fbfe', padding: '100px 0' }}>
      <div style={{ margin: '0 auto', padding: '0 48px' }} ref={containerRef}>

        {/* Header */}
        <div data-reveal className="news-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 52 }}>
          <div>
            <span className="section-pill">Media & News</span>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700, fontSize: 'clamp(26px, 3.5vw, 44px)',
              color: '#0284c7', lineHeight: 1.1, letterSpacing: '-0.01em',
            }}>
              Latest from AB Rwanda
            </h2>
          </div>
          <a href="#news" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 14, fontWeight: 700, color: '#0ea5e9', textDecoration: 'none',
            padding: '10px 20px', border: '2px solid #0ea5e9', borderRadius: 10,
            transition: 'background 0.2s, color 0.2s',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = '#0ea5e9'
              el.style.color = '#ffffff'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'transparent'
              el.style.color = '#0ea5e9'
            }}
          >
            View all news
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        {/* Featured article */}
        <div data-reveal style={{ marginBottom: 24 }}>
          <div className="news-featured" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
            background: '#ffffff', border: '1px solid rgba(14,165,233,0.12)',
            borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(14,165,233,0.08)',
            transition: 'box-shadow 0.3s, border-color 0.3s',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.boxShadow = '0 20px 60px rgba(14,165,233,0.16)'
              el.style.borderColor = 'rgba(14,165,233,0.3)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.boxShadow = '0 8px 40px rgba(14,165,233,0.08)'
              el.style.borderColor = 'rgba(14,165,233,0.12)'
            }}
          >
            <div className="news-featured-image" style={{ position: 'relative', minHeight: 300, background: '#e6f2fa', overflow: 'hidden' }}>
              <img
                src={articles[0].image}
                alt={articles[0].title}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = 'scale(1.05)' }}
                onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = 'scale(1)' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 40%, rgba(0,61,112,0.5) 100%)',
              }} />
              {/* Blue category banner */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                background: '#0ea5e9', padding: '10px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#ffffff', letterSpacing: '0.1em' }}>
                  {articles[0].category.toUpperCase()}
                </span>
                <span style={{
                  background: '#ffffff', color: '#0ea5e9',
                  fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 4, letterSpacing: '0.06em',
                }}>
                  {articles[0].tag.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="news-featured-content" style={{ padding: '44px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 18 }}>
                <div style={{ width: 40, height: 3, background: '#0ea5e9', borderRadius: 2 }} />
                <span style={{ fontSize: 12, color: '#8fa0aa', fontWeight: 600 }}>{articles[0].date}</span>
              </div>
              <h3 style={{
                fontWeight: 800, fontSize: 22, color: '#0284c7',
                lineHeight: 1.35, marginBottom: 16, letterSpacing: '-0.01em',
              }}>
                {articles[0].title}
              </h3>
              <p style={{ fontSize: 14.5, color: '#647080', lineHeight: 1.7, marginBottom: 28 }}>
                {articles[0].excerpt}
              </p>
              <a href="#news" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: 13.5, fontWeight: 700, color: '#0ea5e9', textDecoration: 'none',
                transition: 'gap 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '12px' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '8px' }}
              >
                Read full story
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Sub articles */}
        <div className="news-sub-articles" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {articles.slice(1).map(article => (
            <div key={article.title} data-reveal style={{
              background: '#ffffff', border: '1px solid rgba(14,165,233,0.1)',
              borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
              transition: 'box-shadow 0.25s, border-color 0.25s, transform 0.25s',
              boxShadow: '0 4px 20px rgba(14,165,233,0.06)',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = '0 16px 48px rgba(14,165,233,0.14)'
                el.style.borderColor = 'rgba(14,165,233,0.3)'
                el.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = '0 4px 20px rgba(14,165,233,0.06)'
                el.style.borderColor = 'rgba(14,165,233,0.1)'
                el.style.transform = 'none'
              }}
            >
              {/* Blue top bar */}
              <div style={{ background: '#0ea5e9', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#ffffff', letterSpacing: '0.1em' }}>
                  {article.category.toUpperCase()}
                </span>
                <span style={{ background: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 700, color: '#fff', padding: '2px 8px', borderRadius: 4 }}>
                  {article.tag}
                </span>
              </div>

              <div style={{ height: 190, position: 'relative', background: '#e6f2fa', overflow: 'hidden' }}>
                <img
                  src={article.image}
                  alt={article.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, transparent 50%, rgba(0,61,112,0.35) 100%)',
                }} />
              </div>

              <div style={{ padding: '24px 26px 28px' }}>
                <p style={{ fontSize: 11, color: '#8fa0aa', fontWeight: 700, marginBottom: 10, letterSpacing: '0.06em' }}>
                  {article.date}
                </p>
                <h3 style={{
                  fontWeight: 800, fontSize: 17, color: '#0284c7',
                  lineHeight: 1.35, marginBottom: 12, letterSpacing: '-0.01em',
                }}>
                  {article.title}
                </h3>
                <p style={{ fontSize: 13.5, color: '#647080', lineHeight: 1.65, margin: '0 0 18px' }}>
                  {article.excerpt.slice(0, 120)}…
                </p>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0ea5e9' }}>
                  Read more →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
