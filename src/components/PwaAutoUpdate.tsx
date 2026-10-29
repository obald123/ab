import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'

/* Applies a new site version automatically — no prompt. Mounted once by
   PageShell; renders nothing.

   A new service worker is installed in the background as soon as one is
   deployed, but swapping it in reloads the page. Doing that the instant it
   arrives would wipe whatever the visitor is in the middle of (a half-written
   incident report, a loan calculation), so the reload waits for a natural
   break: the next route change, or the tab going into the background. Either
   way the visitor is already leaving what they were looking at, and the new
   version simply loads in its place.

   `registerType: 'prompt'` in vite.config.ts is what makes the waiting
   possible: nothing activates until `updateServiceWorker` is called here.

   The service worker is deliberately NOT gated behind cookie consent: it
   stores no personal data and is core functionality, not tracking — the same
   reasoning applied to language selection in lib/i18n.tsx. */

/** How often a tab left open checks the server for a new deploy. */
const UPDATE_CHECK_MS = 60 * 60 * 1000

export default function PwaAutoUpdate() {
  const location = useLocation()
  /** The page the visitor was on when the update arrived. */
  const pathWhenReady = useRef<string | null>(null)

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return
      // Without this, a tab kept open for days never learns about a deploy.
      window.setInterval(() => {
        if (navigator.onLine) void registration.update()
      }, UPDATE_CHECK_MS)
    },
  })

  // Background tab: nobody is looking, so swap now.
  useEffect(() => {
    if (!needRefresh) return
    const applyIfHidden = () => {
      if (document.visibilityState === 'hidden') void updateServiceWorker(true)
    }
    applyIfHidden()
    document.addEventListener('visibilitychange', applyIfHidden)
    return () => document.removeEventListener('visibilitychange', applyIfHidden)
  }, [needRefresh, updateServiceWorker])

  // Route change: the visitor has moved on, so load the new version there.
  useEffect(() => {
    if (!needRefresh) return
    if (pathWhenReady.current === null) {
      pathWhenReady.current = location.pathname
      return
    }
    if (location.pathname !== pathWhenReady.current) void updateServiceWorker(true)
  }, [needRefresh, location.pathname, updateServiceWorker])

  return null
}
