import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Ticker from '../Ticker'
import Navbar from '../Navbar'
import Footer from '../Footer'
import CookieConsent from '../CookieConsent'

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
export default function PageShell() {
  return (
    <div className="antialiased" style={{ background: '#ffffff', minHeight: '100vh' }}>
      <ScrollToTop />
      <Ticker />
      <Navbar />
      <Outlet />
      <Footer />
      <CookieConsent />
    </div>
  )
}
