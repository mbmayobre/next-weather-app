'use client'

import { FunctionComponent } from "react";
import { air_quality } from "../lib/definitions";
import { PiWavesBold } from "react-icons/pi";

interface AQIProps {
  data: air_quality;
}

export const AQI: FunctionComponent<AQIProps> = ({ data }) => {
  const aqiLevel = (aqi: number) => {
    if (aqi === 1) return "Good";
    if (aqi === 2) return "Fair";
    if (aqi === 3) return "Moderate";
    if (aqi === 4) return "Poor";
    return "Very Poor";
  };

  return (
    <div className="flex flex-col bg-gray-400 text-black dark:bg-black dark:text-white w-full h-[175px] rounded-2xl mt-4 p-4">
      <div className="flex flex-row justify-start ml-2 mt-2 mb-2">
        <PiWavesBold size={25} />
        <p className="ml-3 font-semibold">Air Quality</p>
      </div>
      <div className="flex flex-row justify-start items-center ml-2 h-full">
        <p className="text-2xl font-semibold">{data.list[0].main.aqi}</p>
      </div>
      <div className="flex flex-row justify-between items-center ml-2 h-full">
        <p className="text-xs text-gray-500 dark:text-gray-400">{aqiLevel(data.list[0].main.aqi)} air quality</p>
      </div>
    </div>
  );
};

export default AQI;