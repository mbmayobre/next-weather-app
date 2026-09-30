/**
 * TypeScript shapes for the OpenWeatherMap responses. Names are lowercase and
 * snake_case because they mirror the API's own fields.
 *
 * IMPORTANT: these are a promise, not a guarantee. The JSON is cast to these
 * types in weather.tsx without being validated at runtime, so if the API
 * changes a field, TypeScript stays happy and the app breaks in the browser. A
 * schema validator (Zod or similar) in the Route Handlers would close that gap.
 *
 * Some fields are also optional in practice but typed as required — most
 * notably `daily[].rain`, which is absent when no rain is forecast, and
 * `alerts`, which is absent when there is nothing to report. Both call sites
 * guard for that; watch for it when using other fields.
 */
export type local_names = {
  ascii: string;
  feature_name: string;
  [key: string]: string; // Allows any additional language codes
};

// A single place, as returned by /api/geocode. The route always hands back one
// of these, whether the lookup was by zip, city name or coordinates.
// `local_names` is only present on reverse and direct lookups, not zip.
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
  tags: string[];
};

// The full One Call 3.0 payload — the object almost every feature card takes
// as its `weather` prop. `timezone` is an IANA name (e.g. "America/Chicago")
// for the searched location, used by sunrise-sunset.tsx.
export type weather = {
  current: current_weather;
  daily: daily_weather[];
  hourly: hourly_weather[];
  lat: number;
  lon: number;
  minutely: minutely_weather[];
  timezone: string;
  timezone_offset: number;
  alerts: weather_alert[];
};

// Air Pollution API payload. `list[0].main.aqi` is a 1-5 index
// (1 = good ... 5 = very poor), not the US EPA 0-500 scale.
export type air_quality = {
  coord: [
    number,
    number,
  ];
  list: {
    dt: number;
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
  }[];
};