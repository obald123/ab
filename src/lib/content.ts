import { useEffect, useState } from 'react'

/* ═══════════════════════════════════════════════════════════════
   PUBLIC CONTENT

   Reads the CMS through the unauthenticated, cached read API. No
   cookies, no credentials — this endpoint is public by design and
   returns only published content.

   Every hook takes a fallback, used in exactly one situation: the
   API could not be reached. The site then still renders its
   last-known copy instead of collapsing to blank sections.

   A successful response is always authoritative, **including an
   empty one**. If an editor removes every news article, the site
   shows no news — falling back to built-in copy there would display
   content nobody can edit and make the CMS look broken.
   ═══════════════════════════════════════════════════════════════ */

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000'
const API = `${BASE_URL}/api/v1`

export type CollectionType = 'ticker' | 'news' | 'rate' | 'product' | 'service' | 'branch'
export type SingletonType = 'hero' | 'nav' | 'footer' | 'campaign' | 'about' | 'contact'

interface CollectionResponse<T> {
  kind: 'collection'
  items: (T & { id: string })[]
}

interface SingletonResponse<T> {
  kind: 'singleton'
  item: (T & { id: string }) | null
}

async function fetchContent<R>(type: string, signal: AbortSignal): Promise<R> {
  const response = await fetch(`${API}/content/${type}`, { signal })
  if (!response.ok) throw new Error(`Content request failed: ${String(response.status)}`)
  return (await response.json()) as R
}

export interface ContentState<T> {
  data: T
  /** True while the first request is in flight. */
  loading: boolean
  /** True when the fallback is being shown because the request failed. */
  degraded: boolean
}

/** Published items of a collection type, with a fallback while offline. */
export function useCollection<T>(type: CollectionType, fallback: T[]): ContentState<T[]> {
  const [state, setState] = useState<ContentState<T[]>>({
    data: fallback,
    loading: true,
    degraded: false,
  })

  useEffect(() => {
    const controller = new AbortController()

    fetchContent<CollectionResponse<T>>(type, controller.signal)
      .then((body) => {
        // The response wins even when empty — see the note at the top.
        setState({ data: body.items, loading: false, degraded: false })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        if (error instanceof Error && error.name === 'AbortError') return
        setState({ data: fallback, loading: false, degraded: true })
      })

    return () => {
      controller.abort()
    }
    // `fallback` is a module-level constant at every call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  return state
}

/** The one published document of a singleton type, with a fallback. */
export function useSingleton<T>(type: SingletonType, fallback: T): ContentState<T> {
  const [state, setState] = useState<ContentState<T>>({
    data: fallback,
    loading: true,
    degraded: false,
  })

  useEffect(() => {
    const controller = new AbortController()

    fetchContent<SingletonResponse<T>>(type, controller.signal)
      .then((body) => {
        setState({ data: body.item ?? fallback, loading: false, degraded: false })
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        if (error instanceof Error && error.name === 'AbortError') return
        setState({ data: fallback, loading: false, degraded: true })
      })

    return () => {
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  return state
}

/* The extension is the only signal available for an arbitrary URL, and it is
   deterministic for anything the media API produced — keys always end in the
   real, sniffed type. */
export function isVideoSource(value: string | undefined | null): boolean {
  if (!value) return false
  return /\.(mp4|webm)(\?|#|$)/i.test(value)
}

/* Media keys from the CMS are relative; anything already absolute (a legacy
   URL still in the payload) is passed through untouched. */
export function mediaUrl(value: string | undefined | null): string {
  if (!value) return ''
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:')) return value
  if (value.startsWith('/api/')) return `${BASE_URL}${value}`
  return `${API}/media/${value}`
}
