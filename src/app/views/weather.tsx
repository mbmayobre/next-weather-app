'use client'

import { FunctionComponent, useEffect, useState, useCallback } from "react";
import { weather, location } from "../lib/definitions";
import SearchBar from "../components/searchbar";
import CurrentWeather from "../components/current-weather";
import DarkModeToggle from "../components/dark-mode-toggle";
import HourlyWeather from "../components/hourly";
import DailyWeather from "../components/daily";
import Precipitation from "../components/precipitation";

export const Weather: FunctionComponent = () => {
  const [weather, setWeather] = useState<weather>();
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [location, setLocation] = useState<location>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather data
  const fetchWeather = useCallback(async () => {
    if (!latitude || !longitude) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=imperial`
      );

      if (!res.ok) throw new Error("Failed to fetch weather data");

      const data = await res.json();
      setWeather(data);
      console.log(data);
    } catch (error) {
      console.error(error);
      setError("Unable to fetch weather data");
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude]);

  // Fetch location data (Geocoding API)
  const fetchLocation = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    
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

      if (!data || data.length === 0) {
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
        // alert(error.message);
        setError(error.message);
      } else {
        // alert("An unknown error occurred");
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLocationName = useCallback(async () => {
    if (!latitude || !longitude) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GEOCODING_API_URL}/reverse?lat=${latitude}&lon=${longitude}&limit=5&&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );

      if (!res.ok) throw new Error("Failed to fetch location name");

      const data = await res.json();
      setLocation(data[0]);
    } catch (error) {
      console.error(error);
      setError("Unable to fetch location name");
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (!!latitude && !!longitude) {
      fetchWeather();
      fetchLocationName();
    }
  }, [latitude, longitude]);

  return (
    <div className="relative w-full sm:w-3/4 flex justify-center p-4">
      {/* Search Bar */}
      <div className="absolute top-0 w-1/2 mx-auto flex justify-center p-4">
        <SearchBar onSearch={fetchLocation} loading={loading} />
        <DarkModeToggle />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {weather && location && !error && (
        <div className="flex flex-wrap justify-center w-full">
          <CurrentWeather weather={weather} location={location} />
          <HourlyWeather weather={weather} />
          <DailyWeather weather={weather} />
          <Precipitation weather={weather} />
        </div>
      )}
    </div>
  );
};

export default Weather;
