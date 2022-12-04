module.exports = {
  stories: [
    "../apps/web/src/components/**/*.stories.mdx",
    "../apps/web/src/components/**/*.stories.@(ts|tsx)",

    "../packages/ui/src/**/*.stories.mdx",
    "../packages/ui/src/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
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
};
