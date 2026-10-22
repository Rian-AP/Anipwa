/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shiunji: {
          bg: "#FFFFFF",
          bgSoft: "#FAF8FC",
          card: "#FFFFFF",
          cardElevated: "#F8F5FA",
          border: "rgba(131, 100, 165, 0.12)",
          borderSoft: "rgba(0, 0, 0, 0.06)",
          purple: "#8464A5",
          purpleDark: "#705094",
          purpleLight: "rgba(132, 100, 165, 0.10)",
          textDark: "#1A1311",
          textMuted: "#6B6570",
          textLight: "#8E8E93",
          // Character palette from shiunjifamily.com
          charaArata: "#FCA1A9",
          charaBanri: "#FCB180",
          charaSeiha: "#81CEF7",
          charaOuka: "#F6B6D3",
          charaMinami: "#A0D5C2",
          charaKotono: "#FDE03D",
          charaShion: "#AAB0FF",
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
