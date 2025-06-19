'use client'

import { FunctionComponent, useEffect, useState, useCallback } from "react";
import { weather, location, air_quality } from "../lib/definitions";
import SearchBar from "../components/searchbar";
import CurrentWeather from "../components/current-weather";
import DarkModeToggle from "../components/dark-mode-toggle";
import HourlyWeather from "../components/hourly";
import DailyWeather from "../components/daily";
import Precipitation from "../components/precipitation";
import Humidity from "../components/humidity";
import Wind from "../components/wind";
import Pressure from "../components/pressure";
import SunriseAndSunset from "../components/sunrise-sunset";
import Visibility from "../components/visibility";
import UVI from "../components/uv-index";
import AQI from "../components/air-quality";
import { type Background } from "../utils/dictionary";
import { getBackgroundFromIcon } from "../utils/image-requests";

interface WeatherProps {
  onBackgroundChange: (bg: Background) => void
}

export const Weather: FunctionComponent<WeatherProps> = ({ onBackgroundChange }) => {
  const [weather, setWeather] = useState<weather>();
  const [aqi, setAqi] = useState<air_quality>();
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
  const [location, setLocation] = useState<location>();
  const [loading, setLoading] = useState<boolean>(false);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false);
  const [aqiLoading, setAqiLoading] = useState<boolean>(false);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [locationNameLoading, setLocationNameLoading] = useState<boolean>(false);
  const [currentLocationLoading, setCurrentLocationLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather data
  const fetchWeather = useCallback(async () => {
    if (!latitude || !longitude) return;
    setWeatherLoading(true);
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
      setWeatherLoading(false);
    }
  }, [latitude, longitude]);

  // Fetch air pollution data
  const fetchAirQuality = useCallback(async () => {
    if (!latitude || !longitude) return;
    setAqiLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AIR_POLLUTION_API_URL}?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );

      if (!res.ok) throw new Error("Failed to fetch air quality data");

      const data = await res.json();
      setAqi(data);
      console.log(data);
    } catch (error) {
      console.error(error);
      setError("Unable to fetch air quality data");
    } finally {
      setAqiLoading(false);
    }
  }, [latitude, longitude]);

  // Fetch location data (Geocoding API)
  const fetchLocation = useCallback(async (city: string) => {
    setLocationLoading(true);
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
      setLocationLoading(false);
    }
  }, []);

  const fetchLocationName = useCallback(async () => {
    if (!latitude || !longitude) return;
    setLocationNameLoading(true);
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
      setLocationNameLoading(false);
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
    if (weatherLoading || aqiLoading || locationLoading || locationNameLoading || currentLocationLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [weather, aqi, weatherLoading, aqiLoading, locationLoading, locationNameLoading]);

  useEffect(() => {
    if (weather) {
      const bg = getBackgroundFromIcon(weather.current.weather[0].icon, weather.current.weather[0].id);
      onBackgroundChange(bg);
    }
  }, [weather, latitude, longitude, onBackgroundChange]);

  const handleGetCurrentLocation = useCallback(() => {
    setCurrentLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          setCurrentLocationLoading(false);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setError("Unable to retrieve your location. Please enable location services in your browser.");
          setCurrentLocationLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setCurrentLocationLoading(false);
    }
  }, []);

  return (
    <div className="relative w-full lg:w-5/6 md:columns-2 flex justify-center p-4">
      {/* Search Bar */}
      <div className="fixed top-0 w-full mx-auto flex justify-center p-4 z-10">
        <SearchBar onSearch={fetchLocation} handleCurrentLocation={handleGetCurrentLocation} loading={loading} />
        <DarkModeToggle />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mt-16">{error}</p>}

      {weather && aqi && location && !error && (
        <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start w-full">
          <div className="flex justify-center w-full mt-20 md:fixed md:w-1/2 lg:w-2/5 h-auto lg:h-[60vh] md:p-4">
            <CurrentWeather weather={weather} location={location} />
          </div>
          <div className="flex flex-wrap justify-center w-full md:mt-20 md:ml-auto md:w-1/2 md:p-4">
            <HourlyWeather weather={weather} />
            <DailyWeather weather={weather} />
            <div className="flex flex-row justify-center w-full">
              <Precipitation weather={weather} />
              <Humidity weather={weather} />
            </div>
            <div className="flex flex-row justify-center w-full">
              <Wind weather={weather} />
              <Pressure weather={weather} />
            </div>
            <div className="flex flex-row justify-center w-full">
              <SunriseAndSunset weather={weather} />
              <Visibility weather={weather} />
            </div>
            <div className="flex flex-row justify-center w-full">
              <UVI weather={weather} />
              <AQI data={aqi} />
            </div>
          </div>          
        </div>
      )}
    </div>
  );
};

export default Weather;
