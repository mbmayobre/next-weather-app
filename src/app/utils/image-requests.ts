import { Background, WeatherIcon, PressureBackground, HumidityBackground } from './dictionary';

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

export function getIconFromCode(code: number): WeatherIcon {
  switch (true) {
    case code === 200 && code < 210:
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