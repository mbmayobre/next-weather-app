'use client'

import { FunctionComponent } from "react";
import { weather } from "../lib/definitions";
import { PiSunBold } from "react-icons/pi";

interface UVIProps {
  weather: weather;
}

export const UVI: FunctionComponent<UVIProps> = ({ weather }) => {
  const uviLevel = (uvi: number) => {
    if (uvi <= 2) return "Low";
    if (uvi <= 5) return "Moderate";
    if (uvi <= 7) return "High";
    if (uvi <= 10) return "Very High";
    return "Extreme";
  };

  return (
    <div className="flex flex-col bg-gray-200 text-black dark:bg-black dark:text-white w-full h-[175px] rounded-2xl mt-4 mr-4 p-4">
      <div className="flex flex-row justify-start ml-2 mt-2 mb-2">
        <PiSunBold size={25} className="font-bold" />
        <p className="ml-3 font-semibold">UV Index</p>
      </div>
      <div className="flex flex-row justify-start items-center ml-2 h-full">
        <p className="text-2xl font-semibold">{weather.current.uvi}</p>
      </div>
      <div className="flex flex-row justify-between items-center ml-2 h-full">
        <p className="text-xs text-gray-800 dark:text-gray-400">{uviLevel(weather.current.uvi)}</p>
      </div>
    </div>
  );
};

export default UVI;