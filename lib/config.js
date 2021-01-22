const path = require('path');

const dirName = path.resolve(__dirname).split('/node_modules')[0];

module.exports = {
  appConfigFile: {
    entry: path.resolve(dirName, '../demo/conf/'),
    output: {
      path: path.resolve(dirName, '../demo/'),
      name: 'appConfig'
    }
  },
  configFile: path.resolve(dirName, '../demo/voltran-app.config.js'),
  dev: false,
  distFolder: path.resolve(dirName, '../dist'),
  publicDistFolder: path.resolve(dirName, '../dist/assets'),
  inputFolder: path.resolve(dirName, '../demo'),
  monitoring: {
    prometheus: false
  },
  criticalCssDisabled: false,
  port: 3578,
  prefix: 'sf',
  ssr: true,
  styles: [],
  output: {
    client: {
      path: path.resolve(dirName, '../dist/assets/project/assets'),
      publicPath: path.resolve(dirName, '../demo/assets'),
      filename: '[name]-[hash].js',
      chunkFilename: '[name]-[chunkhash].js'
    },
    server: {
      path: path.resolve(dirName, '../dist/server'),
      filename: '[name].js'
    }
  },
  staticProps: [],
  routing: {
    components: path.resolve(dirName, '../demo/appRoute/components.js'),
    dictionary: path.resolve(dirName, '../demo/appRoute/dictionary.js')
  },
  svgFolder: '',
  webpackConfiguration: {
    client: {},
    common: {},
    server: {}
  },
  internalCache: {
    defaultInternalCacheMilliseconds: 1000 * 60 * 15
  }
};
