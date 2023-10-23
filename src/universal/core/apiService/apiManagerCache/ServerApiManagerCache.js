/* istanbul ignore file */
import ServerApiManager from '../apiManager/ServerApiManager';
import createCache from '../utils/createCache';

const { services, serviceConfigs } = require('__APP_CONFIG__');

const getCache = func => {
  const { server = {}, defaultConfig = {} } = serviceConfigs || {};
  const config = {
    ...defaultConfig,
    ...server
  };
  const cache = createCache(ServerApiManager, services, config, func);

  return cache;
};

export default getCache;
