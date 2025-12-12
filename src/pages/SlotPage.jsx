// src/pages/SlotPage.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getCurrentUser,
  getGameConfig,
  updateUserBalance,
  getSlotConfig
} from '../api/apiClient.js'
import '../styles/SlotPage.css'
import { SYMBOLS, PAYLINES, DEFAULT_SLOT_CONFIG } from '../config/slot.config.js'

// ---------- Geld-Helfer ----------

function roundToCents(amount) {
  return Math.round((Number(amount) + Number.EPSILON) * 100) / 100
}

function formatCurrency(amount) {
  return roundToCents(amount).toFixed(2)
}

// ---------- Slot-Logik ----------

function buildWeightedTable(symbolWeights) {
  const bag = []
  SYMBOLS.forEach(sym => {
    const weight = symbolWeights[sym.id] ?? sym.defaultWeight
    for (let i = 0; i < weight; i++) {
      bag.push(sym.id)
    }
  })
  return bag
}

function spinReel(weightedTable, rows) {
  const result = []
  for (let i = 0; i < rows; i++) {
    const idx = Math.floor(Math.random() * weightedTable.length)
    result.push(weightedTable[idx])
  }
  return result
}

function spinAllReels(config) {
  const { reels, rows, symbolWeights } = config
  const weightedTable = buildWeightedTable(symbolWeights)
  const reelsResult = []
  for (let i = 0; i < reels; i++) {
    reelsResult.push(spinReel(weightedTable, rows))
  }
  return reelsResult
}

function getSymbolById(id) {
  return SYMBOLS.find(s => s.id === id)
}

function calculateLineWin(lineSymbols, betPerLine) {
  const first = lineSymbols[0]
  if (!first) return 0

  let count = 1
  for (let i = 1; i < lineSymbols.length; i++) {
    if (lineSymbols[i] === first) {
      count++
    } else {
      break
    }
  }

  const symbol = getSymbolById(first)
  if (!symbol) return 0

  const payoutMulti = symbol.payouts[count]
  if (!payoutMulti) return 0

  const rawWin = betPerLine * payoutMulti
  return roundToCents(rawWin)
}

function calculateTotalWin(reelsResult, betPerLine, activePaylines) {
  let total = 0
  const wins = []

  activePaylines.forEach((line, index) => {
    const lineSymbols = reelsResult.map((reel, reelIndex) => {
      const rowIndex = line[reelIndex]
      return reel[rowIndex]
    })
    const winAmount = calculateLineWin(lineSymbols, betPerLine)
    if (winAmount > 0) {
      total += winAmount
      wins.push({
        lineIndex: index,
        symbols: lineSymbols,
        amount: winAmount
      })
    }
  })

  return { total: roundToCents(total), wins }
}

function findScatterCount(reelsResult, scatterSymbolId) {
  let count = 0
  reelsResult.forEach(reel => {
    reel.forEach(symbolId => {
      if (symbolId === scatterSymbolId) count++
    })
  })
  return count
}

// ---------- React-Komponente ----------

