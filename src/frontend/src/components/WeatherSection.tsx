import {
  Droplets,
  Eye,
  MapPin,
  RefreshCw,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Bengali number conversion ───────────────────────────────────────────────
const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
function toBengali(n: number | string): string {
  return String(n).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

// ─── Weather code to Bengali description ─────────────────────────────────────
function weatherDescription(code: number): string {
  if (code === 0) return "পরিষ্কার আকাশ";
  if (code === 1 || code === 2) return "আংশিক মেঘলা";
  if (code === 3) return "মেঘাচ্ছন্ন";
  if (code === 45 || code === 48) return "কুয়াশা";
  if (code >= 51 && code <= 55) return "হালকা গুঁড়ি বৃষ্টি";
  if (code >= 61 && code <= 65) return "বৃষ্টি";
  if (code >= 71 && code <= 75) return "তুষারপাত";
  if (code >= 80 && code <= 82) return "ঝরনা বৃষ্টি";
  if (code === 95 || code === 96 || code === 99) return "বজ্রসহ বৃষ্টি";
  return "মেঘলা";
}

// ─── Weather code to emoji ────────────────────────────────────────────────────
function weatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code === 1 || code === 2) return "⛅";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 55) return "🌦️";
  if (code >= 61 && code <= 65) return "🌧️";
  if (code >= 71 && code <= 75) return "❄️";
  if (code >= 80 && code <= 82) return "🌧️";
  if (code === 95 || code === 96 || code === 99) return "⛈️";
  return "🌥️";
}

// ─── Wind direction to Bengali ────────────────────────────────────────────────
function windDirection(deg: number): string {
  if (deg <= 22 || deg > 337) return "উত্তর";
  if (deg <= 67) return "উত্তর-পূর্ব";
  if (deg <= 112) return "পূর্ব";
  if (deg <= 157) return "দক্ষিণ-পূর্ব";
  if (deg <= 202) return "দক্ষিণ";
  if (deg <= 247) return "দক্ষিণ-পশ্চিম";
  if (deg <= 292) return "পশ্চিম";
  return "উত্তর-পশ্চিম";
}

// ─── AQI info ─────────────────────────────────────────────────────────────────
function aqiInfo(aqi: number): { label: string; color: string; bg: string } {
  if (aqi <= 20) return { label: "ভালো", color: "#22c55e", bg: "#14532d33" };
  if (aqi <= 40)
    return { label: "সন্তোষজনক", color: "#eab308", bg: "#71350633" };
  if (aqi <= 60) return { label: "মাঝারি", color: "#f97316", bg: "#7c2d1233" };
  if (aqi <= 80)
    return { label: "অস্বাস্থ্যকর", color: "#ef4444", bg: "#7f1d1d33" };
  if (aqi <= 100)
    return { label: "খুব অস্বাস্থ্যকর", color: "#a855f7", bg: "#3b0764aa" };
  return { label: "বিপজ্জনক", color: "#be123c", bg: "#4c041533" };
}

// ─── Time formatting ──────────────────────────────────────────────────────────
function timeToBengali(isoOrTime: string): string {
  // Handles "HH:MM" or "YYYY-MM-DDTHH:MM"
  const timePart = isoOrTime.includes("T")
    ? isoOrTime.split("T")[1]
    : isoOrTime;
  const [hStr, mStr] = timePart.split(":");
  const h = Number.parseInt(hStr, 10);
  const m = Number.parseInt(mStr, 10);

  let period: string;
  if (h >= 0 && h <= 4) period = "রাত";
  else if (h <= 7) period = "ভোর";
  else if (h <= 11) period = "সকাল";
  else if (h === 12) period = "দুপুর";
  else if (h <= 16) period = "বিকেল";
  else if (h <= 19) period = "সন্ধ্যা";
  else period = "রাত";

  const display12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const minStr = m === 0 ? "" : ` ${toBengali(m)}মি`;
  return `${period} ${toBengali(display12)}টা${minStr}`;
}

function hourLabel(isoDatetime: string): string {
  return timeToBengali(isoDatetime);
}

function nowBengali(): string {
  const now = new Date();
  const bd = new Intl.DateTimeFormat("bn-BD", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka",
  }).format(now);
  return bd;
}

// ─── API types ────────────────────────────────────────────────────────────────
interface CurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  precipitation_probability: number;
  weather_code: number;
}

interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  weather_code: number[];
}

