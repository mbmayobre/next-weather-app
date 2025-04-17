'use client'

import { FunctionComponent } from "react";
import { weather } from "../lib/definitions";
import { GiWaterDrop } from "react-icons/gi";

interface HumidityProps {
  weather: weather;
}

export const Humidity: FunctionComponent<HumidityProps> = ({ weather }) => {

  return (
    <div className="flex flex-col bg-gray-200 text-black dark:bg-black dark:text-white w-full h-[175px] rounded-2xl mt-4 p-4">
      <div className="flex flex-row justify-start ml-2 mt-2 mb-2">
        <GiWaterDrop size={25} className="font-bold" />
        <p className="ml-3 font-semibold">Humidity</p>
      </div>
      <div className="flex flex-row justify-start items-center ml-2 h-full">
        <p className="text-2xl font-semibold">{weather.current.humidity}%</p>
      </div>
      <div className="flex flex-row justify-between items-center ml-2 h-full">
        <p className="text-xs text-gray-800 dark:text-gray-400">{weather.current.dew_point}° Dew Point</p>
      </div>
    </div>
  );
};

export default Humidity;