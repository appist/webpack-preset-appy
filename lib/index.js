const { devServer, isProduction } = require("./config");

module.exports = {
  devServer,
  devtool: isProduction ? false : "eval-cheap-source-map",
  entry: require("./entry"),
  module: require("./module"),
  output: require("./output"),
  plugins: require("./plugins"),
  resolve: require("./resolve"),
  stats: require("./stats"),
};
