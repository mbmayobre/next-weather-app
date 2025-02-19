export type local_names = {
  ascii: string;
  feature_name: string;
  [key: string]: string; // Allows any additional language codes
};

export type location = {
  name: string;
  local_names: local_names;
  lat: number;
  lon: number;
  country: string;
};

export type quick_weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type current_weather = {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: quick_weather[];
};

export type minutely_weather = {
  dt: number;
  precipitation: number;
};

export type hourly_weather = {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: quick_weather[];
  pop: number;
};

export type daily_weather = {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  summary: string;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust: number;
  weather: quick_weather[];
  clouds: number;
  pop: number;
  rain: number;
  uvi: number;
};

export type weather_alert = {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: any[];
};

export type weather = {
  current: any;
  daily: daily_weather[];
  hourly: hourly_weather[];
  lat: number;
  lon: number;
  minutely: minutely_weather[];
  timezone: string;
  timezone_offset: number;
  alerts: weather_alert[];
};