/**
 * Pure mapping functions: a weather code or a measurement goes in, the name of
 * an icon or background comes out. No React, no I/O — which also makes this the
 * easiest file in the project to unit test.
 *
 * OpenWeatherMap describes conditions two ways, and both are used here:
 * - `id`   a numeric condition code, grouped in ranges: 2xx thunderstorm,
 *          3xx drizzle, 5xx rain, 6xx snow, 7xx atmosphere (mist/fog/haze),
 *          800 clear, 80x clouds. Full list:
 *          https://openweathermap.org/weather-conditions
 * - `icon` a short code such as "02d" / "02n", where the last character is d
 *          for day or n for night.
 *
 * Every function uses the `switch (true)` idiom: each case is a boolean
 * expression and the first true one wins. It reads like an if/else chain but
 * keeps the range checks lined up.
 *
 * The returned strings are union types from dictionary.ts, so a name that does
 * not exist will not compile.
 */
import { Background, WeatherIcon, PressureBackground, HumidityBackground, AirQualityBackground, UVIndexBackground } from './dictionary';

// Full-page background from the condition code alone (no day/night variant).
// Anything unmapped falls back to 'home', the neutral default background.
export function getBackgroundFromCode(code: number): Background {
  switch (true) {
    case code >= 200 && code < 300:
      return 'thunderstorm';
    case code >= 300 && code < 400:
      return 'light-rain';
    case code >= 500 && code < 600:
      return 'rain';
    case code >= 600 && code < 700:
      return 'snow';
    case code >= 700 && code < 800:
      return 'fog';
    case code === 804:
      return 'cloudy';
    default:
      return 'home';
  }
}

export function getPressureBackgroundFromValue(value: number): PressureBackground {
  switch (true) {
    case value < 29.4:
      return 'pressure-very-low';
    case value >= 29.4 && value < 29.8:
      return 'pressure-low';
    case value >= 29.8 && value < 30.2:
      return 'pressure-normal';
    case value >= 30.2 && value < 30.5:
      return 'pressure-high';
    case value >= 30.5:
      return 'pressure-very-high';
    default:
      return 'pressure-normal';
  }
}

// Card/forecast icon from the condition code. The thunderstorm range is
// checked as 200-209 (not code === 200) so 201 and 202 - moderate and heavy
// thunderstorms - do not fall through to the 'clear-day' default.
export function getIconFromCode(code: number): WeatherIcon {
  switch (true) {
    case code >= 200 && code < 210:
      return 'thunder-and-rain';
    case code === 210:
      return 'light-thunder';
    case code === 211 || code === 221:
      return 'thunder';
    case code === 212:
      return 'heavy-thunder';
    case code === 230 || code === 231 || code === 232:
      return 'thunder-and-rain';
    case code >= 300 && code <= 321:
      return 'drizzle';
    case code === 500 || code === 520:
      return 'light-rain';
    case code === 501 || code === 521:
      return 'rain';
    case code >= 502 && code <= 504:
      return 'heavy-rain';
    case code === 511 || code === 611 || code === 612 || code === 613:
      return 'freezing-rain';
    case code === 522 || code === 531:
      return 'heavy-rain';
    case code === 600 || code === 620:
      return 'light-snow';
    case code === 601 || code === 621:
      return 'snow';
    case code === 602 || code === 622:
      return 'heavy-snow';
    case code === 615 || code === 616:
      return 'rain-and-snow';
    case code >= 701 && code <= 781:
      return 'mist';
    case code === 800:
      return 'clear-day';
    case code === 801:
      return 'few-clouds-day';
    case code === 802:
      return 'cloudy-day';
    case code === 803:
      return 'cloudy';
    case code === 804:
      return 'very-cloudy';
    default:
      return 'clear-day';
  }
}

export function getHumidityBackgroundFromValue(value: number): HumidityBackground {
  switch (true) {
    case value < 20:
      return 'humidity-very-low';
    case value >= 20 && value < 40:
      return 'humidity-low';
    case value >= 40 && value < 60:
      return 'humidity-moderate';
    case value >= 60 && value < 80:
      return 'humidity-high';
    case value >= 80:
      return 'humidity-very-high';
    default:
      return 'humidity-moderate';
  }
}

