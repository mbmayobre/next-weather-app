'use client'

import { weather, location } from "../lib/definitions";

interface CurrentWeatherProps {
  weather: weather;
  location: location;
}

export default function CurrentWeather({ weather, location }: CurrentWeatherProps) {

  return (
    <div className="bg-gray-100 mt-20 w-full sm:w-3/4 p-4 rounded-md text-black">
      <h2 className="text-xl font-semibold">{location?.name}, {location?.country}</h2>
      <p className="text-lg">{weather.current.weather[0].description}</p>
      <p className="text-2xl">{weather.current.temp}°F</p>
      <p>Feels like: {weather.current.feels_like}°F</p>
      <p>High: {weather.daily[0].temp.max}°F - Low: {weather.daily[0].temp.min}°F</p>
    </div>
  );
};