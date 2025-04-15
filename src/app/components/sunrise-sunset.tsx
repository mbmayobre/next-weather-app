'use client'

import { FunctionComponent } from "react";
import { weather } from "../lib/definitions";
import { PiSunHorizonBold } from "react-icons/pi";
import { TbSunrise, TbSunset } from "react-icons/tb";

interface SunriseAndSunsetProps {
  weather: weather;
}

export const SunriseAndSunset: FunctionComponent<SunriseAndSunsetProps> = ({ weather }) => {
  const sunriseDate = new Date(weather.current.sunrise * 1000); // Convert to milliseconds
  const sunsetDate = new Date(weather.current.sunset * 1000); // Convert to milliseconds

  const formattedTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })};

  return (
    <div className="flex flex-col bg-gray-400 text-black dark:bg-black dark:text-white w-full h-[175px] rounded-2xl mt-4 p-4">
      <div className="flex flex-row justify-start ml-2 mt-2 mb-2">
        <PiSunHorizonBold size={25} className="font-bold" />
        <p className="ml-3 font-semibold">Sunrise & Sunset</p>
      </div>
      <div className="flex flex-col justify-center items-start h-full">
        <p className="flex flex-nowrap text-sm mb-3"><TbSunrise size={20} className="mr-2" />{formattedTime(sunriseDate)}</p>
        <p className="flex flex-nowrap text-sm"><TbSunset size={20} className="mr-2" />{formattedTime(sunsetDate)}</p>
      </div>
    </div>
  );
};

export default SunriseAndSunset;