'use client'

import { FunctionComponent } from "react";
import { weather } from "../lib/definitions";
import { MdCompress } from "react-icons/md";

interface PressureProps {
  weather: weather;
}

export const Pressure: FunctionComponent<PressureProps> = ({ weather }) => {

  return (
    <div className="flex flex-col bg-gray-400 text-black dark:bg-black dark:text-white w-full h-[175px] rounded-2xl mt-4 p-4">
      <div className="flex flex-row justify-start ml-2 mt-2 mb-2">
        <MdCompress size={25} className="font-bold" />
        <p className="ml-3 font-semibold">Pressure</p>
      </div>
      <div className="flex flex-row justify-start items-center ml-2 h-full">
        <p className="text-2xl font-semibold">{(weather.current.pressure * 0.02953).toFixed(2)}</p>
      </div>
      <div className="flex flex-row justify-between items-center ml-2 h-full">
        <p className="text-xs text-gray-500 dark:text-gray-400">inHg</p>
      </div>
    </div>
  );
};

export default Pressure;