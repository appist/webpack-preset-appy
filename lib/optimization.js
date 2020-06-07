const TerserWebpackPlugin = require("terser-webpack-plugin");

module.exports = {
  minimize: true,
  minimizer: [
    new TerserWebpackPlugin({
      terserOptions: {
        output: {
          comments: false,
        },
      },
      extractComments: false,
    }),
  ],
  runtimeChunk: "single",
  splitChunks: {
    chunks: "all",
    maxInitialRequests: Infinity,
    minSize: 0,
    cacheGroups: {
      vendor: {
        test: /node_modules/,
        name: "vendor",
      },
    },
  },
};
