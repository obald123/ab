import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useT } from '../lib/i18n'
import { isPreviewing } from '../lib/content'
import {
  type BeforeInstallPromptEvent,
  dismissInstall,
  isInstallDismissed,
  isIos,
  isStandalone,
} from '../lib/pwa'
import { IconDownload } from './Icons'

/* Two small, dismissible prompts for the installed-app experience, mounted
   once by PageShell:

   1. "A new version is available" — shown when a new service worker is
      waiting. `registerType: 'prompt'` (vite.config.ts) means a new build is
      never swapped in mid-session; the visitor asks for it here.
   2. "Install AB Bank" — shown when the browser reports the site is
      installable (`beforeinstallprompt`), or, on iOS Safari where that event
      never fires, a static "Share → Add to Home Screen" hint.

   Neither is gated behind cookie consent (see lib/pwa.ts). Both sit below the
   cookie-consent modal's z-index so a first-time visitor answers that first. */

const CARD =
  'pointer-events-auto flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2 rounded-2xl border border-[rgba(14,165,233,0.18)] bg-white p-4 shadow-[0_20px_50px_rgba(2,30,60,0.24)]'
const PRIMARY_BTN =
  'inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] px-4 py-2 text-[13px] font-extrabold text-white shadow-[0_10px_24px_rgba(14,165,233,0.32)] transition-transform hover:-translate-y-0.5'
const GHOST_BTN =
  'inline-flex items-center justify-center rounded-full border border-[rgba(100,116,139,0.24)] px-4 py-2 text-[13px] font-bold text-[#647080] transition-colors hover:bg-[#f8fafc]'

const MOTION = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.98 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
}

type InstallState = 'hidden' | 'prompt' | 'ios'

export default function PwaPrompts() {
  const t = useT()
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW()

  /* The "ready to work offline" note is a one-off confirmation, not something
     that needs an action — let it clear itself. */
  useEffect(() => {
    if (!offlineReady) return
    const id = window.setTimeout(() => setOfflineReady(false), 4500)
    return () => window.clearTimeout(id)
  }, [offlineReady, setOfflineReady])

  const [install, setInstall] = useState<InstallState>('hidden')
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (isStandalone() || isInstallDismissed() || isPreviewing()) return

    const onPrompt = (event: Event) => {
      // Keep Chromium's own mini-infobar from showing; this card replaces it.
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
      setInstall('prompt')
    }
    const onInstalled = () => {
      setInstall('hidden')
      setDeferred(null)
      dismissInstall()
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)

    // iOS Safari: no beforeinstallprompt, so offer the manual hint after a
    // short beat so it doesn't land during first paint.
    let iosTimer: number | undefined
    if (isIos()) iosTimer = window.setTimeout(() => setInstall('ios'), 2500)

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      if (iosTimer !== undefined) window.clearTimeout(iosTimer)
    }
  }, [])

  const runInstall = async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setInstall('hidden')
  }

  const closeInstall = () => {
    setInstall('hidden')
    dismissInstall()
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[9000] flex flex-col items-center gap-3 p-4 print:hidden sm:items-end">
      <AnimatePresence>
        {offlineReady && !needRefresh && (
          <motion.div
            key="offline"
            {...MOTION}
            role="status"
            className="pointer-events-auto rounded-full bg-[#0b3a5c] px-4 py-2 text-[12.5px] font-semibold text-white shadow-lg"
          >
            {t.pwa.offlineReady}
          </motion.div>
        )}

        {needRefresh && (
          <motion.div key="update" {...MOTION} role="alert" className={CARD}>
            <p className="text-[14px] font-extrabold text-[#0f172a]">{t.pwa.updateTitle}</p>
            <p className="text-[13px] leading-relaxed text-[#647080]">{t.pwa.updateBody}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void updateServiceWorker(true)}
                className={PRIMARY_BTN}
              >
                {t.pwa.updateAction}
              </button>
              <button type="button" onClick={() => setNeedRefresh(false)} className={GHOST_BTN}>
                {t.pwa.dismiss}
              </button>
            </div>
          </motion.div>
        )}

        {install !== 'hidden' && !needRefresh && (
          <motion.div key="install" {...MOTION} className={CARD}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[rgba(14,165,233,0.12)]">
                <IconDownload size={18} color="#0284c7" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-extrabold text-[#0f172a]">{t.pwa.installTitle}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-[#647080]">
                  {install === 'ios' ? t.pwa.iosInstallBody : t.pwa.installBody}
                </p>
              </div>
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {install === 'prompt' && (
                <button type="button" onClick={() => void runInstall()} className={PRIMARY_BTN}>
                  {t.pwa.installAction}
                </button>
              )}
              <button type="button" onClick={closeInstall} className={GHOST_BTN}>
                {t.pwa.dismiss}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
