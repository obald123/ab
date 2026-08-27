/* Progressive Web App helpers.
 *
 * The service worker itself is configured in vite.config.ts (`abrPwa`). This
 * module is only the small amount of browser-feature detection the install
 * prompt needs, kept out of the component so it can be unit-tested directly.
 *
 * None of this is gated behind cookie consent: an installable, offline-capable
 * site stores no personal data and is core functionality, not tracking — the
 * same reasoning already applied to language selection in lib/i18n.tsx. */

/** The non-standard event Chromium fires when the app meets the install
 *  criteria. Not in lib.dom yet, so it is typed here. */
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
  prompt: () => Promise<void>
}

/** iOS Safari never fires `beforeinstallprompt`; it needs a manual
 *  "Share → Add to Home Screen" hint instead. iPadOS 13+ reports as a Mac,
 *  so touch support is the tie-breaker. */
export function isIos(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  if (/iphone|ipad|ipod/i.test(ua)) return true
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
}

/** True when the site is already running as an installed app — in which case
 *  no install affordance should show. */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const displayModeStandalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false
  const iosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  return displayModeStandalone || iosStandalone
}

/** Key for "the visitor closed the install banner". A UI preference, not
 *  tracking — see the note at the top of this file. Storage access throws
 *  rather than returning null when a browser has blocked it (private mode,
 *  embedded webviews), so both helpers below swallow that. */
const INSTALL_DISMISSED_KEY = 'abr.pwa.install-dismissed'

export function isInstallDismissed(): boolean {
  try {
    return window.localStorage.getItem(INSTALL_DISMISSED_KEY) === '1'
  } catch {
    return false
  }
}

export function dismissInstall(): void {
  try {
    window.localStorage.setItem(INSTALL_DISMISSED_KEY, '1')
  } catch {
    /* Ignored — the banner simply reappears on the next visit. */
  }
}
