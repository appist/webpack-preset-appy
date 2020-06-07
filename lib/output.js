const { baseUrl, distDir, isProduction } = require("./config");

const output = {
  chunkFilename: "scripts/chunk.[name].js",
  filename: "scripts/[name].js",
  path: distDir,
  publicPath: baseUrl,
};

if (isProduction) {
  output.chunkFilename = "scripts/chunk.[name].[contenthash:12].js";
  output.filename = "scripts/[name].[contenthash:12].js";
}

module.exports = output;
