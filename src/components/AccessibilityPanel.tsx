import { useCallback, useEffect, useRef, useState } from 'react'
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
  Pause,
  PauseCircle,
  PersonStanding,
  Play,
  SkipBack,
  SkipForward,
  Square,
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
   feature at all in that language.

   Modelled on how the established accessibility-toolbar products (Recite Me,
   UserWay, AudioEye) actually behave, not guessed at: Play/Pause/Stop rather
   than one on/off switch, Back/Forward by paragraph, a speed control, and a
   highlighted "currently reading" block — and, matching all of them,
   reading does NOT auto-continue onto whatever page you navigate to next. */

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
  /** speechSynthesis rate/pitch — 1 is each one's own neutral default. Kept
   *  alongside the other toggles so Voice Over's speed/pitch survive a
   *  reload the same way, gated behind the same "Preferences" consent. */
  voiceRate: 1,
  voicePitch: 1,
}

type A11yState = typeof BLANK_A11Y_STATE
/** The boolean-only subset `toggleA11yOption` flips — `voiceRate`/`voicePitch`
 *  are numbers with their own dedicated setters, not switches. */
type BooleanA11yKey = Exclude<keyof A11yState, 'voiceRate' | 'voicePitch'>

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
    // Merged over the defaults rather than trusted outright: a save from
    // before Voice Over had rate/pitch controls won't have those keys, and
    // a raw cast would leave them `undefined`.
    if (saved) return { ...BLANK_A11Y_STATE, ...(JSON.parse(saved) as Partial<A11yState>) }
  } catch {
    /* storage blocked, or not valid JSON — fall through to the default */
  }
  return BLANK_A11Y_STATE
}

/* ── Reading segments ──
   One SpeechSynthesisUtterance per block-level element (paragraphs,
   headings, list items, table cells, ...) rather than the whole page as one
   utterance. This is what makes Back/Forward, hover/tap-to-jump, and
   highlighting the block currently being read all possible — a single giant
   utterance has no addressable position partway through, and speechSynthesis
   has no built-in seek. */
interface Segment {
  el: HTMLElement
  text: string
}

const SEGMENT_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, dt, dd, td, th'

function collectSegments(): Segment[] {
  const root = document.getElementById('a11y-page-content')
  if (!root) return []
  const candidates = Array.from(root.querySelectorAll<HTMLElement>(SEGMENT_SELECTOR))
  // Drop any candidate that is itself inside another candidate (e.g. a <p>
  // nested in a matched <li>) so its text isn't read twice.
  const outermost = candidates.filter(
    (el) => !candidates.some((other) => other !== el && other.contains(el)),
  )
  return outermost
    .map((el) => ({ el, text: el.innerText.trim() }))
    .filter((seg) => seg.text.length > 0)
}

/** True for anything that already has its own click behaviour — jumping the
 *  reader there on hover/click would fight a real link, button, or control. */
function isInteractive(el: Element): boolean {
  return !!el.closest('a, button, input, select, textarea, [role="button"], [tabindex]')
}

const HOVER_DWELL_MS = 450
const HIGHLIGHT_CLASS = 'a11y-reading-highlight'

type PlaybackStatus = 'idle' | 'playing' | 'paused'

