import { useEffect, useState } from 'react'
import { getCurrentUser, getGameConfig, updateUserBalance } from '../api.js'
import '../styles/RoulettePage.css'

// Geld-Helfer
function roundToCents(amount) {
  return Math.round((Number(amount) + Number.EPSILON) * 100) / 100
}

function formatCurrency(amount) {
  return roundToCents(amount).toFixed(2)
}

// Roulette-Zahlen inkl. Farbe
const ROULETTE_NUMBERS = [
  { value: 0, color: 'green' },
  { value: 1, color: 'red' },
  { value: 2, color: 'black' },
  { value: 3, color: 'red' },
  { value: 4, color: 'black' },
  { value: 5, color: 'red' },
  { value: 6, color: 'black' },
  { value: 7, color: 'red' },
  { value: 8, color: 'black' },
  { value: 9, color: 'red' },
  { value: 10, color: 'black' },
  { value: 11, color: 'black' },
  { value: 12, color: 'red' },
  { value: 13, color: 'black' },
  { value: 14, color: 'red' },
  { value: 15, color: 'black' },
  { value: 16, color: 'red' },
  { value: 17, color: 'black' },
  { value: 18, color: 'red' },
  { value: 19, color: 'red' },
  { value: 20, color: 'black' },
  { value: 21, color: 'red' },
  { value: 22, color: 'black' },
  { value: 23, color: 'red' },
  { value: 24, color: 'black' },
  { value: 25, color: 'red' },
  { value: 26, color: 'black' },
  { value: 27, color: 'red' },
  { value: 28, color: 'black' },
  { value: 29, color: 'black' },
  { value: 30, color: 'red' },
  { value: 31, color: 'black' },
  { value: 32, color: 'red' },
  { value: 33, color: 'black' },
  { value: 34, color: 'red' },
  { value: 35, color: 'black' },
  { value: 36, color: 'red' }
]

// Hilfsfunktion: Board in 3 Reihen (klassisches Layout)
function getBoardRows() {
  const numbers = ROULETTE_NUMBERS.filter(n => n.value !== 0)
  const rows = [[], [], []]
  numbers.forEach((n, idx) => {
    const rowIndex = idx % 3
    rows[rowIndex].push(n)
  })
  return rows
}

