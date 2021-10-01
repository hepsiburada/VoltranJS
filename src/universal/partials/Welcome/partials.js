import { generateComponents } from '../../utils/helper';

const componentConfig = require('__V_COMPONENTS__');

const components = generateComponents(componentConfig.default);

const partials = [];

Object.keys(components).forEach(path => {
  const info = components[path];
  partials.push({
    name: info.fragmentName,
    url: path,
    status: info.status
  });
});

export default partials;
