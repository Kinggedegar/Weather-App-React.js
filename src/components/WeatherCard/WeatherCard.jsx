/**
 * WeatherCard — displays current weather data with animated icon
 * Shows: temperature, condition, feels-like, humidity, wind, pressure
 */
import { Heart, Wind, Droplets, Thermometer, Eye, Gauge, Sun, Moon } from 'lucide-react'
import { getIconUrl, } from '../../utils/weatherApi'
import { titleCase, windDirection, formatTime } from '../../utils/helpers'

export default function WeatherCard({ weather, unitSymbol, speedUnit, isFavorite, onToggleFavorite }) {
  if (!weather) return null

  const {
    name,
    sys: { country, sunrise, sunset },
    main: { temp, feels_like, humidity, pressure, temp_min, temp_max },
    weather: [{ description, icon, main: condition }],
    wind: { speed, deg },
    visibility,
    timezone,
  } = weather

  const isNight = icon?.endsWith('n')

  return (
    <div className="animate-slide-up">
      {/* City + Favorite */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-none">
            {name}
          </h1>
          <p className="text-white/60 text-sm mt-1 font-body flex items-center gap-1">
            {country} • {isNight ? <><Moon size={14} className="inline" /> Night</> : <><Sun size={14} className="inline" /> Day</>}
          </p>
        </div>

        {/* Favorite toggle */}
        <button
          onClick={onToggleFavorite}
          className="p-2.5 glass rounded-xl hover:scale-110 active:scale-95 transition-all"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={20}
            className={`transition-colors ${isFavorite ? 'fill-red-400 text-red-400' : 'text-white/60'}`}
          />
        </button>
      </div>

      {/* Main Temperature Block */}
      <div className="flex items-center gap-4 mb-6">
        {/* Animated weather icon */}
        <div className="animate-float">
          <img
            src={getIconUrl(icon)}
            alt={description}
            className="w-24 h-24 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))' }}
          />
        </div>

        <div>
          <div className="flex items-start">
            <span className="font-display text-7xl md:text-8xl font-bold text-white leading-none">
              {Math.round(temp)}
            </span>
            <span className="font-display text-3xl text-white/70 mt-3 ml-1">{unitSymbol}</span>
          </div>
          <p className="text-white/80 font-body text-lg capitalize mt-1">
            {titleCase(description)}
          </p>
          <p className="text-white/50 text-sm font-body mt-0.5">
            H:{Math.round(temp_max)}{unitSymbol} • L:{Math.round(temp_min)}{unitSymbol}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard
          icon={<Thermometer size={16} />}
          label="Feels Like"
          value={`${Math.round(feels_like)}${unitSymbol}`}
        />
        <StatCard
          icon={<Droplets size={16} />}
          label="Humidity"
          value={`${humidity}%`}
          bar
          barValue={humidity}
        />
        <StatCard
          icon={<Wind size={16} />}
          label="Wind"
          value={`${Math.round(speed)} ${speedUnit}`}
          sub={`${windDirection(deg)} direction`}
        />
        <StatCard
          icon={<Gauge size={16} />}
          label="Pressure"
          value={`${pressure} hPa`}
        />
        <StatCard
          icon={<Eye size={16} />}
          label="Visibility"
          value={visibility ? `${(visibility / 1000).toFixed(1)} km` : 'N/A'}
        />
        <SunriseSunsetCard
          sunrise={formatTime(sunrise, timezone)}
          sunset={formatTime(sunset, timezone)}
        />
      </div>
    </div>
  )
}

/** Individual stat card with optional progress bar */
function StatCard({ icon, label, value, sub, bar, barValue }) {
  return (
    <div className="glass rounded-xl p-3.5 hover:bg-white/15 transition-colors group">
      <div className="flex items-center gap-1.5 text-white/50 mb-2">
        <span className="group-hover:text-white/70 transition-colors">{icon}</span>
        <span className="text-xs font-display uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-white font-body font-medium text-lg leading-none">{value}</p>
      {sub && <p className="text-white/40 text-xs mt-1 font-body">{sub}</p>}
      {bar && (
        <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/50 rounded-full transition-all duration-700"
            style={{ width: `${barValue}%` }}
          />
        </div>
      )}
    </div>
  )
}

/** Sunrise/Sunset special card */
function SunriseSunsetCard({ sunrise, sunset }) {
  return (
    <div className="glass rounded-xl p-3.5 hover:bg-white/15 transition-colors">
      <div className="flex items-center gap-1.5 text-white/50 mb-2">
        <span className="text-xs font-display uppercase tracking-wide">Sun</span>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-white/80 text-xs font-body">🌅 Rise <span className="text-white font-medium">{sunrise}</span></p>
        <p className="text-white/80 text-xs font-body">🌇 Set <span className="text-white font-medium">{sunset}</span></p>
      </div>
    </div>
  )
}
