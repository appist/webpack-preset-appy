const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const { isProduction, svelteConfig } = require("./config");
const assetsInlineLimit = 4096;

module.exports = {
  rules: [
    {
      test: /\.css$/,
      use: [
        isProduction ? MiniCSSExtractPlugin.loader : "style-loader",
        "css-loader",
        "postcss-loader",
      ],
    },
    {
      test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: assetsInlineLimit,
            fallback: {
              loader: "file-loader",
              options: {
                name: "images/[name].[contenthash:12].[ext]",
              },
            },
          },
        },
      ],
    },
    {
      test: /\.(svg)(\?.*)?$/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "images/[name].[contenthash:12].[ext]",
          },
        },
      ],
    },
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: assetsInlineLimit,
            fallback: {
              loader: "file-loader",
              options: {
                name: "medias/[name].[contenthash:12].[ext]",
              },
            },
          },
        },
      ],
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: assetsInlineLimit,
            fallback: {
              loader: "file-loader",
              options: {
                name: "fonts/[name].[contenthash:12].[ext]",
              },
            },
          },
        },
      ],
    },
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "babel-loader?cacheDirectory=true",
        },
        {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            happyPackMode: false,
            appendTsxSuffixTo: ["\\.svelte$"],
          },
        },
      ],
    },
    {
      test: /\.svelte$/,
      use: [
        {
          loader: "babel-loader?cacheDirectory=true",
        },
        {
          loader: "svelte-loader",
          options: {
            emitCss: isProduction,
            hotReload: true,
            preprocess: svelteConfig.preprocess,
          },
        },
      ],
    },
  ],
};
