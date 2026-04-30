# 🌤 Stratus — Weather App

A production-grade weather app built with React + Vite + TailwindCSS. Features glassmorphism UI, dynamic weather-based backgrounds, dark/light mode, autocomplete search, 5-day forecast, favorites, and more.

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd weather-app
npm install
```

### 2. Configure API Key

```bash
cp .env.example .env
```

Then edit `.env`:
```
VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
```

Get a **free** API key at: https://openweathermap.org/api  
_(Free tier includes current weather + 5-day forecast — everything this app uses)_

> ⏳ **Note:** New API keys take ~2 hours to activate after signup.

### 3. Run

```bash
npm run dev
```

Open: http://localhost:5173

---

## 🏗 Project Structure

```
src/
├── components/
│   ├── SearchBar/
│   │   └── SearchBar.jsx        # Autocomplete search with debounce
│   ├── WeatherCard/
│   │   └── WeatherCard.jsx      # Current weather display
│   ├── Forecast/
│   │   └── Forecast.jsx         # 5-day horizontal scroll forecast
│   ├── ThemeToggle/
│   │   └── ThemeToggle.jsx      # Dark/light mode switch
│   ├── Skeleton/
│   │   └── Skeleton.jsx         # Shimmer loading placeholders
│   ├── FavoritesBar.jsx         # Saved cities strip
│   ├── ErrorMessage.jsx         # Error notification
│   └── UnitsToggle.jsx          # °C / °F switcher
├── context/
│   └── ThemeContext.jsx         # Global theme state
├── hooks/
│   └── useWeather.js            # Main data-fetching hook
├── utils/
│   ├── weatherApi.js            # All API calls (OWM)
│   └── helpers.js               # Formatters, debounce, mappings
├── App.jsx                      # Root layout
├── main.jsx                     # Entry point
└── index.css                    # Global styles + CSS variables
```

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🔍 Search | City search with debounced autocomplete (OWM Geocoding API) |
| 📍 Geolocation | One-click detect user location |
| 🌡 Current Weather | Temp, feels like, humidity, wind, pressure, visibility |
| 📅 5-Day Forecast | Horizontal scroll cards with icons and high/low temps |
| ❤️ Favorites | Save cities to localStorage, quick-switch between them |
| 🕐 Recent Searches | Last 5 searches shown when search bar is focused |
| 🌙 Dark / Light Mode | Smooth animated toggle, persisted in localStorage |
| 🎨 Dynamic Backgrounds | Background gradient changes based on weather + day/night |
| 💀 Skeleton UI | Shimmer loading states instead of spinners |
| ⚠️ Error Handling | City not found, no internet, invalid API key — all handled gracefully |
| °C / °F | Toggle units anytime — auto-refetches current city |
| 📱 Mobile-First | Fully responsive, works great on all screen sizes |

---

## 🎨 Design System

- **Font**: Syne (display) + DM Sans (body) + DM Mono
- **Style**: Glassmorphism with backdrop blur
- **Backgrounds**: 7 weather themes (sunny, cloudy, rainy, snowy, stormy, foggy, night)
- **Animations**: CSS keyframes for fade-in, slide-up, float, shimmer

---

## 🔧 Build for Production

```bash
npm run build
npm run preview
```

---

## 📦 Dependencies

- `react` + `react-dom` — UI framework
- `vite` — build tool
- `tailwindcss` — utility CSS
- `axios` — HTTP client
- `lucide-react` — icons
