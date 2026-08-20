import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IconShield, IconZap, IconChart, IconCheck } from './Icons'
import { useT } from '../lib/i18n'
import {
  ALL_OFF,
  ALL_ON,
  getStoredConsent,
  OPEN_EVENT,
  persistConsent,
  type CookiePrefs,
} from '../lib/cookieConsent'
import type { Dictionary } from '../locales/en'

/* ══════════════════════════════════════════════
   Cookie consent — GDPR-style popup.
   Choice is persisted in localStorage (see lib/cookieConsent); the popup
   only appears when no valid choice is stored.
══════════════════════════════════════════════ */

export type { CookiePrefs } from '../lib/cookieConsent'
export { getStoredConsent, OPEN_EVENT } from '../lib/cookieConsent'

/* Built from the dictionary rather than declared as a constant, so the three
   categories change language with everything else. */
function categoriesFor(t: Dictionary) {
  return [
    {
      key: 'necessary' as const,
      Icon: IconShield,
      title: t.cookies.necessaryTitle,
      locked: true,
      desc: t.cookies.necessaryBody,
    },
    {
      key: 'functional' as const,
      Icon: IconZap,
      title: t.cookies.preferencesTitle,
      locked: false,
      desc: t.cookies.preferencesBody,
    },
    {
      key: 'analytics' as const,
      Icon: IconChart,
      title: t.cookies.analyticsTitle,
      locked: false,
      desc: t.cookies.analyticsBody,
    },
  ]
}

const BLUE = '#0ea5e9'
const BLUE_DARK = '#0284c7'
const INK = '#0f172a'
const MUTED = '#647080'

function Toggle({ on, disabled, onChange, label }: {
  on: boolean
  disabled?: boolean
  onChange: (next: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!on)}
      style={{
        width: 42, height: 24, flexShrink: 0, padding: 3,
        borderRadius: 999, border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: on ? `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DARK} 100%)` : '#cbd5e1',
        opacity: disabled ? 0.55 : 1,
        transition: 'background 0.2s',
        display: 'flex', alignItems: 'center',
      }}
    >
      <span style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        boxShadow: '0 1px 3px rgba(2,30,60,0.3)',
        transform: `translateX(${on ? 18 : 0}px)`,
        transition: 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
      }} />
    </button>
  )
}

