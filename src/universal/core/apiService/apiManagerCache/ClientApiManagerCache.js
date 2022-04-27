/* istanbul ignore file */
import ClientApiManager from '../apiManager/ClientApiManager';
import createCache from '../utils/createCache';

const { services, timeouts } = require('__APP_CONFIG__');

const cache = createCache(ClientApiManager, services, timeouts.clientApiManager);

export default cache;
