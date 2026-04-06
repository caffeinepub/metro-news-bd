# বালীগাঁও নিউজ

## Current State
The site is a fully functional Bengali news portal with header, breaking news ticker, hero slider, editor's picks, latest news, category sections, external news aggregation, settings panel, and footer. All components are frontend-only (no backend). The site has 9 published versions.

## Requested Changes (Diff)

### Add
- A new `WeatherSection` component (`src/frontend/src/components/WeatherSection.tsx`) that shows a 24-hour weather forecast for Baligaon/Lakhai/Habiganj area (lat: 24.12, lon: 91.22)
- Weather data fetched from Open-Meteo free API (no API key needed)
- Displayed info: temperature (°C), humidity (%), wind speed & direction (km/h + cardinal direction in Bengali), rain probability (%), sunrise & sunset times, AQI (air quality index using Open-Meteo air quality API)
- Auto-refresh: data fetches on load and every 12 hours (setInterval)
- Manual Refresh button that fetches fresh data immediately
- All labels/values displayed in Bengali
- 24-hour hourly forecast cards showing time, temperature, rain probability, wind
- Current conditions prominently displayed at top
- Sunrise/sunset times shown
- AQI with color-coded level (ভালো/মাঝারি/অস্বাস্থ্যকর/বিপজ্জনক)

### Modify
- `App.tsx`: Import and render `WeatherSection` between the ExternalNewsSection and Footer (or before ExternalNewsSection, after LatestNews section)

### Remove
- Nothing removed

## Implementation Plan
1. Create `WeatherSection.tsx` with:
   - Fetch current weather from `https://api.open-meteo.com/v1/forecast?latitude=24.12&longitude=91.22&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation_probability,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,wind_direction_10m,weather_code&daily=sunrise,sunset&timezone=Asia/Dhaka&forecast_days=1`
   - Fetch AQI from `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=24.12&longitude=91.22&current=pm2_5,pm10,european_aqi&timezone=Asia/Dhaka`
   - Display current conditions card with temperature, humidity, wind, rain chance
   - Display AQI badge with Bengali labels
   - Display sunrise/sunset times in Bengali AM/PM format
   - Display 24-hour hourly grid (scrollable) with time, temp, rain probability
   - Auto-refresh every 12 hours via setInterval
   - Manual Refresh button with loading state
   - Wind direction converted from degrees to Bengali cardinal directions
   - Weather code converted to Bengali weather description
2. Add WeatherSection to App.tsx between LatestNews and ExternalNewsSection
