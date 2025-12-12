import { useEffect, useState } from 'react'
import {
  getCurrentUser,
  getGameConfig,
  updateUserBalance,
  updateGameConfig,
  createDemoUser,
  deleteDemoUser,
  createDefaultConfig
} from '../api.js'
export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [config, setConfig] = useState(null)
  const [form, setForm] = useState({
    balance: '',
    gameCost: '',
    winChance: '',
    winMultiplier: ''
  })
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const u = await getCurrentUser().catch(() => null)
        const c = await getGameConfig().catch(() => null)
        setUser(u)
        setConfig(c)
        if (u && c) {
          setForm({
            balance: u.balance,
            gameCost: c.gameCost,
            winChance: c.winChance,
            winMultiplier: c.winMultiplier
          })
        }
      } catch (err) {
        setError(err.message)
      }
    }
    load()
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function validate() {
    const balance = Number(form.balance)
    const gameCost = Number(form.gameCost)
    const winChance = Number(form.winChance)
    const winMultiplier = Number(form.winMultiplier)

    if ([balance, gameCost, winChance, winMultiplier].some(n => isNaN(n))) {
      return 'Alle Felder müssen Zahlen sein.'
    }
    if (balance < 0 || gameCost <= 0) {
      return 'Balance darf nicht negativ sein und Kosten müssen > 0 sein.'
    }
    if (winChance <= 0 || winChance >= 1) {
      return 'Gewinnchance muss zwischen 0 und 1 liegen (z.B. 0.5).'
    }
    if (winMultiplier <= 1) {
      return 'Gewinnfaktor muss grösser als 1 sein.'
    }
    return ''
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setInfo('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      const balance = Number(form.balance)
      const gameCost = Number(form.gameCost)
      const winChance = Number(form.winChance)
      const winMultiplier = Number(form.winMultiplier)

      if (user) {
        const updatedUser = await updateUserBalance(user.id, balance)
        setUser(updatedUser)
      }

      if (config) {
        const updatedConfig = await updateGameConfig({
          ...config,
          gameCost,
          winChance,
          winMultiplier
        })
        setConfig(updatedConfig)
      }

      setInfo('Einstellungen gespeichert.')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleCreateDemo() {
    setError('')
    setInfo('')
    try {
      const [u, c] = await Promise.all([
        createDemoUser(),
        createDefaultConfig()
      ])
      setUser(u)
      setConfig(c)
      setForm({
        balance: u.balance,
        gameCost: c.gameCost,
        winChance: c.winChance,
        winMultiplier: c.winMultiplier
      })
      setInfo('Demo User & Default Config angelegt.')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeleteUser() {
    setError('')
    setInfo('')
    try {
      await deleteDemoUser()
      setUser(null)
      setInfo('Demo User gelöscht.')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <section className="card">
        <h2>Admin</h2>
        {error && <p className="error">{error}</p>}
        {info && <p className="info">{info}</p>}

        {!user || !config ? (
          <div className="inline-buttons">
            <p>Noch keine Daten gefunden.</p>
            <button onClick={handleCreateDemo}>Demo Daten anlegen</button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="form">
            <div className="form-row">
              <label>Spieler:</label>
              <input type="text" value={user.name} disabled className="readonly-input"/>
              
            </div>
            <div className="form-row">
              <label>Kontostand (CHF):</label>
              <input
                type="number"
                name="balance"
                value={form.balance}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label>Kosten pro Spiel (CHF):</label>
              <input
                type="number"
                name="gameCost"
                value={form.gameCost}
                onChange={handleChange}
                min="1"
              />
            </div>
            <div className="form-row">
              <label>Gewinnchance (0 - 1):</label>
              <input
                type="number"
                step="0.01"
                name="winChance"
                value={form.winChance}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label>Gewinnfaktor:</label>
              <input
                type="number"
                step="0.1"
                name="winMultiplier"
                value={form.winMultiplier}
                onChange={handleChange}
              />
            </div>

            <div className="inline-buttons">
              <button type="submit">Speichern</button>
              <button type="button" onClick={handleDeleteUser}>
                Demo User löschen
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
