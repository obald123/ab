/* ══════════════════════════════════════════════
   Cookie consent — shared storage/state, kept out of the CookieConsent
   *component* so any module (i18n, accessibility state, third-party embeds)
   can gate a write behind the visitor's choice without importing a React
   component (and without a components → lib → components import cycle).
══════════════════════════════════════════════ */

const STORAGE_KEY = 'abr-cookie-consent'
/* Bump when the cookie categories change — invalidates older stored consent. */
const CONSENT_VERSION = 1

export type CookiePrefs = {
  necessary: true
  functional: boolean
  analytics: boolean
}

type StoredConsent = CookiePrefs & { version: number; decidedAt: string }

export const ALL_ON: CookiePrefs = { necessary: true, functional: true, analytics: true }
export const ALL_OFF: CookiePrefs = { necessary: true, functional: false, analytics: false }

/** Dispatched with `{ detail: CookiePrefs }` every time the visitor's choice
 *  changes, so anything already on the page (a loaded embed, a locale
 *  switcher) can react immediately instead of waiting for a reload. */
export const CONSENT_EVENT = 'abr:cookie-consent'

/** Lets anything on the page reopen the popup, e.g. a "Cookie settings" link:
   window.dispatchEvent(new Event(OPEN_EVENT)) */
export const OPEN_EVENT = 'abr:open-cookie-settings'

export function getStoredConsent(): CookiePrefs | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredConsent
    if (parsed?.version !== CONSENT_VERSION) return null
    return { necessary: true, functional: !!parsed.functional, analytics: !!parsed.analytics }
  } catch {
    return null
  }
}

/** True only once the visitor has explicitly turned "Preferences" on —
 *  undecided and declined both read as false, so language/accessibility
 *  choices are not written to storage until the visitor has opted in. */
export function hasFunctionalConsent(): boolean {
  return getStoredConsent()?.functional === true
}

/** True only once the visitor has explicitly turned "Analytics" on — gates
 *  third-party embeds (the Facebook feed) that set their own cookies. */
export function hasAnalyticsConsent(): boolean {
  return getStoredConsent()?.analytics === true
}

/** Writes the choice and notifies the rest of the page. Declining a category
 *  is handled by the caller (CookieConsent clears the functional-only keys
 *  it knows about) — this function only owns the consent record itself. */
export function persistConsent(next: CookiePrefs): void {
  const payload: StoredConsent = { ...next, version: CONSENT_VERSION, decidedAt: new Date().toISOString() }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    /* storage blocked (private mode) — the choice just won't persist */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: next }))
}
