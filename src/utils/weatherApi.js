/**
 * weatherApi.js — Centralized OpenWeatherMap API layer
 * Uses environment variable VITE_OPENWEATHER_API_KEY
 * Docs: https://openweathermap.org/api
 */
import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0'

/** Validate API key is present */
function checkKey() {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('NO_API_KEY')
  }
}

/**
 * Fetch current weather by city name
 * @param {string} city
 * @param {'metric'|'imperial'} units
 */
export async function fetchWeatherByCity(city, units = 'metric') {
  checkKey()
  try {
    const { data } = await axios.get(`${BASE_URL}/weather`, {
      params: { q: city, appid: API_KEY, units },
    })
    return data
  } catch (err) {
    handleApiError(err)
  }
}

/**
 * Fetch current weather by coordinates
 * @param {number} lat
 * @param {number} lon
 * @param {'metric'|'imperial'} units
 */
export async function fetchWeatherByCoords(lat, lon, units = 'metric') {
  checkKey()
  try {
    const { data } = await axios.get(`${BASE_URL}/weather`, {
      params: { lat, lon, appid: API_KEY, units },
    })
    return data
  } catch (err) {
    handleApiError(err)
  }
}

/**
 * Fetch 5-day / 3-hour forecast by city name
 * @param {string} city
 * @param {'metric'|'imperial'} units
 */
export async function fetchForecastByCity(city, units = 'metric') {
  checkKey()
  try {
    const { data } = await axios.get(`${BASE_URL}/forecast`, {
      params: { q: city, appid: API_KEY, units },
    })
    return parseForecast(data)
  } catch (err) {
    handleApiError(err)
  }
}

/**
 * Fetch 5-day forecast by coordinates
 */
export async function fetchForecastByCoords(lat, lon, units = 'metric') {
  checkKey()
  try {
    const { data } = await axios.get(`${BASE_URL}/forecast`, {
      params: { lat, lon, appid: API_KEY, units },
    })
    return parseForecast(data)
  } catch (err) {
    handleApiError(err)
  }
}

/**
 * Autocomplete city search using Geocoding API
 * Returns up to 5 suggestions
 * @param {string} query
 */
export async function fetchCitySuggestions(query) {
  checkKey()
  if (!query || query.length < 2) return []
  try {
    const { data } = await axios.get(`${GEO_URL}/direct`, {
      params: { q: query, limit: 5, appid: API_KEY },
    })
    // Deduplicate by display name
    const seen = new Set()
    return data
      .map(item => ({
        name: item.name,
        country: item.country,
        state: item.state,
        lat: item.lat,
        lon: item.lon,
        display: [item.name, item.state, item.country].filter(Boolean).join(', '),
      }))
      .filter(item => {
        if (seen.has(item.display)) return false
        seen.add(item.display)
        return true
      })
  } catch {
    return []
  }
}

/**
 * Parse raw 5-day forecast into one entry per day (noon reading)
 * OWM returns 3-hour intervals; we pick the closest to midday per day
 */
function parseForecast(data) {
  const days = {}
  data.list.forEach(entry => {
    const date = new Date(entry.dt * 1000)
    const dateKey = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    const hour = date.getHours()

    if (!days[dateKey]) {
      days[dateKey] = entry
    } else {
      // Prefer entry closest to noon (12:00)
      const existingHour = new Date(days[dateKey].dt * 1000).getHours()
      if (Math.abs(hour - 12) < Math.abs(existingHour - 12)) {
        days[dateKey] = entry
      }
    }
  })

  return Object.entries(days)
    .slice(0, 5) // Strictly 5 days
    .map(([dateKey, entry]) => ({
      dateKey,
      temp: Math.round(entry.main.temp),
      tempMin: Math.round(entry.main.temp_min),
      tempMax: Math.round(entry.main.temp_max),
      condition: entry.weather[0].main,
      description: entry.weather[0].description,
      icon: entry.weather[0].icon,
      humidity: entry.main.humidity,
      wind: Math.round(entry.wind.speed),
    }))
}

/**
 * Convert OWM error codes to user-friendly messages
 */
function handleApiError(err) {
  if (!err.response) {
    throw new Error('NO_INTERNET')
  }
  const status = err.response?.status
  if (status === 400) throw new Error('INVALID_API_KEY')
  if (status === 404) throw new Error('CITY_NOT_FOUND')
  if (status === 401) throw new Error('KEY_NOT_ACTIVATED')
  if (status === 429) throw new Error('RATE_LIMIT')
  throw new Error('UNKNOWN_ERROR')
}

/** Build full icon URL from OWM icon code */
export function getIconUrl(icon, size = '@2x') {
  return `https://openweathermap.org/img/wn/${icon}${size}.png`
}
