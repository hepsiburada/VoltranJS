import createApiClient from '../utils/createApiClient';
import BaseApiManager from './BaseApiManager';

export default (entity, serviceConfigs, func) => {
  const baseURL =
    entity?.client?.url || entity?.clientUrl || entity?.url || entity?.serverUrl || '/';

  const config = {
    ...serviceConfigs,
    ...(entity?.client && entity?.client?.config && { ...entity?.client?.config }),
    ...(entity?.config && { ...entity?.config })
  };

  const apiManager = new BaseApiManager({
    baseURL,
    ...config
  });

  return createApiClient(apiManager, func);
};
