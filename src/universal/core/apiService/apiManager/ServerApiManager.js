import createApiClient from '../utils/createApiClient';
import BaseApiManager from './BaseApiManager';

import http from 'http';
import https from 'https';

const BASE_HTTP_AGENT_CONFIG = {
  keepAlive: true,
  rejectUnauthorized: false
};

export default (entity, serviceConfigs, func) => {
  const baseURL =
    entity?.server?.url || entity?.serverUrl || entity?.url || entity.clientUrl || '/';

  const config = {
    ...serviceConfigs,
    ...(entity?.server && entity?.server?.config && { ...entity?.server?.config }),
    ...(entity?.config && { ...entity?.config })
  };

  const apiManager = new BaseApiManager({
    baseURL,
    ...config,
    httpAgent: new http.Agent(BASE_HTTP_AGENT_CONFIG),
    httpsAgent: new https.Agent(BASE_HTTP_AGENT_CONFIG)
  });

  return createApiClient(apiManager, func);
};