interface DailyWeather {
  sunrise: string[];
  sunset: string[];
}

interface WeatherAPIResponse {
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

interface AQIResponse {
  current: {
    pm2_5: number;
    pm10: number;
    european_aqi: number;
  };
}

interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
  aqi: number;
  fetchedAt: string;
}

// ─── API URLs ─────────────────────────────────────────────────────────────────
const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=24.12&longitude=91.22" +
  "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation_probability,weather_code" +
  "&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m,wind_direction_10m,weather_code" +
  "&daily=sunrise,sunset&timezone=Asia%2FDhaka&forecast_days=1";

const AQI_URL =
  "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=24.12&longitude=91.22" +
  "&current=pm2_5,pm10,european_aqi&timezone=Asia%2FDhaka";

const AUTO_REFRESH_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours

const SKELETON_STAT_KEYS = ["humidity", "wind-speed", "wind-dir", "rain"];
const SKELETON_HOURLY_KEYS = ["h1", "h2", "h3", "h4", "h5", "h6"];

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`rounded animate-pulse ${className ?? ""}`}
      style={{ backgroundColor: "#2d2d2d" }}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Current conditions skeleton */}
      <div
        className="rounded-lg p-5 border"
        style={{ backgroundColor: "#1a1a1a", borderColor: "#2d2d2d" }}
      >
        <div className="flex gap-4 items-start mb-5">
          <SkeletonBlock className="w-20 h-10" />
          <SkeletonBlock className="w-32 h-6 mt-2" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SKELETON_STAT_KEYS.map((k) => (
            <SkeletonBlock key={k} className="h-16" />
          ))}
        </div>
        <div className="flex gap-3 mt-3">
          <SkeletonBlock className="w-28 h-7" />
          <SkeletonBlock className="w-24 h-7" />
          <SkeletonBlock className="w-24 h-7" />
        </div>
      </div>
      {/* Hourly skeleton */}
      <div className="flex gap-3 overflow-hidden">
        {SKELETON_HOURLY_KEYS.map((k) => (
          <SkeletonBlock key={k} className="w-24 h-28 shrink-0" />
        ))}
      </div>
    </div>
  );
}

// ─── Stat tile ────────────────────────────────────────────────────────────────
function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex flex-col gap-1.5 rounded-md px-3 py-3"
      style={{ backgroundColor: "#111111", border: "1px solid #2d2d2d" }}
    >
      <div className="flex items-center gap-1.5" style={{ color: "#6b6b6b" }}>
        {icon}
        <span className="text-[11px] uppercase tracking-wide font-semibold">
          {label}
        </span>
      </div>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}

