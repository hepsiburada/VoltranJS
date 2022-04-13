const { newrelicEnabled } = require('__APP_CONFIG__');

// eslint-disable-next-line import/no-mutable-exports
let newrelic = null;

if (newrelicEnabled) {
  // eslint-disable-next-line global-require
  newrelic = require('newrelic');
  console.log(' ---- NewRelic is ENABLED! ----');
} else {
  console.log(' ---- NewRelic is DISABLED! ----');
}

const isJsonValid = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const addCustomAttrsToNewrelic = message => {
  if (!newrelic) return;
  const isValidJson = isJsonValid(message);
  if (!isValidJson) return;
  const parsedMessage = JSON.parse(message);
  // eslint-disable-next-line no-restricted-syntax
  for (const key in parsedMessage) {
    if (Object.hasOwnProperty.call(parsedMessage, key)) {
      newrelic?.addCustomAttribute(`a_${key}`, parsedMessage[key]);
    }
  }
  newrelic?.addCustomAttribute('a_voltran.error.message', message);
};

export default newrelic;
