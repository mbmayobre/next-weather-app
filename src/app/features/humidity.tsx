'use client'

import { FunctionComponent, useState, useEffect } from "react";
import { weather } from "../lib/definitions";
import { GiWaterDrop } from "react-icons/gi";
import { getHumidityBackgroundFromValue } from "../utils/image-requests";
import { humidityClassMap, HumidityBackground } from "../utils/dictionary";

interface HumidityProps {
  weather: weather;
}

export const Humidity: FunctionComponent<HumidityProps> = ({ weather }) => {
  const [humidity, setHumidity] = useState<string>("");
  const [bg, setBg] = useState<HumidityBackground>("humidity-moderate");

  useEffect(() => {
    if (weather && weather.current) {
      const humidityValue = weather.current.humidity;
      setHumidity(`${humidityValue}%`);
      const background = getHumidityBackgroundFromValue(humidityValue);
      setBg(background);
    }
  }, [weather]);

  return (
    <div className={`flex flex-col size-full ${humidityClassMap[bg]} bg-cover bg-gray-200 opacity-90 dark:opacity-90 dark:bg-opacity-40 bg-opacity-40 text-black dark:bg-black dark:text-white rounded-2xl p-4`}>
      <div className="flex flex-row justify-start ml-2 mt-2 mb-2">
        <GiWaterDrop size={20} className="font-bold my-auto" />
        <p className="ml-3 text-sm lg:text-lg font-semibold">Humidity</p>
      </div>
      <div className="flex flex-row justify-start items-center ml-2 h-full">
        <p className="text-2xl font-semibold">{humidity}</p>
      </div>
      <div className="flex flex-row justify-between items-center ml-2 h-full">
        <p className="text-xs bg-gray-400 dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 rounded-full p-2 text-gray-800 dark:text-gray-400">{weather.current.dew_point}° Dew Point</p>
      </div>
    </div>
  );
};

export default Humidity;