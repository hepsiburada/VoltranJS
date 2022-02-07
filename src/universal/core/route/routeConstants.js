const components = require('__V_COMPONENTS__');

const ROUTE_PATHS = {};
const ROUTE_CONFIGS = {};

Object.keys(components.default).forEach(path => {
  const info = components.default[path];
  ROUTE_PATHS[info.name] = path;
  ROUTE_CONFIGS[path] = {
    routeName: info.name,
    isPublic: true,
    exact: true
  };
});

const ROUTE_PATH_ARRAY = Object.values(ROUTE_PATHS);

export { ROUTE_PATHS, ROUTE_PATH_ARRAY, ROUTE_CONFIGS };
