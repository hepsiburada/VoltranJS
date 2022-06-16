/* istanbul ignore file */
import ServerApiManager from '../apiManager/ServerApiManager';
import createCache from '../utils/createCache';

const { services, serviceConfigs } = require('__APP_CONFIG__');

const getCache = func => {
  const cache = createCache(ServerApiManager, services, serviceConfigs?.server, func);

  return cache;
};

export default getCache;
