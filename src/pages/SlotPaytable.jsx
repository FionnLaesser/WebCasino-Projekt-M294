// src/pages/SlotPaytable.jsx
import { Link } from 'react-router-dom'
import { SYMBOLS, PAYLINES } from '../slotConfig.js'
import '../styles/SlotPage.css'

export default function SlotPaytable() {
  return (
    <div className="slot-page slot-paytable-page">
      <div className="slot-paytable-card">
        <h1>Fruit Slot – Gewinntabelle</h1>
        <p className="slot-paytable-text">
          Alle Gewinne sind das Vielfache deines Einsatzes pro Linie.
        </p>

        <table className="slot-paytable-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>3 in Linie</th>
              <th>4 in Linie</th>
              <th>5 in Linie</th>
            </tr>
          </thead>
          <tbody>
            {SYMBOLS.map(sym => (
              <tr key={sym.id}>
                <td>
                  <span className="symbol-icon">{sym.label}</span>
                  <span>{sym.displayName}</span>
                </td>
                <td>{sym.payouts[3] ? `${sym.payouts[3]}x` : '-'}</td>
                <td>{sym.payouts[4] ? `${sym.payouts[4]}x` : '-'}</td>
                <td>{sym.payouts[5] ? `${sym.payouts[5]}x` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="slot-paytable-text">
          Aktuell sind <strong>{PAYLINES.length}</strong> Gewinnlinien definiert.
          Gewinne zählen von links nach rechts.
        </p>

        <Link to="/slot" className="slot-paytable-back">
          ← Zurück zum Slot
        </Link>
      </div>
    </div>
  )
}
