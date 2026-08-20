import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Accessibility,
  AlignJustify,
  BookOpen,
  Compass,
  Contrast,
  Eye,
  Focus,
  ImageOff,
  Link,
  MousePointer2,
  PauseCircle,
  PersonStanding,
  Target,
  TextCursor,
  Type,
  Volume2,
  X,
} from 'lucide-react'
import { useLocale, useT, type Locale } from '../lib/i18n'
import { hasFunctionalConsent } from '../lib/cookieConsent'

/* The accessibility FAB + panel, mounted once by PageShell so it's available
   on every route rather than only wherever it happened to be rendered — it
   used to live inside Contact.tsx, which only Home.tsx renders. */

/* ── Voice over (read page aloud) ──
   Built on the browser's own speechSynthesis rather than a cloud TTS service:
   free, no backend, works offline of our own infra. The one real gap is
   language coverage — no browser or OS ships a Kinyarwanda voice, so `rw`
   deliberately falls back to reading in English rather than not offering the
   feature at all in that language. */

/** speechSynthesis.getVoices() can return an empty list on the very first
 *  call — Chrome loads voices asynchronously and only fires 'voiceschanged'
 *  once they're ready — so this is read fresh at play time, not cached at
 *  module scope, in case the first call landed before that event. */
function pickVoice(locale: Locale): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return undefined
  // Kinyarwanda has no browser/OS voice anywhere; English is Rwanda's other
  // official administrative language, so it is the fallback rather than French.
  const want = locale === 'fr' ? 'fr' : 'en'
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith(want)) ??
    voices.find((v) => v.default) ??
    voices[0]
  )
}

function voiceLangTag(locale: Locale): string {
  return locale === 'fr' ? 'fr-FR' : 'en-US'
}

/* Evaluated once, at module load — this app is a Vite CSR SPA, so `window`
 * is always present by the time this module runs in the browser, and support
 * for the API can't change over a page's lifetime. Keeping it out of React
 * state entirely avoids the classic "detect on mount" effect-plus-setState
 * dance for a value that render already has the answer to. */
const VOICE_OVER_SUPPORTED = typeof window !== 'undefined' && 'speechSynthesis' in window

/** Exported so the cookie consent popup can clear it when a visitor declines
 *  "Preferences" — see CookieConsent.tsx's `persist`. */
export const A11Y_STORAGE_KEY = 'a11y-state'

/** Accessibility choices apply immediately either way (the panel is a11y
 *  regardless of any cookie decision) — only whether they *survive a reload*
 *  is gated, matching the "Preferences" category's own description. */
function persistA11yState(next: unknown): void {
  if (!hasFunctionalConsent()) return
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* storage blocked — the choice just won't persist */
  }
}

const BLANK_A11Y_STATE = {
  highContrast: false,
  largeText: false,
  hideImages: false,
  lineHeight: false,
  letterSpacing: false,
  readingMask: false,
  grayscale: false,
  highlightLinks: false,
  bigCursor: false,
  pauseAnimations: false,
  dyslexiaFriendly: false,
  highlightFocus: false,
}

type A11yState = typeof BLANK_A11Y_STATE

/** A pure function of its argument — no component state to close over — so
 *  it lives at module scope rather than being redeclared (and needing to be
 *  listed as an effect dependency) on every render. */
function applyA11yClasses(state: A11yState): void {
  const root = document.documentElement
  root.classList.toggle('a11y-high-contrast', state.highContrast)
  root.classList.toggle('a11y-large-text', state.largeText)
  root.classList.toggle('a11y-hide-images', state.hideImages)
  root.classList.toggle('a11y-line-height', state.lineHeight)
  root.classList.toggle('a11y-letter-spacing', state.letterSpacing)
  root.classList.toggle('a11y-reading-mask', state.readingMask)
  root.classList.toggle('a11y-grayscale', state.grayscale)
  root.classList.toggle('a11y-highlight-links', state.highlightLinks)
  root.classList.toggle('a11y-big-cursor', state.bigCursor)
  root.classList.toggle('a11y-pause-animations', state.pauseAnimations)
  root.classList.toggle('a11y-dyslexia-friendly', state.dyslexiaFriendly)
  root.classList.toggle('a11y-highlight-focus', state.highlightFocus)
}

