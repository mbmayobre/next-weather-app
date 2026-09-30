'use client'

/**
 * Sunrise and sunset times, with artwork showing roughly where the sun is.
 *
 * Two details:
 * - Times are formatted with `timeZone: weather.timezone` so they show the
 *   LOCAL time at the searched location. Searching Tokyo from Utah should show
 *   Tokyo's sunrise, not that instant converted to Mountain Time.
 * - getSunriseIconIndex returns 0-15 and splits the daylight span
 *   proportionally, so the artwork is correct whether the day is 6 hours or 18.
 *
 * This card derives its value with useMemo during render instead of the
 * useState + useEffect pattern the other cards use. It is the simpler approach
 * for a value computed purely from props.
 */
import { FunctionComponent, useMemo } from "react";
import { weather } from "../lib/definitions";
import { PiSunHorizonBold } from "react-icons/pi";
import { TbSunrise, TbSunset } from "react-icons/tb";
import { getSunriseIconIndex } from "../service/image-requests";

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
        <PiSunHorizonBold size={20} className="font-bold my-auto" />
        <p className="ml-3 text-sm lg:text-lg font-semibold">Sunrise & Sunset</p>
      </div>
      <div className="flex flex-col justify-end items-center h-full">
        <p className="flex flex-nowrap text-sm"><TbSunrise size={20} className="mr-2" />{formatTime(sunrise, tzName)}</p>
        <p className="flex flex-nowrap text-sm"><TbSunset size={20} className="mr-2" />{formatTime(sunset, tzName)}</p>
      </div>
    </div>
  );
};

export default SunriseAndSunset;