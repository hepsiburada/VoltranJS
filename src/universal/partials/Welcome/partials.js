import components from '../../core/route/components';

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
