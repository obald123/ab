import { useEffect } from 'react'

const PROTO_SCRIPT_ID = 'intumwa-proto-script'
const PROTO_CHATBOT_ID = import.meta.env.VITE_PROTO_CHATBOT_ID?.trim()
const PROTO_SCRIPT_URL = 'https://embed.proto.cx/index.umd.js'

declare global {
  interface Window {
    proto?: {
      init(settings: { id: string }): void
      destroy(): void
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

export default function ProtoChatbot() {
  useEffect(() => {
    if (!PROTO_CHATBOT_ID) return

    let mounted = true
    void loadProtoScript()
      .then(() => {
        if (mounted) window.proto?.init({ id: PROTO_CHATBOT_ID })
      })
      .catch(() => undefined)

    return () => {
      mounted = false
      window.proto?.destroy()
    }
  }, [])

  return null
}