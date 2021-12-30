const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

const env = process.env.VOLTRAN_ENV || 'local';

const voltranConfig = require('./voltran.config');

const appConfigFilePath = `${voltranConfig.appConfigFile.entry}/${env}.conf.js`;
const appConfig = require(appConfigFilePath); // eslint-disable-line import/no-dynamic-require

const babelConfig = require('./babel.server.config');
const commonConfig = require('./webpack.common.config');
const postCssConfig = require('./postcss.config');
const replaceString = require('./config/string.js');

const isDebug = voltranConfig.dev;

let styles = '';

for (let i = 0; i < voltranConfig.styles.length; i++) {
  styles += `require('${voltranConfig.styles[i]}');`;
}
const voltranServerConfigPath = voltranConfig.webpackConfiguration.server;
const voltranServerConfig = voltranServerConfigPath
  ? require(voltranConfig.webpackConfiguration.server)
  : '';

const serverConfig = webpackMerge(commonConfig, voltranServerConfig, {
  name: 'server',

  target: 'node',

  mode: isDebug ? 'development' : 'production',

  entry: {
    server: [path.resolve(__dirname, isDebug ? 'src/server.js' : 'src/main.js')]
  },

  output: {
    path: voltranConfig.output.server.path,
    filename: voltranConfig.output.server.filename,
    libraryTarget: 'commonjs2'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src'), voltranConfig.inputFolder],
        options: {
          cacheDirectory: true,
          babelrc: false,
          ...babelConfig()
        }
      },
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          multiple: [...replaceString()]
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'css-loader/locals',
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: isDebug,
              localIdentName: appConfig.isCssClassNameObfuscationEnabled
                ? `${voltranConfig.prefix}-[name]-[hash:base64:5]`
                : `${voltranConfig.prefix}-[name]-[local]`,
              minimize: isDebug
            }
          },
          {
            loader: 'postcss-loader',
            options: postCssConfig
          },
          {
            loader: 'sass-loader'
          },
          ...(voltranConfig.sassResources
            ? [
                {
                  loader: 'sass-resources-loader',
                  options: {
                    sourceMap: false,
                    resources: voltranConfig.sassResources
                  }
                }
              ]
            : [])
        ]
      }
    ]
  },

  externals: [nodeExternals()],

  plugins: [
    new webpack.DefinePlugin({
      'process.env.BROWSER': false,
      __DEV__: isDebug
    }),

    ...(isDebug ? [new webpack.HotModuleReplacementPlugin()] : [])
  ]
});

module.exports = serverConfig;
