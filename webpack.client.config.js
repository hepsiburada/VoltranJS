const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const AssetsPlugin = require('assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

require('intersection-observer');

const {createComponentName} = require('./src/universal/utils/helper.js');

const packageJson = require('./package.json');

const isBuildingForCDN = process.argv.includes('--for-cdn');
const isAnalyze = process.argv.includes('--analyze');
const env = process.env.VOLTRAN_ENV || 'local';
const voltranConfig = require('./voltran.config');

const appConfigFilePath = `${voltranConfig.appConfigFile.entry}/${env}.conf.js`;
const appConfig = require(appConfigFilePath);
const commonConfig = require('./webpack.common.config');
const postCssConfig = require('./postcss.config');
const babelConfig = require('./babel.server.config');
 
const voltranClientConfigPath = voltranConfig.webpackConfiguration.client;
const voltranClientConfig = voltranClientConfigPath ?
  require(voltranConfig.webpackConfiguration.client) :
  '';

const normalizeUrl = require('./lib/os.js');
const replaceString = require('./config/string.js');

const fragmentManifest = require(voltranConfig.routing.dictionary);

const isDebug = voltranConfig.dev;
const reScript = /\.(js|jsx|mjs)$/;
const distFolderPath = voltranConfig.distFolder;
const prometheusFile = voltranConfig.monitoring.prometheus;

const chunks = {};

chunks.client = [
  '@babel/polyfill',
  'intersection-observer',
  path.resolve(__dirname, 'src/client/client.js')
];

for (const index in fragmentManifest) {
  if (!fragmentManifest[index]) {
    continue;
  }

  const fragment = fragmentManifest[index];
  const fragmentUrl = fragment.path;
  const name = createComponentName(fragment.routePath);

  chunks[name] = [fragmentUrl];
}

if (isDebug) {
  chunks.client.push('webpack-hot-middleware/client');
}

const GO_PIPELINE_LABEL = process.env.GO_PIPELINE_LABEL || packageJson.version;
const appConfigFileTarget = `${voltranConfig.appConfigFile.output.path}/${voltranConfig.appConfigFile.output.name}.js`;

fs.copyFileSync(appConfigFilePath, appConfigFileTarget);

if (isDebug) {
  const appConfigJSONContent = require(appConfigFileTarget);

  for (const service in appConfigJSONContent.services) {
    appConfigJSONContent.services[service].clientUrl =
      appConfigJSONContent.services[service].serverUrl;
  }

  const moduleExportsText = 'module.exports';
  const appConfigFileContent = fs.readFileSync(appConfigFileTarget).toString();
  const moduleExportsIndex = appConfigFileContent.indexOf(moduleExportsText);

  let context = appConfigFileContent.substr(0, moduleExportsIndex + moduleExportsText.length);
  context += '=';
  context += JSON.stringify(appConfigJSONContent);
  context += ';';

  fs.writeFileSync(appConfigFileTarget, context);
}

const outputPath = voltranConfig.output.client.path;

const clientConfig = webpackMerge(commonConfig, voltranClientConfig, {
  name: 'client',

  target: 'web',

  mode: isDebug ? 'development' : 'production',

  entry: chunks,

  output: {
    path: outputPath,
    publicPath: `${appConfig.mediaUrl}/project/assets/`,
    filename: voltranConfig.output.client.filename,
    chunkFilename: voltranConfig.output.client.chunkFilename,
    jsonpFunction: `WP_${voltranConfig.prefix.toUpperCase()}_VLTRN`
  },

  module: {
    rules: [
      {
        test: reScript,
        include: [path.resolve(__dirname, 'src'), voltranConfig.inputFolder],
        loader: 'babel-loader',
        options: {
          cacheDirectory: isDebug,
          babelrc: false,
          ...babelConfig()
        }
      },
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            ...replaceString()
          ]
        }
      },
      {
        test: /\.css$/,
        use: [
          isDebug
            ? {
              loader: 'style-loader',
              options: {
                insertAt: 'top',
                singleton: true,
                sourceMap: false
              }
            }
            : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false,
              importLoaders: 1,
              sourceMap: isDebug,
              minimize: isDebug
            }
          },
          {
            loader: 'postcss-loader',
            options: postCssConfig
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          isDebug
            ? {
              loader: 'style-loader',
              options: {
                insertAt: 'top',
                singleton: true,
                sourceMap: false
              }
            }
            : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
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
          }
        ]
      }
    ]
  },

  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        sourceMap: isDebug,
        parallel: true,
        terserOptions: { mangle: { safari10: true } }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },

  plugins: [
    ...(isBuildingForCDN
      ? []
      : [
        new CleanWebpackPlugin([distFolderPath], {
          verbose: true
        })
      ]),

    new webpack.DefinePlugin({
      'process.env.BROWSER': true,
      __DEV__: isDebug,
      GO_PIPELINE_LABEL: JSON.stringify(GO_PIPELINE_LABEL)
    }),

    new CopyWebpackPlugin([
      {
        from: voltranConfig.output.client.publicPath,
        to: voltranConfig.publicDistFolder
      }
    ]),

    ...(isDebug
      ? [new webpack.HotModuleReplacementPlugin()]
      : [
        new MiniCssExtractPlugin({
          filename: '[name].css',
          chunkFilename: '[id]-[contenthash].css'
        })
      ]),

    new AssetsPlugin({
      path: voltranConfig.inputFolder,
      filename: 'assets.json',
      prettyPrint: true
    }),

    ...(
      isAnalyze ?
        [
          new BundleAnalyzerPlugin()
        ] :
        []
    ),
  ]
});

module.exports = clientConfig;
