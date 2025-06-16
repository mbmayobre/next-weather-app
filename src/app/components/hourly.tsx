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
    <div className="flex flex-wrap bg-gray-200 dark:bg-opacity-40 bg-opacity-40 text-black dark:bg-black dark:text-white mt-4 md:mt-0 h-[235px] w-full p-4 rounded-2xl">
      <div className="flex flex-row items-center ml-3 mb-4 mt-3">
        <TbClockHour4 size={25} className="font-bold" />
        <p className="ml-3 font-semibold">Hourly Forecast</p>
      </div>
      <div className="flex flex-row overflow-x-scroll pl-4 pt-4 pr-4 pb-8">
        {weather.hourly.slice(0, 25).map((hour, index) => (
          <div key={index} className="flex flex-col justify-center px-3 min-w-max h-full">
            <p className="flex justify-center w-full">{Math.round(hour.temp)}°</p>
            <img
              className="flex w-[40px] h-[40px] object-cover my-auto"
              src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
              alt="Hourly Weather Icon"
            />
            <p className="text-center text-xs text-blue-600 dark:text-blue-400 mb-1">{hour.pop > 0 ? `${Math.round(hour.pop * 100)}%` : null}</p>
            <p className="text-center text-xs">{formatHour(hour.dt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyWeather;