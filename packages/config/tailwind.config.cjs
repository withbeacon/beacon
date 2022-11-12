const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../../apps/web/src/**/*.tsx", "../../packages/*/src/**/*.{tsx,ts,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        gray: colors.neutral,
        primary: colors.orange,
      },
    },
  },
  plugins: [require("tailwindcss-radix")],
};
