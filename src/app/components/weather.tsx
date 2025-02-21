'use client'

import { useEffect, useState } from "react";
import { weather, location } from "../lib/definitions";

export default function Weather() {
  const [city, setCity] = useState<string>("");
  const [weather, setWeather] = useState<weather>();
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [location, setLocation] = useState<location>();
  const [loading, setLoading] = useState<boolean>(false);

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
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GEOCODING_API_URL}/direct?q=${city}&limit=5&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch location");
      }
      const data = await res.json();
      if (data.length === 0) {
        throw new Error("No location found");
      }
      setLatitude(data[0].lat);
      setLongitude(data[0].lon);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLocationName = async () => {
    if (!latitude || !longitude) return;
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_GEOCODING_API_URL}/reverse?lat=${latitude}&lon=${longitude}&limit=5&&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    );
    const data = await res.json();
    setLocation(data[0]);
    setLoading(false);
  };

  useEffect(() => {
    if (!!latitude && !!longitude) {
      fetchWeather();
      fetchLocationName();
    }
  }, [latitude, longitude]);

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {/* <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="p-2 border rounded-md text-black"
      /> */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 border rounded-md text-black w-full pr-10"
        />
        {city && (
          <button
            onClick={() => setCity("")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 mr-2"
          >
            ✖
          </button>
        )}
      </div>

      <div className="flex space-x-2">
        <button onClick={fetchLocation} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          {loading ? "Loading..." : "Get Weather"}
        </button>
        {/* <button onClick={() => setCity("")} className="bg-red-500 text-white px-4 py-2 rounded-md">
          Clear
        </button> */}
      </div>

      {weather && (
      <div className="bg-gray-100 p-4 rounded-md text-black">
        <h2 className="text-xl font-semibold">{location?.name}, {location?.country}</h2>
        <p className="text-lg">{weather.current.weather[0].description}</p>
        <p className="text-2xl">{weather.current.temp}°F</p>
      </div>
      )}
    </div>
  );
}
