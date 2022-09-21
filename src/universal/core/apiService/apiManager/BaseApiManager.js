import axios from 'axios';
import {
  CONTENT_TYPE_HEADER,
  JSON_CONTENT_TYPE,
  REQUEST_TYPES_WITH_BODY
} from '../../../utils/constants';
import CookieService from '../../../service/CookieService';
import pickByIndexOf from '../../../utils/lodash/pickByIndexOf';
import omitByIndexOf from '../../../utils/lodash/omitByIndexOf';

function createBaseConfig() {
  return {};
}

class BaseApiManager {
  constructor(config) {
    const headers = {
      common: {
        ...createBaseConfig.headers,
        ...(config ? config.headers : null)
      }
    };

    if (!process.env.BROWSER) {
      headers['Accept-Encoding'] = 'gzip, deflate';
    }

    if (process.env.BROWSER && config?.addCookiesToHeader) {
      let cookies = CookieService.getAllItems();
      if (config?.includeCookies?.length > 0) {
        cookies = pickByIndexOf(cookies, config?.includeCookies);
      }
      if (config?.excludeCookies?.length > 0) {
        cookies = omitByIndexOf(cookies, config?.excludeCookies);
      }

      Object.keys(cookies).forEach(key => {
        headers[key] = cookies[key];
      });
    }

    this.api = this.createInstance({
      ...createBaseConfig(),
      ...config,
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
