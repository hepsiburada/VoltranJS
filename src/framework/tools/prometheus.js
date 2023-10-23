import http from "http";
import os from "os";
import Hiddie from 'hiddie';
import prom from 'prom-client';
import logger from "../../universal/utils/logger";

import voltranConfig from '../../../voltran.config'
import {HTTP_STATUS_CODES} from "../../universal/utils/constants";


const enablePrometheus = voltranConfig.monitoring.prometheus;

export const injectPrometheus = (hiddie) => {
  if (enablePrometheus) {
    // eslint-disable-next-line global-require
    const Prometheus = require('__V_PROMETHEUS__');
    Prometheus.injectMetricsRoute(hiddie);
    Prometheus.startCollection();
  }
}


export const startPrometheus = (port) => {
  if (enablePrometheus) {
    const aggregatorRegistry = new prom.AggregatorRegistry();


    // eslint-disable-next-line consistent-return
    const hiddie = Hiddie(async (err, req, res) => {
      if (req.url === '/metrics' && req.method === 'GET') {
        res.setHeader('Content-Type', aggregatorRegistry.contentType);
        return res.end(await aggregatorRegistry.clusterMetrics());
      }
      res.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
      res.end(JSON.stringify({message: 'not found'}));
    });

    http.createServer(hiddie.run).listen(port, () => {
      logger.info(
        `Voltran ready on ${voltranConfig.port} with ${
          os.cpus().length
        } core, also /metrics ready on ${port}`
      );
    });
  }
}
