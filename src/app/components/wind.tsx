'use client'

import { FunctionComponent, useEffect, useState } from "react";
import { weather } from "../lib/definitions";
import { LiaArrowAltCircleUpSolid } from "react-icons/lia";
import { FaWind } from "react-icons/fa6";

interface WindProps {
  weather: weather;
}

export const Wind: FunctionComponent<WindProps> = ({ weather }) => {

  const convertDegreesToDirection = (degrees: number) => {
    const directions = ["North", "Northeast", "East", "Southeast", "Sout", "Southwest", "West", "Northwest"];
    return directions[Math.round(degrees / 45) % 8];
  };

  return (
    <div className="flex flex-col bg-gray-400 text-black dark:bg-black dark:text-white w-full h-[175px] rounded-2xl mt-4 p-4">
      <div className="flex flex-row justify-start ml-2 mt-2 mb-2">
        <FaWind size={25} className="font-bold" />
        <p className="ml-3 font-semibold">Wind</p>
      </div>
      <div className="flex flex-row justify-start items-center h-full">
        <p className="text-2xl font-semibold">{weather.current.wind_speed}mph</p>
      </div>
      <div className="flex flex-row justify-start items-center h-full">
        <LiaArrowAltCircleUpSolid size={30} style={{ transform: `rotate(${weather.current.wind_deg + 180}deg)` }} className='font-bold' />
        <p className="text-xs ml-4 text-gray-500 dark:text-gray-400">From {convertDegreesToDirection(weather.current.wind_deg)}</p>
      </div>
    </div>
  );
};

export default Wind;