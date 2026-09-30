/**
 * Shared vocabulary for artwork: the set of valid names, and the literal
 * Tailwind class for each one.
 *
 * WHY THE CLASS MAPS EXIST — the least obvious thing in this codebase.
 *
 * Tailwind does not parse your JavaScript. At build time it scans source files
 * for strings that look like class names and generates CSS only for what it
 * finds. So this silently produces no CSS at all:
 *
 *     <div className={`bg-${bg}`} />        // Tailwind never sees "bg-cloudy"
 *
 * Writing every class out in full below means the scanner finds them, while
 * components stay dynamic by doing `className={bgClassMap[bg]}`.
 *
 * Consequence: these maps are NOT dead code even if an entry looks unused.
 * Deleting one removes the generated CSS and the artwork silently disappears.
 * sunrise-sunset.tsx depends on exactly this — it builds `bg-sunrise-${idx}`
 * inline, and it only works because sunriseClassMap spells those names out.
 *
 * The union types serve a second purpose: they make a typo a compile error
 * instead of a missing image at runtime.
 */
export type Background =
  | 'thunderstorm'
  | 'light-rain'
  | 'rain'
  | 'snow'
  | 'fog'
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'cloudy'
  | 'home';

export type WeatherIcon =
  | 'clear-day'
  | 'clear-night'
  | 'cloudy'
  | 'cloudy-day'
  | 'cloudy-night'
  | 'drizzle'
  | 'few-clouds-night'
  | 'few-clouds-day'
  | 'freezing-rain'
  | 'heavy-rain'
  | 'heavy-snow'
  | 'heavy-thunder'
  | 'light-rain'
  | 'light-snow'
  | 'light-thunder'
  | 'mist'
  | 'rain-and-snow'
  | 'rain'
  | 'snow'
  | 'thunder-and-rain'
  | 'thunder'
  | 'very-cloudy';

export type PressureBackground =
  | 'pressure-very-low'
  | 'pressure-low'
  | 'pressure-normal'
  | 'pressure-high'
  | 'pressure-very-high';

export type HumidityBackground =
  | 'humidity-very-low'
  | 'humidity-low'
  | 'humidity-moderate'
  | 'humidity-high'
  | 'humidity-very-high';

export type AirQualityBackground =
  | 'air-quality-very-poor'
  | 'air-quality-poor'
  | 'air-quality-moderate'
  | 'air-quality-fair'
  | 'air-quality-good';

export type UVIndexBackground =
  | 'uv-index-low'
  | 'uv-index-moderate'
  | 'uv-index-high'
  | 'uv-index-very-high'
  | 'uv-index-extreme';

export type SunriseIcon =
  | 'sunrise-0'
  | 'sunrise-1'
  | 'sunrise-2'
  | 'sunrise-3'
  | 'sunrise-4'
  | 'sunrise-5'
  | 'sunrise-6'
  | 'sunrise-7'
  | 'sunrise-8'
  | 'sunrise-9'
  | 'sunrise-10'
  | 'sunrise-11'
  | 'sunrise-12'
  | 'sunrise-13'
  | 'sunrise-14'
  | 'sunrise-15';

export const bgClassMap: Record<Background, string> = {
  'thunderstorm':        'bg-thunderstorm',
  'light-rain':          'bg-light-rain',
  'rain':                'bg-rain',
  'snow':                'bg-snow',
  'fog':                 'bg-fog',
  'clear-day':           'bg-clear-day',
  'clear-night':         'bg-clear-night',
  'partly-cloudy-day':   'bg-partly-cloudy-day',
  'partly-cloudy-night': 'bg-partly-cloudy-night',
  'cloudy':              'bg-cloudy',
  'home':                'bg-home',
};

export const pressureClassMap: Record<PressureBackground, string> = {
  'pressure-very-low':  'bg-pressure-very-low',
  'pressure-low':       'bg-pressure-low',
  'pressure-normal':    'bg-pressure-normal',
  'pressure-high':      'bg-pressure-high',
  'pressure-very-high': 'bg-pressure-very-high',
};

export const humidityClassMap: Record<HumidityBackground, string> = {
  'humidity-very-low':  'bg-humidity-very-low',
  'humidity-low':       'bg-humidity-low',
  'humidity-moderate':  'bg-humidity-moderate',
  'humidity-high':      'bg-humidity-high',
  'humidity-very-high': 'bg-humidity-very-high',
};

export const airQualityClassMap: Record<AirQualityBackground, string> = {
  'air-quality-very-poor': 'bg-air-quality-very-poor',
  'air-quality-poor':      'bg-air-quality-poor',
  'air-quality-moderate':  'bg-air-quality-moderate',
  'air-quality-fair':      'bg-air-quality-fair',
  'air-quality-good':      'bg-air-quality-good',
};

export const uvIndexClassMap: Record<UVIndexBackground, string> = {
  'uv-index-low':       'bg-uv-index-low',
  'uv-index-moderate':  'bg-uv-index-moderate',
  'uv-index-high':      'bg-uv-index-high',
  'uv-index-very-high': 'bg-uv-index-very-high',
  'uv-index-extreme':   'bg-uv-index-extreme',
};

export const sunriseClassMap: Record<SunriseIcon, string> = {
  'sunrise-0':  'bg-sunrise-0',
  'sunrise-1':  'bg-sunrise-1',
  'sunrise-2':  'bg-sunrise-2',
  'sunrise-3':  'bg-sunrise-3',
  'sunrise-4':  'bg-sunrise-4',
  'sunrise-5':  'bg-sunrise-5',
  'sunrise-6':  'bg-sunrise-6',
  'sunrise-7':  'bg-sunrise-7',
  'sunrise-8':  'bg-sunrise-8',
  'sunrise-9':  'bg-sunrise-9', 
  'sunrise-10': 'bg-sunrise-10',
  'sunrise-11': 'bg-sunrise-11',
  'sunrise-12': 'bg-sunrise-12',
  'sunrise-13': 'bg-sunrise-13',
  'sunrise-14': 'bg-sunrise-14',
  'sunrise-15': 'bg-sunrise-15',
};
