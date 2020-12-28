import ApiManager from './ApiManager';
import { createApiClient } from '../../common/network/apiUtils';

import http from 'http';
import https from 'https';

const BASE_HTTP_AGENT_CONFIG = {
  keepAlive: true,
  rejectUnauthorized: false
};

export default (config, timeout) => {
  const apiManager = new ApiManager({
    timeout,
    baseURL: config.serverUrl,
    httpAgent: new http.Agent(BASE_HTTP_AGENT_CONFIG),
    httpsAgent: new https.Agent(BASE_HTTP_AGENT_CONFIG)
  });

  return createApiClient(apiManager);
};
