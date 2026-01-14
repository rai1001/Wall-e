/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        action: {
            DEFAULT: '#2563EB', // blue-600
            hover: '#1D4ED8', // blue-700
        },
        status: {
            ok: '#10B981', // green-500
        },
        pending: '#FBBF24', // amber-400
        alert: '#EF4444', // red-500
        surface: '#F2F4F6', // off-white-gray
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
