/* istanbul ignore file */
const { services, timeouts } = require('__APP_CONFIG__');
import ServerApiManager from './ServerApiManager';
import { SERVICES } from '../../utils/constants';

const cache = {};

Object.entries(services).forEach(entity => {
  cache[SERVICES[entity[0]]] = ServerApiManager(entity[1], timeouts.serverApiManager);
});

export default cache;