export default function CookieConsent() {
  const t = useT()
  const categories = categoriesFor(t)
  const [open, setOpen] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [prefs, setPrefs] = useState<CookiePrefs>(ALL_OFF)
  const dialogRef = useRef<HTMLDivElement>(null)

  /* Show only when there's no stored decision — after a short beat so it
     doesn't fight the hero animation on first paint. */
  useEffect(() => {
    const stored = getStoredConsent()
    if (stored) {
      setPrefs(stored)
      return
    }
    const t = setTimeout(() => setOpen(true), 700)
    return () => clearTimeout(t)
  }, [])

  /* Allow re-opening later from a "Cookie settings" link anywhere on the page */
  useEffect(() => {
    const reopen = () => {
      setPrefs(getStoredConsent() ?? ALL_OFF)
      setCustomizing(true)
      setOpen(true)
    }
    window.addEventListener(OPEN_EVENT, reopen)
    return () => window.removeEventListener(OPEN_EVENT, reopen)
  }, [])

  const persist = (next: CookiePrefs) => {
    persistConsent(next)
    if (!next.functional) {
      /* Declining "Preferences" must actually take back what it promises to
         control, not just stop writing to it going forward — otherwise a
         choice made here (e.g. after previously accepting) has no visible
         effect until the visitor happens to clear their browser storage
         themselves. Language is deliberately not cleared here any more: an
         explicit language pick is honoured regardless of this consent (see
         lib/i18n.tsx) — a visitor who picks Kinyarwanda should not have it
         silently revert on the next visit just because they also declined
         "Preferences". `a11y-state` is owned by Contact.tsx, which stops
         writing to it on its own once `hasFunctionalConsent()` is false —
         not imported by key here to avoid pulling that page's whole module
         into this globally-mounted component's bundle. */
      try {
        localStorage.removeItem('a11y-state')
      } catch {
        /* storage blocked — nothing to clear */
      }
    }
    setPrefs(next)
    setOpen(false)
    setCustomizing(false)
  }

  /* Focus the dialog on open and keep Tab inside it while it's up */
  useEffect(() => {
    if (!open) return
    const node = dialogRef.current
    if (!node) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const focusables = () => Array.from(
      node.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'),
    )
    focusables()[0]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [open, customizing])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — deliberately not click-to-dismiss: consent needs a choice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 10050,
              background: 'rgba(2, 15, 36, 0.42)',
              backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
            }}
          />

          {/* Centring is done by this flex wrapper, not by a transform on the
              dialog: framer-motion writes its own `transform` from y/scale and
              was overwriting `translate(-50%, -50%)`, which left the panel
              hanging off the centre point instead of centred on it. */}
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 10051,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 16, pointerEvents: 'none',
            }}
          >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-body"
            className="cookie-dialog"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              pointerEvents: 'auto',
              width: 'min(560px, 100%)',
              display: 'flex', flexDirection: 'column',
              background: '#ffffff',
              borderRadius: 20,
              border: '1px solid rgba(14,165,233,0.16)',
              boxShadow: '0 30px 80px rgba(2,30,60,0.32)',
              overflow: 'hidden',
            }}
          >
            {/* Brand accent bar */}
            <div style={{ height: 4, background: `linear-gradient(90deg, ${BLUE} 0%, #38bdf8 50%, ${BLUE_DARK} 100%)`, flexShrink: 0 }} />

            {/* Everything between the accent bar and the action row scrolls.
                `flex: 1 1 auto` + `minHeight: 0` is what actually bounds it —
                without minHeight a flex child refuses to shrink below its
                content and the action row gets pushed out of the dialog. */}
            <div
              className="cookie-scroll"
              style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain' }}
            >
            <div style={{ padding: '24px 26px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                  background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DARK} 100%)`,
                  boxShadow: '0 8px 20px rgba(14,165,233,0.32)',
                }}>
                  <IconShield size={22} color="#fff" strokeWidth={2} />
                </span>
                <h2 id="cookie-consent-title" style={{
                  fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700,
                  color: INK, margin: 0, letterSpacing: '-0.01em',
                }}>
                  {t.cookies.title}
                </h2>
              </div>

              <p id="cookie-consent-body" style={{ fontSize: 14, color: MUTED, lineHeight: 1.68, margin: 0 }}>
                We use cookies to enhance your browsing experience, and analyze our traffic.
                {t.cookies.intro}{' '}
                <Link
                  to="/forms"
                  onClick={() => setOpen(false)}
                  style={{ color: BLUE_DARK, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}
                >
                  {t.cookies.policy}
                </Link>
              </p>
            </div>

            {/* Category preferences */}
            <AnimatePresence initial={false}>
              {customizing && (
                <motion.div
                  key="prefs"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '20px 26px 4px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {categories.map(({ key, Icon, title, locked, desc }) => {
                      const on = key === 'necessary' ? true : prefs[key]
                      return (
                        <div key={key} style={{
                          display: 'flex', alignItems: 'flex-start', gap: 12,
                          padding: '13px 15px', borderRadius: 14,
                          background: on ? 'rgba(14,165,233,0.05)' : '#f8fafc',
                          border: `1px solid ${on ? 'rgba(14,165,233,0.18)' : 'rgba(100,116,139,0.14)'}`,
                          transition: 'background 0.2s, border-color 0.2s',
                        }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 32, height: 32, borderRadius: 10, flexShrink: 0, marginTop: 1,
                            background: on ? 'rgba(14,165,233,0.14)' : 'rgba(100,116,139,0.1)',
                          }}>
                            <Icon size={17} color={on ? BLUE_DARK : '#94a3b8'} strokeWidth={2} />
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                              <span style={{ fontSize: 13.5, fontWeight: 800, color: INK }}>{title}</span>
                              {locked && (
                                <span style={{
                                  fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                                  color: BLUE_DARK, background: 'rgba(14,165,233,0.12)',
                                  padding: '2px 7px', borderRadius: 999,
                                }}>
                                  {t.cookies.alwaysOn}
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, margin: 0 }}>{desc}</p>
                          </div>
                          <Toggle
                            on={on}
                            disabled={locked}
                            label={`${title} cookies`}
                            onChange={next => setPrefs(p => ({ ...p, [key]: next }))}
                          />
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            </div>

            {/* Actions — always visible, never scrolled away */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 10,
              padding: '18px 26px 22px', flexShrink: 0,
              borderTop: '1px solid rgba(14,165,233,0.14)',
              background: '#ffffff',
            }}>
              {customizing ? (
                <button
                  type="button"
                  onClick={() => persist(prefs)}
                  style={{ ...btnPrimary, flex: '1 1 100%' }}
                  onMouseEnter={e => hover(e, true, 'primary')}
                  onMouseLeave={e => hover(e, false, 'primary')}
                >
                  <IconCheck size={16} color="#fff" strokeWidth={2.5} />
                  {t.cookies.savePreferences}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCustomizing(true)}
                  style={{ ...btnGhost, flex: '1 1 130px' }}
                  onMouseEnter={e => hover(e, true, 'ghost')}
                  onMouseLeave={e => hover(e, false, 'ghost')}
                >
                  {t.cookies.customize}
                </button>
              )}
              <button
                type="button"
                onClick={() => persist(ALL_OFF)}
                style={{ ...btnOutline, flex: '1 1 130px' }}
                onMouseEnter={e => hover(e, true, 'outline')}
                onMouseLeave={e => hover(e, false, 'outline')}
              >
                {t.cookies.rejectAll}
              </button>
              <button
                type="button"
                onClick={() => persist(ALL_ON)}
                style={{ ...btnPrimary, flex: '1 1 130px' }}
                onMouseEnter={e => hover(e, true, 'primary')}
                onMouseLeave={e => hover(e, false, 'primary')}
              >
                {t.cookies.acceptAll}
              </button>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── button styling ── */
const btnBase: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
  padding: '13px 20px', borderRadius: 999,
  fontSize: 14, fontWeight: 800, cursor: 'pointer',
  transition: 'transform 0.18s, box-shadow 0.18s, background 0.18s, border-color 0.18s, color 0.18s',
  whiteSpace: 'nowrap',
}

