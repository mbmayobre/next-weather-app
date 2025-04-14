'use client'

import { FunctionComponent, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { FaLocationCrosshairs } from "react-icons/fa6";

interface SearchBarProps {
  onSearch: (city: string) => void;
  handleCurrentLocation: () => void;
  loading: boolean;
}

export const SearchBar: FunctionComponent<SearchBarProps> = ({ onSearch, handleCurrentLocation, loading }) => {
  const [city, setCity] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim() !== "") {
      onSearch(city);
    }
  };

  return (
    <form className="w-full max-w-sm min-w-[345px]" onSubmit={handleSearch}>
      <div className="relative flex items-center">
        {/* Search Icon */}
        <FiSearch size={30} className="absolute w-7 h-7 pl-3 text-slate-600" />

        <div className="relative w-full">
          {/* Search Input */}
          <input
            className="w-full bg-transparent text-slate-800 dark:text-slate-300 text-sm border border-black dark:border-white placeholder-gray-500 rounded-md pl-10 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 focus:placeholder:invisible hover:border-slate-500 shadow-sm focus:shadow"
            placeholder="Enter location..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          {/* Clear Button */}
          {city.length > 0 && (
            <button
              type="button"
              onClick={() => setCity("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <IoMdClose size={20} />
            </button>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="ml-2 w-[90px] font-semibold rounded-md bg-gray-200 dark:bg-slate-800 border border-black dark:border-opacity-0 text-black dark:text-white py-2 px-4 text-center text-sm transition-all shadow-md focus:bg-slate-700 focus:shadow-none disabled:pointer-events-none disabled:opacity-80 disabled:shadow-none"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>

        {/* Current Location Button */}
        <button
          type="button"
          onClick={handleCurrentLocation}
          className="ml-2 w-auto rounded-md bg-gray-200 dark:bg-slate-800 border border-black dark:border-opacity-0 text-black dark:text-white py-2 px-4 text-center text-sm transition-all shadow-md focus:bg-slate-700 focus:shadow-none disabled:pointer-events-none disabled:opacity-80 disabled:shadow-none"
          disabled={loading}
        >
          <FaLocationCrosshairs size={20} />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;