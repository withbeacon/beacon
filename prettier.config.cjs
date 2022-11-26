module.exports = {
  plugins: [require("prettier-plugin-tailwindcss")],
  tailwindConfig: "./packages/config/tailwind.config.cjs",
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
};
