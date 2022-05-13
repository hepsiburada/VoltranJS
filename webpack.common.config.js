const path = require('path');
const webpack = require('webpack');
const {merge} = require('webpack-merge');
const packageJson = require(path.resolve(process.cwd(), 'package.json'));
const voltranConfig = require('./voltran.config');

const reStyle = /\.(css|less|styl|scss|sass|sss)$/;
const reImage = /\.(bmp|gif|jpg|jpeg|png|svg)$/;
const staticAssetName = '[name]-[contenthash].[ext]';

const isDebug = voltranConfig.dev;

const voltranCommonConfigPath = voltranConfig.webpackConfiguration.common;
const voltranCommonConfig = voltranCommonConfigPath
  ? require(voltranConfig.webpackConfiguration.common)
  : '';

const commonConfig = merge(voltranCommonConfig, {
  mode: isDebug ? 'development' : 'production',

  output: {
    assetModuleFilename: staticAssetName,
  },

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
                type: 'asset',
                use: 'svg-url-loader',
                parser: {
                  dataUrlCondition: {
                    maxSize: 4096, // 4kb
                  },
                },
              },

              // Inline lightweight images as Base64 encoded DataUrl string
              {
                type: 'asset',
                parser: {
                  dataUrlCondition: {
                    maxSize: 4096, // 4kb
                  },
                },
              },
            ],
          },

          {
            type: 'asset/resource',
          },
        ],
      },

      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10000,
          },
        },
      },

      {
        test: /\.(ttf|eot|otf|woff|woff2)$/,
        type: 'asset/resource',
      }
    ]
  },

  stats: 'errors-only',

  // Choose a developer tool to enhance debugging
  // https://webpack.js.org/configuration/devtool/#devtool
  devtool: isDebug ? 'inline-cheap-module-source-map' : 'source-map',

  plugins: [
    new webpack.DefinePlugin({
      VOLTRAN_API_VERSION: JSON.stringify(packageJson.version),
      'process.env.GO_PIPELINE_LABEL': JSON.stringify(process.env.GO_PIPELINE_LABEL),
    }),
  ],
  resolve: {
    alias: {
      // 'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
      // 'postcss-loader': path.resolve(__dirname, 'node_modules', 'postcss-loader'),
    },
    fallback: {
      url: false,
    },
  },
});

module.exports = commonConfig;
