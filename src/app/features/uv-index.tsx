'use client'

import { FunctionComponent, useState, useEffect } from "react";
import { weather } from "../lib/definitions";
import { PiSunBold } from "react-icons/pi";
import { getUVIndexBackgroundFromValue } from "../utils/image-requests";
import { UVIndexBackground, uvIndexClassMap } from "../utils/dictionary";

interface UVIProps {
  weather: weather;
}

export const UVI: FunctionComponent<UVIProps> = ({ weather }) => {
  const [bg, setBg] = useState<UVIndexBackground>("uv-index-moderate");
  const [uvi, setUvi] = useState<number>(0);

  useEffect(() => {
    if (weather && weather.current) {
      const uviValue = Math.round(weather.current.uvi);
      setUvi(uviValue);
      const background = getUVIndexBackgroundFromValue(uviValue);
      setBg(background);
    }
  }, [weather]);

  const uviLevel = (uvi: number) => {
    if (uvi <= 2) return "Low";
    if (uvi <= 5) return "Moderate";
    if (uvi <= 7) return "High";
    if (uvi <= 10) return "Very High";
    return "Extreme";
  };

  return (
    <div className={`flex flex-col size-full bg-gray-200 ${uvIndexClassMap[bg]} bg-contain bg-no-repeat bg-center dark:bg-opacity-40 bg-opacity-40 text-black dark:bg-black dark:text-white rounded-2xl p-4 pb-8`}>
      <div className="flex flex-row justify-start ml-2 mt-2 mb-2">
        <PiSunBold size={20} className="font-bold my-auto" />
        <p className="ml-3 text-sm lg:text-lg font-semibold">UV Index</p>
      </div>
      <div className="flex flex-row justify-center items-center ml-2 h-full">
        <p className="text-2xl font-semibold">{uvi}</p>
      </div>
      <div className="flex flex-row justify-center items-center ml-2 mb-2 h-full">
        <p className="text-xs text-gray-800 dark:text-gray-400">{uviLevel(uvi)}</p>
      </div>
    </div>
  );
};

export default UVI;