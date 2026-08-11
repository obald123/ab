import { useEffect, useState } from 'react'
import { API_ROOT, exitPreview, previewToken } from '../lib/content'

/* The one thing that distinguishes a staging preview from the live site.
   Without it, an unpublished page is indistinguishable from a published one —
   which is exactly how draft copy ends up quoted as fact. It is deliberately
   loud, fixed to the viewport, and cannot be dismissed. */

interface PreviewInfo {
  approvalId: string
  type: string
}

type State =
  | { status: 'checking' }
  | { status: 'live'; info: PreviewInfo }
  | { status: 'expired' }

export default function PreviewBanner() {
  const [state, setState] = useState<State>({ status: 'checking' })

  useEffect(() => {
    if (!previewToken) return
    const controller = new AbortController()

    /* One probe against a cheap type, purely to tell "previewing" from
       "this link has expired" — otherwise an expired token looks identical to
       an API outage and the page silently shows built-in fallback copy. */
    fetch(`${API_ROOT}/preview/${previewToken}/content/settings`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          setState({ status: 'expired' })
          return
        }
        const body = (await response.json()) as { preview?: PreviewInfo }
        setState(body.preview ? { status: 'live', info: body.preview } : { status: 'expired' })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        if (error instanceof Error && error.name === 'AbortError') return
        setState({ status: 'expired' })
      })

    return () => {
      controller.abort()
    }
  }, [])

  if (!previewToken) return null

  const expired = state.status === 'expired'

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[100] print:hidden"
    >
      <div
        className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center text-[12.5px] font-semibold text-white shadow-lg ${
          expired ? 'bg-[#8a1c1c]' : 'bg-[#0b3a5c]'
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              expired ? 'bg-red-300' : 'animate-pulse bg-amber-300'
            }`}
            aria-hidden
          />
          {expired ? 'Preview link expired' : 'Staging preview — not published'}
        </span>

        <span className="font-normal text-white/75">
          {expired
            ? 'Showing the live site. Generate a new preview from the CMS to see the pending change.'
            : state.status === 'live'
              ? `Showing the pending “${state.info.type}” change laid over the live site. Nothing here is visible to the public.`
              : 'Loading the pending change…'}
        </span>

        <button
          type="button"
          onClick={exitPreview}
          className="rounded-full border border-white/40 px-3 py-0.5 text-[11.5px] font-semibold transition-colors hover:bg-white/15"
        >
          Exit preview
        </button>
      </div>
    </div>
  )
}
