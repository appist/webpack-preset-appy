const fs = require("fs");
const path = require("path");
const {
  BundleAnalyzerPlugin: BundleAnalyzerWebpackPlugin,
} = require("webpack-bundle-analyzer");
const CaseSensitivePathsWebpackPlugin = require("case-sensitive-paths-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const ManifestWebpackPlugin = require("webpack-manifest-plugin");
const MiniCSSExtractWebpackPlugin = require("mini-css-extract-plugin");
const OptimizeCSSNanoWebpackPlugin = require("@intervolga/optimize-cssnano-plugin");
const PreloadWebpackPlugin = require("preload-webpack-plugin");
const { PurgeCSS } = require("purgecss");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

const {
  appName,
  appPackage,
  assetsDir,
  baseUrl: BASE_URL,
  cwd,
  distDir,
  isProduction,
  publicDir,
  srcDir,
  ssrRoutes,
  baseUrl,
} = require("./config");

module.exports = [
  new CleanWebpackPlugin(),
  new EnvironmentPlugin({
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL,
    AVAILABLE_LOCALES: (() =>
      fs.readdirSync(`${srcDir}/locales`).map(fn => fn.replace(".json", "")))(),
  }),
  new CaseSensitivePathsWebpackPlugin(),
  new FriendlyErrorsWebpackPlugin(),
  ...(isProduction
    ? [
        new MiniCSSExtractWebpackPlugin({
          filename: "styles/[name].[contenthash:12].css",
          chunkFilename: "styles/chunk.[name].[contenthash:12].css",
        }),
        new OptimizeCSSNanoWebpackPlugin({
          sourceMap: true,
          cssnanoOptions: {
            preset: [
              "default",
              {
                mergeLonghand: false,
                cssDeclarationSorter: false,
              },
            ],
          },
        }),
        {
          apply: compiler => {
            compiler.hooks.afterEmit.tap(
              "AfterEmitPlugin",
              async compilation => {
                const results = await new PurgeCSS().purge({
                  content: [`${distDir}/**/*.html`, `${distDir}/**/*.js`],
                  css: [`${distDir}/**/*.css`],
                });

                results.forEach(result => {
                  fs.writeFileSync(
                    path.resolve(__dirname, result.file),
                    result.css
                  );
                });
              }
            );
          },
        },
      ]
    : []),
  new HTMLWebpackPlugin({
    cache: false,
    title: appName,
    scriptLoading: "defer",
    template: path.resolve(publicDir, "index.html"),
    minify: isProduction,
  }),
  new PreloadWebpackPlugin({
    rel: "preload",
    include: "allChunks",
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: publicDir,
        to: distDir,
        toType: "dir",
        globOptions: {
          ignore: ["**/.DS_Store", "**/.gitkeep", "index.html"],
        },
      },
      {
        from: assetsDir,
        to: `${distDir}/[path][name]${
          isProduction ? ".[contenthash:12]" : ""
        }.[ext]`,
        globOptions: {
          ignore: [
            "**/.DS_Store",
            "**/.gitkeep",
            "**/*.{jsx,less,sass,scss,styl,ts,tsx}",
          ],
        },
        noErrorOnMissing: true,
      },
    ],
  }),
  new ManifestWebpackPlugin({
    basePath: baseUrl,
    fileName: "assets-manifest.json",
    filter: f => {
      return !f.path.includes(".gitkeep") && !f.path.includes(".DS_Store");
    },
    map: function (file) {
      file.name = file.name.replace(/(\.[a-z0-9]{12})(\..*)$/i, "$2");

      return file;
    },
  }),
  ...(isProduction
    ? [
        new BundleAnalyzerWebpackPlugin({
          analyzerMode: "static",
          openAnalyzer: process.env.WEBPACK_OPEN_BUNDLE_ANALYZER === "true",
          reportFilename: path.resolve(
            cwd,
            "tmp/webpack/bundle-analyzer-report.html"
          ),
        }),
        new FaviconsWebpackPlugin({
          cache: false,
          favicons: Object.assign(
            {},
            (() =>
              Object.assign({}, appPackage.pwa, {
                appName: appName,
                appShortName: appName,
                appDescription: appPackage.description,
              }))(),
            {
              icons: {
                android: true,
                appleIcon: true,
                appleStartup: false,
                coast: false,
                favicons: false,
                firefox: false,
                windows: true,
                yandex: false,
              },
            }
          ),
          inject: true,
          logo: `${publicDir}/logo.png`,
          prefix: "pwa/",
        }),
        new WorkboxWebpackPlugin.GenerateSW({
          skipWaiting: true,
          clientsClaim: true,
          navigateFallback: "/index.html",
          navigateFallbackDenylist: ssrRoutes
            .concat(["/service-worker.js"])
            .map(p => new RegExp(p)),
        }),
      ]
    : []),
];
