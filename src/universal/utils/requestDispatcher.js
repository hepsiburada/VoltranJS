import { getEventBus } from './helper';

const responsePrefix = 'RequestDispatcher.Response.';
const requestPrefix = 'RequestDispatcher.';

export default {
  subscribe(requestName, callback) {
    getEventBus().on(`${responsePrefix}${requestName}`, ({ error, body }) => {
      if (error) {
        callback(error, null);
      } else {
        callback(null, body);
      }
    });
  },
  request(requestName, params, options) {
    getEventBus().emit(`${requestPrefix}${requestName}`, params, options);
  }
};
