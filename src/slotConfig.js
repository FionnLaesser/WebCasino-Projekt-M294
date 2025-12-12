// src/slotConfig.js
// Spielerfreundlich, viele Gewinne & Bonus-Spiel statt Free Spins

export const SYMBOLS = [
  {
    id: 'lemon',
    label: '🍋',
    displayName: 'Zitrone',
    payouts: { 3: 2, 4: 6, 5: 14 }, // x Einsatz pro Linie
    defaultWeight: 15
  },
  {
    id: 'orange',
    label: '🟠',
    displayName: 'Orange',
    payouts: { 3: 2, 4: 6, 5: 14 },
    defaultWeight: 15
  },
  {
    id: 'cherry',
    label: '🍒',
    displayName: 'Kirsche',
    payouts: { 3: 3, 4: 8, 5: 18 },
    defaultWeight: 14
  },
  {
    id: 'plum',
    label: '🟣',
    displayName: 'Pflaume',
    payouts: { 3: 3, 4: 9, 5: 20 },
    defaultWeight: 13
  },
  {
    id: 'grapes',
    label: '🫐',
    displayName: 'Trauben',
    payouts: { 3: 4, 4: 10, 5: 24 },
    defaultWeight: 10
  },
  {
    id: 'watermelon',
    label: '🍉',
    displayName: 'Wassermelone',
    payouts: { 3: 4, 4: 11, 5: 26 },
    defaultWeight: 9
  },
  {
    id: 'bell',
    label: '🔔',
    displayName: 'Glocke',
    payouts: { 3: 8, 4: 20, 5: 45 },
    defaultWeight: 5
  },
  {
    id: 'seven',
    label: '7️⃣',
    displayName: 'Sieben',
    payouts: { 3: 12, 4: 28, 5: 70 },
    defaultWeight: 4
  },
  {
    id: 'crown',
    label: '👑',
    displayName: 'Krone (Bonus-Scatter)',
    payouts: { 3: 3, 4: 8, 5: 25 },
    defaultWeight: 4
  }
]

// Gewinnlinien (Index der Reihe 0=oben,1=mitte,2=unten)
export const PAYLINES = [
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2],
  [0, 1, 2, 1, 0],
  [2, 1, 0, 1, 2],
  [0, 0, 1, 2, 2],
  [2, 2, 1, 0, 0],
  [1, 0, 0, 0, 1],
  [1, 2, 2, 2, 1],
  [0, 1, 1, 1, 2]
]

// Standard-Config mit Bonus-Spiel
export const DEFAULT_SLOT_CONFIG = {
  reels: 5,
  rows: 3,
  paylines: PAYLINES.length,

  baseBets: [0.05, 0.10, 0.20, 0.30, 0.50],

  symbolWeights: SYMBOLS.reduce((acc, s) => {
    acc[s.id] = s.defaultWeight
    return acc
  }, {}),

  // Bonus-Game statt Free Spins
  bonusGame: {
    enabled: true,
    triggerSymbol: 'crown',
    triggerCount: 3,       // z.B. 3 Kronen starten das Bonus-Spiel
    multipliers: [25, 50, 100]
  },

  bigWinMultipliers: {
    big: 12,
    mega: 25,
    ultra: 50
  }
}
