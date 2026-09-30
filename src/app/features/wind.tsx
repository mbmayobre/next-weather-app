'use client'

/**
 * Wind speed and direction, with an arrow that rotates to match.
 *
 * Two conversions worth knowing:
 * - `wind_deg` is the direction the wind is coming FROM, in degrees clockwise
 *   from north. Dividing by 45 and rounding maps it onto the 8-point compass
 *   (the % 8 wraps 360 degrees back around to "North").
 * - The arrow image points "up" by default, so it is rotated by deg + 180 to
 *   show the direction the wind is blowing TOWARDS, which is what reads
 *   naturally as an arrow.
 */
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
      className="relative flex flex-col size-full mr-4 bg-gray-200 dark:bg-opacity-40 bg-opacity-40 text-black dark:bg-black dark:text-white rounded-2xl p-4"
    >
      <div className="flex z-[2] flex-row justify-start ml-2 mt-2 mb-2">
        <FaWind size={20} className="my-auto" />
        <p className="ml-3 text-sm lg:text-lg font-semibold">Wind</p>
      </div>
      <div className="flex z-[2] flex-row justify-start items-center ml-2 h-full">
        <p className="text-2xl font-semibold">{weather.current.wind_speed}mph</p>
      </div>
      <div className="flex z-[2] flex-row justify-start items-center ml-2 h-full">
        <p className="text-xs text-gray-800 dark:text-gray-400">From {convertDegreesToDirection(weather.current.wind_deg)}</p>
      </div>
      <img
        src="/icons/arrow.svg"
        alt="Wind Direction"
        className="absolute z-[1] opacity-75 w-[125px] h-[125px] top-1/2 left-1/2"
        style={{
          transform: `translate(-50%, -50%) rotate(${weather.current.wind_deg + 180}deg)`,
        }}
      />
    </div>
  );
};

export default Wind;