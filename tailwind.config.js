/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        govNavy: "#0B1F3A",
        govGold: "#D4AF37",
        govRed: "#C53030",
      },
    },
  },
  plugins: [],
};