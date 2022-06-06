/* istanbul ignore file */
import ServerApiManager from '../apiManager/ServerApiManager';
import createCache from '../utils/createCache';

const { services, serviceConfigs } = require('__APP_CONFIG__');

const cache = createCache(ServerApiManager, services, serviceConfigs?.server);

export default cache;
