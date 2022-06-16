import createApiClient from '../utils/createApiClient';
import BaseApiManager from './BaseApiManager';

import http from 'http';
import https from 'https';

const BASE_HTTP_AGENT_CONFIG = {
  keepAlive: true,
  rejectUnauthorized: false
};

export default (entity, serviceConfigs, func) => {
  const apiManager = new BaseApiManager({
    baseURL: entity.serverUrl || entity.url || entity.clientUrl || '/',
    ...serviceConfigs,
    httpAgent: new http.Agent(BASE_HTTP_AGENT_CONFIG),
    httpsAgent: new https.Agent(BASE_HTTP_AGENT_CONFIG)
  });

  return createApiClient(apiManager, func);
};
