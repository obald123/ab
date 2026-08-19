import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { en } from '../locales/en'
import { rw } from '../locales/rw'
import { fr } from '../locales/fr'
import type { Dictionary } from '../locales/en'

/* Which language the site is being read in (I18N_PLAN).
 *
 * This is the source of truth for two separate things, and it matters that
 * they stay in step:
 *
 *   1. Interface text the Frontend owns — labels, buttons, filters.
 *   2. The `?lang=` the content hooks send, which decides which translation
 *      the CMS resolves for every published document.
 *
 * The API falls back field by field, so a document nobody has translated yet
 * still renders — in English — under a Kinyarwanda interface, rather than
 * rendering blank.
 */

export const LOCALES = ['en', 'rw', 'fr'] as const

export type Locale = (typeof LOCALES)[number]

/** Endonyms: a language picker should name each language in that language. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  rw: 'Kinyarwanda',
  fr: 'Français',
}

/** Two-letter codes for the compact switcher in the navbar. */
export const LOCALE_SHORT: Record<Locale, string> = {
  en: 'EN',
  rw: 'RW',
  fr: 'FR',
}

const STORAGE_KEY = 'abr.lang'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

/* Storage access throws rather than returning null when a browser has blocked
   it — private modes, embedded webviews. Language is a convenience; it must
   never be able to take the site down. */
function storedLocale(): Locale | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value !== null && isLocale(value) ? value : null
  } catch {
    return null
  }
}

function rememberLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* Ignored — the choice simply will not survive a reload. */
  }
}

/** First visit only: honour the browser's preference if we can serve it. */
function preferredLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en'
  for (const candidate of navigator.languages ?? [navigator.language]) {
    const base = candidate.split('-')[0]?.toLowerCase() ?? ''
    if (isLocale(base)) return base
  }
  return 'en'
}

function initialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  /* An explicit `?lang=` wins, so a link can be shared in the language it was
     read in even though the routes are not yet locale-prefixed. */
  const fromQuery = new URLSearchParams(window.location.search).get('lang')
  if (fromQuery !== null && isLocale(fromQuery)) return fromQuery
  return storedLocale() ?? preferredLocale()
}

const DICTIONARIES: Record<Locale, Dictionary> = { en, rw, fr }

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  /** Interface text for the active language. */
  t: Dictionary
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  /* `<html lang>` is set at build time from .figma/make/site.json and is always
     "en", so the runtime has to own it. Screen readers pick pronunciation from
     this, and it is what tells a browser whether to offer to translate. */
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    rememberLocale(next)
    /* Changing language re-renders every component on the page and re-requests
       every CMS document at once. Done as an urgent update that is ~780ms of
       blocking work on a mid-range phone, which is what the INP warning is
       measuring: the switcher stays visually stuck until it finishes.

       As a transition, React renders the new language in the background and
       keeps the tap responsive — the old text stays on screen for a few frames
       instead of the whole page freezing. */
    startTransition(() => {
      setLocaleState(next)
    })
  }, [])

  const value = useMemo(
    () => ({ locale, setLocale, t: DICTIONARIES[locale] }),
    [locale, setLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext)
  /* Defaulting rather than throwing keeps a component usable in isolation —
     a test rendering one page does not have to wrap it in the provider. */
  return context ?? { locale: 'en', setLocale: () => undefined, t: en }
}

/** Interface text for the active language: `const t = useT()` → `t.common.apply`. */
export function useT(): Dictionary {
  return useLocale().t
}

/* ── Locale-aware formatting ──────────────────────────────────────────────
   Intl covers all three languages natively, including Kinyarwanda month names
   and the RWF symbol, so none of this needs a translation file. */

/** e.g. "14 Mar 2026" · "2026 Wer 14" · "14 mars 2026" */
export function formatDate(iso: string, locale: Locale = 'en'): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(intlLocale(locale), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatNumber(value: number, locale: Locale = 'en'): string {
  return value.toLocaleString(intlLocale(locale), { maximumFractionDigits: 0 })
}

export function formatCurrency(value: number, locale: Locale = 'en'): string {
  return value.toLocaleString(intlLocale(locale), {
    style: 'currency',
    currency: 'RWF',
    maximumFractionDigits: 0,
  })
}

/* English is served as en-RW: Rwandan date order and the local currency
   symbol, without translating the month names. */
function intlLocale(locale: Locale): string {
  return locale === 'en' ? 'en-RW' : locale
}
