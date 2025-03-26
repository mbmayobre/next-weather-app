'use client'

import { FunctionComponent } from "react";
import { weather } from "../lib/definitions";
import { TbClockHour4 } from "react-icons/tb";

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
    <div className="flex flex-wrap bg-gray-400 mt-4 w-full sm:w-3/4 p-4 rounded-2xl text-black">
      <div className="flex flex-row items-center ml-3 mb-4">
        <TbClockHour4 size={25} className="font-bold" />
        <p className="ml-3 font-semibold">Hourly Forecast</p>
      </div>
      <div className="flex flex-row overflow-x-scroll pb-2">
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
    </div>
  );
};

export default HourlyWeather;