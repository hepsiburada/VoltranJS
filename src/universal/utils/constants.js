const appConfig = require('__APP_CONFIG__');

const WINDOW_GLOBAL_PARAMS = {
  HISTORY: 'storefront.pwa.mobile.global.history'
};

const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  PARTIAL_CONTENT: 206,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const JSON_CONTENT_TYPE = 'application/json';
const CONTENT_TYPE_HEADER = 'Content-Type';
const REQUEST_TYPES_WITH_BODY = ['post', 'put', 'patch'];
const SERVICES = Object.freeze(
  Object.keys(appConfig.services).reduce((obj, val) => {
    // eslint-disable-next-line no-param-reassign
    obj[val] = Symbol(val);
    return obj;
  }, {})
);

const BLACKLIST_OUTPUT = [
  'componentName',
  'fullWidth',
  'isMobileComponent',
  'isPreviewQuery',
  'responseOptions'
];

const QUERY_PARAMS = {
  WITH_CRITICAL_STYLES: 'withCriticalCss'
};

export {
  HTTP_STATUS_CODES,
  WINDOW_GLOBAL_PARAMS,
  JSON_CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  REQUEST_TYPES_WITH_BODY,
  SERVICES,
  BLACKLIST_OUTPUT,
  QUERY_PARAMS
};
