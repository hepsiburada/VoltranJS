import createApiClient from '../utils/createApiClient';
import BaseApiManager from './BaseApiManager';

export default (config, timeout) => {
  const apiManager = new BaseApiManager({
    baseURL: config.clientUrl || config.url || config.serverUrl || '/',
    timeout
  });

  return createApiClient(apiManager);
};
