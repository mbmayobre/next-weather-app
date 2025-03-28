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
    <div className="flex flex-wrap bg-gray-400 mt-4 w-full sm:w-3/4 p-4 rounded-2xl text-black">
      <div className="flex flex-row items-center ml-3 mb-4">
        <MdOutlineCalendarToday size={25} className="font-bold" />
        <p className="ml-3 font-semibold">8-day Forecast</p>
      </div>
      <div className="flex flex-row justify-center overflow-x-scroll pb-2 w-full">
        {weather.daily.map((day, index) => (
          <div key={index} className="flex flex-col mx-2 pt-2 pb-2 sm:pb-5 px-3 bg-gray-200 rounded-full h-full max-w-min" >
            <p className="text-center">{Math.round(day.temp.max)}°</p>
            <p className="text-center">{Math.round(day.temp.min)}°</p>
            <img
              className="flex w-full h-full object-cover my-2"
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt="Daily Weather Icon"
            />
            <p className="text-center text-xs text-gray-600">{day.pop > 0 ? `${Math.round(day.pop * 100)}%` : null}</p>
            <p className="text-center mx-auto w-10">{index === 0 ? 'Today' : formatDayAndDate(day.dt).day}</p>
            <p className="text-center">{formatDayAndDate(day.dt).date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyWeather;