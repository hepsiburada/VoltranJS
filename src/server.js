/* istanbul ignore file */
import newrelic from './universal/tools/newrelic/newrelic';

import cookieParser from 'cookie-parser';
import { compose } from 'compose-middleware';
import compression from 'compression';
import path from 'path';
import Hiddie from 'hiddie';
import http from 'http';
import serveStatic from 'serve-static';
import prom from 'prom-client';
import helmet from 'helmet';
import url from 'url';
import xss from 'xss';

import Welcome from './universal/partials/Welcome';
import render from './render';
import registerControllers from './api/controllers';
import renderMultiple from './renderMultiple';

import { createCacheManagerInstance } from './universal/core/cache/cacheUtils';

import { HTTP_STATUS_CODES } from './universal/utils/constants';

import voltranConfig from '../voltran.config';

const enablePrometheus = voltranConfig.monitoring.prometheus;
let Prometheus;

if (enablePrometheus) {
  // eslint-disable-next-line global-require
  Prometheus = require('__V_PROMETHEUS__');
}

const fragmentManifest = require('__V_DICTIONARY__');

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
  process.exit(1);
});

process.on('message', message => {
  handleProcessMessage(message);
});

const fragments = [];

Object.keys(fragmentManifest).forEach(index => {
  const fragmentUrl = fragmentManifest[index].path;
  const arr = fragmentUrl.split(path.sep);
  const name = arr[arr.length - 1];
  fragments.push(name);
});

const handleProcessMessage = message => {
  if (message?.msg?.action === 'deleteallcache') {
    createCacheManagerInstance().removeAll();
  } else if (message?.msg?.action === 'deletecache') {
    createCacheManagerInstance().remove(message?.msg?.key);
  }
};

const handleUrls = async (req, res, next) => {
  if (req.url === '/' && req.method === 'GET') {
    res.html(Welcome());
  } else if (req.url === '/metrics' && req.method === 'GET' && !enablePrometheus) {
    res.setHeader('Content-Type', prom.register.contentType);
    res.end(prom.register.metrics());
  } else if (req.url === '/status' && req.method === 'GET') {
    res.json({ success: true, version: process.env.GO_PIPELINE_LABEL || '1.0.0', fragments });
  } else if ((req.url === '/statusCheck' || req.url === '/statuscheck') && req.method === 'GET') {
    res.json({ success: true, version: process.env.GO_PIPELINE_LABEL || '1.0.0', fragments });
  } else if (req.url === '/deleteallcache' && req.method === 'GET') {
    process.send({
      msg: {
        action: 'deleteallcache'
      },
      options: {
        forwardAllWorkers: true
      }
    });
    res.json({ success: true });
  } else if (req.path === '/deletecache' && req.method === 'GET') {
    if (req?.query?.key) {
      process.send({
        msg: {
          action: 'deletecache',
          key: req?.query?.key
        },
        options: {
          forwardAllWorkers: true
        }
      });
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } else {
    newrelic?.setTransactionName?.(req.path);
    next();
  }
};

const cors = async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(HTTP_STATUS_CODES.OK);
    res.end();

    return;
  }

  next();
};

const utils = async (req, res, next) => {
  res.json = json => {
    addCustomAttrsToNewrelic(json.message)
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(json));
  };

  res.html = html => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html);
  };

  res.status = code => {
    res.statusCode = code;
    return res;
  };

  next();
};

const locals = async (req, res, next) => {
  const parsedUrl = url.parse(req.url, true);

  req.query = JSON.parse(xss(JSON.stringify(parsedUrl.query)));
  req.path = xss(parsedUrl.pathname);
  req.url = xss(req.url);

  if (req.headers['set-cookie']) {
    req.headers.cookie = req.headers.cookie || req.headers['set-cookie']?.join();
    delete req.headers['set-cookie'];
  }

  res.locals = {};
  res.locals.startEpoch = new Date();

  next();
};

if (process.env.NODE_ENV === 'production') {
  const hiddie = Hiddie(async (err, req, res) => {
    res.end();
  });
  hiddie.use(compression());
  hiddie.use(locals);
  hiddie.use(helmet());
  hiddie.use(cors);
  hiddie.use('/', serveStatic(`${voltranConfig.distFolder}/public`));
  hiddie.use(cookieParser());
  hiddie.use(utils);
  hiddie.use(handleUrls);

  if (enablePrometheus) {
    Prometheus.injectMetricsRoute(hiddie);
    Prometheus.startCollection();
  }

  registerControllers(hiddie);
  hiddie.use('/components/:components/:path*', renderMultiple);
  hiddie.use('/components/:components', renderMultiple);
  hiddie.use(render);
  http.createServer(hiddie.run).listen(voltranConfig.port);
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
