const { content, ...config } = require("@bud/config/tailwind.config.cjs");

module.exports = {
  content: ["./apps/web/src/**/*.tsx", "./packages/*/src/**/*.tsx"],
  ...config,
}

