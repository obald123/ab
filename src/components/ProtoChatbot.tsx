import { useEffect, useState } from 'react'
import { useT } from '../lib/i18n'

/* Intumwa support chatbot (Proto).

   Loaded only when the visitor asks for it. The provider's script, as soon as
   it runs, stores a visitor identifier and a "first seen" date in this site's
   browser storage and opens a connection to the provider — so loading it on
   every page would put a persistent identifier on every visitor before they
   chose anything. Instead we show our own button; clicking it loads the
   script, waits for the widget to be ready, and opens it. From then on the
   provider's own toggle button takes over. */

const PROTO_SCRIPT_ID = 'intumwa-proto-script'
const PROTO_CHATBOT_ID = import.meta.env.VITE_PROTO_CHATBOT_ID?.trim()
const PROTO_SCRIPT_URL = 'https://embed.proto.cx/index.umd.js'

declare global {
  interface Window {
    proto?: {
      init(settings: { id: string }): void
      destroy(): void
      open(): void
      /** null until the widget has fetched its configuration and is ready. */
      isOpen(): boolean | null
    }
  }
}

let scriptLoad: Promise<void> | undefined

function loadProtoScript(): Promise<void> {
  if (window.proto?.init) return Promise.resolve()
  if (scriptLoad) return scriptLoad

  scriptLoad = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = PROTO_SCRIPT_ID
    script.src = PROTO_SCRIPT_URL
    script.type = 'text/javascript'
    script.async = true
    script.referrerPolicy = 'no-referrer'
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener(
      'error',
      () => {
        scriptLoad = undefined
        script.remove()
        reject(new Error('Unable to load the Intumwa chatbot.'))
      },
      { once: true },
    )
    document.head.appendChild(script)
  })

  return scriptLoad
}

/** Resolves once the widget is ready to open, or rejects after `timeoutMs`. */
function whenReady(timeoutMs = 10_000): Promise<void> {
  const started = Date.now()
  return new Promise((resolve, reject) => {
    const check = () => {
      if (window.proto?.isOpen() !== null && window.proto?.isOpen() !== undefined) {
        resolve()
      } else if (Date.now() - started > timeoutMs) {
        reject(new Error('The chatbot did not become ready.'))
      } else {
        window.setTimeout(check, 150)
      }
    }
    check()
  })
}

type State = 'idle' | 'loading' | 'ready' | 'failed'

export default function ProtoChatbot() {
  const t = useT()
  const [state, setState] = useState<State>('idle')

  // Tear the widget down if the shell ever unmounts.
  useEffect(() => () => window.proto?.destroy(), [])

  if (!PROTO_CHATBOT_ID || state === 'ready') return null

  async function start() {
    if (!PROTO_CHATBOT_ID) return
    setState('loading')
    try {
      await loadProtoScript()
      window.proto?.init({ id: PROTO_CHATBOT_ID })
      await whenReady()
      window.proto?.open()
      setState('ready')
    } catch {
      setState('failed')
    }
  }

  const busy = state === 'loading'
  return (
    <button
      type="button"
      onClick={() => void start()}
      disabled={busy}
      aria-label={state === 'failed' ? t.chatbot.retry : t.chatbot.open}
      title={state === 'failed' ? t.chatbot.unavailable : t.chatbot.open}
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        zIndex: 8999,
        width: 58,
        height: 58,
        borderRadius: '50%',
        border: 'none',
        cursor: busy ? 'wait' : 'pointer',
        background: state === 'failed' ? '#7f1d1d' : '#334155',
        color: '#ffffff',
        boxShadow: '0 10px 30px rgba(15,23,42,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="print:hidden"
    >
      {busy ? (
        <span
          aria-hidden="true"
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            border: '2.5px solid rgba(255,255,255,0.35)',
            borderTopColor: '#ffffff',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      ) : (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )}
      <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
    </button>
  )
}
