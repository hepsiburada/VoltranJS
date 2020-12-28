/* eslint-disable */
const webpack = require('webpack');

const webpackClientConfig = require('../../webpack.client.config');
const webpackServerConfig = require('../../webpack.server.config');

function compilationCallback(err, stats, config, resolve, reject) {
  if (err) {
    console.log('Compilation execution error occurred');
    console.log(err);

    return reject(err);
  }

  if (stats.hasErrors()) {
    console.log('Compilation bundle error occurred');
    console.log(stats.toJson().errors);

    return reject(new Error('Webpack compilation errors'));
  }

  console.log(`Compilation completed for ${config.name}`);

  resolve();
}

async function bundle() {
  const clientCompilationPromise = new Promise((resolve, reject) => {
    webpack(webpackClientConfig, (err, stats) =>
      compilationCallback(err, stats, webpackClientConfig, resolve, reject)
    );
  });

  await clientCompilationPromise;

  const serverCompilationPromise = new Promise((resolve, reject) => {
    webpack(webpackServerConfig, (err, stats) =>
      compilationCallback(err, stats, webpackServerConfig, resolve, reject)
    );
  });

  await serverCompilationPromise;
}

module.exports = bundle;
