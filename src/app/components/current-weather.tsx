'use client'

import { FunctionComponent } from "react";
import { weather, location } from "../lib/definitions";

interface CurrentWeatherProps {
  weather: weather;
  location: location;
}

export const CurrentWeather: FunctionComponent<CurrentWeatherProps> = ({ weather, location }) => {

  return (
    <div className="flex flex-row justify-between bg-gray-400 mt-20 w-full py-4 px-8 rounded-2xl text-black">
      <div>
        <h2 className="text-xl font-semibold mb-5">{location?.name}, {location?.country}</h2>
        <p className="text-6xl mb-5">{weather.current.temp}°F</p>
        <p className="text-lg">{weather.current.weather[0].description}</p>
        <p>Feels like: {weather.current.feels_like}°F</p>
        <p>High: {weather.daily[0].temp.max}°F - Low: {weather.daily[0].temp.min}°F</p>
      </div>
      <div className="flex items-center">
        <img
          className="w-40 h-40 object-cover"
          src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`}
          alt="Weather Icon"
        />
      </div>
    </div>
  );
};

export default CurrentWeather;