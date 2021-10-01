import { generateComponents } from '../../utils/helper';

const componentConfig = require('__V_COMPONENTS__');

const components = generateComponents(componentConfig.default);

const routesWithComponents = {};

Object.keys(components).forEach(path => {
  const info = components[path];
  routesWithComponents[path] = info.fragment;
});

export default routesWithComponents;
