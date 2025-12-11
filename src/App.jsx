import { Routes, Route, Link } from 'react-router-dom'
import GamePage from './pages/GamePage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import RoulettePage from './pages/RoulettePage.jsx'

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Simple Roulette</h1>
        <nav>
          <Link to="/">Slot</Link>
          <Link to="/roulette">Roulette Tisch</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/roulette" element={<RoulettePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  )
}