/** Reads whatever was saved once, synchronously, at first render — so the
 *  classes an earlier visit chose apply from the very first paint instead of
 *  flashing unstyled and then jumping a frame later once an effect runs. */
function loadA11yState(): A11yState {
  try {
    const saved = localStorage.getItem(A11Y_STORAGE_KEY)
    if (saved) return JSON.parse(saved) as A11yState
  } catch {
    /* storage blocked, or not valid JSON — fall through to the default */
  }
  return BLANK_A11Y_STATE
}

export default function AccessibilityPanel() {
  const t = useT()
  const { locale } = useLocale()
  const { pathname } = useLocation()

  const [voiceOverActive, setVoiceOverActive] = useState(false)

  useEffect(() => {
    if (!VOICE_OVER_SUPPORTED) return
    // Stop mid-sentence on navigation — otherwise it keeps narrating a page
    // the visitor has already left. This component itself never unmounts
    // (PageShell renders it once, outside <Outlet/>), so route change is the
    // only signal available for "the page being read is gone now". Cancelling
    // an external system's in-progress operation, and reflecting that in
    // state, is exactly what this effect is for — not a derived-state
    // shortcut the rule below is meant to catch.
    window.speechSynthesis.cancel()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVoiceOverActive(false)
  }, [pathname])

  const toggleVoiceOver = useCallback(() => {
    if (!VOICE_OVER_SUPPORTED) return

    if (voiceOverActive) {
      window.speechSynthesis.cancel()
      setVoiceOverActive(false)
      return
    }

    // The single landmark PageShell wraps every route in.
    const main = document.getElementById('a11y-page-content')
    const text = main?.innerText.trim()
    if (!text) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = voiceLangTag(locale)
    const voice = pickVoice(locale)
    if (voice) utterance.voice = voice
    utterance.onend = () => setVoiceOverActive(false)
    utterance.onerror = () => setVoiceOverActive(false)
    window.speechSynthesis.speak(utterance)
    setVoiceOverActive(true)
  }, [locale, voiceOverActive])

  const [a11yOpen, setA11yOpen] = useState(false)
  const [a11yState, setA11yState] = useState(loadA11yState)

  useEffect(() => {
    // Applies whatever the lazy initializer above already loaded — a DOM
    // mutation, not a state update, so it doesn't need to be (and isn't)
    // reachable through the set-state-in-effect rule at all. Every
    // subsequent change applies its own classes directly (toggleA11yOption,
    // applyProfile, the reset button), so this only ever needs to run once.
    applyA11yClasses(a11yState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!a11yOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setA11yOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [a11yOpen])

  function toggleA11yOption(option: keyof typeof a11yState) {
    setA11yState((current) => {
      const next = { ...current, [option]: !current[option] }
      persistA11yState(next)
      applyA11yClasses(next)
      return next
    })
  }

  function applyProfile(profile: 'vision' | 'navigation' | 'focus') {
    if (profile === 'vision') {
      const next = {
        highContrast: true,
        largeText: true,
        hideImages: false,
        lineHeight: true,
        letterSpacing: true,
        readingMask: false,
        grayscale: false,
        highlightLinks: true,
        bigCursor: false,
        pauseAnimations: false,
        dyslexiaFriendly: true,
        highlightFocus: true,
      }
      setA11yState(next)
      persistA11yState(next)
      applyA11yClasses(next)
    }
    if (profile === 'navigation') {
      const next = {
        highContrast: false,
        largeText: true,
        hideImages: false,
        lineHeight: true,
        letterSpacing: false,
        readingMask: true,
        grayscale: false,
        highlightLinks: true,
        bigCursor: true,
        pauseAnimations: true,
        dyslexiaFriendly: false,
        highlightFocus: true,
      }
      setA11yState(next)
      persistA11yState(next)
      applyA11yClasses(next)
    }
    if (profile === 'focus') {
      const next = {
        highContrast: true,
        largeText: false,
        hideImages: true,
        lineHeight: true,
        letterSpacing: false,
        readingMask: true,
        grayscale: false,
        highlightLinks: false,
        bigCursor: false,
        pauseAnimations: true,
        dyslexiaFriendly: false,
        highlightFocus: true,
      }
      setA11yState(next)
      persistA11yState(next)
      applyA11yClasses(next)
    }
  }

  return (
    <div className="a11y-fab" aria-hidden={false}>
      <button aria-label={t.a11y.toggleMenu} onClick={() => setA11yOpen((s) => !s)} className="a11y-fab-button">
        <PersonStanding size={26} />
      </button>
      {a11yOpen && (
        <>
          {/* Decorative mouse-only affordance: aria-hidden already exempts it
              from needing a keyboard equivalent of its own, and the panel has
              two real ones regardless — Escape (handled above) and the
              explicit Close button below. */}
          <div className="a11y-backdrop" aria-hidden="true" onClick={() => setA11yOpen(false)} />
          {/* This click handler only stops a click inside the panel from
              bubbling to the backdrop above and closing it — it triggers no
              action of its own, so there's no keyboard equivalent to add. */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
          <div role="dialog" aria-modal="true" aria-label={t.a11y.menu} className="a11y-panel" onClick={(e) => e.stopPropagation()}>
            <div className="a11y-panel-header">
              <div className="a11y-panel-header-title">
                <div className="a11y-panel-header-icon"><PersonStanding size={16} /></div>
                <span className="a11y-panel-header-text">Accessibility</span>
              </div>
              <button type="button" onClick={() => setA11yOpen(false)} aria-label="Close" className="a11y-panel-close">
                <X size={16} />
              </button>
            </div>

            <div className="a11y-panel-section">
              <div className="a11y-panel-section-title">Content</div>
              {[
                { key: 'largeText' as const, label: 'Bigger Text', Icon: Type },
                { key: 'lineHeight' as const, label: 'Line Height', Icon: AlignJustify },
                { key: 'letterSpacing' as const, label: 'Letter Spacing', Icon: TextCursor },
                { key: 'hideImages' as const, label: 'Hide Images', Icon: ImageOff },
              ].map(({ key, label, Icon }) => (
                <label key={key} htmlFor={`a11y-opt-${key}`} aria-label={label} className="a11y-toggle-row" data-active={String(a11yState[key])}>
                  <div className="a11y-toggle-info">
                    <div className="a11y-toggle-icon"><Icon size={16} /></div>
                    <span className="a11y-toggle-label">{label}</span>
                  </div>
                  <div className="a11y-switch">
                    <input id={`a11y-opt-${key}`} type="checkbox" checked={a11yState[key]} onChange={() => toggleA11yOption(key)} />
                    <div className="a11y-switch-track" />
                    <div className="a11y-switch-thumb" />
                  </div>
                </label>
              ))}
            </div>

            <div className="a11y-panel-section">
              <div className="a11y-panel-section-title">Colors</div>
              {[
                { key: 'highContrast' as const, label: 'High Contrast', Icon: Contrast },
                { key: 'grayscale' as const, label: 'Grayscale', Icon: Accessibility },
                { key: 'readingMask' as const, label: 'Reading Mask', Icon: Eye },
              ].map(({ key, label, Icon }) => (
                <label key={key} htmlFor={`a11y-opt-${key}`} aria-label={label} className="a11y-toggle-row" data-active={String(a11yState[key])}>
                  <div className="a11y-toggle-info">
                    <div className="a11y-toggle-icon"><Icon size={16} /></div>
                    <span className="a11y-toggle-label">{label}</span>
                  </div>
                  <div className="a11y-switch">
                    <input id={`a11y-opt-${key}`} type="checkbox" checked={a11yState[key]} onChange={() => toggleA11yOption(key)} />
                    <div className="a11y-switch-track" />
                    <div className="a11y-switch-thumb" />
                  </div>
                </label>
              ))}
            </div>

            <div className="a11y-panel-section">
              <div className="a11y-panel-section-title">Navigation & Motor</div>
              {[
                { key: 'highlightLinks' as const, label: 'Highlight Links', Icon: Link },
                { key: 'bigCursor' as const, label: 'Big Cursor', Icon: MousePointer2 },
                { key: 'highlightFocus' as const, label: 'Focus Outlines', Icon: Focus },
                { key: 'pauseAnimations' as const, label: 'Pause Animations', Icon: PauseCircle },
              ].map(({ key, label, Icon }) => (
                <label key={key} htmlFor={`a11y-opt-${key}`} aria-label={label} className="a11y-toggle-row" data-active={String(a11yState[key])}>
                  <div className="a11y-toggle-info">
                    <div className="a11y-toggle-icon"><Icon size={16} /></div>
                    <span className="a11y-toggle-label">{label}</span>
                  </div>
                  <div className="a11y-switch">
                    <input id={`a11y-opt-${key}`} type="checkbox" checked={a11yState[key]} onChange={() => toggleA11yOption(key)} />
                    <div className="a11y-switch-track" />
                    <div className="a11y-switch-thumb" />
                  </div>
                </label>
              ))}
            </div>

            <div className="a11y-panel-section">
              <div className="a11y-panel-section-title">Reading</div>
              <label htmlFor="a11y-opt-dyslexiaFriendly" aria-label="Dyslexia Friendly" className="a11y-toggle-row" data-active={String(a11yState.dyslexiaFriendly)}>
                <div className="a11y-toggle-info">
                  <div className="a11y-toggle-icon"><BookOpen size={16} /></div>
                  <span className="a11y-toggle-label">Dyslexia Friendly</span>
                </div>
                <div className="a11y-switch">
                  <input id="a11y-opt-dyslexiaFriendly" type="checkbox" checked={a11yState.dyslexiaFriendly} onChange={() => toggleA11yOption('dyslexiaFriendly')} />
                  <div className="a11y-switch-track" />
                  <div className="a11y-switch-thumb" />
                </div>
              </label>
              {VOICE_OVER_SUPPORTED && (
                <label htmlFor="a11y-opt-voiceOver" aria-label="Voice Over" className="a11y-toggle-row" data-active={String(voiceOverActive)}>
                  <div className="a11y-toggle-info">
                    <div className="a11y-toggle-icon"><Volume2 size={16} /></div>
                    <span className="a11y-toggle-label">Voice Over</span>
                  </div>
                  <div className="a11y-switch">
                    <input
                      id="a11y-opt-voiceOver"
                      type="checkbox"
                      checked={voiceOverActive}
                      aria-label="Read this page aloud"
                      onChange={toggleVoiceOver}
                    />
                    <div className="a11y-switch-track" />
                    <div className="a11y-switch-thumb" />
                  </div>
                </label>
              )}
            </div>

            <div className="a11y-panel-section">
              <div className="a11y-panel-section-title">Quick Presets</div>
              <div className="a11y-profiles">
                {[
                  { id: 'vision' as const, label: 'Vision', Icon: Eye },
                  { id: 'navigation' as const, label: 'Navigation', Icon: Compass },
                  { id: 'focus' as const, label: 'Focus', Icon: Target },
                ].map(({ id, label, Icon }) => (
                  <button key={id} type="button" className="a11y-profile-btn" onClick={() => applyProfile(id)}>
                    <div className="a11y-profile-icon"><Icon size={14} /></div>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="a11y-panel-footer">
              <button type="button" className="a11y-panel-reset" onClick={() => {
                setA11yState(BLANK_A11Y_STATE)
                applyA11yClasses(BLANK_A11Y_STATE)
                persistA11yState(BLANK_A11Y_STATE)
              }}>Reset All</button>
              <span className="a11y-panel-status">12 options</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
