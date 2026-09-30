'use client'

/**
 * THE DATA HUB. Start here when learning the codebase.
 *
 * This is the only component that fetches anything or owns server data.
 * Everything under features/ is a "dumb" card: it receives the `weather` or
 * `aqi` object as a prop and renders a slice of it. Keeping fetching in one
 * place is what stops a dozen cards from each firing their own requests.
 *
 * WHAT HAPPENS ON A SEARCH
 *   1. SearchBar calls fetchLocation("Chicago")
 *   2. GET /api/geocode?q=Chicago            -> { name, lat, lon, country }
 *   3. handleFetchWeatherData fires three requests IN PARALLEL:
 *        GET /api/weather?lat&lon            -> setWeather
 *        GET /api/air-quality?lat&lon        -> setAqi
 *        GET /api/geocode?lat&lon (reverse)  -> setLocation  (for the header)
 *   4. React re-renders and the cards fill in
 *   5. A useEffect derives the page background and reports it to page.tsx
 *
 * The "use my location" button skips step 1-2: the browser's geolocation API
 * gives coordinates directly.
 *
 * Every URL above points at THIS app's own /api routes, never at
 * OpenWeatherMap. The API key is attached server-side in those Route Handlers
 * (see lib/openweather.ts) so it never reaches the browser.
 */
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
  // A counter rather than a boolean, so the spinner stays up until the LAST of
  // the three parallel requests finishes. See hooks/loading-counter.tsx.
  const { isLoading, start, stop } = useLoadingCounter();

  // All server data for the app lives in these three pieces of state. They are
  // `undefined` until the first successful search, which is why the render
  // below waits for all three before showing any cards.
  const [weather, setWeather] = useState<weather>();   // One Call 3.0 payload
  const [aqi, setAqi] = useState<air_quality>();       // Air Pollution payload
  const [location, setLocation] = useState<location>();// Place name for the header
  const [error, setError] = useState<string | null>(null);

  /**
   * One wrapper for every request: flag loading, clear the old error, fetch,
   * treat a non-2xx as a failure, hand the parsed body to a setter, report any
   * problem, and always clear the loading flag.
   *
   * It is generic in T so each caller keeps its own correctly-typed setter
   * (setWeather takes a `weather`, setAqi takes an `air_quality`) while this
   * helper stays shape-agnostic.
   *
   * Caveat: the JSON is cast to T, never validated. See lib/definitions.ts.
   */
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

  // The three wrappers below each return their fetchJson promise. That return
  // matters: without it the async function would resolve immediately and the
  // Promise.all in handleFetchWeatherData would wait on nothing.
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

  // Fires all three requests at once, so a search takes as long as the slowest
  // one rather than the sum of all three.
  const handleFetchWeatherData = (latitude: string, longitude: string) => {
    Promise.all([
      fetchWeather(latitude, longitude),
      fetchAirQuality(latitude, longitude),
      fetchLocationName(latitude, longitude),
    ]);
  };

  /**
   * Entry point for a text search. Turns "Chicago" or "60601" into coordinates
   * via /api/geocode, then kicks off the three data requests.
   *
   * The server decides whether the input is a zip or a city name and always
   * responds with a single location object, so there is no array handling here.
   * On failure it responds with { error }, which is preferred over a generic
   * message so the user sees "No location found" rather than something vague.
   *
   * encodeURIComponent matters: a query like "Salt Lake City & more" would
   * otherwise break the URL at the ampersand.
   */
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

  /**
   * Entry point for the crosshair button. navigator.geolocation is callback-
   * based, so it is wrapped in a Promise to be awaited like everything else.
   * The browser shows its own permission prompt; a denial rejects and is
   * reported as an error message.
   */
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

  // Report the matching page background up to page.tsx, which owns <main>.
  // Runs whenever new weather arrives.
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

      {/* Cards render only once all three payloads are in, so no card has to
          handle a half-loaded state. The tradeoff is all-or-nothing: if any one
          request fails, nothing is shown. */}
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