export default function AccessibilityPanel() {
  const t = useT()
  const { locale } = useLocale()
  const { pathname } = useLocation()

  const [a11yOpen, setA11yOpen] = useState(false)
  const [a11yState, setA11yState] = useState(loadA11yState)

  const [voiceOverEnabled, setVoiceOverEnabled] = useState(false)
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>('idle')

  const segmentsRef = useRef<Segment[]>([])
  const indexRef = useRef(0)
  const highlightedRef = useRef<HTMLElement | null>(null)
  const hoverTimerRef = useRef<number | null>(null)

  const clearHighlight = useCallback(() => {
    highlightedRef.current?.classList.remove(HIGHLIGHT_CLASS)
    highlightedRef.current = null
  }, [])

  const highlightSegment = useCallback(
    (el: HTMLElement) => {
      clearHighlight()
      el.classList.add(HIGHLIGHT_CLASS)
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      highlightedRef.current = el
    },
    [clearHighlight],
  )

  const resetReading = useCallback(() => {
    window.speechSynthesis.cancel()
    clearHighlight()
    segmentsRef.current = []
    indexRef.current = 0
    setPlaybackStatus('idle')
  }, [clearHighlight])

  /* `speakSegment` calls itself (to chain onto the next segment when one
   * finishes on its own) — referencing the `useCallback`-bound `const`
   * directly from inside its own body would either be a TDZ reference or,
   * once past that, could call a stale version of itself from a closure
   * captured before rate/pitch/locale last changed. Routing the recursive
   * call through a ref that's always kept current sidesteps both. */
  const speakSegmentRef = useRef<(index: number) => void>(() => undefined)

  // Stop and fully reset on navigation — a different page has a different
  // (and by then stale) set of segments, so nothing about the old reading
  // position still means anything. Matches how Recite Me/UserWay/AudioEye
  // all behave too: none of them auto-continue reading onto the next page.
  useEffect(() => {
    if (!VOICE_OVER_SUPPORTED) return
    // Cancelling speechSynthesis and resetting the toggle to match reality
    // is the actual point of this effect — a genuine response to an external
    // event (navigation), not a derived-state shortcut the rule below is
    // meant to catch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    resetReading()
    setVoiceOverEnabled(false)
  }, [pathname, resetReading])

  const speakSegment = useCallback(
    (index: number) => {
      const segments = segmentsRef.current
      if (index >= segments.length) {
        // Reached the end on its own (not stopped/paused) — announce it,
        // the way a real screen reader says "end of document".
        clearHighlight()
        indexRef.current = segments.length
        const done = new SpeechSynthesisUtterance('End of page.')
        done.lang = voiceLangTag(locale)
        const voice = pickVoice(locale)
        if (voice) done.voice = voice
        done.onend = () => setPlaybackStatus('idle')
        done.onerror = () => setPlaybackStatus('idle')
        window.speechSynthesis.speak(done)
        return
      }

      indexRef.current = index
      highlightSegment(segments[index].el)

      const utterance = new SpeechSynthesisUtterance(segments[index].text)
      utterance.lang = voiceLangTag(locale)
      utterance.rate = a11yState.voiceRate
      utterance.pitch = a11yState.voicePitch
      const voice = pickVoice(locale)
      if (voice) utterance.voice = voice
      utterance.onend = () => {
        // A manual jump (Back/Forward/hover/click) also cancels whatever
        // was playing, which fires this same onend — the index guard is
        // what stops that stale callback from double-advancing on top of
        // the deliberate jump.
        if (indexRef.current === index) speakSegmentRef.current(index + 1)
      }
      utterance.onerror = () => {
        if (indexRef.current === index) setPlaybackStatus('idle')
      }
      window.speechSynthesis.speak(utterance)
    },
    [a11yState.voiceRate, a11yState.voicePitch, clearHighlight, highlightSegment, locale],
  )

  useEffect(() => {
    speakSegmentRef.current = speakSegment
  }, [speakSegment])

  const play = useCallback(() => {
    if (playbackStatus === 'paused') {
      window.speechSynthesis.resume()
      setPlaybackStatus('playing')
      return
    }
    if (segmentsRef.current.length === 0) segmentsRef.current = collectSegments()
    if (segmentsRef.current.length === 0) return
    setPlaybackStatus('playing')
    speakSegment(indexRef.current)
  }, [playbackStatus, speakSegment])

  const pause = useCallback(() => {
    window.speechSynthesis.pause()
    setPlaybackStatus('paused')
  }, [])

  const back = useCallback(() => {
    if (segmentsRef.current.length === 0) return
    window.speechSynthesis.cancel()
    setPlaybackStatus('playing')
    speakSegment(Math.max(0, indexRef.current - 1))
  }, [speakSegment])

  const forward = useCallback(() => {
    if (segmentsRef.current.length === 0) return
    window.speechSynthesis.cancel()
    setPlaybackStatus('playing')
    speakSegment(indexRef.current + 1)
  }, [speakSegment])

  const jumpToElement = useCallback(
    (el: HTMLElement) => {
      const idx = segmentsRef.current.findIndex((seg) => seg.el === el)
      if (idx === -1) return
      window.speechSynthesis.cancel()
      setPlaybackStatus('playing')
      speakSegment(idx)
    },
    [speakSegment],
  )

  const toggleVoiceOver = useCallback(() => {
    if (!VOICE_OVER_SUPPORTED) return
    if (voiceOverEnabled) {
      resetReading()
      setVoiceOverEnabled(false)
      return
    }
    segmentsRef.current = collectSegments()
    setVoiceOverEnabled(true)
  }, [voiceOverEnabled, resetReading])

  // Hover (mouse, after a short dwell so passing the cursor over text while
  // scrolling doesn't constantly retrigger it) and click/tap both jump the
  // reader to whatever block they land on — but only while Voice Over is
  // armed, and never when the target already has its own click behaviour,
  // so the rest of the site's normal links and buttons are untouched.
  useEffect(() => {
    if (!voiceOverEnabled) return
    const root = document.getElementById('a11y-page-content')
    if (!root) return

    const segmentFor = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof Element) || isInteractive(target)) return null
      const el = target.closest<HTMLElement>(SEGMENT_SELECTOR)
      if (!el || !root.contains(el)) return null
      return segmentsRef.current.some((seg) => seg.el === el) ? el : null
    }

    const onMouseOver = (e: MouseEvent) => {
      const el = segmentFor(e.target)
      if (!el) return
      if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = window.setTimeout(() => jumpToElement(el), HOVER_DWELL_MS)
    }
    const onMouseOut = () => {
      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current)
        hoverTimerRef.current = null
      }
    }
    const onClick = (e: MouseEvent) => {
      const el = segmentFor(e.target)
      if (el) jumpToElement(el)
    }

    root.addEventListener('mouseover', onMouseOver)
    root.addEventListener('mouseout', onMouseOut)
    root.addEventListener('click', onClick)
    return () => {
      root.removeEventListener('mouseover', onMouseOver)
      root.removeEventListener('mouseout', onMouseOut)
      root.removeEventListener('click', onClick)
      if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current)
    }
  }, [voiceOverEnabled, jumpToElement])

  const setVoiceRate = useCallback((rate: number) => {
    setA11yState((current) => {
      const next = { ...current, voiceRate: rate }
      persistA11yState(next)
      return next
    })
  }, [])

  const setVoicePitch = useCallback((pitch: number) => {
    setA11yState((current) => {
      const next = { ...current, voicePitch: pitch }
      persistA11yState(next)
      return next
    })
  }, [])

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

  function toggleA11yOption(option: BooleanA11yKey) {
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
        ...a11yState,
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
        ...a11yState,
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
        ...a11yState,
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
                <>
                  <label htmlFor="a11y-opt-voiceOver" aria-label="Voice Over" className="a11y-toggle-row" data-active={String(voiceOverEnabled)}>
                    <div className="a11y-toggle-info">
                      <div className="a11y-toggle-icon"><Volume2 size={16} /></div>
                      <span className="a11y-toggle-label">Voice Over</span>
                    </div>
                    <div className="a11y-switch">
                      <input
                        id="a11y-opt-voiceOver"
                        type="checkbox"
                        checked={voiceOverEnabled}
                        aria-label="Read this page aloud"
                        onChange={toggleVoiceOver}
                      />
                      <div className="a11y-switch-track" />
                      <div className="a11y-switch-thumb" />
                    </div>
                  </label>

                  {voiceOverEnabled && (
                    <div className="a11y-voice-panel">
                      <div className="a11y-voice-transport">
                        <button type="button" className="a11y-voice-btn" aria-label="Previous paragraph" onClick={back}>
                          <SkipBack size={15} />
                        </button>
                        {playbackStatus === 'playing' ? (
                          <button type="button" className="a11y-voice-btn a11y-voice-btn--primary" aria-label="Pause" onClick={pause}>
                            <Pause size={18} />
                          </button>
                        ) : (
                          <button type="button" className="a11y-voice-btn a11y-voice-btn--primary" aria-label="Play" onClick={play}>
                            <Play size={18} />
                          </button>
                        )}
                        <button
                          type="button"
                          className="a11y-voice-btn"
                          aria-label="Stop"
                          disabled={playbackStatus === 'idle'}
                          onClick={resetReading}
                        >
                          <Square size={14} />
                        </button>
                        <button type="button" className="a11y-voice-btn" aria-label="Next paragraph" onClick={forward}>
                          <SkipForward size={15} />
                        </button>
                      </div>

                      <label className="a11y-voice-slider-row">
                        <span className="a11y-voice-slider-label">Speed</span>
                        <input
                          className="a11y-voice-slider"
                          type="range"
                          min={0.5}
                          max={2}
                          step={0.1}
                          value={a11yState.voiceRate}
                          aria-label="Reading speed"
                          onChange={(e) => setVoiceRate(Number(e.target.value))}
                        />
                        <span className="a11y-voice-slider-value">{a11yState.voiceRate.toFixed(1)}×</span>
                      </label>

                      <label className="a11y-voice-slider-row">
                        <span className="a11y-voice-slider-label">Pitch</span>
                        <input
                          className="a11y-voice-slider"
                          type="range"
                          min={0}
                          max={2}
                          step={0.1}
                          value={a11yState.voicePitch}
                          aria-label="Voice pitch"
                          onChange={(e) => setVoicePitch(Number(e.target.value))}
                        />
                        <span className="a11y-voice-slider-value">{a11yState.voicePitch.toFixed(1)}×</span>
                      </label>

                      <p className="a11y-voice-hint">
                        Hover or tap any paragraph to read from there. Use ⏮ ⏭ to move by
                        paragraph. Reading stops if you leave this page.
                      </p>
                    </div>
                  )}
                </>
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
