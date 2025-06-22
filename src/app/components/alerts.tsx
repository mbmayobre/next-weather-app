'use client'

import { FunctionComponent } from "react";
import { weather } from "../lib/definitions";

interface AlertsProps {
  weather: weather;   
}

export const Alerts: FunctionComponent<AlertsProps> = ({ weather }) => {
  if (!weather.alerts || weather.alerts.length === 0) {
    return null; // No alerts to display
  }

  return (
    <div className="flex flex-col bg-red-100 dark:bg-red-800 text-red-900 dark:text-red-100 w-full h-auto rounded-2xl mt-4 p-4">
      <div className="flex flex-row justify-start ml-2 mt-2 mb-2">
        <p className="font-semibold">Weather Alerts</p>
      </div>
      <ul className="list-disc ml-6">
        {weather.alerts.map((alert, index) => (
          <li key={index} className="mb-2">
            <strong>{alert.event}</strong>: {alert.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alerts;