const btnPrimary: React.CSSProperties = {
  ...btnBase,
  border: 'none', color: '#ffffff',
  background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DARK} 100%)`,
  boxShadow: '0 10px 26px rgba(14,165,233,0.34)',
}

const btnOutline: React.CSSProperties = {
  ...btnBase,
  border: `1.5px solid rgba(14,165,233,0.34)`, color: BLUE_DARK,
  background: '#ffffff',
}

const btnGhost: React.CSSProperties = {
  ...btnBase,
  border: '1.5px solid rgba(100,116,139,0.22)', color: MUTED,
  background: '#ffffff', fontWeight: 700,
}

function hover(e: React.MouseEvent<HTMLButtonElement>, on: boolean, kind: 'primary' | 'outline' | 'ghost') {
  const el = e.currentTarget
  el.style.transform = on ? 'translateY(-2px)' : ''
  if (kind === 'primary') {
    el.style.boxShadow = on ? '0 14px 32px rgba(14,165,233,0.44)' : '0 10px 26px rgba(14,165,233,0.34)'
  } else if (kind === 'outline') {
    el.style.background = on ? 'rgba(14,165,233,0.07)' : '#ffffff'
    el.style.borderColor = on ? 'rgba(14,165,233,0.6)' : 'rgba(14,165,233,0.34)'
  } else {
    el.style.background = on ? '#f8fafc' : '#ffffff'
    el.style.borderColor = on ? 'rgba(100,116,139,0.4)' : 'rgba(100,116,139,0.22)'
    el.style.color = on ? INK : MUTED
  }
}
