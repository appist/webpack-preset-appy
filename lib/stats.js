const { isProduction } = require("./config");

module.exports = isProduction
  ? {
      assets: true,
      assetsSort: "!size",
      children: false,
      colors: true,
    }
  : "minimal";
