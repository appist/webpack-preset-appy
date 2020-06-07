const path = require("path");
const { assetsDir, cwd, srcDir } = require("./config");

module.exports = {
  alias: {
    "@assets": assetsDir,
    "@": srcDir,
    svelte: path.resolve(cwd, "node_modules", "svelte"),
  },
  extensions: [".mjs", ".js", ".jsx", ".json", ".svelte", ".ts", ".tsx"],
  mainFields: ["svelte", "browser", "module", "main"],
};
