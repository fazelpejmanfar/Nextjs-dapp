/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "5xl": "2000px"
      },
      fontFamily: {
        kanit: ["Kanit", "sans-serif"]
      }
    },
  },
  plugins: [],
}