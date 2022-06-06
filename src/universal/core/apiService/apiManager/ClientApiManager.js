import createApiClient from '../utils/createApiClient';
import BaseApiManager from './BaseApiManager';

export default (entity, serviceConfigs) => {
  const baseURL = entity.clientUrl || entity.url || entity.serverUrl || '/';
  const config = {
    ...serviceConfigs,
    ...entity?.config
  };

  const apiManager = new BaseApiManager({
    baseURL,
    ...config
  });

  return createApiClient(apiManager);
};
