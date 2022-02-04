import components from '../../core/route/components';

const previewPages = require('__V_PREVIEW_PAGES__');

const partials = [];
const BLACKLIST = ['REQUEST_DISPATCHER'];
Object.keys(components).forEach(path => {
  const info = components[path];
  if (!BLACKLIST.includes(info.name)) {
    partials.push({
      name: info.fragmentName,
      url: path,
      status: info.status
    });
  }
});
const pages = previewPages?.default?.pages || [];
partials.push(...pages);

export default partials;
