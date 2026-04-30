/**
 * App.jsx — Root component
 * Wires together all components, handles unit changes and re-fetching
 */
import { useEffect, useRef } from 'react'
import { useWeather } from './hooks/useWeather'
import { useTheme } from './context/ThemeContext'
import { getWeatherBackground } from './utils/helpers'

import SearchBar from './components/SearchBar/SearchBar'
import WeatherCard from './components/WeatherCard/WeatherCard'
import Forecast from './components/Forecast/Forecast'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import UnitsToggle from './components/UnitsToggle'
import FavoritesBar from './components/FavoritesBar'
import ErrorMessage from './components/ErrorMessage'
import { WeatherSkeleton, ForecastSkeleton } from './components/Skeleton/Skeleton'

export default function App() {
  const { isDark } = useTheme()
  const {
    weather,
    forecast,
    loading,
    error,
    units,
    unitSymbol,
    speedUnit,
    favorites,
    recent,
    isFavorite,
    loadByCity,
    detectLocation,
    toggleUnits,
    toggleFavorite,
    clearError,
  } = useWeather()

  // Track previous city so we can reload on unit change
  const lastCityRef = useRef(null)
  if (weather?.name) lastCityRef.current = weather.name

  // Re-fetch when units change (keep current city loaded)
  const prevUnitsRef = useRef(units)
  useEffect(() => {
    if (prevUnitsRef.current !== units && lastCityRef.current) {
      loadByCity(lastCityRef.current)
    }
    prevUnitsRef.current = units
  }, [units, loadByCity])

  // Determine dynamic background class
  const bgClass = weather
    ? getWeatherBackground(weather.weather[0].main, weather.weather[0].icon)
    : 'bg-default'

  return (
    <>
      {/* Dynamic Background */}
      <div className={`bg-layer ${bgClass}`} />

      {/* Noise texture overlay for depth */}
      <div className="noise-overlay" />

      {/* App Shell */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* ─── Header ─────────────────────────────── */}
        <header className="sticky top-0 z-20 backdrop-blur-md bg-black/10 border-b border-white/10">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-2xl">🌤</span>
              <span className="font-display font-bold text-white text-lg hidden sm:block tracking-tight">
                Stratus
              </span>
            </div>

            {/* Search — takes available space */}
            <div className="flex-1 min-w-0">
              <SearchBar
                onSearch={loadByCity}
                onDetectLocation={detectLocation}
                recent={recent}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <UnitsToggle units={units} onToggle={toggleUnits} />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* ─── Main Content ────────────────────────── */}
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">

          {/* Error Banner */}
          <ErrorMessage message={error} onDismiss={clearError} />

          {/* Favorites */}
          {favorites.length > 0 && (
            <FavoritesBar
              favorites={favorites}
              onSelect={loadByCity}
              onRemove={(city) => toggleFavorite(city)}
              currentCity={weather?.name}
            />
          )}

          {/* Loading State — Skeleton UI */}
          {loading && (
            <div className="space-y-5">
              <WeatherSkeleton />
              <ForecastSkeleton />
            </div>
          )}

          {/* Weather Data */}
          {!loading && weather && (
            <>
              <WeatherCard
                weather={weather}
                unitSymbol={unitSymbol}
                speedUnit={speedUnit}
                isFavorite={isFavorite}
                onToggleFavorite={() => toggleFavorite(weather.name)}
              />
              <Forecast forecast={forecast} unitSymbol={unitSymbol} />
            </>
          )}

          {/* Empty State — shown on first load */}
          {!loading && !weather && !error && (
            <EmptyState onDetect={detectLocation} />
          )}
        </main>

        {/* ─── Footer ─────────────────────────────── */}
        <footer className="text-center py-4 px-4">
          <p className="text-white/25 text-xs font-body">
            Powered by OpenWeatherMap • Stratus v1.0
          </p>
        </footer>
      </div>
    </>
  )
}

/** Empty / welcome state */
function EmptyState({ onDetect }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="text-8xl mb-6 animate-float">🌍</div>
      <h2 className="font-display text-3xl font-bold text-white mb-3">
        What's the weather like?
      </h2>
      <p className="text-white/50 font-body text-base mb-8 max-w-xs leading-relaxed">
        Search for any city or use your current location to get started
      </p>
      <button
        onClick={onDetect}
        className="
          glass-strong px-6 py-3 rounded-2xl text-white font-display font-semibold
          hover:bg-white/20 hover:scale-105 active:scale-95
          transition-all duration-200
          flex items-center gap-2
        "
      >
        <span>📍</span>
        Use My Location
      </button>
    </div>
  )
}
