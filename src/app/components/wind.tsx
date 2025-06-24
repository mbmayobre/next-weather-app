'use client'

import { FunctionComponent } from "react";
import { weather } from "../lib/definitions";
import { FaWind } from "react-icons/fa6";

interface WindProps {
  weather: weather;
}

export const Wind: FunctionComponent<WindProps> = ({ weather }) => {

  const convertDegreesToDirection = (degrees: number) => {
    const directions = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"];
    return directions[Math.round(degrees / 45) % 8];
  };

  return (
    <div 
      className="relative flex flex-col mr-4 bg-gray-200 dark:bg-opacity-40 bg-opacity-40 text-black dark:bg-black dark:text-white w-full h-[175px] rounded-2xl mt-4 p-4"
    >
      <div className="flex z-[2] flex-row justify-start ml-2 mt-2 mb-2">
        <FaWind size={25} />
        <p className="ml-3 font-semibold">Wind</p>
      </div>
      <div className="flex z-[2] flex-row justify-start items-center ml-2 h-full">
        <p className="text-2xl font-semibold">{weather.current.wind_speed}mph</p>
      </div>
      <div className="flex z-[2] flex-row justify-start items-center ml-2 h-full">
        <p className="text-xs ml-4 text-gray-800 dark:text-gray-400">From {convertDegreesToDirection(weather.current.wind_deg)}</p>
      </div>
      <img
        src="/icons/arrow.svg"
        alt="Wind Direction"
        className="absolute z-[1] opacity-75 w-[125px] h-[125px] inset-y-auto inset-x-auto self-center"
        style={{ transform: `rotate(${weather.current.wind_deg + 180}deg)` }}
      />
    </div>
  );
};

export default Wind;