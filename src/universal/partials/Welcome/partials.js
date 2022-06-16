import components from '../../core/route/components';

const preview = require('__V_PREVIEW__');

const partials = [];
const BLACKLIST = ['REQUEST_DISPATCHER'];
Object.keys(components).forEach(path => {
  const info = components[path];
  if (!BLACKLIST.includes(info.name)) {
    partials.push({
      name: info.fragmentName,
      url: path,
      status: info?.fragment?.previewStatus || info.status
    });
  }
});
const pages = preview?.default?.pages || [];
partials.push(...pages);

export default partials;
