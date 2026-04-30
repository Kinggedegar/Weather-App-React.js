/**
 * helpers.js — Utility functions for the Weather App
 */

/**
 * Map OWM weather condition + time of day to a CSS background class
 * @param {string} condition - OWM main condition (e.g., "Rain", "Clear")
 * @param {string} icon      - OWM icon code (ends in 'n' for night)
 * @returns {string} Tailwind-compatible CSS class
 */
export function getWeatherBackground(condition, icon = '') {
  const isNight = icon?.endsWith('n')
  if (isNight) return 'bg-night'

  const map = {
    Clear: 'bg-sunny',
    Clouds: 'bg-cloudy',
    Rain: 'bg-rainy',
    Drizzle: 'bg-rainy',
    Thunderstorm: 'bg-stormy',
    Snow: 'bg-snowy',
    Mist: 'bg-foggy',
    Smoke: 'bg-foggy',
    Haze: 'bg-foggy',
    Dust: 'bg-foggy',
    Fog: 'bg-foggy',
    Sand: 'bg-foggy',
    Ash: 'bg-stormy',
    Squall: 'bg-stormy',
    Tornado: 'bg-stormy',
  }
  return map[condition] || 'bg-default'
}

/**
 * Format Unix timestamp to a readable time string
 * @param {number} unix - Unix timestamp in seconds
 * @param {number} timezoneOffset - OWM timezone offset in seconds
 */
export function formatTime(unix, timezoneOffset = 0) {
  const date = new Date((unix + timezoneOffset) * 1000)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  })
}

/**
 * Simple debounce factory
 * @param {Function} fn
 * @param {number} delay ms
 */
export function debounce(fn, delay) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Convert wind speed m/s to km/h (rounded)
 */
export function msToKmh(ms) {
  return Math.round(ms * 3.6)
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Get wind direction label from degrees
 */
export function windDirection(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

/** Get user-friendly error message from error code */
export function getErrorMessage(code) {
  const messages = {
    CITY_NOT_FOUND: "We couldn't find that city. Double-check the spelling and try again.",
    NO_INTERNET: "No internet connection. Please check your network and try again.",
    INVALID_API_KEY: "Invalid API key. Please check your .env configuration.",
    KEY_NOT_ACTIVATED: "Your API key isn't active yet — OpenWeatherMap takes up to 2 hours to activate new keys. Grab a coffee and try again shortly ☕",
    RATE_LIMIT: "Too many requests. Please wait a moment and try again.",
    NO_API_KEY: "API key missing. Copy .env.example to .env and add your OpenWeatherMap key.",
    UNKNOWN_ERROR: "Something went wrong. Please try again.",
    GEOLOCATION_DENIED: "Location access denied. Please search for a city manually.",
    GEOLOCATION_UNAVAILABLE: "Location unavailable on this device.",
  }
  return messages[code] || messages.UNKNOWN_ERROR
}
