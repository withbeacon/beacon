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
      shadow: {
        'soft-base': '0px 4px 46px 1px rgba(17, 18, 21, 0.05)',
      }
    },
  },
  plugins: [require("tailwindcss-radix")],
};
