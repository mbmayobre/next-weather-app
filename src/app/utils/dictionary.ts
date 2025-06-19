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
  | 'very-cloudy'

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
} 
