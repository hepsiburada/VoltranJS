const path = require('path');
const webpack = require('webpack');
const {merge} = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const env = process.env.VOLTRAN_ENV || 'local';

const voltranConfig = require('./voltran.config');

const appConfigFilePath = `${voltranConfig.appConfigFile.entry}/${env}.conf.js`;
const appConfig = require(appConfigFilePath); // eslint-disable-line import/no-dynamic-require

const commonConfig = require('./webpack.common.config');
const postCssConfig = require('./postcss.config');
const packageJson = require(path.resolve(process.cwd(), 'package.json'));
const replaceString = require('./config/string.js');

const distFolderPath = voltranConfig.distFolder;
const isDebug = voltranConfig.dev;

let styles = '';

for (let i = 0; i < voltranConfig.styles.length; i++) {
  styles += `require('${voltranConfig.styles[i]}');`;
}
const voltranServerConfigPath = voltranConfig.webpackConfiguration.server;
const voltranServerConfig = voltranServerConfigPath
  ? require(voltranConfig.webpackConfiguration.server)
  : '';
const voltranCustomServer =
  voltranConfig.entry.server && !isDebug ? voltranConfig.entry.server : 'src/server.js';

const voltranServer = path.resolve(__dirname, isDebug ? voltranCustomServer : 'src/main.js');

const serverConfig = merge(commonConfig, voltranServerConfig, {
  name: 'server',

  target: 'node',

  mode: isDebug ? 'development' : 'production',

  entry: {
    server: [voltranServer]
  },

  output: {
    path: voltranConfig.output.server.path,
    filename: voltranConfig.output.server.filename,
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        loader: 'esbuild-loader',
        include: [path.resolve(__dirname, 'src'), voltranConfig.inputFolder],
        options: {
          loader: 'jsx',
          target: 'es2015',
        },
      },
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          multiple: [...replaceString()],
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: appConfig.isCssClassNameObfuscationEnabled
                  ? `${voltranConfig.prefix}-[name]-[hash:base64]`
                  : `${voltranConfig.prefix}-[path][name]__[local]`,
                localIdentHashSalt: packageJson.name,
                exportOnlyLocals: true,
              },
              importLoaders: 1,
              sourceMap: isDebug,
            }
          },
          {
            loader: 'postcss-loader',
            options: postCssConfig
          },
          {
            loader: 'sass-loader',
          },
          ...(voltranConfig.sassResources
            ? [
              {
                loader: 'sass-resources-loader',
                options: {
                  sourceMap: false,
                  resources: voltranConfig.sassResources,
                },
              },
            ]
            : [])
        ]
      }
    ]
  },

  externalsPresets: {node: true},
  externals: [
    nodeExternals(),
  ],

  plugins: [
    new CleanWebpackPlugin({
        verbose: false,
      dangerouslyAllowCleanPatternsOutsideProject: true,
    }),

    new webpack.DefinePlugin({
      'process.env.BROWSER': false,
      __DEV__: isDebug,
    }),

    ...(isDebug ? [new webpack.HotModuleReplacementPlugin()] : [])
  ]
});

module.exports = serverConfig;
