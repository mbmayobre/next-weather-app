'use client'

import { FunctionComponent, useState, useEffect } from "react";
import { weather } from "../lib/definitions";

interface AlertsProps {
  weather: weather;   
}

export const Alerts: FunctionComponent<AlertsProps> = ({ weather }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Automatically expand alerts if there are any
    if (weather.alerts && weather.alerts.length > 0) {
      setExpanded(false);
      setVisible(true);
    }
  }, [weather.alerts]);

  // If no alerts or user has closed it, render nothing
  if (!visible || !weather.alerts || weather.alerts.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-4 md:my-0">
      <div className={`relative flex flex-col dark:bg-opacity-40 bg-opacity-40 bg-red-100 dark:bg-red-800 text-red-900 dark:text-red-100 w-full h-auto rounded-2xl mb-0 md:mb-4 p-4 transition-[max-height] duration-300 ease-in-out overflow-hidden ${expanded ? "max-h-[2000px]" : "max-h-60"}`}>
        {!expanded && (
          <div
            className="pointer-events-none absolute bottom-0 left-0 w-full h-16
                        bg-gradient-to-t from-red-100 dark:from-red-800 to-transparent"
          />
        )}
        <div className="flex items-center mb-2 px-4">
          <p className="text-lg font-semibold mr-auto">Alerts</p>
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-sm text-red-900 dark:text-red-100 hover:underline mr-4"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
          <button
            onClick={() => setVisible(false)}
            aria-label="Close alerts"
            className="text-2xl text-red-700 dark:text-red-100 hover:text-red-900"
          >
            ×
          </button>
        </div>
        <ul className="list-disc ml-6">
          {weather.alerts.map((alert, index) => (
            <div key={index} className="mb-2">
              <li className="mb-4">
                <strong>{alert.event}</strong>: 
                {alert.tags && alert.tags.length > 0 && (
                  <div>
                    {alert.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="rounded-md p-1 text-xs bg-red-200 dark:bg-red-900 text-red-950 dark:text-red-200">
                        {tag} 
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-2 text-sm">
                  {alert.description}
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Alerts;