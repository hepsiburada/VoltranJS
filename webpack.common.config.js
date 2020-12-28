const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const packageJson = require('./package');

const reStyle = /\.(css|less|styl|scss|sass|sss)$/;
const reImage = /\.(bmp|gif|jpg|jpeg|png|svg)$/;
const staticAssetName = '[name]-[hash].[ext]';

const voltranConfig = require('./voltran.config');
const isDebug = voltranConfig.dev;

const commonConfig = webpackMerge(voltranConfig.webpackConfiguration.common, {
  mode: isDebug ? 'development' : 'production',

  module: {
    // Make missing exports an error instead of warning
    strictExportPresence: true,

    rules: [
      // Rules for images
      {
        test: reImage,
        oneOf: [
          // Inline lightweight images into CSS
          {
            issuer: reStyle,
            oneOf: [
              // Inline lightweight SVGs as UTF-8 encoded DataUrl string
              {
                test: /\.svg$/,
                loader: 'svg-url-loader',
                options: {
                  name: staticAssetName,
                  limit: 4096 // 4kb
                }
              },

              // Inline lightweight images as Base64 encoded DataUrl string
              {
                loader: 'url-loader',
                options: {
                  name: staticAssetName,
                  limit: 4096 // 4kb
                }
              }
            ]
          },

          {
            loader: 'file-loader',
            options: {
              name: staticAssetName
            }
          }
        ]
      },

      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          name: staticAssetName,
          limit: 10000
        }
      },

      {
        test: /\.(ttf|eot|otf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: staticAssetName
        }
      }
    ]
  },

  stats: 'errors-only',

  // Choose a developer tool to enhance debugging
  // https://webpack.js.org/configuration/devtool/#devtool
  devtool: isDebug ? 'cheap-module-inline-source-map' : 'source-map',

  plugins: [
    new webpack.DefinePlugin({
      VOLTRAN_API_VERSION: JSON.stringify(packageJson.version),
      'process.env.GO_PIPELINE_LABEL': JSON.stringify(process.env.GO_PIPELINE_LABEL)
    })
  ]
});

module.exports = commonConfig;
