export default function RouletteWheel({ lastResult, isSpinning }) {
  return (
    <div className="roulette">
      <div className={`roulette-wheel ${isSpinning ? 'spin' : ''}`}>
        <div className="roulette-inner">R</div>
      </div>
      {lastResult && (
        <p className={`result ${lastResult.type}`}>
          {lastResult.type === 'win'
            ? `Gewonnen: +${lastResult.amount} CHF`
            : `Verloren: -${lastResult.amount} CHF`}
        </p>
      )}
    </div>
  )
}
