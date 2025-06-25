'use client'

import { FunctionComponent } from "react";
import { weather } from "../lib/definitions";
import { GiHeavyRain } from "react-icons/gi";

interface PrecipitationProps {
  weather: weather;
}

export const Precipitation: FunctionComponent<PrecipitationProps> = ({ weather }) => {
  const convertMillimetersToInches = (mm: number) => {
    return (mm / 25.4).toFixed(2);
  };

  return (
    <div className="flex flex-col size-full bg-gray-200 dark:bg-opacity-40 bg-opacity-40 text-black dark:bg-black dark:text-white rounded-2xl p-4">
      <div className="flex flex-row justify-start ml-2 mt-2 mb-2">
        <GiHeavyRain size={20} className="font-bold" />
        <p className="ml-3 text-sm font-semibold">Precipitation</p>
      </div>
      <div className="flex flex-row justify-start items-center ml-2 h-full">
        {!weather.daily[0].rain && <p className="text-2xl font-semibold my-auto">0.00in</p>}
        {weather.daily[0].rain && <p className="text-2xl font-semibold">{convertMillimetersToInches(weather.daily[0].rain)}in</p>}
      </div>
      <div className="flex flex-row justify-between items-center ml-2 h-full">
        <div>
          <p className="text-xs text-wrap text-gray-800 dark:text-gray-400">Total rain</p>
          <p className="text-xs text-wrap text-gray-800 dark:text-gray-400">for the day</p>
        </div>
        <div className="flex items-center">
          <img
            className="w-10 h-10 object-contain"
            src={`/icons/rain.svg`}
            alt="Weather Icon"
          />
        </div>
      </div>
    </div>
  );
};

export default Precipitation;