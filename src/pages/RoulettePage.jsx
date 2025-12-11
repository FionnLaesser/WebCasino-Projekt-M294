import { useEffect, useState } from 'react'
import {
  getCurrentUser,
  getGameConfig,
  updateUserBalance
} from '../api.js'
import UserInfo from '../components/UserInfo.jsx'
import RouletteWheel from '../components/RouletteWheel.jsx'

// rote Zahlen im klassischen Roulette
const RED_NUMBERS = new Set([
  1, 3, 5, 7, 9,
  12, 14, 16, 18,
  19, 21, 23, 25, 27,
  30, 32, 34, 36
])

function getColorForNumber(n) {
  if (n === 0) return 'green'
  return RED_NUMBERS.has(n) ? 'red' : 'black'
}

// typische 3er-Reihen auf dem Tisch
const topRow = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]
const middleRow = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35]
const bottomRow = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]

export default function RoulettePage() {
  const [user, setUser] = useState(null)
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedNumbers, setSelectedNumbers] = useState([])
  const [lastResult, setLastResult] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [rolledNumber, setRolledNumber] = useState(null)

  // User + Config laden (wie in GamePage)
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [u, cfg] = await Promise.all([
          getCurrentUser(),
          getGameConfig()
        ])
        setUser(u)
        setConfig(cfg)
      } catch (err) {
        setError(err.message || 'Fehler beim Laden von User/Config')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  function toggleNumber(n) {
    setSelectedNumbers(prev =>
      prev.includes(n)
        ? prev.filter(x => x !== n)
        : [...prev, n]
    )
  }

  function clearSelection() {
    setSelectedNumbers([])
  }

  async function handlePlay() {
    if (!user) return;

    if (selectedNumbers.length === 0) {
      setError("Waehle mindestens eine Zahl.");
      return;
    }

    const totalCost = selectedNumbers.length * 1; // 1 CHF pro Zahl

    if (user.balance < totalCost) {
      setError("Nicht genug Guthaben.");
      return;
    }

    setError("");
    setIsSpinning(true);
    setLastResult(null);
    setRolledNumber(null);

    const spinDuration = 1500;

    setTimeout(async () => {
      const rolled = Math.floor(Math.random() * 37);
      setRolledNumber(rolled);

      const hit = selectedNumbers.includes(rolled);

      let newBalance = user.balance - totalCost;
      let result;

      if (hit) {
        const winAmount = 32;       // Gewinn für richtige Zahl
        newBalance += winAmount;

        result = {
          type: "win",
          amount: winAmount
        };
      } else {
        result = {
          type: "lose",
          amount: totalCost
        };
      }

      try {
        const updatedUser = await updateUserBalance(user.id, newBalance);
        setUser(updatedUser);
        setLastResult(result);
      } catch (err) {
        setError(err.message || "Kontostand konnte nicht aktualisiert werden.");
      } finally {
        setIsSpinning(false);
      }
    }, spinDuration);
  }


  if (loading) return <p>Daten werden geladen...</p>

  return (
    <div className="page">
      {error && <p className="error">{error}</p>}

      <UserInfo user={user} />

      {config && (
        <section className="card">
          <h2>Spiel-Einstellungen</h2>
          <p>Spielkosten: <strong> 1 CHF </strong> pro Zahl</p>
          <p>Gewinn-Multiplikator: <strong>32x</strong></p>
          <p>
            Du gewinnst die Runde, wenn die gezogene Zahl in deinen ausgewaehlten Zahlen ist.
          </p>
        </section>
      )}

      <section className="card">
        <h2>Roulette Tisch</h2>
        <p>Waehle die Felder, auf die du wetten moechtest.</p>

        <div className="roulette-layout">
          {/* 0 links in Gruen */}
          <div className="roulette-zero">
            <button
              className={
                'roulette-zero-field ' +
                (selectedNumbers.includes(0) ? 'selected' : '')
              }
              onClick={() => toggleNumber(0)}
            >
              0
            </button>
          </div>

          {/* 1–36 im Raster */}
          <div className="roulette-grid">
            {[topRow, middleRow, bottomRow].map((row, rowIdx) => (
              <div key={rowIdx} className="roulette-row">
                {row.map(n => {
                  const color = getColorForNumber(n)
                  const isSelected = selectedNumbers.includes(n)
                  return (
                    <button
                      key={n}
                      className={
                        `roulette-field ${color}` +
                        (isSelected ? ' selected' : '')
                      }
                      onClick={() => toggleNumber(n)}
                    >
                      {n}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="roulette-selection-info">
          <p>
            Ausgewaehlte Zahlen:{' '}
            {selectedNumbers.length === 0
              ? 'keine'
              : selectedNumbers
                .slice()
                .sort((a, b) => a - b)
                .join(', ')}
          </p>

          <button onClick={clearSelection}>
            Auswahl loeschen
          </button>
        </div>

        <div className="roulette-play-area">
          <RouletteWheel lastResult={lastResult} isSpinning={isSpinning} />

          {rolledNumber !== null && (
            <p className="rolled-number">
              Gefallene Zahl: <strong>{rolledNumber}</strong>{' '}
              (<span className={getColorForNumber(rolledNumber)}>
                {rolledNumber === 0
                  ? 'Gruen'
                  : getColorForNumber(rolledNumber) === 'red'
                    ? 'Rot'
                    : 'Schwarz'}
              </span>)
            </p>
          )}

          <button
            onClick={handlePlay}
            disabled={isSpinning || !user || !config}
          >
            Spielen
          </button>
        </div>
      </section>
    </div>
  )
}
