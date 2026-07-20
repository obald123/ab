import { useState, useRef, useCallback } from 'react'
import { IconBank, IconCreditCard, IconMobile, IconGlobe, IconBuilding, IconChart, IconBriefcase, IconHandshake, IconHome, IconCar, IconGraduate, IconBulb } from './Icons'

const tabs = ['Personal', 'Business', 'Loans'] as const
type Tab = (typeof tabs)[number]
type IconComp = React.FC<{ size?: number; color?: string; strokeWidth?: number }>

const services: Record<Tab, { title: string; description: string; Icon: IconComp; highlight?: string }[]> = {
  Personal: [
    { Icon: IconBank, title: 'Savings Account', description: 'Earn up to 7.5% per annum on your savings. Minimum balance of RWF 5,000 with no monthly fees.', highlight: '7.5% p.a.' },
    { Icon: IconCreditCard, title: 'Current Account', description: 'Manage your daily finances with unlimited transactions, a Visa debit card, and free internet banking.' },
    { Icon: IconMobile, title: 'Mobile Banking', description: 'ABBank Mobile lets you transfer money, pay bills, and check balances 24/7 from anywhere in Rwanda.' },
    { Icon: IconGlobe, title: 'Diaspora Banking', description: 'Send money home to Rwanda with competitive exchange rates and no hidden fees for Rwandans abroad.' },
  ],
  Business: [
    { Icon: IconBuilding, title: 'Business Current Account', description: 'Dedicated account for SMEs and corporates with bulk payment capabilities and cash management tools.' },
    { Icon: IconChart, title: 'Trade Finance', description: 'Letters of credit, bank guarantees, and import/export financing to support your cross-border trade.', highlight: 'From 8% p.a.' },
    { Icon: IconBriefcase, title: 'Corporate Treasury', description: 'Optimise liquidity with sweep accounts, term deposits, and FX solutions tailored to your business cycle.' },
    { Icon: IconHandshake, title: 'SME Banking', description: 'Specialised products for small and medium enterprises — from working capital to equipment financing.' },
  ],
  Loans: [
    { Icon: IconHome, title: 'Home Loan', description: 'Finance your dream home in Rwanda with terms up to 20 years and competitive rates starting at 15%.', highlight: 'From 15% p.a.' },
    { Icon: IconCar, title: 'Auto Loan', description: 'Drive away in your new vehicle with financing up to 90% of the car value and 5-year repayment terms.' },
    { Icon: IconGraduate, title: 'Education Loan', description: "Invest in your future or your children's education with flexible repayment aligned to academic calendars.", highlight: 'Grace period' },
    { Icon: IconBulb, title: 'Business Loan', description: 'Scale your business with working capital and term loans up to RWF 500M for qualifying enterprises.' },
  ],
}

