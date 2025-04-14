'use client'

import { FunctionComponent, useEffect, useState } from "react";
import { MdDarkMode } from "react-icons/md";
import { FaCircle } from "react-icons/fa";

export const DarkModeToggle: FunctionComponent = () => {
  // Initialize state; default to false.
  const [isDarkMode, setIsDarkMode] = useState(false);

  // On mount, load the user's preference from localStorage or fallback to system preference.
  useEffect(() => {
    // Check if localStorage has a saved preference
    const storedPreference = localStorage.getItem('darkMode');
    // Check system preference if no localStorage preference exists.
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedPreference === 'true') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  // When isDarkMode changes, update the HTML element and persist the value in localStorage.
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className="px-4 py-2 ms-2 rounded-md bg-gray-200 dark:bg-slate-800 border border-black dark:border-opacity-0 text-black dark:text-white transition-colors shadow-md"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? <FaCircle /> : <MdDarkMode />}
    </button>
  );
};

export default DarkModeToggle;