/* eslint-disable */
const http = require('http');
const Hiddie = require('hiddie');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
const webpackClientConfig = require('../../webpack.client.config');
const webpackServerConfig = require('../../webpack.server.config');
const voltranConfig = require('../../voltran.config');
const run = require('./run');
const clean = require('./clean');

const PORT_REPORT_TIMEOUT = 1000;

async function start() {
  const hiddie = Hiddie((err, req, res) => {
    res.end();
  });

  await run(clean);

  const compiler = webpack([webpackClientConfig, webpackServerConfig]);

  const clientCompiler = compiler.compilers.find(compiler => compiler.name === 'client');

  hiddie.use(
    webpackDevMiddleware(compiler, {
      quiet: true,
      noInfo: true,
      lazy: false,
      writeToDisk: true,
      serverSideRender: false,
      publicPath: webpackClientConfig.output.publicPath
    })
  );

  hiddie.use(webpackHotMiddleware(clientCompiler));
  hiddie.use(webpackHotServerMiddleware(compiler, {
    chunkName: 'server',
    serverRendererOptions: { hiddie }
  }));

  http.createServer(hiddie.run).listen(voltranConfig.port);

  compiler.hooks.done.tap('start.js__port-reporting', () => {
    setTimeout(() => {
      console.log(`Voltran ready on ${voltranConfig.port}`);
    }, PORT_REPORT_TIMEOUT);
  });

  return hiddie;
}

module.exports = start;
