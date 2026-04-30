/**
 * FavoritesBar — horizontal strip of saved cities
 * Click a city to load its weather
 */
import { Heart, X } from 'lucide-react'

export default function FavoritesBar({ favorites, onSelect, onRemove, currentCity }) {
  if (!favorites || favorites.length === 0) return null

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Heart size={12} className="text-white/40" />
        <span className="text-white/40 text-xs font-display uppercase tracking-widest">Favorites</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 forecast-scroll">
        {favorites.map(city => (
          <div key={city} className="flex-none group relative">
            <button
              onClick={() => onSelect(city)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body
                transition-all duration-200 hover:scale-105 active:scale-95
                ${currentCity === city
                  ? 'bg-white/25 text-white ring-1 ring-white/40'
                  : 'glass text-white/70 hover:text-white hover:bg-white/15'
                }
              `}
            >
              {city}
            </button>
            {/* Remove button appears on hover */}
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(city) }}
              className="absolute -top-1.5 -right-1.5 bg-red-500/80 rounded-full p-0.5
                         opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              title="Remove"
            >
              <X size={10} className="text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
