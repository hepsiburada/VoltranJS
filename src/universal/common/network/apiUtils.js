import Request from '../../model/Request';
import { createCacheManagerInstance } from '../../core/cache/cacheUtils';
import * as ApiUtils from './apiUtils.js';

const getSortedParams = nonSortedParams => {
  if (!nonSortedParams) {
    return nonSortedParams;
  }

  return Object.keys(nonSortedParams)
    .sort()
    .reduce(
      (params, key) => ({
        ...params,
        [key]: nonSortedParams[key]
      }),
      {}
    );
};

const getPayload = (url, method, params, configArgument) => {
  let payload;
  if (configArgument) {
    payload = { url, method, params, ...configArgument };
  } else {
    payload = { url, method, params };
  }
  return payload;
};

const getRequest = (apiManager, method, url, paramsArgument, configArgument, response) => {
  const params = ApiUtils.getSortedParams(paramsArgument);
  /* const payload = getPayload(url, method, params, configArgument);
  const uri = apiManager.api.getUri(payload);

  return new Request(apiManager.api, payload, uri, response); */
};

const makeRequest = (
  apiManager,
  cacheManager,
  method,
  url,
  paramsArgument,
  configArgument,
  cacheSettings
) => {
  let request;

  const isCacheEnabled = cacheSettings && cacheSettings.cacheStatus && cacheSettings.cacheKey;
  if (isCacheEnabled) {
    const cacheResponse = cacheManager.get(cacheSettings);

    if (cacheResponse && !cacheResponse.isExpired) {
      // console.log('Came from cache', cacheSettings.cacheKey);
      request = getRequest(apiManager, method, url, paramsArgument, configArgument, {
        cacheResponse: cacheResponse.cacheValue
      });
    } else {
      // console.log('Not exist cache, request sent', cacheSettings.cacheKey);
      request = getRequest(apiManager, method, url, paramsArgument, configArgument, {
        onSuccess: response => {
          cacheManager.put(cacheSettings, response);
          return response;
        },
        onError: error => {
          if (cacheResponse) {
            // console.log('Came from cache - IN ERROR BLOCK', cacheSettings.cacheKey);
            return Promise.resolve(cacheResponse.cacheValue);
          }
          return error;
        }
      });
    }
  } else {
    // console.log('Doesnt have CacheSettings', url);
    request = getRequest(method, url, paramsArgument, configArgument);
  }

  return request;
};

function createApiClient(apiManager) {
  const cacheManager = createCacheManagerInstance();

  return {
    get(url, params, config, cacheSettings) {
      return makeRequest(apiManager, cacheManager, 'get', url, params, config, cacheSettings);
    },

    post(url, params, config, cacheSettings) {
      return makeRequest(apiManager, cacheManager, 'post', url, params, config, cacheSettings);
    },

    put(url, params, config, cacheSettings) {
      return makeRequest(apiManager, cacheManager, 'put', url, params, config, cacheSettings);
    },

    delete(url, config, cacheSettings) {
      return makeRequest(apiManager, cacheManager, 'delete', url, config, null, cacheSettings);
    },

    head(url, config, cacheSettings) {
      return makeRequest(apiManager, cacheManager, 'head', url, config, null, cacheSettings);
    },

    options(url, config, cacheSettings) {
      return makeRequest(apiManager, cacheManager, 'options', url, config, null, cacheSettings);
    }
  };
}

export { createApiClient, getSortedParams, getPayload, getRequest, makeRequest };