export function getAirQualityBackgroundFromValue(value: number): AirQualityBackground {
  switch (true) {
    case value === 1:
      return 'air-quality-good';
    case value === 2:
      return 'air-quality-fair';
    case value === 3:
      return 'air-quality-moderate';
    case value === 4:
      return 'air-quality-poor';
    case value === 5:
      return 'air-quality-very-poor';
    default:
      return 'air-quality-moderate';
  }
}

export function getUVIndexBackgroundFromValue(value: number): UVIndexBackground {
  switch (true) {
    case value <= 2:
      return 'uv-index-low';
    case value > 2 && value <= 5:
      return 'uv-index-moderate';
    case value > 5 && value <= 7:
      return 'uv-index-high';
    case value > 7 && value <= 10:
      return 'uv-index-very-high';
    case value > 10:
      return 'uv-index-extreme';
    default:
      return 'uv-index-moderate';
  }
}

// Day/night-aware wrapper around getBackgroundFromCode. Only clear and partly
// cloudy skies have separate night artwork; rain looks the same after dark, so
// everything else defers to the code-only mapping.
export function getBackgroundFromIcon(icon: string, code: number): Background {
  const isDay = icon.endsWith('d');

  // clear
  if (code === 800) {
    return isDay ? 'clear-day' : 'clear-night';
  }

  // partly-cloudy (“few clouds” / OpenWeather code 801)
  if (code >= 801 && code < 804) {
    return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night';
  }

  // for everything else, just fall back to the existing mapping
  return getBackgroundFromCode(code);
}

// Day/night-aware wrapper around getIconFromCode. This is the one the feature
// components call; prefer it over getIconFromCode so night icons are used.
export function getIconFromIcon(icon: string, code: number): WeatherIcon {
  const isDay = icon.endsWith('d');

  // clear
  if (code === 800) {
    return isDay ? 'clear-day' : 'clear-night';
  }

  // few clouds
  if (code === 801) {
    return isDay ? 'few-clouds-day' : 'few-clouds-night';
  }

  // cloudy
  if (code === 802) {
    return isDay ? 'cloudy-day' : 'cloudy-night';
  }

  // for everything else, just fall back to the existing mapping
  return getIconFromCode(code);
}

/**
 * @param nowSec   – the API’s current time, in UNIX seconds (weather.current.dt)
 * @param sunrise  – API sunrise time, in UNIX seconds
 * @param sunset   – API sunset time, in UNIX seconds
 * @returns        – icon index 0…15
 *
 * Picks one of 16 sun-position images for the sunrise/sunset card. The daytime
 * slots are allocated by PROPORTION of the day elapsed rather than by clock
 * hours, so the artwork stays correct for a 6-hour winter day in Alaska and an
 * 18-hour summer one alike.
 */
export function getSunriseIconIndex(
  nowSec: number,
  sunrise: number,
  sunset: number
): number {
  const nowMs  = nowSec  * 1_000;
  const riseMs = sunrise * 1_000;
  const setMs  = sunset  * 1_000;
  const H      = 3_600_000;  // ms in 1 hour

  // 0: night (≤ 2h before sunrise)
  if (nowMs <= riseMs - 2 * H) return 0;
  // 1: 1–2h before sunrise
  if (nowMs <= riseMs -     H) return 1;
  // 2: up to sunrise
  if (nowMs <= riseMs)          return 2;

  // 3–13: daytime split into 11 slots
  if (nowMs < setMs) {
    const daylight = setMs - riseMs;
    const elapsed  = nowMs  - riseMs;
    const slot     = Math.ceil((elapsed / daylight) * 11);
    return 2 + slot;  // maps slot 1…11 → icon 3…13
  }

  // 14: at sunset
  if (nowMs <= setMs)      return 14;
  // 15: up to 1h after sunset
  if (nowMs <= setMs + H)  return 15;

  // otherwise, back to night
  return 0;
}
