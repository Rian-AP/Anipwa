/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          bg: "#000000",
          card: "#121214",
          cardElevated: "#1c1c1e",
          border: "#2c2c2e",
          accent: "#ff375f", // vibrant iOS pink/red accent
          accentHover: "#ff2d55",
          primary: "#ff383c", // icon match red
          gray: "#8e8e93",
          lightGray: "#d1d1d6",
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "sans-serif"
        ]
      }
    },
  },
  plugins: [],
}
