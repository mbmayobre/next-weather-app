'use client'

import { FunctionComponent, useEffect, useState, useCallback } from "react";
import { weather } from "../lib/definitions";
import { MdOutlineCalendarToday } from "react-icons/md";

interface WeekProps {
  weather: weather;
}

export const WeekWeather: FunctionComponent<WeekProps> = ({ weather }) => {

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
          </div>
        ))}
      </div>
    </div>
  );
};