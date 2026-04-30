/**
 * useWeather — master hook that orchestrates all weather data fetching
 * Handles: current weather, forecast, units toggle, favorites, recent searches
 */
import { useState, useCallback, useRef } from 'react'
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
  fetchForecastByCity,
  fetchForecastByCoords,
} from '../utils/weatherApi'
import { getErrorMessage } from '../utils/helpers'

const MAX_RECENT = 5

export function useWeather() {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [units, setUnits] = useState(() => localStorage.getItem('stratus-units') || 'metric')

  // Favorites: array of city name strings
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('stratus-favorites') || '[]') }
    catch { return [] }
  })

  // Recent searches: array of city name strings
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('stratus-recent') || '[]') }
    catch { return [] }
  })

  // Cancel token to avoid stale data on rapid requests
  const abortRef = useRef(null)

  /** Core: load weather + forecast for a city string */
  const loadByCity = useCallback(async (city) => {
    if (!city?.trim()) return
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setError(null)

    try {
      const [w, f] = await Promise.all([
        fetchWeatherByCity(city, units),
        fetchForecastByCity(city, units),
      ])
      setWeather(w)
      setForecast(f)
      addToRecent(w.name)
    } catch (err) {
      setError(getErrorMessage(err.message))
      setWeather(null)
      setForecast([])
    } finally {
      setLoading(false)
    }
  }, [units])

  /** Core: load weather + forecast from GPS coordinates */
  const loadByCoords = useCallback(async (lat, lon) => {
    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setError(null)

    try {
      const [w, f] = await Promise.all([
        fetchWeatherByCoords(lat, lon, units),
        fetchForecastByCoords(lat, lon, units),
      ])
      setWeather(w)
      setForecast(f)
      addToRecent(w.name)
    } catch (err) {
      setError(getErrorMessage(err.message))
    } finally {
      setLoading(false)
    }
  }, [units])

  /** Request browser geolocation */
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError(getErrorMessage('GEOLOCATION_UNAVAILABLE'))
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => loadByCoords(pos.coords.latitude, pos.coords.longitude),
      () => {
        setLoading(false)
        setError(getErrorMessage('GEOLOCATION_DENIED'))
      },
      { timeout: 8000 }
    )
  }, [loadByCoords])

  /** Toggle between metric / imperial; reload current city if loaded */
  const toggleUnits = useCallback(() => {
    setUnits(prev => {
      const next = prev === 'metric' ? 'imperial' : 'metric'
      localStorage.setItem('stratus-units', next)
      return next
    })
    // Reload will happen via useEffect in App when units changes
  }, [])

  /** Add/remove a city from favorites */
  const toggleFavorite = useCallback((cityName) => {
    setFavorites(prev => {
      const updated = prev.includes(cityName)
        ? prev.filter(c => c !== cityName)
        : [...prev, cityName]
      localStorage.setItem('stratus-favorites', JSON.stringify(updated))
      return updated
    })
  }, [])

  /** Add city to recent searches, keep list trimmed */
  const addToRecent = (cityName) => {
    setRecent(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== cityName.toLowerCase())
      const updated = [cityName, ...filtered].slice(0, MAX_RECENT)
      localStorage.setItem('stratus-recent', JSON.stringify(updated))
      return updated
    })
  }

  const clearError = () => setError(null)

  const isFavorite = weather ? favorites.includes(weather.name) : false
  const unitSymbol = units === 'metric' ? '°C' : '°F'
  const speedUnit = units === 'metric' ? 'm/s' : 'mph'

  return {
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
    loadByCoords,
    detectLocation,
    toggleUnits,
    toggleFavorite,
    clearError,
  }
}
