'use client'

import { FunctionComponent, useMemo } from "react";
import { weather } from "../lib/definitions";
import { PiSunHorizonBold } from "react-icons/pi";
import { TbSunrise, TbSunset } from "react-icons/tb";
import { getSunriseIconIndex } from "../utils/image-requests";

interface SunriseAndSunsetProps {
  weather: weather;
}

export const SunriseAndSunset: FunctionComponent<SunriseAndSunsetProps> = ({ weather }) => {
  const { sunrise, sunset, dt } = weather.current;
  const tzName = weather.timezone;

  const idx = useMemo(
    () => getSunriseIconIndex(dt, sunrise, sunset),
    [dt, sunrise, sunset]
  );

  const formatTime = (
    unixSec: number,
    tz: string
  ): string => {
    return new Date(unixSec * 1000).toLocaleTimeString("en-US", {
      hour:      "numeric",
      minute:    "2-digit",
      hour12:    true,
      timeZone:  tz,
    });
  }

  return (
    <div className={`flex flex-col size-full bg-sunrise-${idx} bg-cover bg-no-repeat bg-gray-200 dark:bg-opacity-40 bg-opacity-40 text-black dark:bg-black dark:text-white rounded-2xl p-4`}>
      <div className="flex flex-row justify-start ml-2 mt-2 mb-2">
        <PiSunHorizonBold size={20} className="font-bold" />
        <p className="ml-3 text-sm font-semibold">Sunrise & Sunset</p>
      </div>
      <div className="flex flex-col justify-center items-center h-full mt-8">
        <p className="flex flex-nowrap text-sm"><TbSunrise size={20} className="mr-2" />{formatTime(sunrise, tzName)}</p>
        <p className="flex flex-nowrap text-sm"><TbSunset size={20} className="mr-2" />{formatTime(sunset, tzName)}</p>
      </div>
    </div>
  );
};

export default SunriseAndSunset;