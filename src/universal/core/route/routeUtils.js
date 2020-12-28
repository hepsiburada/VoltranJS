import React from 'react';
import queryString from 'query-string';
import { matchPath } from 'react-router';

import { removeQueryStringFromUrl } from '../../utils/helper';
import { ROUTE_PATH_ARRAY, ROUTE_CONFIGS } from './routeConstants';

const extractQueryParamsFromLocation = location => {
  return queryString.parse(location.search);
};

const matchUrlForRoutePath = (urlPath, routePath) => {
  let result = null;
  const routeConfig = ROUTE_CONFIGS[routePath];
  const rawMatchPathResult = matchPath(removeQueryStringFromUrl(urlPath), {
    path: routePath,
    routePath,
    ...routeConfig
  });

  if (rawMatchPathResult) {
    result = {
      ...rawMatchPathResult,
      ...routeConfig
    };
  }

  return result;
};

const matchUrlInRouteArray = (path, routeArray) => {
  let result = null;

  for (let index = 0; index < routeArray.length; index += 1) {
    const routePath = routeArray[index];
    const matchResult = matchUrlForRoutePath(path, routePath);

    if (matchResult) {
      result = matchResult;
      break;
    }
  }

  return result;
};

const matchUrlInRouteConfigs = path => {
  return matchUrlInRouteArray(path, ROUTE_PATH_ARRAY);
};

const renderMergedProps = (component, ownRouteProps, routingProps) => {
  const finalProps = {
    ...ownRouteProps,
    ...routingProps
  };
  return React.createElement(component, finalProps);
};

export {
  extractQueryParamsFromLocation,
  matchUrlInRouteConfigs,
  matchUrlInRouteArray,
  matchUrlForRoutePath,
  renderMergedProps
};
