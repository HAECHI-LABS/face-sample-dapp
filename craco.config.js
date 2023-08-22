const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.ignoreWarnings = [/Failed to parse source map/];
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
      };

      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
      return webpackConfig;
    },
  },
};