export default function SlotPage() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [gameConfig, setGameConfig] = useState(null)
  const [slotConfig, setSlotConfig] = useState(DEFAULT_SLOT_CONFIG)
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [selectedBetIndex, setSelectedBetIndex] = useState(0)
  const [reels, setReels] = useState([])
  const [lastWin, setLastWin] = useState(0)

  const [isSpinning, setIsSpinning] = useState(false)
  const [turbo, setTurbo] = useState(false)

  const [winOverlay, setWinOverlay] = useState(null)

  // Bonus-Spiel State
  const [bonusActive, setBonusActive] = useState(false)
  const [bonusBaseBet, setBonusBaseBet] = useState(0)
  const [bonusResult, setBonusResult] = useState(null)

  // für "jeder 4. Spin gewinnt ungefähr"
  const [spinCount, setSpinCount] = useState(0)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [u, cfg, slotCfgFromDb] = await Promise.all([
          getCurrentUser(),
          getGameConfig(),
          getSlotConfig()
        ])

        setUser(u)
        setGameConfig(cfg)

        if (slotCfgFromDb && slotCfgFromDb.content) {
          const dbCfg = slotCfgFromDb.content

          const mergedConfig = {
            reels: dbCfg.reels ?? DEFAULT_SLOT_CONFIG.reels,
            rows: dbCfg.rows ?? DEFAULT_SLOT_CONFIG.rows,
            paylines: dbCfg.paylines ?? DEFAULT_SLOT_CONFIG.paylines,
            baseBets: dbCfg.baseBets ?? DEFAULT_SLOT_CONFIG.baseBets,
            symbolWeights: dbCfg.symbolWeights ?? DEFAULT_SLOT_CONFIG.symbolWeights,
            bonusGame: {
              ...DEFAULT_SLOT_CONFIG.bonusGame,
              ...(dbCfg.bonusGame || {})
            },
            bigWinMultipliers: {
              ...DEFAULT_SLOT_CONFIG.bigWinMultipliers,
              ...(dbCfg.bigWinMultipliers || {})
            }
          }

          setSlotConfig(mergedConfig)
        } else {
          setSlotConfig(DEFAULT_SLOT_CONFIG)
        }

        const emptyReels = Array(DEFAULT_SLOT_CONFIG.reels).fill(
          Array(DEFAULT_SLOT_CONFIG.rows).fill(null)
        )
        setReels(emptyReels)
      } catch (err) {
        console.error(err)
        setError('Fehler beim Laden der Daten.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [message])

  function getActivePaylines() {
    const lineCount = Math.min(
      slotConfig.paylines ?? PAYLINES.length,
      PAYLINES.length
    )
    return PAYLINES.slice(0, lineCount)
  }

  function getBetPerLine() {
    const baseBets = slotConfig.baseBets ?? DEFAULT_SLOT_CONFIG.baseBets
    const raw = baseBets[selectedBetIndex] ?? baseBets[0]
    return roundToCents(raw)
  }

  async function handleSpin() {
    if (!user || !gameConfig) return
    if (isSpinning || bonusActive) return // während Bonus-Spiel nicht drehen

    try {
      setError('')
      setWinOverlay(null)
      setBonusResult(null)
      setIsSpinning(true)

      const activePaylines = getActivePaylines()
      const betPerLine = getBetPerLine()
      const rawTotalBet = betPerLine * activePaylines.length
      const totalBet = roundToCents(rawTotalBet)

      if (user.balance < totalBet) {
        setError('Nicht genug Guthaben für diesen Einsatz.')
        return
      }

      // lokaler Spin-Counter
      const nextSpinCount = spinCount + 1
      setSpinCount(nextSpinCount)

      // 1. normaler Spin
      let newReels = spinAllReels(slotConfig)
      let { total: baseWin } = calculateTotalWin(
        newReels,
        betPerLine,
        activePaylines
      )

      // 2. "mindestens jeder 4. Spin gewinnt":
      // Wenn bisher kein Gewinn und wir sind auf Spin 4, 8, 12, ... -> neu rollen bis Gewinn
      if (baseWin === 0 && nextSpinCount % 4 === 0) {
        let tries = 0
        while (baseWin === 0 && tries < 50) {
          newReels = spinAllReels(slotConfig)
          baseWin = calculateTotalWin(
            newReels,
            betPerLine,
            activePaylines
          ).total
          tries++
        }
      }

      setReels(newReels)

      let totalWin = baseWin

      // BONUS-GAME CHECK (mit Kronen)
      const bonusCfg = slotConfig.bonusGame ?? DEFAULT_SLOT_CONFIG.bonusGame
      let bonusTriggered = false
      if (bonusCfg.enabled) {
        const scatterCount = findScatterCount(
          newReels,
          bonusCfg.triggerSymbol
        )
        if (scatterCount >= bonusCfg.triggerCount) {
          bonusTriggered = true
          setBonusActive(true)
          setBonusBaseBet(totalBet)
          setMessage('Bonus-Spiel! Wähle eine Karte.')
        }
      }

      // Big/Mega/Ultra Win Overlay bestimmen
      const bigCfg =
        slotConfig.bigWinMultipliers ?? DEFAULT_SLOT_CONFIG.bigWinMultipliers
      const betBase = getBetPerLine()
      let overlayType = null

      if (totalWin >= betBase * (bigCfg.ultra ?? 50)) {
        overlayType = 'ultra'
      } else if (totalWin >= betBase * (bigCfg.mega ?? 25)) {
        overlayType = 'mega'
      } else if (totalWin >= betBase * (bigCfg.big ?? 12)) {
        overlayType = 'big'
      }

      totalWin = roundToCents(totalWin)
      setLastWin(totalWin)

      // Balance updaten: Einsatz abziehen + Liniengewinn addieren
      let newBalance = roundToCents(user.balance)
      newBalance = roundToCents(newBalance - totalBet + totalWin)
      const updatedUser = await updateUserBalance(null, newBalance)
      setUser(updatedUser)

      if (overlayType && totalWin > 0) {
        setWinOverlay({
          type: overlayType,
          amount: totalWin
        })
        setTimeout(() => setWinOverlay(null), 3000)
      }

      if (totalWin > 0) {
        setMessage(`Du gewinnst ${formatCurrency(totalWin)} CHF!`)
      } else if (!bonusTriggered) {
        setMessage('Leider keine Gewinnkombi.')
      }

      // Delay, damit man nicht spammen kann
      const delayMs = turbo ? 150 : 900
      await new Promise(resolve => setTimeout(resolve, delayMs))
    } catch (err) {
      console.error(err)
      setError('Fehler beim Drehen der Walzen.')
    } finally {
      setIsSpinning(false)
    }
  }

  async function handleBonusPick(multiplier) {
    if (!bonusActive || !user) return
    try {
      const amount = roundToCents(bonusBaseBet * multiplier)
      const newBalance = roundToCents(user.balance + amount)
      const updatedUser = await updateUserBalance(null, newBalance)
      setUser(updatedUser)
      setBonusResult({ multiplier, amount })
      setMessage(
        `Bonus-Gewinn: ${multiplier}x! Du erhältst ${formatCurrency(
          amount
        )} CHF.`
      )
    } catch (err) {
      console.error(err)
      setError('Fehler im Bonus-Spiel.')
    } finally {
      setBonusActive(false)
      setBonusBaseBet(0)
    }
  }

  if (loading) {
    return <p>Daten werden geladen...</p>
  }

  if (!user || !gameConfig) {
    return <p>Fehlende Spieldaten. Bitte ergänze Sie in der Admin-seite.</p>
  }

  const activePaylines = getActivePaylines()
  const betPerLine = getBetPerLine()
  const totalBet = roundToCents(betPerLine * activePaylines.length)
  const middleRowIndex = Math.floor((slotConfig.rows ?? 3) / 2)

  return (
    <div className="slot-page">
      {/* Fehler nur als Text, Slot bleibt sichtbar */}
      {error && <p className="error">{error}</p>}

      {/* TOP BAR */}
      <div className="slot-top-bar">
        <div className="slot-top-box">
          <div className="slot-top-label">BALANCE</div>
          <div className="slot-top-value">
            {formatCurrency(user.balance)} CHF
          </div>
        </div>

        <div className="slot-top-title">
          <h1>Fruit Slot</h1>
          <span>PLEASE PLACE YOUR BET</span>
        </div>

        <div className="slot-top-box">
          <div className="slot-top-label">LAST WIN</div>
          <div className="slot-top-value">
            {formatCurrency(lastWin)} CHF
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main className="slot-main">
        <div
          className={
            'slot-frame' +
            (isSpinning && !turbo ? ' slot-frame-spinning' : '')
          }
        >
          {/* LINES Badge */}
          <div className="slot-lines-badge">
            <span>{activePaylines.length}</span>
            <span>LINES</span>
          </div>

          {/* Reels */}
          <div
            className={
              'slot-reels' +
              (isSpinning && !turbo ? ' slot-reels-anim' : '')
            }
          >
            {reels.map((reel, reelIndex) => (
              <div key={reelIndex} className="slot-reel">
                {reel.map((symbolId, rowIndex) => {
                  const symbol = getSymbolById(symbolId)
                  const isMiddle = rowIndex === middleRowIndex
                  return (
                    <div
                      key={rowIndex}
                      className={
                        'slot-cell' + (isMiddle ? ' slot-cell-middle' : '')
                      }
                    >
                      <div className="slot-symbol">
                        {symbol ? symbol.label : ' '}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Mittlere Linie */}
          <div className="slot-middle-line" />

          {/* Seiten-Controls rechts */}
          <div className="slot-side-controls">
            <button
              type="button"
              className="slot-spin-circle"
              onClick={handleSpin}
              disabled={isSpinning || bonusActive}
            >
              <span className="slot-spin-label">
                {isSpinning ? 'SPIN...' : 'SPIN'}
              </span>
            </button>

            <button
              type="button"
              className={
                'slot-turbo-btn' + (turbo ? ' slot-turbo-btn-active' : '')
              }
              onClick={() => setTurbo(t => !t)}
            >
              TURBO
            </button>

            <div className="slot-coin-btn">💰</div>
          </div>

          {/* BIG / MEGA / ULTRA WIN Overlay */}
          {winOverlay && (
            <div className="slot-win-overlay">
              <div className="slot-win-text">
                {winOverlay.type === 'ultra'
                  ? 'ULTRA WIN!'
                  : winOverlay.type === 'mega'
                  ? 'MEGA WIN!'
                  : 'BIG WIN!'}{' '}
                {formatCurrency(winOverlay.amount)} CHF
              </div>
            </div>
          )}

          {/* BONUS-SPIEL OVERLAY */}
          {bonusActive && (
            <div className="slot-bonus-overlay">
              <div className="slot-bonus-card-container">
                <h2>Bonus-Spiel</h2>
                <p>Wähle eine Karte und erhalte einen Multiplikator!</p>
                <div className="slot-bonus-cards">
                  {(slotConfig.bonusGame?.multipliers ??
                    DEFAULT_SLOT_CONFIG.bonusGame.multipliers
                  ).map((m, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="slot-bonus-card"
                      onClick={() => handleBonusPick(m)}
                    >
                      ?
                    </button>
                  ))}
                </div>
                <p className="slot-bonus-info">
                  Mögliche Multiplikatoren:{" "}
                  {(slotConfig.bonusGame?.multipliers ??
                    DEFAULT_SLOT_CONFIG.bonusGame.multipliers
                  ).join('x, ')}x
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Untere Leiste */}
        <div className="slot-bottom-bar">
          <div className="slot-bottom-section">
            <div className="slot-bottom-label">BALANCE</div>
            <div className="slot-bottom-value">
              {formatCurrency(user.balance)} CHF
            </div>
          </div>

          <div className="slot-bottom-section slot-bottom-bets">
            <div className="slot-bottom-label">BET</div>
            <div className="slot-bet-buttons">
              {(slotConfig.baseBets ?? DEFAULT_SLOT_CONFIG.baseBets).map(
                (bet, index) => (
                  <button
                    key={index}
                    className={
                      'slot-bet-btn' +
                      (index === selectedBetIndex
                        ? ' slot-bet-btn-active'
                        : '')
                    }
                    onClick={() => setSelectedBetIndex(index)}
                    disabled={isSpinning || bonusActive}
                  >
                    <div className="slot-bet-value">
                      {formatCurrency(bet)} CHF
                    </div>
                    <div className="slot-bet-label">BET</div>
                  </button>
                )
              )}
            </div>
          </div>

          <div className="slot-bottom-section slot-lastwin">
            <div className="slot-bottom-label">TOTAL BET</div>
            <div className="slot-bottom-value">
              {formatCurrency(totalBet)} CHF
            </div>
            <button
              type="button"
              className="slot-paytable-btn"
              onClick={() => navigate('/slot/paytable')}
            >
              GEWINNTABELLE
            </button>
          </div>
        </div>

        {/* Nachricht */}
        {(message || bonusResult) && (
          <div className="slot-message-bar">
            {message}
          </div>
        )}
      </main>
    </div>
  )
}
