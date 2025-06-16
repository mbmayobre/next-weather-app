import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'sunny': "url('/background-images/sunny-background.webp')",
        'snow': "url('/background-images/snow-background.webp')",
        'rain': "url('/background-images/moderate-rain-background.webp')",
        'heavy-rain': "url('/background-images/heavy-rain-background.webp')",
        'cloudy': "url('/background-images/cloudy-background.webp')",
        'fog': "url('/background-images/foggy-background.webp')",
        'thunderstorm': "url('/background-images/thunderstorm-background.webp')",
        'light-rain': "url('/background-images/light-rain-background.webp')",
        'clear-night': "url('/background-images/clear-night-background.webp')",
        'partly-cloudy-day': "url('/background-images/partly-cloudy-background.webp')",
        'partly-cloudy-night': "url('/background-images/partly-cloudy-night-background.webp')",
      },
    },
  },
  plugins: [],
} satisfies Config;
