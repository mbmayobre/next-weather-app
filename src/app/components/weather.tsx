'use client'

import { useEffect, useState } from "react";
import { weather, location } from "../lib/definitions";
import { IoMdClose } from "react-icons/io";
import { FiSearch } from "react-icons/fi";

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
        !isNaN(Number(city)) ? 
        `${process.env.NEXT_PUBLIC_GEOCODING_API_URL}/zip?zip=${city},US&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
        :
        `${process.env.NEXT_PUBLIC_GEOCODING_API_URL}/direct?q=${city}&limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch location");
      }
      const data = await res.json();
      if (data.length === 0) {
        throw new Error("No location found");
      }
      if (Array.isArray(data)) {
        setLatitude(data[0].lat);
        setLongitude(data[0].lon);
      } else {
      setLatitude(data.lat);
      setLongitude(data.lon);
      }
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
      <div className="w-full max-w-sm min-w-[300px]">
        <div className="relative flex items-center">
          <FiSearch size={30} className="absolute w-7 h-7 pl-3 text-slate-600" />
          <input
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Enter city name or zip code..." 
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {city.length > 0 && 
            <button
              onClick={() => setCity("")}
              className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <IoMdClose size={20} />
            </button>
          }  
          <button
            onClick={fetchLocation}
            className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
            type="button"
          >
            {loading ? "Loading..." : "Search"}
          </button> 
        </div>
      </div>
      {/* <div className="flex items-center relative w-full max-w-md">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 border rounded-md text-black w-full pr-10"
        /> */}
        {/* {city && (
          <button
            onClick={() => setCity("")}
            className="right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 mr-2"
          >
            <IoMdClose size={20} />
          </button>
        )} */}
        {/* <button onClick={fetchLocation} className="absolute right-2 bg-blue-500 text-white px-4 py- rounded-md">
          <FiSearch size={20} />
        </button>
      </div> */}

      {/* <div>
        {loading && <p>Loading...</p>}
      </div> */}

      {/* <div className="flex space-x-2">
        <button onClick={fetchLocation} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          {loading ? "Loading..." : "Get Weather"}
        </button>
      </div> */}

      {weather && (
      <div className="bg-gray-100 p-4 rounded-md text-black">
        <h2 className="text-xl font-semibold">{location?.name}, {location?.country}</h2>
        <p className="text-lg">{weather.current.weather[0].description}</p>
        <p className="text-2xl">{weather.current.temp}°F</p>
        <p>Feels like: {weather.current.feels_like}°F</p>
        <p>High: {weather.daily[0].temp.max}°F - Low: {weather.daily[0].temp.min}°F</p>
      </div>
      )}
    </div>
  );
}
