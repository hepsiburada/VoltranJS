/* istanbul ignore file */
import ClientApiManager from './ClientApiManager';
import { SERVICES } from '../../utils/constants';

const { services, timeouts } = require('__APP_CONFIG__');

const cache = {};

Object.entries(services).forEach(entity => {
  cache[SERVICES[entity[0]]] = ClientApiManager(entity[1], timeouts.clientApiManager);
});

export default cache;
