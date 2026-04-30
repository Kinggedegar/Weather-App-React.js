/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        sky: {
          950: '#0a1628',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        shimmer: 'shimmer 1.8s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'scale-in': 'scaleIn 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shake': 'shake 0.4s ease-in-out',
        'rotate-in': 'rotateIn 0.6s ease-out',
        'ping-slow': 'pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideDown: { from: { opacity: 0, transform: 'translateY(-10px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        bounceIn: {
          '0%': { opacity: 0, transform: 'scale(0.3)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        rotateIn: {
          '0%': { opacity: 0, transform: 'rotate(-10deg) scale(0.9)' },
          '100%': { opacity: 1, transform: 'rotate(0) scale(1)' },
        },
        pingSlow: {
          '75%, 100%': { transform: 'scale(2)', opacity: 0 },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
