/* istanbul ignore file */
import ClientApiManager from '../apiManager/ClientApiManager';
import createCache from '../utils/createCache';

const { services, serviceConfigs } = require('__APP_CONFIG__');

const getCache = func => {
  const { client = {}, defaultConfig = {} } = serviceConfigs || {};
  const config = {
    ...defaultConfig,
    ...client
  };
  const cache = createCache(ClientApiManager, services, config, func);

  return cache;
};

export default getCache;
