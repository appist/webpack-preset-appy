const path = require("path");

const cwd = process.cwd(),
  appPackage = require(path.resolve(cwd, "package.json")),
  baseUrl = process.env.BASE_URL || "/",
  isProduction = process.env.NODE_ENV === "production",
  isSSLEnabled = process.env.HTTP_SSL_ENABLED === "true",
  httpsOption = {
    key: path.resolve(cwd, `${process.env.HTTP_SSL_CERT_PATH}/key.pem`),
    cert: path.resolve(cwd, `${process.env.HTTP_SSL_CERT_PATH}/cert.pem`),
  },
  https = (() => {
    return isSSLEnabled &&
      fs.existsSync(httpsOption.key) &&
      fs.existsSync(httpsOption.cert)
      ? {
          key: fs.readFileSync(ssl.key),
          cert: fs.readFileSync(ssl.cert),
        }
      : false;
  })(),
  svelteConfig = require(path.resolve(cwd, "svelte.config.js"));

module.exports = {
  // Capitalize the application name.
  appName: appPackage.name.charAt(0).toUpperCase() + appPackage.name.slice(1),

  baseUrl,
  cwd,

  // Configure the `webpack-dev-server` for local development use.
  devServer: {
    historyApiFallback: true,
    https,
    host: process.env.HTTP_HOST || "0.0.0.0",
    port:
      parseInt(
        isSSLEnabled
          ? process.env.HTTP_SSL_PORT || 3443
          : process.env.HTTP_PORT || 3000
      ) + 1,
    hot: false,
    overlay: {
      warnings: true,
      errors: true,
    },
  },

  // Indicate if the build is optimised for production deployment.
  isProduction,

  // Indicate if the `webpack-dev-server` should be running with HTTPS.
  isSSLEnabled,

  // Indicate the folder that contains the fonts/images/medias/scripts/styles assets.
  assetsDir: path.resolve(cwd, "assets"),

  // Indicate the folder that contains the optimised build assets.
  distDir: path.resolve(cwd, "dist"),

  // Indicate the folder that contains the public assets which are directly copied over to `distDir`.
  publicDir: path.resolve(cwd, "web/public"),

  // Indicate the folder that contains Svelte SPA source code.
  srcDir: path.resolve(cwd, "web/src"),

  // Indicate the SSL key/cert file location which will be used by `webpack-dev-server` when `HTTP_SSL_ENABLED` is
  // set to `true`. By default, `HTTP_SSL_CERT_PATH` is set to `./tmp/ssl`.
  httpsOption,

  // Indicate the HTTPS configuration for `webpack-dev-server` to use when `HTTP_SSL_ENABLED` is set to `true`.
  https,

  // Indicate the server-side rendering routes which is set by appy's `start` and `build` commands so that the service
  // worker doesn't handle navigation fallback to `/index.html` when the current route matching 1 of these routes.
  ssrRoutes: (() => {
    let routes = [];

    if (
      process.env.APPY_SSR_ROUTES !== undefined &&
      process.env.APPY_SSR_ROUTES !== ""
    ) {
      routes = routes.concat(process.env.APPY_SSR_ROUTES.split(","));
    }

    return routes;
  })(),

  svelteConfig,
};
