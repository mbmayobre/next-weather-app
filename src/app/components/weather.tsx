'use client'

import { useEffect, useState } from "react";

export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!latitude || !longitude) return;
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=imperial`
    );
    const data = await res.json();
    setWeather(data);
    setLoading(false);
    console.log(data);
  };

  const fetchLocation = async () => {
    if (!city) return;
    setLoading(true);
    const res = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    );
    const data = await res.json();
    setLatitude(data[0].lat);
    setLongitude(data[0].lon);
    setLoading(false);
  }

  useEffect(() => {
    if (!!latitude && !!longitude) {
      fetchWeather();
    }
  }, [latitude, longitude]);

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="p-2 border rounded-md text-black"
      />
      <button onClick={fetchLocation} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        {loading ? "Loading..." : "Get Weather"}
      </button>

      {weather && (
        <div className="bg-gray-100 p-4 rounded-md text-black">
          {/* <h2 className="text-xl font-semibold">{weather.name}</h2>
          <p className="text-lg">{weather.weather[0].description}</p>
          <p className="text-2xl">{weather.main.temp}°F</p> */}
        </div>
      )}
    </div>
  );
}
