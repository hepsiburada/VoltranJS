const components = require('__V_COMPONENTS__');

const partials = [];

Object.keys(components.default).forEach(path => {
  const info = components.default[path];
  partials.push({
    name: info.fragmentName,
    url: path,
    status: info.status
  });
});

export default partials;
