module.exports = {
  stories: [
    "../apps/web/src/**/*.stories.mdx",
    "../apps/web/src/**/*.stories.@(ts|tsx)",

    "../packages/ui/**/*.stories.mdx",
    "../packages/ui/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-links",
    "@storybook/addon-controls",
    "@storybook/addon-essentials",
    "@storybook/addon-storysource",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-postcss",
      options: {
        cssLoaderOptions: {
          importLoaders: 1,
        },
        postcssLoaderOptions: {
          implementation: require("postcss"),
        },
      },
    },
  ],
  framework: "@storybook/react",
  core: {
    builder: "webpack5",
  },
  features: {
    interactionsDebugger: true,
  }
};
