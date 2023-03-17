/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../../apps/web/src/**/*.tsx", "../../packages/*/src/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
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
      backgroundImage: {
        "dark-insight-card":
          "linear-gradient(180deg, #1C1D27 0%, rgba(28, 29, 39, 0) 116.07%)",

        "insight-card":
          "linear-gradient(180deg, #E5E6EB 0%, rgba(243, 243, 246, 0) 116.07%)",

        "landing-title":
          "linear-gradient(183.86deg, #1E1E1E 3.16%, rgba(143, 143, 143, 0) 455.06%, rgba(30, 30, 30, 0.2) 455.06%)",

        "landing-title-dark": 
          "linear-gradient(178.82deg, #EAEBEB 1.01%, rgba(143, 143, 143, 0) 434.92%, #121316 434.92%)",
      },
      dropShadow: {
        "insight-card": "2px 2px 48px rgba(194, 194, 194, 0.00)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      screens: {
        xl: "1440px",
      }
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    require("tailwindcss-radix"),
    require("tailwindcss-animate"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@headlessui/tailwindcss"),
  ],
};
