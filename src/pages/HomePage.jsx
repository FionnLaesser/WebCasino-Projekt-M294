import rouletteImg from '../assets/images/home/home-roulette-preview.png'
import slotImg from '../assets/images/home/home-slot-preview.png'
import paytableImg from '../assets/images/home/home-paytable-preview.png'
import adminSlotImg from '../assets/images/home/home-admin-slot-preview.png'
import adminImg from '../assets/images/home/home-admin-preview.png'

export default function HomePage() {
  return (
    <div className="page">

      <section className="card">
        <h2>Willkommen</h2>
        <p className="fullscreen-hint">
          🔍 Hinweis: Bitte im <b>Vollbildmodus</b> anschauen, damit alle Elemente korrekt
          dargestellt werden.
        </p>
        <p>
          Hallo 👋 Dies ist das <b>Casino Projekt 294</b>.
          Auf dieser Seite findest du eine kurze Erklärung zu jedem Spiel
          und jedem Bereich der Anwendung.
        </p>
      </section>

      <section className="card">
        <h2>Roulette Tisch</h2>
        <img src={rouletteImg} alt="Roulette Tisch" className="home-img" />
        <p>
          Am <b>Roulette-Tisch</b> kannst du einzelne Zahlen anklicken und so Einsätze setzen.
          Mit <b>SPIN</b> wird eine Zufallszahl gezogen, und dein Gewinn oder Verlust
          wird direkt mit deinem Kontostand verrechnet.
          Im Feld <b>„Einsatz pro Zahl/Klick“</b> kannst du einstellen,
          wie viel ein Klick auf die jeweilige Zahl setzt.
        </p>
      </section>

      <section className="card">
        <h2>Slot</h2>
        <img src={slotImg} alt="Slot Spiel" className="home-img" />
        <p>
          Der <b>Slot</b> verfügt über mehrere Walzen mit festen Gewinnlinien.
          Deine <b>Balance</b> zeigt dein aktuelles Guthaben, <b>Last Win</b> den letzten Gewinn.
          Du wählst deinen Einsatz, startest mit <b>SPIN</b> und kannst mit dem
          <b>Turbo-Modus</b> die Animation beschleunigen.
          Unter <b>Gewinntabelle</b> kannst du die Gewinne sehen.
        </p>
      </section>

      <section className="card">
        <h2>Gewinntabelle</h2>
        <img src={paytableImg} alt="Gewinntabelle" className="home-img" />
        <p>
          In der <b>Gewinntabelle</b> siehst du, welche Symbole wie viel auszahlen.
          Die Multiplikatoren beziehen sich immer auf den Einsatz pro Linie.
        </p>
      </section>

      <section className="card">
        <h2>Admin Slot</h2>
        <img src={adminSlotImg} alt="Admin Slot" className="home-img" />
        <p>
          Im <b>Admin Slot</b> kannst du Einstellungen für den Slot testen oder
          Demo-Werte verwenden, um das Verhalten des Spiels zu prüfen.
        </p>
      </section>

      <section className="card">
        <h2>Admin</h2>
        <img src={adminImg} alt="Admin Bereich" className="home-img" />
        <p>
          Der <b>Admin-Bereich</b> erlaubt das Ändern von Spielregeln wie
          Kontostand, Spielkosten, Gewinnchance und Gewinnfaktor.
          Die Spielkosten, Gewinnchance und Gewinnfaktor beziehen sich nur auf den
          Admin Slot. Ungültige Eingaben werden rot markiert.
        </p>
      </section>

    </div>
  )
}
