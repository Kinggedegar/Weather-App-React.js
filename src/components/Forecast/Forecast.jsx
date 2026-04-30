/**
 * Forecast — horizontal scrollable 5-day forecast strip
 * Each card shows: day, icon, high/low, condition
 */
import { Droplets } from 'lucide-react'
import { getIconUrl } from '../../utils/weatherApi'
import { titleCase } from '../../utils/helpers'

export default function Forecast({ forecast, unitSymbol }) {
  if (!forecast || forecast.length === 0) return null

  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
      <h2 className="text-white/60 text-xs font-display uppercase tracking-widest mb-3">
        5-Day Forecast
      </h2>

      <div className="flex gap-3 overflow-x-auto forecast-scroll pb-2 -mx-1 px-1">
        {forecast.map((day, i) => (
          <ForecastCard
            key={day.dateKey}
            day={day}
            unitSymbol={unitSymbol}
            delay={i * 0.05}
            isFirst={i === 0}
          />
        ))}
      </div>
    </div>
  )
}

function ForecastCard({ day, unitSymbol, delay, isFirst }) {
  return (
    <div
      className={`
        flex-none w-28 glass rounded-2xl p-3.5 text-center
        hover:bg-white/15 hover:scale-[1.03] active:scale-[0.98]
        transition-all duration-200 cursor-default animate-slide-up
        ${isFirst ? 'ring-1 ring-white/30' : ''}
      `}
      style={{ animationDelay: `${0.1 + delay}s`, animationFillMode: 'both' }}
    >
      {/* Day name */}
      <p className={`font-display text-xs font-semibold uppercase tracking-wide mb-2 ${isFirst ? 'text-white' : 'text-white/60'}`}>
        {isFirst ? 'Today' : day.dateKey.split(',')[0]}
      </p>

      {/* Weather Icon */}
      <div className="flex justify-center mb-2">
        <img
          src={getIconUrl(day.icon, '@2x')}
          alt={day.condition}
          className="w-12 h-12"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
        />
      </div>

      {/* Condition */}
      <p className="text-white/60 text-xs font-body mb-3 leading-tight">
        {titleCase(day.description)}
      </p>

      {/* High / Low */}
      <div className="flex justify-between items-center">
        <span className="text-white font-display font-semibold text-sm">
          {day.tempMax}{unitSymbol}
        </span>
        <span className="text-white/40 font-body text-xs">
          {day.tempMin}{unitSymbol}
        </span>
      </div>

      {/* Humidity indicator */}
      {day.humidity > 0 && (
        <div className="mt-2 flex items-center justify-center gap-1">
          <Droplets size={12} className="text-blue-300/70" />
          <span className="text-white/40 text-xs font-mono">{day.humidity}%</span>
        </div>
      )}
    </div>
  )
}
