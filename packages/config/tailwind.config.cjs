/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../../apps/web/src/**/*.tsx", "../../packages/*/src/**/*.tsx"],
  theme: {
    extend: {
      darkMode: "class",
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ['"Jetbrains Mono"', "monospace"],
      },
      colors: {
        gray: {
          50: "#F9F9FB",
          100: "#F3F3F6",
          200: "#E5E6EB",
          300: "#D1D2DB",
          400: "#9B9DB0",
          500: "#646787",
          600: "#484B66",
          700: "#242632",
          800: "#1C1D27",
          900: "#13141B",
        },
        primary: {
          100: "#C1D3F5",
          200: "#95B4EE",
          300: "#8CADED",
          400: "#5D8CE6",
          500: "#4178E1",
          600: "#2362DC",
          700: "#1F58C6",
          800: "#18449A",
          900: "#0E2758",
        },
      },
      shadow: {
        'soft-base': '0px 4px 46px 1px rgba(17, 18, 21, 0.05)',
      }
    },
  },
  plugins: [require("tailwindcss-radix")],
};
