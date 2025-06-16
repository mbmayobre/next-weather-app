'use client'

import { FunctionComponent } from "react";
import { weather } from "../lib/definitions";
import { MdOutlineVisibility } from "react-icons/md";

interface VisibilityProps {
  weather: weather;
}

export const Visibility: FunctionComponent<VisibilityProps> = ({ weather }) => {
  

  return (
    <div className="flex flex-col bg-gray-200 dark:bg-opacity-40 bg-opacity-40 text-black dark:bg-black dark:text-white w-full h-[175px] rounded-2xl mt-4 p-4">
      <div className="flex flex-row justify-start ml-2 mt-2 mb-2">
        <MdOutlineVisibility size={25} className="font-bold" />
        <p className="ml-3 font-semibold">Visibility</p>
      </div>
      <div className="flex flex-col justify-center items-start ml-2 h-full">
        <p className="text-2xl font-semibold">{(weather.current.visibility / 1609.344).toFixed(2)} mi</p>
      </div>
    </div>
  );
};

export default Visibility;