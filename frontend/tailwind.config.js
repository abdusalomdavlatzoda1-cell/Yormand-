/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f7f7",
          100: "#dcebe9",
          200: "#b8d6d2",
          300: "#8fbdb6",
          400: "#5f9c93",
          500: "#3f7d74",
          600: "#2f645d",
          700: "#27504b",
          800: "#20403c",
          900: "#1a3532",
        },
        ivory: "#faf8f4",
        gold: "#b8935f",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
