
import cookieParser from 'cookie-parser';
import { compose } from 'compose-middleware';
import compression from 'compression';
import serveStatic from 'serve-static';
import helmet from 'helmet';
import cluster from "cluster";
import os from 'os';

import render from './render';
import logger from "./universal/utils/logger";
import { createCacheManagerInstance } from './universal/core/cache/cacheUtils';
import {locals, handleUrls, utils} from "./framework/middlewares";
import voltranConfig from '../voltran.config';
import {startServer} from "./framework/startServer";
import {startPrometheus, triggerMessageListener} from "./framework/tools";

const isDebug = voltranConfig.dev;
const customServer = require('__V_SERVER__');

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
  process.exit(1);
});

process.on('message', message => {
  handleProcessMessage(message);
});

const handleProcessMessage = message => {
  if (message?.msg?.action === 'deleteallcache') {
    createCacheManagerInstance().removeAll();
  } else if (message?.msg?.action === 'deletecache') {
    createCacheManagerInstance().remove(message?.msg?.key);
  }
};

if(!isDebug){
  cluster.on('fork', (worker) => {
    triggerMessageListener(worker);
  });
}

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

if (cluster.isMaster && !isDebug) {
  if(customServer?.clusterMiddleware){
    customServer?.clusterMiddleware?.(cluster, forkClusters)
  }else {
    forkClusters();
  }
  startPrometheus(voltranConfig.port + 1)
}else {
  if (process.env.NODE_ENV === 'production') {
    startServer();
  }
}

export default () => {
  return compose([
    compression(),
    locals,
    helmet(),
    serveStatic(`${voltranConfig.distFolder}/public`),
    cookieParser(),
    utils,
    handleUrls,
    render
  ]);
};
