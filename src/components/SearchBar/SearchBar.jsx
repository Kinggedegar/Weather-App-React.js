/**
 * SearchBar — city search with debounced autocomplete suggestions
 * Shows recent searches when focused with empty input
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, MapPin, Clock, X, Loader2 } from 'lucide-react'
import { fetchCitySuggestions } from '../../utils/weatherApi'
import { debounce } from '../../utils/helpers'

export default function SearchBar({ onSearch, onDetectLocation, recent = [] }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  // Debounced fetch — fires 350ms after user stops typing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSuggestions = useCallback(
    debounce(async (value) => {
      if (value.length < 2) {
        setSuggestions([])
        setLoadingSuggestions(false)
        return
      }
      try {
        const results = await fetchCitySuggestions(value)
        setSuggestions(results)
      } catch {
        setSuggestions([])
      } finally {
        setLoadingSuggestions(false)
      }
    }, 350),
    []
  )

  useEffect(() => {
    if (query.length >= 2) {
      setLoadingSuggestions(true)
      fetchSuggestions(query)
    } else {
      setSuggestions([])
      setLoadingSuggestions(false)
    }
  }, [query, fetchSuggestions])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target) && !inputRef.current?.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSubmit = (e) => {
    e?.preventDefault()
    const val = query.trim()
    if (!val) return
    onSearch(val)
    setShowDropdown(false)
    setQuery('')
    inputRef.current?.blur()
  }

  const handleSelect = (displayName) => {
    onSearch(displayName)
    setQuery('')
    setShowDropdown(false)
    setSuggestions([])
    inputRef.current?.blur()
  }

  const handleKeyDown = (e) => {
    const items = suggestions.length > 0 ? suggestions : recent
    if (!showDropdown || items.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestion(prev => Math.min(prev + 1, items.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestion(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeSuggestion >= 0 && activeSuggestion < items.length) {
        const item = suggestions.length > 0 ? suggestions[activeSuggestion].display : items[activeSuggestion]
        handleSelect(item)
      } else {
        handleSubmit()
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
      setActiveSuggestion(-1)
    }
  }

  const showRecent = showDropdown && query.length === 0 && recent.length > 0
  const showSuggestions = showDropdown && (suggestions.length > 0 || loadingSuggestions)
  const isOpen = showRecent || showSuggestions

  return (
    <div className="relative w-full">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          flex items-center gap-3 px-4 py-3.5
          glass rounded-2xl
          transition-all duration-300
          ${isOpen ? 'rounded-b-none border-b-transparent' : ''}
          focus-within:shadow-lg focus-within:shadow-black/20
        `}>
          {/* Search Icon */}
          <Search size={18} className="text-white/60 flex-shrink-0" />

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setShowDropdown(true)
              setActiveSuggestion(-1)
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search city..."
            className="flex-1 bg-transparent text-white placeholder-white/40 outline-none font-body text-sm min-w-0"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Loading indicator or clear button */}
          {loadingSuggestions && (
            <Loader2 size={16} className="text-white/50 animate-spin flex-shrink-0" />
          )}
          {query && !loadingSuggestions && (
            <button
              type="button"
              onClick={() => { setQuery(''); setSuggestions([]); inputRef.current?.focus() }}
              className="text-white/40 hover:text-white/80 transition-colors flex-shrink-0"
            >
              <X size={16} />
            </button>
          )}

          {/* Divider */}
          <div className="w-px h-5 bg-white/20 flex-shrink-0" />

          {/* Detect location button */}
          <button
            type="button"
            onClick={onDetectLocation}
            title="Use my location"
            className="text-white/60 hover:text-white transition-colors flex-shrink-0 group"
          >
            <MapPin size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 glass rounded-b-2xl border-t border-white/10 overflow-hidden z-50 animate-slide-down"
          >
            {/* Suggestions */}
            {suggestions.length > 0 && suggestions.map((item, i) => (
              <button
                key={`${item.lat}-${item.lon}`}
                type="button"
                onClick={() => handleSelect(item.name)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-left
                  hover:bg-white/10 transition-colors
                  ${activeSuggestion === i ? 'bg-white/10' : ''}
                `}
              >
                <MapPin size={14} className="text-white/40 flex-shrink-0" />
                <span className="text-white text-sm truncate font-body">
                  <span className="font-medium">{item.name}</span>
                  {(item.state || item.country) && (
                    <span className="text-white/50 ml-1.5">
                      {[item.state, item.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                </span>
              </button>
            ))}

            {/* Recent searches (when query is empty) */}
            {showRecent && (
              <>
                <div className="px-4 pt-3 pb-1">
                  <span className="text-white/40 text-xs font-display uppercase tracking-wider">Recent</span>
                </div>
                {recent.map((city, i) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleSelect(city)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-left
                      hover:bg-white/10 transition-colors
                      ${activeSuggestion === i ? 'bg-white/10' : ''}
                    `}
                  >
                    <Clock size={14} className="text-white/40 flex-shrink-0" />
                    <span className="text-white/80 text-sm font-body">{city}</span>
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
