const { newrelicEnabled } = require('__APP_CONFIG__');

// eslint-disable-next-line import/no-mutable-exports
let newrelic = null;

if (newrelicEnabled) {
  // eslint-disable-next-line global-require
  newrelic = require('newrelic');
}

export default newrelic;
