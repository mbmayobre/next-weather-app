'use client'

import { FunctionComponent, useState, useEffect } from "react";
import { air_quality } from "../lib/definitions";
import { PiWavesBold } from "react-icons/pi";
import { getAirQualityBackgroundFromValue } from "../utils/image-requests";
import { AirQualityBackground, airQualityClassMap } from "../utils/dictionary";

interface AQIProps {
  data: air_quality;
}

export const AQI: FunctionComponent<AQIProps> = ({ data }) => {
  const [bg, setBg] = useState<AirQualityBackground>("air-quality-moderate");

  useEffect(() => {
    if (data && data.list && data.list.length > 0) {
      const aqiValue = data.list[0].main.aqi;
      const background = getAirQualityBackgroundFromValue(aqiValue);
      setBg(background);
    }
  }, [data]);

  const aqiLevel = (aqi: number) => {
    if (aqi === 1) return "Good";
    if (aqi === 2) return "Fair";
    if (aqi === 3) return "Moderate";
    if (aqi === 4) return "Poor";
    return "Very Poor";
  };

  return (
    <div className={`flex flex-col size-full ${airQualityClassMap[bg]} bg-contain bg-no-repeat [background-position:50%_10px] bg-gray-200 dark:bg-opacity-40 bg-opacity-40 text-black dark:bg-black dark:text-white rounded-2xl p-4 pt-8`}>
      <div className="flex flex-row justify-center mt-4 mb-2">
        <PiWavesBold size={20} className="my-auto" />
        <p className="ml-2 md:ml-3 text-sm lg:text-lg font-semibold">Air Quality</p>
      </div>
      <div className="flex flex-row justify-center items-center h-full">
        <p className="text-2xl font-semibold">{data.list[0].main.aqi}</p>
      </div>
      <div className="flex flex-row justify-center items-center h-full">
        <p className="text-xs text-gray-800 dark:text-gray-400">{aqiLevel(data.list[0].main.aqi)} air quality</p>
      </div>
    </div>
  );
};

export default AQI;