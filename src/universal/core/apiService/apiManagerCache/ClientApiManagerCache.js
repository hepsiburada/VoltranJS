/* istanbul ignore file */
import ClientApiManager from '../apiManager/ClientApiManager';
import createCache from '../utils/createCache';

const { services, serviceConfigs } = require('__APP_CONFIG__');

const getCache = func => {
  const cache = createCache(ClientApiManager, services, serviceConfigs?.client, func);

  return cache;
};

export default getCache;
