import components from './components';

const routesWithComponents = {};

Object.keys(components).forEach(path => {
  const info = components[path];
  routesWithComponents[path] = info.fragment;
});

export default routesWithComponents;
