/* istanbul ignore file */
import ServerApiManager from '../apiManager/ServerApiManager';
import createCache from '../utils/createCache';

const { services, timeouts } = require('__APP_CONFIG__');

const cache = createCache(ServerApiManager, services, timeouts.serverApiManager);

export default cache;
