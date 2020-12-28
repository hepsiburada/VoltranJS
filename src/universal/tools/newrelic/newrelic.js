const {newrelicEnabled} = require('__APP_CONFIG__');

let newrelic = null;

if (newrelicEnabled) {
  newrelic = require('newrelic');
}

export default newrelic;
