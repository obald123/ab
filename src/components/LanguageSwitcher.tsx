import { useEffect, useRef, useState } from 'react'
import { LOCALES, LOCALE_LABELS, LOCALE_SHORT, useLocale } from '../lib/i18n'

/* Language picker.
 *
 * Changing the language re-requests every CMS document with `?lang=`, so the
 * page's content changes with it — see lib/i18n.tsx. Each language is named in
 * itself rather than in English, which is the one convention every language
 * picker shares: somebody looking for French is looking for "Français". */

const GLOBE_PATH =
  'M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18 15 15 0 010-18z'

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false)
    }
    // Escape closes it too — a menu that can only be dismissed with a mouse is
    // unusable from the keyboard.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (compact) {
    /* Inside the mobile drawer there is room to lay the three out flat, which
       is one tap instead of two. */
    return (
      <div style={{ display: 'flex', gap: 8, padding: '16px 0 4px' }}>
        {LOCALES.map((code) => (
          <button
            key={code}
            onClick={() => setLocale(code)}
            aria-pressed={code === locale}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 10,
              border: `1.5px solid ${code === locale ? '#0284c7' : '#e2e8f0'}`,
              background: code === locale ? '#0284c7' : '#ffffff',
              color: code === locale ? '#ffffff' : '#647080',
              fontWeight: 700,
              fontSize: 13,
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            {LOCALE_SHORT[code]}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${LOCALE_LABELS[locale]}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '7px 12px',
          borderRadius: 100,
          border: '1.5px solid rgba(14,165,233,0.22)',
          background: '#ffffff',
          color: '#0284c7',
          fontWeight: 800,
          fontSize: 12.5,
          fontFamily: 'inherit',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path d={GLOBE_PATH} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {LOCALE_SHORT[locale]}
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Choose a language"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: 170,
            background: '#ffffff',
            border: '1px solid rgba(14,165,233,0.16)',
            borderRadius: 12,
            boxShadow: '0 16px 40px rgba(2,30,60,0.14)',
            padding: 6,
            margin: 0,
            listStyle: 'none',
            zIndex: 60,
          }}
        >
          {LOCALES.map((code) => {
            const active = code === locale
            return (
              <li key={code}>
                <button
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLocale(code)
                    setOpen(false)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: active ? 'rgba(14,165,233,0.08)' : 'transparent',
                    color: active ? '#0284c7' : '#334155',
                    fontWeight: active ? 800 : 600,
                    fontSize: 13.5,
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  {/* `lang` on the option itself, so a screen reader announces
                      each name with that language's pronunciation. */}
                  <span lang={code}>{LOCALE_LABELS[code]}</span>
                  <span style={{ fontSize: 11, fontWeight: 800, opacity: 0.6 }}>
                    {LOCALE_SHORT[code]}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
