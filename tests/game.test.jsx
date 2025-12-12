// tests/game.test.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'

// API-Funktionen mocken
vi.mock('../src/api/apiClient.js', () => ({
  getCurrentUser: vi.fn(),
  getGameConfig: vi.fn(),
  updateUserBalance: vi.fn()
}))

import { getCurrentUser, getGameConfig, updateUserBalance } from '../src/api/apiClient.js'
import GamePage from '../src/pages/GamePage.jsx'

describe('GamePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('zeigt zuerst Laden und danach Spielerkarte und Spielregeln', async () => {
    getCurrentUser.mockResolvedValue({
      id: 'u1',
      name: 'Testspieler',
      balance: 100
    })
    getGameConfig.mockResolvedValue({
      gameCost: 10,
      winChance: 0.5,
      winMultiplier: 3
    })

    render(<GamePage />)

    // Ladeanzeige
    expect(
      screen.getByText(/Daten werden geladen/i)
    ).toBeInTheDocument()

    // Danach Inhalte
    await waitFor(() => {
      expect(screen.getByText('Spieler')).toBeInTheDocument()
    })

    expect(
      screen.getByText('Kosten pro Spiel: 10 CHF')
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Gewinnchance:/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Gewinnfaktor: x3/)
    ).toBeInTheDocument()
  })

  it('zeigt Hinweis, wenn kein User oder keine Config vorhanden ist', async () => {
    getCurrentUser.mockResolvedValue(null)
    getGameConfig.mockResolvedValue(null)

    render(<GamePage />)

    // Hinweistext vorhanden
    expect(
      await screen.findByText(/Fehlende Spieldaten\./i)
    ).toBeInTheDocument()

    // Kein Spielen-Button vorhanden
    expect(
      screen.queryByRole('button', { name: /spielen/i })
    ).not.toBeInTheDocument()
  })

  it('zeigt Fehlermeldung, wenn Kontostand kleiner als Spielkosten ist', async () => {
    getCurrentUser.mockResolvedValue({
      id: 'u1',
      name: 'Armer Spieler',
      balance: 5
    })
    getGameConfig.mockResolvedValue({
      gameCost: 10,
      winChance: 0.5,
      winMultiplier: 2
    })

    render(<GamePage />)

    const button = await screen.findByRole('button', { name: /spielen/i })
    const user = userEvent.setup()
    await user.click(button)

    // Kein API-Update
    expect(updateUserBalance).not.toHaveBeenCalled()

    // Fehlermeldung (wartet auf Render)
    expect(
      await screen.findByText(/Nicht genug Geld für dieses Spiel\./i)
    ).toBeInTheDocument()
  })

  it('berechnet Verlust korrekt und speichert neuen Kontostand', async () => {
    // erzwungene Niederlage
    vi.spyOn(Math, 'random').mockReturnValue(0.9)

    getCurrentUser.mockResolvedValue({
      id: 'u1',
      name: 'Verlierer',
      balance: 100
    })
    getGameConfig.mockResolvedValue({
      gameCost: 10,
      winChance: 0.5,
      winMultiplier: 2
    })

    updateUserBalance.mockResolvedValue({
      id: 'u1',
      name: 'Verlierer',
      balance: 90
    })

    render(<GamePage />)

    const button = await screen.findByRole('button', { name: /spielen/i })
    const user = userEvent.setup()
    await user.click(button)

    await waitFor(() => {
      expect(updateUserBalance).toHaveBeenCalledWith('u1', 90)
      expect(
        screen.getByText('Verloren: -10 CHF')
      ).toBeInTheDocument()
    })
  })

  it('berechnet Gewinn korrekt und speichert neuen Kontostand', async () => {
    // erzwungener Gewinn
    vi.spyOn(Math, 'random').mockReturnValue(0.1)

    getCurrentUser.mockResolvedValue({
      id: 'u1',
      name: 'Gewinner',
      balance: 100
    })
    getGameConfig.mockResolvedValue({
      gameCost: 10,
      winChance: 0.5,
      winMultiplier: 3
    })

    updateUserBalance.mockResolvedValue({
      id: 'u1',
      name: 'Gewinner',
      balance: 120
    })

    render(<GamePage />)

    const button = await screen.findByRole('button', { name: /spielen/i })
    const user = userEvent.setup()
    await user.click(button)

    await waitFor(() => {
      expect(updateUserBalance).toHaveBeenCalledWith('u1', 120)
      expect(
        screen.getByText('Gewonnen: +20 CHF')
      ).toBeInTheDocument()
    })
  })
})
