import Ticker from './components/Ticker'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Products from './components/Products'
import Services from './components/Services'
import Campaign from './components/Campaign'
import About from './components/About'
import News from './components/News'
import Contact from './components/Contact'
import Branches from './components/Branches'

export default function App() {
  return (
    <div className="antialiased" style={{ background: '#ffffff' }}>
      <Ticker />
      <Navbar />
      <Hero />
      <Products />
      <Services />
      <Campaign />
      <About />
      <Branches />
      <News />
      <Contact />
    </div>
  )
}
