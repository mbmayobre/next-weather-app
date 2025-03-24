'use client'

import { FunctionComponent, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FiSearch } from "react-icons/fi";

interface SearchBarProps {
  onSearch: (city: string) => void;
  loading: boolean;
}

export const SearchBar: FunctionComponent<SearchBarProps> = ({ onSearch, loading }) => {
  const [city, setCity] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim() !== "") {
      onSearch(city);
    }
  };

  return (
    <form className="w-full max-w-sm min-w-[300px]" onSubmit={handleSearch}>
      <div className="relative flex items-center">
        {/* Search Icon */}
        <FiSearch size={30} className="absolute w-7 h-7 pl-3 text-slate-600" />

        <div className="relative w-full">
          {/* Search Input */}
          <input
            className="w-full bg-transparent text-slate-400 text-sm border border-slate-400 rounded-md pl-10 pr-10 py-2 transition duration-300 ease focus:outline-none focus:border-slate-100 focus:placeholder:invisible hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Enter city name or zip code..."
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
          className="ml-2 w-[90px] rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>
    </form>
  );
}

export default SearchBar;