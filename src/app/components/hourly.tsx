'use client'

import { FunctionComponent } from "react";
import { weather } from "../lib/definitions";

interface HourlyProps {
  weather: weather;
}

export const HourlyWeather: FunctionComponent<HourlyProps> = ({ weather }) => {

  const formatHour = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const formatted = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
    });
  
    // Replace the regular space with a non-breaking space (\u00A0)
    return formatted.replace(' ', '\u00A0');
  }
  

  return (
    <div className="flex flex-row bg-gray-400 mt-6 w-3/4 p-4 rounded-2xl text-black overflow-x-scroll">
      {weather.hourly.map((hour, index) => (
        <div key={index} className="flex flex-col justify-center mx-3 w-auto">
          <p className="flex justify-center w-full">{Math.round(hour.temp)}°</p>
          <img
            className="flex w-full h-full object-cover my-2"
            src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
            alt="Hourly Weather Icon"
          />
          <p className="text-xs">{formatHour(hour.dt)}</p>
        </div>
      ))}
    </div>
  );
};

export default HourlyWeather;