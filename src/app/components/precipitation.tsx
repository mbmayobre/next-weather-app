'use client'

import { FunctionComponent } from "react";
import { weather } from "../lib/definitions";

interface PrecipitationProps {
  weather: weather;
}

export const Precipitation: FunctionComponent<PrecipitationProps> = ({ weather }) => {

  return (
    <></>
  );
};

export default Precipitation;