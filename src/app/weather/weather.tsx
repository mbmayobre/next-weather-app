'use client'

import { FunctionComponent, useEffect, useState, useCallback, Dispatch, SetStateAction } from "react";
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
  const [location, setLocation] = useState<location>();
  const [error, setError] = useState<string | null>(null);

  // All requests go through our own /api Route Handlers, which attach the
  // OpenWeatherMap API key server-side.
  const fetchJson = async <T,>(url: string, errorMessage: string, setData: (data: T) => void): Promise<void> => {
    start();
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(errorMessage);
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error(error);
      setError(errorMessage);
    } finally {
      stop();
    }
  };

  // Fetch weather data
  const fetchWeather = async (latitude: string, longitude: string) => {
    if (!latitude || !longitude) return
    const url = `/api/weather?lat=${latitude}&lon=${longitude}`
    const errorMessage = "Unable to fetch weather data";
    return fetchJson(url, errorMessage, setWeather);
  };

  // Fetch air pollution data
  const fetchAirQuality = async (latitude: string, longitude: string) => {
    if (!latitude || !longitude) return
    const url = `/api/air-quality?lat=${latitude}&lon=${longitude}`
    const errorMessage = "Unable to fetch air quality data";
    return fetchJson(url, errorMessage, setAqi);
  };

  // Fetch location name
  const fetchLocationName = async (latitude: string, longitude: string) => {
    if (!latitude || !longitude) return
    const url = `/api/geocode?lat=${latitude}&lon=${longitude}`
    const errorMessage = "Unable to fetch location name";
    return fetchJson(url, errorMessage, setLocation);
  };

  const handleFetchWeatherData = (latitude: string, longitude: string) => {
    Promise.all([
      fetchWeather(latitude, longitude),
      fetchAirQuality(latitude, longitude),
      fetchLocationName(latitude, longitude),
    ]);
  };

  // Fetch location data (Geocoding API)
  const fetchLocation = useCallback(async (city: string) => {
    start();
    setError(null);
    
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(city)}`);
      const data: (location & { error?: string }) | null = await res.json().catch(() => null);

      if (!res.ok || !data) {
        throw new Error(data?.error ?? "Failed to fetch location");
      }

      handleFetchWeatherData(String(data.lat), String(data.lon));
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      stop();
    }
  }, []);

  const handleGetCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    start();
    setError("");

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const latitude = position.coords.latitude.toString();
      const longitude = position.coords.longitude.toString();

      handleFetchWeatherData(latitude, longitude);
    } catch (error) {
      console.error("Error fetching location:", error);
      setError("Unable to retrieve your location. Please enable location services in your browser.");
    } finally {
      stop();
    }
  }, []);

  useEffect(() => {
    if (weather) {
      const bg = getBackgroundFromIcon(weather.current.weather[0].icon, weather.current.weather[0].id);
      onBackgroundChange(bg);
    }
  }, [weather, onBackgroundChange]);

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
