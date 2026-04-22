// eslint-disable-next-line import/prefer-default-export
export const removeQueryStringFromUrl = url => {
  const partials = url.split('?');

  return partials[0];
};

export const createComponentName = routePath => {
  return routePath.split('/').join('');
};

export function guid() {
  return `${s4()}${s4()}-${s4()}-4${s4().substr(0, 3)}-${s4()}-${s4()}${s4()}${s4()}`.toLowerCase();
}

export function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

export const sanitizeId = id => String(id).replace(/[^a-zA-Z0-9-_]/g, '');

export const sanitizeValues = (obj, keys = []) => {
  if (!keys.length) return obj;

  const traverse = node => {
    if (Array.isArray(node)) return node.map(traverse);
    if (node !== null && typeof node === 'object') {
      return Object.entries(node).reduce((acc, [key, value]) => {
        if (!keys.includes(key)) {
          acc[key] = traverse(value);
        }
        return acc;
      }, {});
    }
    return node;
  };

  return traverse(obj);
};

