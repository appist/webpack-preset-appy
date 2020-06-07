const path = require("path");
const { srcDir } = require("./config");

module.exports = {
  app: path.resolve(srcDir, "main.ts"),
};
