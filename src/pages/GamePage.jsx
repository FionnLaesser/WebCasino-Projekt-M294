import { useEffect, useState, useRef } from 'react'
import { getCurrentUser, getGameConfig, updateUserBalance } from '../api.js'
import UserInfo from '../components/UserInfo.jsx'
import RouletteWheel from '../components/RouletteWheel.jsx'

export default function GamePage() {
  const [user, setUser] = useState(null)
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastResult, setLastResult] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)

  const spinTimeoutRef = useRef(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')
        const [u, c] = await Promise.all([getCurrentUser(), getGameConfig()])
        setUser(u)
        setConfig(c)
      } catch (err) {
        setError(err?.message ?? 'Unbekannter Fehler')
      } finally {
        setLoading(false)
      }
    }

    load()

    return () => {
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
    }
  }, [])

  async function handlePlay() {
    if (!user || !config || isSpinning) return

    setError('')
    setLastResult(null)

    if (user.balance < config.gameCost) {
      setError('Nicht genug Geld für dieses Spiel.')
      return
    }

    setIsSpinning(true)

    const didWin = Math.random() < config.winChance
    const cost = config.gameCost
    const winAmount = cost * config.winMultiplier

    let newBalance = user.balance - cost
    let result

    if (didWin) {
      newBalance += winAmount
      result = { type: 'win', amount: winAmount - cost }
    } else {
      result = { type: 'lose', amount: cost }
    }

    try {
      const updatedUser = await updateUserBalance(user.id, newBalance)
      setUser(updatedUser)
      setLastResult(result)
    } catch (err) {
      setError(err?.message ?? 'Unbekannter Fehler')
    } finally {
      spinTimeoutRef.current = setTimeout(() => setIsSpinning(false), 700)
    }
  }

  if (loading) return <p>Daten werden geladen...</p>

  if (!user || !config) {
    return <p>Fehlende Spieldaten. Bitte ergänze Sie in der Admin-seite.</p>
  }

  return (
    <div className="page">
      {error && <p className="error">{error}</p>}

      <UserInfo user={user} />

      <section className="card">
        <h2>Spielregeln</h2>
        <p>Kosten pro Spiel: {config.gameCost} CHF</p>
        <p>Gewinnchance: {Math.round(config.winChance * 100)} %</p>
        <p>Gewinnfaktor: x{config.winMultiplier}</p>
      </section>

      <section className="card">
        <RouletteWheel lastResult={lastResult} isSpinning={isSpinning} />
        <button onClick={handlePlay} disabled={isSpinning}>
          Spielen
        </button>
      </section>
    </div>
  )
}
