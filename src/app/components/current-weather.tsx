'use client'

import { FunctionComponent, useEffect, useState } from "react";
import { weather, location } from "../lib/definitions";
import { getIconFromIcon } from "../utils/image-requests";
import { type WeatherIcon } from "../utils/dictionary";

interface CurrentWeatherProps {
  weather: weather;
  location: location;
}

export const CurrentWeather: FunctionComponent<CurrentWeatherProps> = ({ weather, location }) => {
  const [weatherIcon, setWeatherIcon] = useState<WeatherIcon>('clear-day');

  useEffect(() => {
    if (weather && location) {
      const icon = weather.current.weather[0].icon;
      const code = weather.current.weather[0].id;
      const weatherIcon = getIconFromIcon(icon, code);
      setWeatherIcon(weatherIcon);
    }
  }, [weather, location]);

  return (
    <div className="flex flex-row justify-between md:items-center bg-gray-200 dark:bg-opacity-40 bg-opacity-40 text-black dark:bg-black dark:text-white w-full py-4 px-8 rounded-2xl text-black mr-0 md:mr-4">
      <div>
        <h2 className="text-xl font-semibold mb-5">{location?.name}, {location?.country}</h2>
        <p className="text-5xl font-semibold sm:text-6xl mb-5">{Math.round(weather.current.temp)}°F</p>
        <p className="text-lg">{weather.current.weather[0].description}</p>
        <p>Feels like: {weather.current.feels_like}°F</p>
        <p className="hidden sm:block">High: {weather.daily[0].temp.max}°F - Low: {weather.daily[0].temp.min}°F</p>
        <p className="block sm:hidden">High: {weather.daily[0].temp.max}°F</p>
        <p className="block sm:hidden">Low: {weather.daily[0].temp.min}°F</p>
      </div>
      <div className="flex items-center">
        <img
          className="w-40 h-40 object-contain"
          src={`/icons/${weatherIcon}.svg`}
          alt="Weather Icon"
        />
      </div>
    </div>
  );
};

export default CurrentWeather;