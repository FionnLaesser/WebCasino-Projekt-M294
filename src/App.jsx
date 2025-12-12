// src/App.jsx
import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import GamePage from './pages/GamePage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import RoulettePage from './pages/RoulettePage.jsx'
import SlotPage from './pages/SlotPage.jsx'
import SlotPaytablePage from './pages/SlotPaytablePage.jsx'
import HomePage from './pages/HomePage.jsx'

export default function App() {
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);

  useEffect(() => {
  function checkSize() {
    const isFullscreen =
      window.innerWidth >= window.screen.width - 2 &&
      window.innerHeight >= window.screen.height - 2;

    // nur warnen, wenn NICHT Vollbild und Fenster wirklich klein ist  
    const isSmall =
      !isFullscreen &&
      (window.innerWidth < 1100 || window.innerHeight < 650);

    setShowFullscreenWarning(isSmall);
  }

  checkSize();
  window.addEventListener('resize', checkSize);

  return () => window.removeEventListener('resize', checkSize);
}, []);


  return (
    <>
      {showFullscreenWarning && (
        <div className="fullscreen-warning">
          🔍 Für die beste Spielerfahrung bitte im Vollbild-Modus und 100% nutzen!
        </div>
      )}

      <div className="app">
        <header className="app-header">
          <h1>Casino Projekt 294</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/roulette">Roulette Tisch</Link>
            <Link to="/slot">Slot</Link>
            <Link to="/admin-slot">Admin Slot</Link>
            <Link to="/admin">Admin</Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin-slot" element={<GamePage />} />
            <Route path="/roulette" element={<RoulettePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/slot" element={<SlotPage />} />
            <Route path="/slot/paytable" element={<SlotPaytablePage />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
