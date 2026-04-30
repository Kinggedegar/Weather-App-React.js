/**
 * FavoritesBar — horizontal strip of saved cities
 * Click a city to load its weather
 */
import { Heart, X, Star } from 'lucide-react'

export default function FavoritesBar({ favorites, onSelect, onRemove, currentCity }) {
  if (!favorites || favorites.length === 0) return null

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Star size={13} className="text-amber-300" />
        <span className="text-white/60 text-xs font-display uppercase tracking-widest font-semibold">Favorites</span>
        <span className="text-white/40 text-xs font-body">({favorites.length})</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 forecast-scroll">
        {favorites.map((city, idx) => (
          <div 
            key={city} 
            className="flex-none group relative list-item-fade"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <button
              onClick={() => onSelect(city)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-xs font-body font-medium
                transition-all duration-300 hover:scale-105 active:scale-95
                ${currentCity === city
                  ? 'bg-gradient-to-r from-white/30 to-white/15 text-white ring-2 ring-white/40 shadow-lg'
                  : 'glass text-white/70 hover:text-white hover:bg-white/10 card-hover'
                }
              `}
            >
              <Heart size={12} className={currentCity === city ? 'fill-red-300 text-red-300' : 'text-white/50'} />
              {city}
            </button>
            {/* Remove button appears on hover */}
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(city) }}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5
                         opacity-0 group-hover:opacity-100 transition-all duration-200 
                         hover:scale-110 active:scale-95 shadow-lg"
              title="Remove"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
