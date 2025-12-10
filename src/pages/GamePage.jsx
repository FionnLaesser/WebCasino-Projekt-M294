import { useEffect, useState } from 'react'
import {
  getCurrentUser,
  getGameConfig,
  updateUserBalance
} from '../api.js'
import UserInfo from '../components/UserInfo.jsx'
import RouletteWheel from '../components/RouletteWheel.jsx'

export default function GamePage() {
  const [user, setUser] = useState(null)
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastResult, setLastResult] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const [u, c] = await Promise.all([
          getCurrentUser(),
          getGameConfig()
        ])
        setUser(u)
        setConfig(c)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handlePlay() {
    if (!user || !config) return
    setError('')
    setLastResult(null)

    if (user.balance < config.gameCost) {
      setError('Nicht genug Geld fuer dieses Spiel.')
      return
    }

    setIsSpinning(true)

    // einfache "Simulation"
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
      setError(err.message)
    } finally {
      // kleine "Animation"
      setTimeout(() => setIsSpinning(false), 700)
    }
  }

  if (loading) return <p>Daten werden geladen...</p>

  return (
    <div className="page">
      {error && <p className="error">{error}</p>}

      <UserInfo user={user} />

      {config && (
        <section className="card">
          <h2>Spielregeln</h2>
          <p>Kosten pro Spiel: {config.gameCost} CHF</p>
          <p>Gewinnchance: {Math.round(config.winChance * 100)} %</p>
          <p>Gewinnfaktor: x{config.winMultiplier}</p>
        </section>
      )}

      <section className="card">
        <RouletteWheel lastResult={lastResult} isSpinning={isSpinning} />
        <button
          onClick={handlePlay}
          disabled={isSpinning || !user || !config}
        >
          Spielen
        </button>
      </section>
    </div>
  )
}
