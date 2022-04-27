import createApiClient from '../utils/createApiClient';
import BaseApiManager from './BaseApiManager';

import http from 'http';
import https from 'https';

const BASE_HTTP_AGENT_CONFIG = {
  keepAlive: true,
  rejectUnauthorized: false
};

export default (config, timeout) => {
  const apiManager = new BaseApiManager({
    timeout,
    baseURL: config.serverUrl || config.url || config.clientUrl || '/',
    httpAgent: new http.Agent(BASE_HTTP_AGENT_CONFIG),
    httpsAgent: new https.Agent(BASE_HTTP_AGENT_CONFIG)
  });

  return createApiClient(apiManager);
};
