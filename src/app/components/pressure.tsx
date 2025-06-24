'use client'

import { FunctionComponent, useState, useEffect } from "react";
import { weather } from "../lib/definitions";
import { MdCompress } from "react-icons/md";
import { getPressureBackgroundFromValue } from "../utils/image-requests";
import { pressureClassMap, PressureBackground } from "../utils/dictionary";

interface PressureProps {
  weather: weather;
}

export const Pressure: FunctionComponent<PressureProps> = ({ weather }) => {
  const [pressure, setPressure] = useState<string>("");
  const [bg, setBg] = useState<PressureBackground>("pressure-normal");

  useEffect(() => {
    if (weather && weather.current) {
      const pressureString = (weather.current.pressure * 0.02953).toFixed(2);
      const pressureValue = weather.current.pressure * 0.02953;
      setPressure(pressureString);
      const background = getPressureBackgroundFromValue(pressureValue);
      setBg(background);
    }
  }, [weather]);

  return (
    <div className={`flex flex-col justify-center ${pressureClassMap[bg]} bg-contain bg-no-repeat [background-position:50%_10px] bg-gray-200 dark:bg-opacity-40 bg-opacity-40 text-black dark:bg-black dark:text-white w-full h-[175px] rounded-2xl mt-4 p-4 pt-8`}>
      <div className="flex flex-row justify-center mt-4 mb-2">
        <MdCompress size={25} className="font-bold" />
        <p className="ml-3 text-sm font-semibold">Pressure</p>
      </div>
      <div className="flex flex-row justify-center items-center h-full">
        <p className="text-3xl font-semibold">{pressure}</p>
      </div>
      <div className="flex flex-row justify-center items-center h-full">
        <p className="text-xs text-gray-800 dark:text-gray-400">inHg</p>
      </div>
    </div>
  );
};

export default Pressure;