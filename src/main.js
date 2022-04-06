import os from 'os';
import cluster from 'cluster';

import logger from './universal/utils/logger';
import Hiddie from 'hiddie';
import http from 'http';
import voltranConfig from '../voltran.config';
import prom from 'prom-client';
import { HTTP_STATUS_CODES } from './universal/utils/constants';

const voltranMain = require('__V_MAIN__');

const enablePrometheus = voltranConfig.monitoring.prometheus;

function triggerMessageListener(worker) {
  worker.on('message', function(message) {
    if (message?.options?.forwardAllWorkers) {
      sendMessageToAllWorkers(message);
    }
  });
}

function sendMessageToAllWorkers(message) {
  Object.keys(cluster.workers).forEach(function(key) {
    const worker = cluster.workers[key];
    worker.send({
      msg: message.msg
    });
  }, this);
}

cluster.on('fork', worker => {
  triggerMessageListener(worker);
});

const DEFAULT_CPU_COUNT = os.cpus().length;

function forkClusters(cpuCount = DEFAULT_CPU_COUNT) {
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', worker => {
    logger.error(`Worker ${worker.id} died`);
    const newWorker = cluster.fork();
    cluster.emit('message', newWorker, 'NEW_WORKER');
  });
}

if (cluster.isMaster) {
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
      res.end(JSON.stringify({ message: 'not found' }));
    });

    http.createServer(hiddie.run).listen(metricsPort, () => {
      logger.info(
        `Voltran ready on ${voltranConfig.port} with ${
          os.cpus().length
        } core, also /metrics ready on ${metricsPort}`
      );
    });
  }

  if (voltranConfig.entry.main) {
    const voltranMainFile = voltranMain.default;
    forkClusters(voltranMainFile.cpuCount);
    voltranMainFile.load(cluster);
  }
} else if (voltranConfig.entry.server) {
  require('__V_SERVER__');
} else {
  require('./server');
}
