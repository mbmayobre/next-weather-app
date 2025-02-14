'use client'

import { useState } from "react";

export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEATHER_API_URL}?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
    );
    const data = await res.json();
    setWeather(data);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="p-2 border rounded-md"
      />
      <button onClick={fetchWeather} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        {loading ? "Loading..." : "Get Weather"}
      </button>

      {weather && (
        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="text-xl font-semibold">{weather.name}, {weather.sys.country}</h2>
          <p className="text-lg">{weather.weather[0].description}</p>
          <p className="text-2xl">{weather.main.temp}°C</p>
        </div>
      )}
    </div>
  );
}
