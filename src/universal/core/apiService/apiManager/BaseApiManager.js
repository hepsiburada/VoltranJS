import axios from 'axios';
import Cookies from 'js-cookie';
import {
  CONTENT_TYPE_HEADER,
  JSON_CONTENT_TYPE,
  REQUEST_TYPES_WITH_BODY
} from '../../../utils/constants';
import voltranConfig from '../../../../../voltran.config';
import CookieService from '../../../service/CookieService';

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

    if (process.env.BROWSER && voltranConfig.setCookiesToHeader) {
      const cookieMap = CookieService.getAllItems();

      Object.keys(cookieMap).forEach(key => {
        if (voltranConfig.setCookiesToHeaderKeys.length > 0) {
          voltranConfig.setCookiesToHeaderKeys.map(item => {
            if (key.indexOf(item) === 0) {
              headers[key] = cookieMap[key];
            }
          });
        } else {
          headers[key] = cookieMap[key];
        }
      });
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
