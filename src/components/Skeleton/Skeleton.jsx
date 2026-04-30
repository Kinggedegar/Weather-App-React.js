/**
 * Skeleton — shimmer loading placeholders that match the real layout
 */

export function WeatherSkeleton() {
  return (
    <div className="animate-fade-in">
      {/* City name */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="skeleton h-10 w-48 mb-2" />
          <div className="skeleton h-4 w-24" />
        </div>
        <div className="skeleton h-10 w-10 rounded-xl" />
      </div>

      {/* Temp + icon */}
      <div className="flex items-center gap-4 mb-6">
        <div className="skeleton w-24 h-24 rounded-2xl" />
        <div>
          <div className="skeleton h-20 w-40 mb-2" />
          <div className="skeleton h-5 w-32 mb-1" />
          <div className="skeleton h-4 w-24" />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-3.5">
            <div className="skeleton h-3 w-16 mb-2" />
            <div className="skeleton h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ForecastSkeleton() {
  return (
    <div>
      <div className="skeleton h-3 w-24 mb-3" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-none w-28 glass rounded-2xl p-3.5">
            <div className="skeleton h-3 w-12 mx-auto mb-2" />
            <div className="skeleton w-12 h-12 rounded-full mx-auto mb-2" />
            <div className="skeleton h-3 w-16 mx-auto mb-3" />
            <div className="flex justify-between">
              <div className="skeleton h-4 w-8" />
              <div className="skeleton h-4 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
