import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
import Hiddie from 'hiddie';
import http from 'http';
import serveStatic from 'serve-static';
import helmet from 'helmet';

import render from '../render';
import registerControllers from '../api/controllers';
import renderMultiple from '../renderMultiple';
import {cors, locals, utils, handleUrls} from "./middlewares";
import {startPrometheus} from "./tools";

import voltranConfig from '../../voltran.config';

const {bundleAnalyzerStaticEnabled} = require('__APP_CONFIG__');

const customServer = require('__V_SERVER__');
const fragmentManifest = require('__V_DICTIONARY__');

const fragments = [];
Object.keys(fragmentManifest).forEach(index => {
  const fragmentUrl = fragmentManifest[index].path;
  const arr = fragmentUrl.split(path.sep);
  const name = arr[arr.length - 1];
  fragments.push(name);
});


export const startServer = () => {
  const hiddie = Hiddie(async (err, req, res) => {
    res.end();
  });

  customServer?.prepare?.(hiddie)
  hiddie.use(compression());
  hiddie.use(locals);
  hiddie.use(helmet());
  hiddie.use(cors);
  hiddie.use('/', serveStatic(`${voltranConfig.distFolder}/public`));
  bundleAnalyzerStaticEnabled &&
  hiddie.use(
    '/bundleAnalyze',
    serveStatic(`${voltranConfig.distFolder}/public/project/assets/report.html`)
  );
  hiddie.use(cookieParser());
  hiddie.use(utils);
  hiddie.use(handleUrls);
  startPrometheus(hiddie);
  registerControllers(hiddie);
  hiddie.use('/components/:components/:path*', renderMultiple);
  hiddie.use('/components/:components', renderMultiple);
  hiddie.use(render);
  http.createServer(hiddie.run).listen(voltranConfig.port);
}
