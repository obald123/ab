import Hero from '../components/Hero'
import Products from '../components/Products'
import LoanCalculator from '../components/LoanCalculator'
import Services from '../components/Services'
import Campaign from '../components/Campaign'
import About from '../components/About'
import News from '../components/News'
import SocialFeed from '../components/SocialFeed'
import Contact from '../components/Contact'
import Branches from '../components/Branches'

/* The original one-pager, now the `/` route. Ticker, Navbar, Footer and
   the cookie banner live in PageShell so every route shares them. */
export default function Home() {
  return (
    <>
      <Hero />
      <Products />
      <LoanCalculator />
      <Services />
      <Campaign />
      <About />
      <Branches />
      <News />
      <SocialFeed />
      <Contact />
    </>
  )
}
