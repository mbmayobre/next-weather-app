'use client'

import { FunctionComponent, useEffect, useState, useCallback } from "react";
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
        <p className="ml-3 font-semibold">Hourly Forecast</p>
      </div>
      <div className="flex flex-row overflow-x-scroll pb-2">
        {weather.daily.map((day, index) => (
          <div key={index} className="flex flex-col justify-center bg-gray-200 w-auto" >
            <p>{Math.round(day.temp.max)}°</p>
            <p>{Math.round(day.temp.min)}°</p>
            <img
              className="flex w-full h-full object-cover my-2"
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt="Daily Weather Icon"
            />
            <p>{index === 0 ? 'Today' : formatDayAndDate(day.dt).day}</p>
            <p>{formatDayAndDate(day.dt).date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyWeather;