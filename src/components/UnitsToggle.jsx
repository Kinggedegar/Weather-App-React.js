/**
 * UnitsToggle — switches between Celsius and Fahrenheit
 */
export default function UnitsToggle({ units, onToggle }) {
  const isMetric = units === 'metric'

  return (
    <button
      onClick={onToggle}
      className="glass rounded-xl px-3 py-1.5 flex items-center gap-0.5 hover:bg-white/15 transition-all active:scale-95"
      title={`Switch to ${isMetric ? 'Fahrenheit' : 'Celsius'}`}
    >
      <span className={`font-display font-semibold text-sm transition-colors ${isMetric ? 'text-white' : 'text-white/35'}`}>
        °C
      </span>
      <span className="text-white/30 font-body text-sm mx-1">|</span>
      <span className={`font-display font-semibold text-sm transition-colors ${!isMetric ? 'text-white' : 'text-white/35'}`}>
        °F
      </span>
    </button>
  )
}
