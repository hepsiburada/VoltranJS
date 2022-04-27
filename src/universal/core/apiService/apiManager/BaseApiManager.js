import axios from 'axios';
import {
  CONTENT_TYPE_HEADER,
  JSON_CONTENT_TYPE,
  REQUEST_TYPES_WITH_BODY
} from '../../../utils/constants';

function createBaseConfig() {
  return {};
}

class BaseApiManager {
  constructor(customConfig) {
    const headers = {
      common: {
        ...createBaseConfig.headers,
        ...(customConfig ? customConfig.headers : null)
      }
    };

    if (!process.env.BROWSER) {
      headers['Accept-Encoding'] = 'gzip, deflate';
    }

    this.api = this.createInstance({
      ...createBaseConfig(),
      ...customConfig,
      headers
    });
  }

  createInstance(config) {
    const instance = axios.create(config);

    REQUEST_TYPES_WITH_BODY.forEach(requestType => {
      instance.defaults.headers[requestType][CONTENT_TYPE_HEADER] = JSON_CONTENT_TYPE;
    });

    return instance;
  }
}

export default BaseApiManager;
