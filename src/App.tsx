import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PageShell from './components/page/PageShell'
import Home from './pages/Home'
import WhoWeAre from './pages/WhoWeAre'
import Careers from './pages/Careers'
import Tenders from './pages/Tenders'
import Articles from './pages/Articles'
import NewsPage from './pages/NewsPage'
import Forms from './pages/Forms'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageShell />}>
          <Route index element={<Home />} />
          <Route path="who-we-are" element={<WhoWeAre />} />
          <Route path="careers" element={<Careers />} />
          <Route path="tenders" element={<Tenders />} />
          <Route path="media/news" element={<NewsPage />} />
          <Route path="media/articles" element={<Articles />} />
          <Route path="forms" element={<Forms />} />
          {/* Convenience aliases so shorter URLs still resolve */}
          <Route path="news" element={<Navigate to="/media/news" replace />} />
          <Route path="articles" element={<Navigate to="/media/articles" replace />} />
          <Route path="about" element={<Navigate to="/who-we-are" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
