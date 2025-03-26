'use client'

import { FunctionComponent } from "react";
import { weather, location } from "../lib/definitions";

interface HourlyProps {
  weather: weather;
}

export const HourlyWeather: FunctionComponent<HourlyProps> = ({ weather }) => {

  return (
    <></>
  );
};

export default HourlyWeather;