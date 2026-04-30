/**
 * Forecast — horizontal scrollable 5-day forecast strip
 * Each card shows: day, icon, high/low, condition
 */
import { Droplets, TrendingUp, Wind } from 'lucide-react'
import { getIconUrl } from '../../utils/weatherApi'
import { titleCase } from '../../utils/helpers'

export default function Forecast({ forecast, unitSymbol }) {
  if (!forecast || forecast.length === 0) return null

  return (
    <div className="animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
      <h2 className="text-white/60 text-xs font-display uppercase tracking-widest mb-4 flex items-center gap-2">
        <TrendingUp size={14} />
        5-Day Forecast
      </h2>

      <div className="flex gap-3 overflow-x-auto forecast-scroll pb-2 -mx-1 px-1">
        {forecast.map((day, i) => (
          <ForecastCard
            key={day.dateKey}
            day={day}
            unitSymbol={unitSymbol}
            delay={i * 0.08}
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
        flex-none w-32 glass rounded-2xl p-4 text-center
        card-hover cursor-default forecast-card
        transition-all duration-300
        ${isFirst ? 'ring-2 ring-white/40 bg-white/15' : 'hover:bg-white/10'}
      `}
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Day name */}
      <p className={`font-display text-xs font-bold uppercase tracking-wider mb-3 ${isFirst ? 'text-white' : 'text-white/60'}`}>
        {isFirst ? 'Today' : day.dateKey.split(',')[0]}
      </p>

      {/* Weather Icon */}
      <div className="flex justify-center mb-3">
        <img
          src={getIconUrl(day.icon, '@2x')}
          alt={day.condition}
          className="w-14 h-14 drop-shadow-lg hover:scale-110 transition-transform"
        />
      </div>

      {/* Condition */}
      <p className="text-white/70 text-xs font-body mb-4 leading-snug h-8 overflow-hidden">
        {titleCase(day.description)}
      </p>

      {/* Divider */}
      <div className="h-px bg-white/10 mb-3" />

      {/* High / Low with gradient bar */}
      <div className="mb-3">
        <div className="flex justify-between items-end mb-1">
          <div className="flex flex-col items-start flex-1">
            <span className="text-xs text-white/50 font-body mb-0.5">High</span>
            <span className="text-white font-display font-bold text-base">
              {day.tempMax}{unitSymbol}
            </span>
          </div>
          <div className="h-8 w-0.5 bg-gradient-to-b from-red-400 to-blue-400 mx-2" />
          <div className="flex flex-col items-end flex-1">
            <span className="text-xs text-white/50 font-body mb-0.5">Low</span>
            <span className="text-white/60 font-display font-semibold text-base">
              {day.tempMin}{unitSymbol}
            </span>
          </div>
        </div>
      </div>

      {/* Humidity indicator */}
      {day.humidity > 0 && (
        <div className="flex items-center justify-center gap-1.5 bg-white/5 rounded-lg py-1.5">
          <Droplets size={12} className="text-blue-300" />
          <span className="text-white/60 text-xs font-mono">{day.humidity}%</span>
        </div>
      )}
    </div>
  )
}
