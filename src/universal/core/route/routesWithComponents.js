const components = require('__V_COMPONENTS__');

const routesWithComponents = {};

Object.keys(components.default).forEach(path => {
  const info = components.default[path];
  routesWithComponents[path] = info.fragment;
});

export default routesWithComponents;
