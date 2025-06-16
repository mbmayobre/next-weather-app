'use client'

import { FunctionComponent } from "react";
import { weather } from "../lib/definitions";
import { MdOutlineCalendarToday } from "react-icons/md";

interface DailyWeatherProps {
  weather: weather;
}

export const DailyWeather: FunctionComponent<DailyWeatherProps> = ({ weather }) => {
  const formatDayAndDate = (timestamp: number): { day: string; date: string } => {
    const date = new Date(timestamp * 1000);
  
    const day = date.toLocaleDateString('en-US', {
      weekday: 'short', // Mon, Tue, etc.
    });
  
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'numeric', // 1-12
      day: 'numeric',   // 1-31
    });
  
    return {
      day,
      date: formattedDate, // e.g. "3/25"
    };
  }

  return (
    <div className="flex flex-col flex-wrap bg-gray-200 dark:bg-opacity-40 bg-opacity-40 text-black dark:bg-black dark:text-white w-full rounded-2xl mt-4 p-4">
      <div className="flex flex-row items-center ml-3 mb-4 mt-3">
        <MdOutlineCalendarToday size={25} className="font-bold" />
        <p className="ml-3 font-semibold">7-day Forecast</p>
      </div>
      <div className="flex flex-wrap overflow-x-auto w-full p-4">
        <div className="flex flex-row mx-auto">
          {weather.daily.map((day, index) => (
            <div key={index} className="flex flex-col mx-1 py-5 px-3 bg-gray-300 dark:bg-gray-800 rounded-full h-full max-w-min" >
              <p className="text-center">{Math.round(day.temp.max)}°</p>
              <p className="text-center text-gray-700 dark:text-gray-500">{Math.round(day.temp.min)}°</p>
              <img
                className="flex w-full h-full object-cover my-2"
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                alt="Daily Weather Icon"
              />
              <p className="text-center text-xs text-blue-600 dark:text-blue-400">{day.pop > 0 ? `${Math.round(day.pop * 100)}%` : null}</p>
              <p className="text-center mx-auto w-10">{index === 0 ? 'Today' : formatDayAndDate(day.dt).day}</p>
              <p className="text-center text-gray-700 dark:text-gray-500">{formatDayAndDate(day.dt).date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyWeather;