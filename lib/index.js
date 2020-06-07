const { devServer, isProduction } = require("./config");

module.exports = {
  devServer,
  devtool: isProduction ? false : "eval-cheap-source-map",
  entry: require("./entry"),
  module: require("./module"),
  optimization: require("./optimization"),
  output: require("./output"),
  plugins: require("./plugins"),
  resolve: require("./resolve"),
  stats: require("./stats"),
};
