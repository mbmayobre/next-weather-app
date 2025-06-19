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

export function getBackgroundFromIcon(icon: string, code: number): Background {
  const isDay   = icon.endsWith('d');

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
