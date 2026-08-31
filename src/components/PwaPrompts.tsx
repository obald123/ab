import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useT } from '../lib/i18n'
import { isPreviewing } from '../lib/content'
import {
  dismissInstall,
  installPlatform,
  isInstallDismissed,
  isIos,
  isStandalone,
} from '../lib/pwa'
import { IconCheckCircle, IconDownload } from './Icons'

/* Two pieces of installed-app furniture, mounted once by PageShell and
   styled to match the cookie-consent dialog (same tokens, same pill buttons,
   same brand accent bar):

   1. "A new version is available" — a new service worker is waiting.
      `registerType: 'prompt'` (vite.config.ts) means nothing swaps in until
      the visitor asks; this is where they ask.
   2. "Install AB Bank" — walks the visitor through their browser's own
      "add to home screen" flow with numbered steps. It deliberately does
      NOT call the browser's install prompt: on Chromium that pops a second,
      unstyled OS dialog on top of this card, which is the thing being
      avoided here. `beforeinstallprompt` is still caught (and its default
      suppressed) purely as an "installable, not yet installed" signal.

   Neither is gated behind cookie consent (see lib/pwa.ts). Both sit below the
   cookie-consent modal's z-index so a first visit answers that first. */

const BLUE = '#0ea5e9'
const BLUE_DARK = '#0284c7'
const INK = '#0f172a'
const MUTED = '#647080'

const shell: CSSProperties = {
  pointerEvents: 'auto',
  width: 'min(370px, calc(100vw - 2rem))',
  background: '#ffffff',
  borderRadius: 18,
  border: '1px solid rgba(14,165,233,0.16)',
  boxShadow: '0 24px 60px rgba(2,30,60,0.28)',
  overflow: 'hidden',
}

const badge: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: 12,
  flexShrink: 0,
  background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DARK} 100%)`,
  boxShadow: '0 8px 20px rgba(14,165,233,0.3)',
}

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-serif)',
  fontSize: 16,
  fontWeight: 700,
  color: INK,
  margin: 0,
  letterSpacing: '-0.01em',
}

const bodyStyle: CSSProperties = {
  fontSize: 12.5,
  color: MUTED,
  lineHeight: 1.6,
  margin: '4px 0 0',
}

const btnPrimary: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  padding: '10px 18px',
  borderRadius: 999,
  border: 'none',
  fontSize: 13,
  fontWeight: 800,
  cursor: 'pointer',
  color: '#ffffff',
  background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DARK} 100%)`,
  boxShadow: '0 10px 24px rgba(14,165,233,0.32)',
}

const btnGhost: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 16px',
  borderRadius: 999,
  border: '1.5px solid rgba(100,116,139,0.22)',
  color: MUTED,
  background: '#ffffff',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
}

const MOTION = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 14, scale: 0.98 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
}

const AccentBar = () => (
  <div
    style={{
      height: 3,
      flexShrink: 0,
      background: `linear-gradient(90deg, ${BLUE} 0%, #38bdf8 50%, ${BLUE_DARK} 100%)`,
    }}
  />
)

const RefreshGlyph = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffffff"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
)

function Steps({ items }: { items: string[] }) {
  return (
    <ol
      style={{
        listStyle: 'none',
        margin: '12px 0 0',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
      }}
    >
      {items.map((step, i) => (
        <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span
            style={{
              flexShrink: 0,
              width: 20,
              height: 20,
              borderRadius: 999,
              marginTop: 1,
              background: 'rgba(14,165,233,0.12)',
              color: BLUE_DARK,
              fontSize: 11,
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {i + 1}
          </span>
          <span style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.5 }}>{step}</span>
        </li>
      ))}
    </ol>
  )
}

export default function PwaPrompts() {
  const t = useT()
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW()

  /* The offline-ready note needs no action — let it clear itself. */
  useEffect(() => {
    if (!offlineReady) return
    const id = window.setTimeout(() => setOfflineReady(false), 4500)
    return () => window.clearTimeout(id)
  }, [offlineReady, setOfflineReady])

  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    if (isStandalone() || isInstallDismissed() || isPreviewing()) return

    const reveal = () => setShowInstall(true)

    const onPrompt = (event: Event) => {
      // Suppress Chromium's mini-infobar; this card guides the install instead.
      event.preventDefault()
      reveal()
    }
    const onInstalled = () => {
      setShowInstall(false)
      dismissInstall()
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)

    // iOS Safari never fires beforeinstallprompt — offer the steps after a
    // short beat so the card doesn't land during first paint.
    let iosTimer: number | undefined
    if (isIos()) iosTimer = window.setTimeout(reveal, 2500)

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      if (iosTimer !== undefined) window.clearTimeout(iosTimer)
    }
  }, [])

  const closeInstall = () => {
    setShowInstall(false)
    dismissInstall()
  }

  const platform = installPlatform()
  const steps =
    platform === 'ios'
      ? [t.pwa.iosStep1, t.pwa.iosStep2]
      : platform === 'android'
        ? [t.pwa.androidStep1, t.pwa.androidStep2]
        : [t.pwa.desktopStep1, t.pwa.desktopStep2]

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[9000] flex flex-col items-center gap-3 p-4 pb-24 print:hidden sm:inset-x-auto sm:right-0 sm:items-end sm:pb-4">
      <AnimatePresence>
        {offlineReady && !needRefresh && (
          <motion.div
            key="offline"
            {...MOTION}
            role="status"
            style={{
              pointerEvents: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#ffffff',
              border: '1px solid rgba(14,165,233,0.16)',
              borderRadius: 999,
              padding: '9px 16px 9px 12px',
              boxShadow: '0 12px 30px rgba(2,30,60,0.18)',
              fontSize: 12.5,
              fontWeight: 700,
              color: INK,
            }}
          >
            <IconCheckCircle size={16} color={BLUE_DARK} strokeWidth={2} />
            {t.pwa.offlineReady}
          </motion.div>
        )}

        {needRefresh && (
          <motion.div key="update" {...MOTION} role="alert" style={shell}>
            <AccentBar />
            <div style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={badge}>
                  <RefreshGlyph />
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={titleStyle}>{t.pwa.updateTitle}</p>
                  <p style={bodyStyle}>{t.pwa.updateBody}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                <button
                  type="button"
                  style={btnPrimary}
                  onClick={() => void updateServiceWorker(true)}
                >
                  <RefreshGlyph />
                  {t.pwa.updateAction}
                </button>
                <button type="button" style={btnGhost} onClick={() => setNeedRefresh(false)}>
                  {t.pwa.dismiss}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showInstall && !needRefresh && (
          <motion.div key="install" {...MOTION} style={shell}>
            <AccentBar />
            <div style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={badge}>
                  <IconDownload size={18} color="#ffffff" strokeWidth={2} />
                </span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={titleStyle}>{t.pwa.installTitle}</p>
                  <p style={bodyStyle}>{t.pwa.installBody}</p>
                </div>
              </div>

              <Steps items={steps} />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 14 }}>
                <button type="button" style={btnPrimary} onClick={closeInstall}>
                  {t.pwa.installDone}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