function use3DTilt(strength = 10) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * strength}deg) rotateX(${y * -strength}deg) translateZ(10px) translateY(-6px)`
    el.style.boxShadow = `${-x * 12}px ${-y * 6}px 48px rgba(14,165,233,0.14), 0 20px 48px rgba(14,165,233,0.08)`
  }, [strength])
  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return
    el.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateZ(0) translateY(0)'
    el.style.boxShadow = '0 4px 24px rgba(14,165,233,0.07)'
  }, [])
  return { ref, onMove, onLeave }
}

function ServiceCard({ service }: { service: typeof services.Personal[0] }) {
  const { ref, onMove, onLeave } = use3DTilt(8)
  return (
    <div
      ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{
        background: '#ffffff',
        border: '1.5px solid rgba(14,165,233,0.08)',
        borderRadius: 20, padding: '28px 26px',
        cursor: 'default',
        transition: 'transform 0.14s ease-out, box-shadow 0.14s ease-out',
        boxShadow: '0 4px 24px rgba(14,165,233,0.07)',
        transformStyle: 'preserve-3d',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Top accent stripe */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
        borderRadius: '20px 20px 0 0',
      }} />
      {/* Subtle dot grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(14,165,233,0.035) 1px, transparent 1px)',
        backgroundSize: '28px 28px', pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative' }}>
        {/* Icon */}
        <div style={{
          width: 48, height: 48, borderRadius: 14, marginBottom: 18,
          background: 'linear-gradient(135deg, rgba(14,165,233,0.08) 0%, rgba(58,143,208,0.12) 100%)',
          border: '1px solid rgba(14,165,233,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'translateZ(12px)',
        }}>
          <service.Icon size={22} color="#0ea5e9" strokeWidth={1.75} />
        </div>

        {service.highlight && (
          <div style={{
            display: 'inline-block', fontSize: 10.5, fontWeight: 700,
            color: '#0ea5e9', background: 'rgba(14,165,233,0.08)',
            border: '1px solid rgba(14,165,233,0.14)',
            borderRadius: 100, padding: '2px 10px',
            letterSpacing: '0.04em', marginBottom: 10,
          }}>
            {service.highlight}
          </div>
        )}

        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 18, fontWeight: 700, color: '#0284c7',
          marginBottom: 12, lineHeight: 1.3, letterSpacing: '-0.01em',
          transform: 'translateZ(8px)',
        }}>
          {service.title}
        </h3>
        <p style={{ fontSize: 14, color: '#647080', lineHeight: 1.72, margin: 0 }}>
          {service.description}
        </p>

        <div style={{
          marginTop: 20, display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 13, fontWeight: 700, color: '#0ea5e9',
        }}>
          Learn more
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  const [activeTab, setActiveTab] = useState<Tab>('Personal')

  return (
    <section id="services" style={{
      background: '#ffffff', padding: '108px 0',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background decorative ring */}
      <div style={{
        position: 'absolute', top: -300, left: -200, width: 800, height: 800,
        borderRadius: '50%', pointerEvents: 'none',
        border: '1px solid rgba(14,165,233,0.04)',
        background: 'radial-gradient(circle, rgba(14,165,233,0.02) 0%, transparent 60%)',
      }} />

      <div style={{ margin: '0 auto', padding: '0 48px' }}>

        {/* Header */}
        <div className="services-header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 64, alignItems: 'flex-end' }}>
          <div>
            <span className="section-pill">Our Services</span>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 700, fontSize: 'clamp(28px, 4vw, 52px)',
              color: '#0284c7', lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: 18,
            }}>
              Financial Solutions<br />
              <span style={{
                backgroundImage: 'linear-gradient(100deg, #0ea5e9, #38bdf8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Built for Rwanda</span>
            </h2>
          </div>
          <p style={{ fontSize: 16, color: '#647080', lineHeight: 1.78, maxWidth: 400, marginLeft: 'auto' }}>
            Whether you are saving for the future, growing a business, or investing in property — AB Rwanda has the products and expertise to support every stage of your financial journey.
          </p>
        </div>

        {/* Tabs */}
        <div className="services-tabs" style={{ display: 'flex', borderBottom: '2px solid rgba(14,165,233,0.1)', marginBottom: 44, gap: 0 }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '13px 36px', fontSize: 14, fontWeight: 700,
                border: 'none', background: 'none', cursor: 'pointer',
                letterSpacing: '0.01em',
                borderBottom: activeTab === tab ? '3px solid #0ea5e9' : '3px solid transparent',
                marginBottom: -2,
                color: activeTab === tab ? '#0ea5e9' : '#8fa0aa',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                if (activeTab !== tab) (e.currentTarget as HTMLButtonElement).style.color = '#0ea5e9'
              }}
              onMouseLeave={e => {
                if (activeTab !== tab) (e.currentTarget as HTMLButtonElement).style.color = '#8fa0aa'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Service cards */}
        <div className="services-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>
          {services[activeTab].map(service => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>

        {/* Bottom CTA bar */}
        <div className="services-cta" style={{
          marginTop: 60, padding: '36px 48px',
          background: 'linear-gradient(135deg, #f0f7fd 0%, #e8f2fb 100%)',
          border: '1.5px solid rgba(14,165,233,0.1)',
          borderRadius: 20, display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', gap: 20,
        }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#0284c7', marginBottom: 6 }}>
              Not sure which product fits?
            </p>
            <p style={{ fontSize: 14, color: '#647080', margin: 0 }}>
              Our advisors at any of our 47+ branches will help you choose.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="#contact" style={{
              padding: '12px 28px', borderRadius: 10,
              background: '#0ea5e9', color: '#ffffff',
              fontWeight: 800, fontSize: 14, textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(14,165,233,0.3)',
              transition: 'transform 0.2s, background 0.2s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = '#0284c7'; el.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background = '#0ea5e9'; el.style.transform = 'none'
              }}
            >
              Talk to an Advisor
            </a>
            <a href="#products" style={{
              padding: '12px 28px', borderRadius: 10,
              border: '2px solid rgba(14,165,233,0.3)', color: '#0ea5e9',
              fontWeight: 700, fontSize: 14, textDecoration: 'none',
              background: 'transparent',
              transition: 'border-color 0.2s, background 0.2s',
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = '#0ea5e9'; el.style.background = 'rgba(14,165,233,0.05)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = 'rgba(14,165,233,0.3)'; el.style.background = 'transparent'
              }}
            >
              View All Products →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
