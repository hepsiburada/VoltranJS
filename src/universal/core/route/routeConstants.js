import values from 'lodash/values';
import { generateComponents } from '../../utils/helper';

const componentConfig = require('__V_COMPONENTS__');

const components = generateComponents(componentConfig.default);

const ROUTE_PATHS = {};
const ROUTE_CONFIGS = {};

Object.keys(components).forEach(path => {
  const info = components[path];
  ROUTE_PATHS[info.name] = path;
  ROUTE_CONFIGS[path] = {
    routeName: info.name,
    isPublic: true,
    exact: true
  };
});

const ROUTE_PATH_ARRAY = values(ROUTE_PATHS);

export { ROUTE_PATHS, ROUTE_PATH_ARRAY, ROUTE_CONFIGS };
