/**
 * ThemeToggle — animated dark/light mode switch
 */
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`
        relative w-14 h-7 rounded-full transition-all duration-500
        ${isDark ? 'bg-indigo-500/40' : 'bg-amber-400/40'}
        glass hover:scale-105 active:scale-95
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
      `}
      aria-label="Toggle theme"
    >
      {/* Track icons */}
      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 opacity-60">
        <Sun size={12} className="text-amber-300" />
      </span>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-60">
        <Moon size={12} className="text-indigo-300" />
      </span>

      {/* Sliding knob */}
      <span
        className={`
          absolute top-0.5 w-6 h-6 rounded-full
          flex items-center justify-center
          transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]
          ${isDark
            ? 'translate-x-7 bg-indigo-200 shadow-[0_0_8px_rgba(129,140,248,0.6)]'
            : 'translate-x-0.5 bg-amber-100 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
          }
        `}
      >
        {isDark
          ? <Moon size={12} className="text-indigo-700" />
          : <Sun size={12} className="text-amber-600" />
        }
      </span>
    </button>
  )
}
