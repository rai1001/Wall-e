/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "cream": "#FFFBF2",
        "terracotta": "#D2691E",
        "sage": "#87A96B",
        "main": "#3C3C3C",
        "accent": "#FF8C42",
      },
      fontFamily: {
        "display": ["Fraunces", "serif"],
        "body": ["Inter", "sans-serif"],
      },
      borderRadius: {
        "xl": "24px",
      },
      boxShadow: {
        "soft": "0 8px 30px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
}
