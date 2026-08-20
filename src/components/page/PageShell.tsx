import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Ticker from '../Ticker'
import Navbar from '../Navbar'
import Footer from '../Footer'
import CookieConsent from '../CookieConsent'
import PreviewBanner from '../PreviewBanner'
import { isPreviewing } from '../../lib/content'

/** Routed pages don't keep the previous page's scroll position. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])
  return null
}

/* Shared chrome for every route. The home one-pager and the standalone
   pages both render inside this, so the ticker, navbar and footer are
   defined once instead of per page. */
/** Height of the staging-preview banner, in px. */
const PREVIEW_BANNER_HEIGHT = 36

export default function PageShell() {
  const previewing = isPreviewing()

  /* The banner is fixed to the viewport, and so are the ticker and navbar.
     Publishing its height as a custom property is what lets those two shift
     down by it without either of them knowing preview mode exists. */
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--abr-preview-offset',
      previewing ? `${String(PREVIEW_BANNER_HEIGHT)}px` : '0px',
    )
  }, [previewing])

  return (
    <div
      className="antialiased"
      style={{
        background: '#ffffff',
        minHeight: '100vh',
        // Pushes the flow content down by the same amount as the fixed chrome.
        paddingTop: previewing ? PREVIEW_BANNER_HEIGHT : 0,
      }}
    >
      <PreviewBanner />
      <ScrollToTop />
      <Ticker />
      <Navbar />
      {/* The one landmark per route — routed pages used to each declare their
          own <main>, which is what "read this page aloud" (Contact.tsx)
          targets via document.querySelector('main'). Owning it here instead
          means every route gets it (including Home, which never had one) and
          none of them can end up nesting a second <main> inside this one. */}
      <main id="a11y-page-content">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  )
}
