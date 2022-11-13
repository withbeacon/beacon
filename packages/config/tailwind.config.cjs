const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["../../apps/web/src/**/*.tsx", "../../packages/*/src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ['"Jetbrains Mono"', "monospace"],
      },
      colors: {
        gray: colors.neutral,
        primary: colors.orange,
      },
    },
  },
  plugins: [require("tailwindcss-radix")],
};
