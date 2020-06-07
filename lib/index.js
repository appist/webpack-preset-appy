const { devServer } = require("./config");

module.exports = {
  devServer,
  entry: require("./entry"),
  module: require("./module"),
  output: require("./output"),
  plugins: require("./plugins"),
  resolve: require("./resolve"),
  stats: "minimal",
};
