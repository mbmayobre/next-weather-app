'use client'

import { FunctionComponent, useEffect, useState, useCallback } from "react";
import { weather, location, air_quality } from "../lib/definitions";
import SearchBar from "../components/searchbar";
import CurrentWeather from "../features/current-weather";
import DarkModeToggle from "../components/dark-mode-toggle";
import HourlyWeather from "../features/hourly";
import DailyWeather from "../features/daily";
import Precipitation from "../features/precipitation";
import Humidity from "../features/humidity";
import Wind from "../features/wind";
import Pressure from "../features/pressure";
import SunriseAndSunset from "../features/sunrise-sunset";
import Visibility from "../features/visibility";
import UVI from "../features/uv-index";
import AQI from "../features/air-quality";
import { type Background } from "../service/dictionary";
import { getBackgroundFromIcon } from "../service/image-requests";
import Alerts from "../features/alerts";
import { useLoadingCounter } from "../hooks/loading-counter";
import LoadingSpinner from "../components/loading-spinner";

interface WeatherProps {
  onBackgroundChange: (bg: Background) => void
}

export const Weather: FunctionComponent<WeatherProps> = ({ onBackgroundChange }) => {
  const { isLoading, start, stop } = useLoadingCounter();
  const [weather, setWeather] = useState<weather>();
  const [aqi, setAqi] = useState<air_quality>();
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [location, setLocation] = useState<location>();
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather data
  const fetchWeather = useCallback(async () => {
    console.log("fetchWeather")
    if (!latitude || !longitude) return;
    // setIsLoading(true);
    start();
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=imperial`
      );

      if (!res.ok) throw new Error("Failed to fetch weather data");

      const data = await res.json();
      setWeather(data);
    } catch (error) {
      console.error(error);
      setError("Unable to fetch weather data");
    } finally {
      // setIsLoading(false);
      stop();
    }
  }, [latitude, longitude]);

  // Fetch air pollution data
  const fetchAirQuality = useCallback(async () => {
    console.log("fetchAirQuality")
    if (!latitude || !longitude) return;
    // setIsLoading(true);
    start();
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AIR_POLLUTION_API_URL}?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );

      if (!res.ok) throw new Error("Failed to fetch air quality data");

      const data = await res.json();
      setAqi(data);
    } catch (error) {
      console.error(error);
      setError("Unable to fetch air quality data");
    } finally {
      // setIsLoading(false);
      stop();
    }
  }, [latitude, longitude]);

  // Fetch location data (Geocoding API)
  const fetchLocation = useCallback(async (city: string) => {
    console.log("fetchLocation")
    // setIsLoading(true);
    start();
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
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      // setIsLoading(false);
      stop();
    }
  }, []);

  const fetchLocationName = useCallback(async () => {
    console.log("fetchLocationName")
    if (!latitude || !longitude) return;
    // setIsLoading(true);
    start();
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
      // setIsLoading(false);
      stop();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (!!latitude && !!longitude) {
      fetchWeather();
      fetchAirQuality();
      fetchLocationName();
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (weather) {
      const bg = getBackgroundFromIcon(weather.current.weather[0].icon, weather.current.weather[0].id);
      onBackgroundChange(bg);
    }
  }, [weather, latitude, longitude, onBackgroundChange]);

  const handleGetCurrentLocation = useCallback(async () => {
    console.log("handleGetCurrentLocation")
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    // setIsLoading(true);
    start();
    setError("");

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      setLatitude(position.coords.latitude.toString());
      setLongitude(position.coords.longitude.toString());
    } catch (error) {
      console.error("Error fetching location:", error);
      setError("Unable to retrieve your location. Please enable location services in your browser.");
    } finally {
      // setIsLoading(false);
      stop();
    }
  }, []);

  return (
    <div className="relative w-full lg:w-5/6 md:columns-2 flex justify-center p-4">
      {/* Search Bar */}
      <div className="fixed top-0 w-full mx-auto flex justify-center p-4 z-20">
        <SearchBar onSearch={fetchLocation} handleCurrentLocation={handleGetCurrentLocation} loading={isLoading} />
        <DarkModeToggle />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-16">{error}</p>}

      {isLoading && <LoadingSpinner />}

      {weather && aqi && location && !error && !isLoading && (
        <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start w-full">
          <div className="flex justify-center w-full mt-10 md:fixed md:w-1/2 lg:w-2/5 h-auto lg:h-[60vh] md:p-4">
            <CurrentWeather weather={weather} location={location} />
          </div>
          <div className="flex flex-wrap justify-center w-full md:mt-10 md:ml-auto md:w-1/2 md:p-4">
            {weather.alerts && weather.alerts.length > 0 && (
              <Alerts weather={weather} />
            )}
            <HourlyWeather weather={weather} />
            <DailyWeather weather={weather} />
            <div className="flex flex-row justify-center w-full mt-4">
              <div className="w-1/2 aspect-square mr-2">
                <Precipitation weather={weather} />
              </div>
              <div className="w-1/2 aspect-square ml-2">
                <Humidity weather={weather} />
              </div>
            </div>
            <div className="flex flex-row justify-center w-full mt-4">
              <div className="w-1/2 aspect-square mr-2">
                <Wind weather={weather} />
              </div>
              <div className="w-1/2 aspect-square ml-2">
                <Pressure weather={weather} />
              </div>
            </div>
            <div className="flex flex-row justify-center w-full mt-4">
              <div className="w-1/2 aspect-square mr-2">
                <SunriseAndSunset weather={weather} />
              </div>
              <div className="w-1/2 aspect-square ml-2">
                <Visibility weather={weather} />
              </div>
            </div>
            <div className="flex flex-row justify-center w-full mt-4">
              <div className="w-1/2 aspect-square mr-2">
                <UVI weather={weather} />
              </div>
              <div className="w-1/2 aspect-square ml-2">
                <AQI data={aqi} />
              </div>
            </div>
          </div>          
        </div>
      )}
    </div>
  );
};

export default Weather;
