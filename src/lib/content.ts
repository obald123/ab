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

/** The API root, for the few callers that build a URL the hooks do not cover. */
export const API_ROOT = API

/* ═══════════════════════════════════════════════════════════════
   STAGING PREVIEW

   A reviewer opens this site with `?preview=<token>` from the CMS.
   In that mode every read goes to the token-scoped preview endpoint
   instead of the live one, so the page renders the *pending* change
   in its real surroundings — same components, same styles, same
   everything — without any of it being published.

   The token is a bearer credential, so it is taken out of the
   address bar immediately and held in sessionStorage: it then dies
   with the tab, does not survive a copied URL, and is not handed to
   any third party in a Referer header.
   ═══════════════════════════════════════════════════════════════ */

const PREVIEW_STORAGE_KEY = 'abr.preview.token'
/** 32 random bytes, base64url — the shape the API issues. */
const PREVIEW_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/

function readPreviewToken(): string | null {
  if (typeof window === 'undefined') return null

  const fromUrl = new URLSearchParams(window.location.search).get('preview')
  if (fromUrl && PREVIEW_TOKEN_PATTERN.test(fromUrl)) {
    window.sessionStorage.setItem(PREVIEW_STORAGE_KEY, fromUrl)

    // Strip it from the address bar so the credential is not shared by a
    // copied link, a bookmark, or an outbound Referer.
    const cleaned = new URL(window.location.href)
    cleaned.searchParams.delete('preview')
    window.history.replaceState(null, '', cleaned.toString())
    return fromUrl
  }

  const stored = window.sessionStorage.getItem(PREVIEW_STORAGE_KEY)
  return stored && PREVIEW_TOKEN_PATTERN.test(stored) ? stored : null
}

/** Non-null only while this tab is previewing an unpublished change. */
export const previewToken: string | null = readPreviewToken()

export function isPreviewing(): boolean {
  return previewToken !== null
}

/** Leaves preview mode for this tab and reloads onto live content. */
export function exitPreview(): void {
  if (typeof window === 'undefined') return
  window.sessionStorage.removeItem(PREVIEW_STORAGE_KEY)
  window.location.reload()
}

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
  const url = previewToken
    ? `${API}/preview/${previewToken}/content/${type}`
    : `${API}/content/${type}`

  const response = await fetch(url, { signal })
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
  // Media the API serves lives on the API host, which may differ from this one.
  if (value.startsWith('/api/')) return `${BASE_URL}${value}`
  /* Any other absolute path is served by this site — a bundled asset, or a
     site-relative path an editor typed. Treating those as media keys would
     produce `/api/v1/media//assets/…` and 404. */
  if (value.startsWith('/')) return value
  // Anything left is a bare storage key.
  return `${API}/media/${value}`
}