// ─── Hourly card ──────────────────────────────────────────────────────────────
function HourlyCard({
  time,
  temp,
  rainPct,
  windSpeed,
  code,
  isCurrent,
}: {
  time: string;
  temp: number;
  rainPct: number;
  windSpeed: number;
  code: number;
  isCurrent: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center gap-1.5 rounded-lg px-3 py-3 shrink-0 w-24 border transition-colors"
      style={{
        backgroundColor: isCurrent ? "#1f1f1f" : "#141414",
        borderColor: isCurrent ? "oklch(0.4764 0.2183 22.8)" : "#2d2d2d",
        minHeight: "7rem",
      }}
    >
      <span
        className="text-[10px] font-semibold"
        style={{ color: isCurrent ? "oklch(0.6 0.18 22.8)" : "#6b6b6b" }}
      >
        {time}
      </span>
      <span className="text-lg leading-none">{weatherEmoji(code)}</span>
      <span className="text-sm font-bold text-white">
        {toBengali(Math.round(temp))}°
      </span>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[9px]" style={{ color: "#6b6b6b" }}>
          💧 {toBengali(rainPct)}%
        </span>
        <span className="text-[9px]" style={{ color: "#6b6b6b" }}>
          💨 {toBengali(Math.round(windSpeed))}
        </span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function WeatherSection() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [weatherRes, aqiRes] = await Promise.all([
        fetch(WEATHER_URL),
        fetch(AQI_URL),
      ]);
      if (!weatherRes.ok || !aqiRes.ok) throw new Error("fetch failed");
      const weatherJson: WeatherAPIResponse = await weatherRes.json();
      const aqiJson: AQIResponse = await aqiRes.json();
      setData({
        current: weatherJson.current,
        hourly: weatherJson.hourly,
        daily: weatherJson.daily,
        aqi: Math.round(aqiJson.current.european_aqi ?? 0),
        fetchedAt: nowBengali(),
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    intervalRef.current = setInterval(fetchWeather, AUTO_REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchWeather]);

  // Get current hour index for highlighting in hourly forecast
  const getCurrentHourIndex = (times: string[]): number => {
    const nowHour = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
    ).getHours();
    return times.findIndex((t) => {
      const h = Number.parseInt(t.split("T")[1]?.split(":")[0] ?? "0", 10);
      return h === nowHour;
    });
  };

  return (
    <section id="weather" aria-labelledby="weather-section-heading">
      {/* Section Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div
          className="w-1 h-7 rounded-sm shrink-0"
          style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
        />
        <h2
          id="weather-section-heading"
          className="text-base font-bold uppercase tracking-widest text-white shrink-0"
        >
          আবহাওয়া
        </h2>
        <div
          className="flex-1 h-px min-w-[20px]"
          style={{ backgroundColor: "#2d2d2d" }}
        />
        <div className="flex items-center gap-3 ml-auto">
          {data && (
            <span className="text-xs" style={{ color: "#6b6b6b" }}>
              শেষ আপডেট:{" "}
              <span style={{ color: "#9c9c9c" }}>{data.fetchedAt}</span>
            </span>
          )}
          <button
            type="button"
            data-ocid="weather.refresh.button"
            onClick={fetchWeather}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white rounded transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
            aria-label="আবহাওয়া রিফ্রেশ করুন"
          >
            {loading ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                আপডেট হচ্ছে...
              </>
            ) : (
              <>
                <RefreshCw size={13} />
                রিফ্রেশ করুন
              </>
            )}
          </button>
        </div>
      </div>

      {/* Location label */}
      <div className="flex items-center gap-1.5 mb-4">
        <MapPin
          size={14}
          style={{ color: "oklch(0.4764 0.2183 22.8)" }}
          aria-hidden="true"
        />
        <span className="text-sm font-semibold" style={{ color: "#c8c8c8" }}>
          বালীগাঁও, লাখাই, হবিগঞ্জ
        </span>
        <span className="text-xs" style={{ color: "#6b6b6b" }}>
          (২৪.১২°উ, ৯১.২২°পূ)
        </span>
      </div>

      {/* Loading state */}
      {loading && !data && <LoadingSkeleton />}

      {/* Error state */}
      {error && !loading && (
        <div
          className="flex flex-col items-center justify-center gap-4 py-12 rounded-lg border"
          data-ocid="weather.error_state"
          style={{ backgroundColor: "#1a1a1a", borderColor: "#2d2d2d" }}
        >
          <span className="text-3xl">⛅</span>
          <p className="text-sm text-center" style={{ color: "#c8c8c8" }}>
            আবহাওয়ার তথ্য লোড করা যায়নি। পুনরায় চেষ্টা করুন।
          </p>
          <button
            type="button"
            data-ocid="weather.retry.button"
            onClick={fetchWeather}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white rounded transition-opacity hover:opacity-80"
            style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
          >
            <RefreshCw size={13} />
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      )}

      {/* Weather data */}
      {!loading && !error && data && (
        <div className="flex flex-col gap-5" data-ocid="weather.section">
          {/* Current conditions card */}
          <div
            className="rounded-lg p-5 border"
            style={{ backgroundColor: "#1a1a1a", borderColor: "#2d2d2d" }}
            data-ocid="weather.card"
          >
            {/* Temperature + description */}
            <div className="flex flex-wrap items-start gap-4 mb-5">
              <div className="flex items-end gap-2">
                <span
                  className="text-5xl font-black text-white leading-none"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {toBengali(Math.round(data.current.temperature_2m))}°সে
                </span>
              </div>
              <div className="flex flex-col gap-1 mt-1">
                <span className="text-2xl leading-none">
                  {weatherEmoji(data.current.weather_code)}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#c8c8c8" }}
                >
                  {weatherDescription(data.current.weather_code)}
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <StatTile
                icon={<Droplets size={12} />}
                label="আর্দ্রতা"
                value={`${toBengali(data.current.relative_humidity_2m)}%`}
              />
              <StatTile
                icon={<Wind size={12} />}
                label="বাতাসের গতি"
                value={`${toBengali(Math.round(data.current.wind_speed_10m))} কি.মি/ঘ`}
              />
              <StatTile
                icon={<Wind size={12} />}
                label="বাতাসের দিক"
                value={windDirection(data.current.wind_direction_10m)}
              />
              <StatTile
                icon={<Thermometer size={12} />}
                label="বৃষ্টির সম্ভাবনা"
                value={`${toBengali(data.current.precipitation_probability)}%`}
              />
            </div>

            {/* AQI + Sunrise/Sunset */}
            <div className="flex flex-wrap items-center gap-3">
              {/* AQI badge */}
              {(() => {
                const info = aqiInfo(data.aqi);
                return (
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-bold"
                    style={{
                      backgroundColor: info.bg,
                      borderColor: info.color,
                      color: info.color,
                    }}
                    data-ocid="weather.aqi.panel"
                  >
                    <Eye size={12} />
                    <span>বায়ু মান (AQI): {toBengali(data.aqi)}</span>
                    <span
                      className="px-1.5 py-0.5 rounded text-white text-[10px]"
                      style={{ backgroundColor: info.color }}
                    >
                      {info.label}
                    </span>
                  </div>
                );
              })()}

              {/* Sunrise */}
              {data.daily.sunrise[0] && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border"
                  style={{
                    backgroundColor: "#111111",
                    borderColor: "#2d2d2d",
                    color: "#c8c8c8",
                  }}
                >
                  <Sunrise
                    size={13}
                    style={{ color: "#f59e0b" }}
                    aria-hidden="true"
                  />
                  <span className="font-semibold" style={{ color: "#f59e0b" }}>
                    সূর্যোদয়:
                  </span>
                  {timeToBengali(data.daily.sunrise[0])}
                </div>
              )}

              {/* Sunset */}
              {data.daily.sunset[0] && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border"
                  style={{
                    backgroundColor: "#111111",
                    borderColor: "#2d2d2d",
                    color: "#c8c8c8",
                  }}
                >
                  <Sunset
                    size={13}
                    style={{ color: "#f97316" }}
                    aria-hidden="true"
                  />
                  <span className="font-semibold" style={{ color: "#f97316" }}>
                    সূর্যাস্ত:
                  </span>
                  {timeToBengali(data.daily.sunset[0])}
                </div>
              )}
            </div>
          </div>

          {/* 24-hour hourly forecast */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-0.5 h-4 rounded-sm shrink-0"
                style={{ backgroundColor: "oklch(0.4764 0.2183 22.8)" }}
              />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "#9c9c9c" }}
              >
                ২৪ ঘন্টার পূর্বাভাস
              </span>
            </div>
            <ul
              className="flex gap-2 overflow-x-auto pb-2 list-none m-0 p-0"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#2d2d2d transparent",
              }}
              aria-label="প্রতি ঘন্টার আবহাওয়া"
            >
              {(() => {
                const currentIdx = getCurrentHourIndex(data.hourly.time);
                // Show 24 hours starting from current hour (or 0 if not found)
                const start = currentIdx >= 0 ? currentIdx : 0;
                const slots = data.hourly.time.slice(start, start + 24);
                return slots.map((isoTime, i) => {
                  const idx = start + i;
                  return (
                    <li
                      key={isoTime}
                      data-ocid={`weather.item.${i + 1}`}
                      className="shrink-0"
                    >
                      <HourlyCard
                        time={i === 0 ? "এখন" : hourLabel(isoTime)}
                        temp={data.hourly.temperature_2m[idx]}
                        rainPct={data.hourly.precipitation_probability[idx]}
                        windSpeed={data.hourly.wind_speed_10m[idx]}
                        code={data.hourly.weather_code[idx]}
                        isCurrent={i === 0}
                      />
                    </li>
                  );
                });
              })()}
            </ul>
          </div>
        </div>
      )}

      {/* Subtle loading overlay on refresh (when data already exists) */}
      {loading && data && (
        <div
          className="flex items-center justify-center gap-2 py-4 rounded mt-4"
          style={{ backgroundColor: "#141414" }}
          data-ocid="weather.loading_state"
        >
          <RefreshCw
            size={14}
            className="animate-spin"
            style={{ color: "oklch(0.4764 0.2183 22.8)" }}
          />
          <span className="text-sm" style={{ color: "#9c9c9c" }}>
            আবহাওয়ার তথ্য আপডেট হচ্ছে...
          </span>
        </div>
      )}
    </section>
  );
}
