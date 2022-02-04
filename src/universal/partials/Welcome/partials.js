import components from '../../core/route/components';

const previewPages = require('__V_PREVIEW_PAGES__');

const partials = [];

Object.keys(components).forEach(path => {
  const info = components[path];
  partials.push({
    name: info.fragmentName,
    url: path,
    status: info.status
  });
});
partials.push(...previewPages.default.pages);

export default partials;
