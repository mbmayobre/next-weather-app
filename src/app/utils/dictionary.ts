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
