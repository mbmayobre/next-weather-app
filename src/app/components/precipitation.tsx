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
    <div className="flex flex-col bg-gray-400 text-black dark:bg-black dark:text-white w-[200px] h-[200px] rounded-2xl mt-4 p-4">
      <div className="flex flex-row justify-start ml-2 mt-2 mb-2">
        <GiHeavyRain size={25} className="font-bold" />
        <p className="ml-3 font-semibold">Precipitation</p>
      </div>
      <div className="flex flex-row justify-start items-center h-full">
        {!weather.daily[0].rain && <p className="text-2xl font-semibold">0.00in</p>}
        {weather.daily[0].rain && <p className="text-2xl font-semibold">{convertMillimetersToInches(weather.daily[0].rain)}in</p>}
      </div>
      <div className="flex flex-row justify-between items-center h-full">
        <p className="text-xs text-gray-500 dark:text-gray-400">Total rain for the day</p>
        <img
          className="w-15 h-15 object-cover"
          src={`https://openweathermap.org/img/wn/09d@2x.png`}
          alt="Weather Icon"
        />
      </div>
    </div>
  );
};

export default Precipitation;