export default function RoulettePage() {
  const [user, setUser] = useState(null)
  const [gameConfig, setGameConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [betPerClick, setBetPerClick] = useState(0.10) // wie viel pro Klick / Chip
  const [bets, setBets] = useState({}) // { zahl: einsatzInCHF }
  const [isSpinning, setIsSpinning] = useState(false)

  const [lastResult, setLastResult] = useState(null) // { value, color }
  const [lastWin, setLastWin] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [u, cfg] = await Promise.all([
          getCurrentUser(),
          getGameConfig()
        ])
        setUser(u)
        setGameConfig(cfg)
      } catch (err) {
        console.error(err)
        setError('Fehler beim Laden der Daten.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(''), 3000)
    return () => clearTimeout(t)
  }, [message])

  function handleBetPerClickChange(e) {
    const value = Number(e.target.value)
    if (isNaN(value) || value < 0) return
    setBetPerClick(roundToCents(value))
  }

  function handleNumberClick(numberValue) {
    if (isSpinning) return
    const amount = betPerClick
    if (amount <= 0) return

    setBets(prev => {
      const prevAmount = prev[numberValue] || 0
      const newAmount = roundToCents(prevAmount + amount)
      return {
        ...prev,
        [numberValue]: newAmount
      }
    })
  }

  function handleClearBets() {
    if (isSpinning) return
    setBets({})
    setMessage('Sämtliche Einsätze wurden gelöscht.')
  }

  function getTotalBet() {
    return roundToCents(
      Object.values(bets).reduce((sum, val) => sum + val, 0)
    )
  }

  async function handleSpin() {
    if (!user || !gameConfig) return
    if (isSpinning) return

    const totalBet = getTotalBet()
    if (totalBet <= 0) {
      setError('Bitte platziere zuerst Einsätze.')
      return
    }

    if (user.balance < totalBet) {
      setError('Nicht genug Guthaben für diesen Einsatz.')
      return
    }

    try {
      setError('')
      setMessage('')
      setIsSpinning(true)
      setLastWin(0)

      // Einsätze abbuchen
      let balance = roundToCents(user.balance - totalBet)

      // "Drehen": Zufallszahl 0–36
      const resultIndex = Math.floor(Math.random() * ROULETTE_NUMBERS.length)
      const result = ROULETTE_NUMBERS[resultIndex]
      setLastResult(result)

      // 32:1 Auszahlung für Treffer auf Zahl
      let winAmount = 0
      const betOnNumber = bets[result.value] || 0
      if (betOnNumber > 0) {
        winAmount = roundToCents(betOnNumber * 32)
      }

      balance = roundToCents(balance + winAmount)
      const updatedUser = await updateUserBalance(null, balance)
      setUser(updatedUser)

      setLastWin(winAmount)

      if (winAmount > 0) {
        setMessage(
          `Treffer! ${result.value} (${result.color.toUpperCase()}) – Gewinn: ${formatCurrency(
            winAmount
          )} CHF`
        )
      } else {
        setMessage(
          `Keine Treffer. Gefallen ist: ${result.value} (${result.color.toUpperCase()}).`
        )
      }

      // Einsätze NICHT automatisch löschen -> Spieler kann sie stehen lassen
    } catch (err) {
      console.error(err)
      setError('Fehler beim Spin.')
    } finally {
      // kleines Delay für “Animation-Gefühl”
      setTimeout(() => {
        setIsSpinning(false)
      }, 600)
    }
  }

  if (loading) {
    return <p>Daten werden geladen...</p>
  }

  if (!user || !gameConfig) {
    return <p>Fehlende Spieldaten. Bitte ergänze Sie in der Admin-seite.</p>
  }

  const totalBet = getTotalBet()
  const boardRows = getBoardRows()

  return (
    <div className="roulette-page">
      {error && <p className="error">{error}</p>}

      <header className="roulette-header">
        <div className="roulette-info-box">
          <div className="roulette-label">BALANCE</div>
          <div className="roulette-value">
            {formatCurrency(user.balance)} CHF
          </div>
        </div>
        <h1>Simple Roulette</h1>
        <div className="roulette-info-box">
          <div className="roulette-label">LETZTER GEWINN</div>
          <div className="roulette-value">
            {formatCurrency(lastWin)} CHF
          </div>
        </div>
      </header>

      <main className="roulette-main">
        {/* Einsatz pro Zahl / Klick */}
        <section className="roulette-controls">
          <div className="roulette-bet-per-click">
            <label>
              Einsatz pro Zahl / Klick:
              <input
                type="number"
                step="0.05"
                min="0"
                value={betPerClick}
                onChange={handleBetPerClickChange}
                disabled={isSpinning}
              />
              <span>CHF</span>
            </label>
          </div>

          <div className="roulette-summary">
            <div>
              <span className="roulette-label">Gesamt-Einsatz:</span>{' '}
              <span className="roulette-value">
                {formatCurrency(totalBet)} CHF
              </span>
            </div>
            {lastResult && (
              <div className="roulette-last-result">
                Letzte Zahl:{' '}
                <span className={`roulette-num ${lastResult.color}`}>
                  {lastResult.value}
                </span>{' '}
                ({lastResult.color.toUpperCase()})
              </div>
            )}
          </div>

          <div className="roulette-buttons">
            <button
              type="button"
              className="roulette-spin-btn"
              onClick={handleSpin}
              disabled={isSpinning || totalBet <= 0}
            >
              {isSpinning ? 'Dreht...' : 'SPIN'}
            </button>
            <button
              type="button"
              className="roulette-clear-btn"
              onClick={handleClearBets}
              disabled={isSpinning}
            >
              Einsätze löschen
            </button>
          </div>
        </section>

        {/* Roulette-Feld */}
        <section className="roulette-table">
          {/* 0-Feld separat */}
          <div className="roulette-zero-row">
            <button
              type="button"
              className={`roulette-cell zero ${
                bets[0] > 0 ? 'has-bet' : ''
              }`}
              onClick={() => handleNumberClick(0)}
              disabled={isSpinning}
            >
              <span className="roulette-num-text">0</span>
              {bets[0] > 0 && (
                <span className="roulette-chip">
                  {formatCurrency(bets[0])}
                </span>
              )}
            </button>
          </div>

          {/* 1–36 in klassischer 3er-Grid-Anordnung */}
          <div className="roulette-grid">
            {boardRows.map((row, rowIndex) => (
              <div key={rowIndex} className="roulette-row">
                {row.map(num => (
                  <button
                    key={num.value}
                    type="button"
                    className={`roulette-cell ${num.color} ${
                      bets[num.value] > 0 ? 'has-bet' : ''
                    }`}
                    onClick={() => handleNumberClick(num.value)}
                    disabled={isSpinning}
                  >
                    <span className="roulette-num-text">
                      {num.value}
                    </span>
                    {bets[num.value] > 0 && (
                      <span className="roulette-chip">
                        {formatCurrency(bets[num.value])}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </section>

        {message && <div className="roulette-message">{message}</div>}
      </main>
    </div>
  )
}
