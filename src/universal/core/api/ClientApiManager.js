import ApiManager from './ApiManager';
import { createApiClient } from '../../common/network/apiUtils';

export default (config, timeout) => {
  const apiManager = new ApiManager({
    baseURL: config.clientUrl,
    timeout
  });

  return createApiClient(apiManager);
};
