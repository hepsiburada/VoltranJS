import os from 'os';

// 2 thread per core. 8 core = 8 * 2 = 16 thread. 
// This poll will be used by queue system (epoll, kqueue and iocp)
// we need to check under load.
// cluster?
process.env.UV_THREADPOOL_SIZE = OS.cpus().length

import cluster from 'cluster';

import logger from './universal/utils/logger';
import Hiddie from 'hiddie';
import http from 'http';
import voltranConfig from '../voltran.config';
import prom from 'prom-client';
import {HTTP_STATUS_CODES} from './universal/utils/constants';

const enablePrometheus = voltranConfig.monitoring.prometheus;

function triggerMessageListener(worker) {
  worker.on('message', function (message) {
    if (message?.options?.forwardAllWorkers) {
      sendMessageToAllWorkers(message);
    }
  });
}

function sendMessageToAllWorkers(message) {
  Object.keys(cluster.workers).forEach(function (key) {
    const worker = cluster.workers[key];
    worker.send({
      msg: message.msg,
    });
  }, this);
}

cluster.on('fork', (worker) => {
  triggerMessageListener(worker);
});

if (cluster.isMaster) {
  for (let i = 0; i < os.cpus().length; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', worker => {
    logger.error(`Worker ${worker.id} died`);
    cluster.fork();
  });

  if (enablePrometheus) {
    const aggregatorRegistry = new prom.AggregatorRegistry();
    const metricsPort = voltranConfig.port + 1;

    // eslint-disable-next-line consistent-return
    const hiddie = Hiddie(async (err, req, res) => {
      if (req.url === '/metrics' && req.method === 'GET') {
        res.setHeader('Content-Type', aggregatorRegistry.contentType);
        return res.end(await aggregatorRegistry.clusterMetrics());
      }
      res.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
      res.end(JSON.stringify({message: 'not found'}));
    });

    http.createServer(hiddie.run).listen(metricsPort, () => {
      logger.info(
        `Voltran ready on ${voltranConfig.port} with ${
          os.cpus().length
        } core, also /metrics ready on ${metricsPort}`
      );
    });
  }
} else {
  // eslint-disable-next-line global-require
  require('./server');
}
