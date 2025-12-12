// src/pages/AdminSlot.jsx
import { useEffect, useState } from 'react'
import { getSlotConfig, updateSlotConfig } from '../api/apiClient.js'
import '../styles/SlotPage.css'
import { SYMBOLS } from '../config/slot.config.js'

export default function AdminSlotsPage() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const slotCfg = await getSlotConfig()
        if (slotCfg && slotCfg.content) {
          setConfig(slotCfg.content)
        } else {
          setConfig({
            reels: 5,
            rows: 3,
            paylines: 10,
            baseBets: [0.05, 0.1, 0.2, 0.3, 0.5],
            symbolWeights: SYMBOLS.reduce((acc, s) => {
              acc[s.id] = s.defaultWeight
              return acc
            }, {}),
            freeSpins: {
              enabled: true,
              triggerSymbol: 'crown',
              triggerCount: 3,
              spins: 10,
              multiplier: 2
            },
            bigWinMultipliers: {
              big: 15,
              mega: 30,
              ultra: 60
            }
          })
        }
      } catch (err) {
        console.error(err)
        setError('Fehler beim Laden der Slot-Konfiguration.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  function handleChange(field, value) {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }))
  }

  function handleBaseBetChange(index, value) {
    const num = Number(value)
    setConfig(prev => {
      const newBaseBets = [...prev.baseBets]
      newBaseBets[index] = isNaN(num) ? 0 : num
      return {
        ...prev,
        baseBets: newBaseBets
      }
    })
  }

  function handleSymbolWeightChange(symbolId, value) {
    const num = Number(value)
    setConfig(prev => ({
      ...prev,
      symbolWeights: {
        ...prev.symbolWeights,
        [symbolId]: isNaN(num) ? 0 : num
      }
    }))
  }

  function handleFreeSpinsChange(field, value) {
    setConfig(prev => ({
      ...prev,
      freeSpins: {
        ...prev.freeSpins,
        [field]: value
      }
    }))
  }

  function handleBigWinMultiplierChange(field, value) {
    const num = Number(value)
    setConfig(prev => ({
      ...prev,
      bigWinMultipliers: {
        ...prev.bigWinMultipliers,
        [field]: isNaN(num) ? 0 : num
      }
    }))
  }

  async function handleSave() {
    if (!config) return
    try {
      setSaving(true)
      setMessage('')
      setError('')
      await updateSlotConfig(config)
      setMessage('Konfiguration erfolgreich gespeichert.')
    } catch (err) {
      console.error(err)
      setError('Fehler beim Speichern der Konfiguration.')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !config) {
    return <p>Slot-Konfiguration wird geladen...</p>
  }

  return (
    <div className="slot-admin">
      <h1>Slot Admin</h1>

      {error && <p className="error">{error}</p>}
      {message && <p className="slot-message">{message}</p>}

      <section className="admin-section">
        <h2>Grundparameter</h2>
        <label>
          Walzen (Reels):
          <input
            type="number"
            value={config.reels}
            onChange={e => handleChange('reels', Number(e.target.value))}
          />
        </label>
        <label>
          Reihen (Rows):
          <input
            type="number"
            value={config.rows}
            onChange={e => handleChange('rows', Number(e.target.value))}
          />
        </label>
        <label>
          Gewinnlinien (aktuell):
          <input
            type="number"
            value={config.paylines}
            onChange={e => handleChange('paylines', Number(e.target.value))}
          />
        </label>
      </section>

      <section className="admin-section">
        <h2>Einsätze (Base Bets)</h2>
        {config.baseBets.map((bet, index) => (
          <label key={index}>
            Einsatz {index + 1}:
            <input
              type="number"
              step="0.01"
              value={bet}
              onChange={e => handleBaseBetChange(index, e.target.value)}
            />
          </label>
        ))}
      </section>

      <section className="admin-section">
        <h2>Symbol-Gewichte</h2>
        {SYMBOLS.map(sym => (
          <label key={sym.id}>
            {sym.label} {sym.displayName}:
            <input
              type="number"
              value={config.symbolWeights[sym.id] ?? sym.defaultWeight}
              onChange={e => handleSymbolWeightChange(sym.id, e.target.value)}
            />
          </label>
        ))}
      </section>

      <section className="admin-section">
        <h2>Free Spins</h2>
        <label>
          Free Spins aktiviert:
          <input
            type="checkbox"
            checked={config.freeSpins.enabled}
            onChange={e =>
              handleFreeSpinsChange('enabled', e.target.checked)
            }
          />
        </label>
        <label>
          Trigger-Symbol:
          <select
            value={config.freeSpins.triggerSymbol}
            onChange={e =>
              handleFreeSpinsChange('triggerSymbol', e.target.value)
            }
          >
            {SYMBOLS.map(sym => (
              <option key={sym.id} value={sym.id}>
                {sym.label} {sym.displayName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Anzahl benötigter Scatter:
          <input
            type="number"
            value={config.freeSpins.triggerCount}
            onChange={e =>
              handleFreeSpinsChange('triggerCount', Number(e.target.value))
            }
          />
        </label>
        <label>
          Anzahl Free Spins:
          <input
            type="number"
            value={config.freeSpins.spins}
            onChange={e =>
              handleFreeSpinsChange('spins', Number(e.target.value))
            }
          />
        </label>
        <label>
          Gewinn-Multiplikator während Free Spins:
          <input
            type="number"
            step="0.1"
            value={config.freeSpins.multiplier}
            onChange={e =>
              handleFreeSpinsChange('multiplier', Number(e.target.value))
            }
          />
        </label>
      </section>

      <section className="admin-section">
        <h2>Big-Win-Multiplikatoren</h2>
        <label>
          Big Win (x Einsatz):
          <input
            type="number"
            value={config.bigWinMultipliers.big}
            onChange={e =>
              handleBigWinMultiplierChange('big', e.target.value)
            }
          />
        </label>
        <label>
          Mega Win (x Einsatz):
          <input
            type="number"
            value={config.bigWinMultipliers.mega}
            onChange={e =>
              handleBigWinMultiplierChange('mega', e.target.value)
            }
          />
        </label>
        <label>
          Ultra Win (x Einsatz):
          <input
            type="number"
            value={config.bigWinMultipliers.ultra}
            onChange={e =>
              handleBigWinMultiplierChange('ultra', e.target.value)
            }
          />
        </label>
      </section>

      <button
        className="admin-save-btn"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Speichere...' : 'Speichern'}
      </button>
    </div>
  )
}
