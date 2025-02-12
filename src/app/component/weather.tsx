import React, { useState } from "react";

interface WeatherProps {};

export function Weather({}: WeatherProps) {
  const [weather, setWeather] = useState(null);

  return (
    <div>
      <h1>Weather</h1>
      <p>Current weather: {weather}</p>
    </div>
  );
}