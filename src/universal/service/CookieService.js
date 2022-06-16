import Cookies from 'js-cookie';

const appConfig = require('__APP_CONFIG__');

const domain = appConfig.cookieStorageUrl;

export default class CookieService {
  static setItem(key, value, options) {
    Cookies.set(key, value, { domain, ...options });
  }

  static getItem(key) {
    return Cookies.get(key);
  }

  static getAllItems() {
    return Cookies.get();
  }

  static getJSON(key) {
    return Cookies.getJSON(key);
  }

  static removeItem(key, options) {
    Cookies.remove(key, { domain, ...options });
  }
}
