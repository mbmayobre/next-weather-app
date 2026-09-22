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

  // TODO(human): shared fetch helper to replace the near-duplicate blocks in
  // fetchWeather, fetchAirQuality, and fetchLocationName below.
  //
  // Each of those three functions currently does the same thing: bail if lat/lon
  // are missing, call start(), clear the error, fetch a URL, throw a specific
  // error message on a bad response, hand the parsed JSON to a setter, catch and
  // report a specific error message, then call stop().
  //
  // Implement a generic fetchJson<T> here that captures that shared shape, then
  // rewrite fetchWeather/fetchAirQuality/fetchLocationName to call it. Decide:
  // - signature: e.g. fetchJson<T>(url: string, errorMessage: string): Promise<T | undefined>
  //   (start/stop/setError happen inside; caller still owns its own state setter)
  // - what happens on failure: return undefined and let the caller skip setting
  //   state, or throw and let each caller's own try/catch stay in place?
  // - should start()/stop() live inside the helper, or stay in each caller so
  //   Promise.all-style composition above isn't affected?

  const fetchJson = async <T,>(url: string, errorMessage: string, setData: (data: T) => void): Promise<void> => {
    if (!url) return
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
    const url = `${process.env.NEXT_PUBLIC_WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=imperial`
    const errorMessage = "Unable to fetch weather data";
    return fetchJson(url, errorMessage, setWeather);
  };

  // Fetch air pollution data
  const fetchAirQuality = async (latitude: string, longitude: string) => {
    if (!latitude || !longitude) return
    const url = `${process.env.NEXT_PUBLIC_AIR_POLLUTION_API_URL}?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    const errorMessage = "Unable to fetch air quality data";
    return fetchJson(url, errorMessage, setAqi);
  };

  // Fetch location name
  const fetchLocationName = async (latitude: string, longitude: string) => {
    if (!latitude || !longitude) return
    const url = `${process.env.NEXT_PUBLIC_GEOCODING_API_URL}/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    const errorMessage = "Unable to fetch location name";
    return fetchJson(url, errorMessage, (data: location[]) => setLocation(data[0]));
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

      let latitude: string;
      let longitude: string;

      if (Array.isArray(data)) {
        latitude = data[0].lat;
        longitude = data[0].lon;
      } else {
        latitude = data.lat;
        longitude = data.lon;
      }

      handleFetchWeatherData(latitude, longitude);
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
