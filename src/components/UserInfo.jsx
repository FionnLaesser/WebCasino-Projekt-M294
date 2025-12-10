export default function UserInfo({ user }) {
  if (!user) return null
  return (
    <section className="card">
      <h2>Spieler</h2>
      <p>Name: <strong>{user.name}</strong></p>
      <p>Kontostand: <strong>{user.balance} CHF</strong></p>
    </section>
  )
}
