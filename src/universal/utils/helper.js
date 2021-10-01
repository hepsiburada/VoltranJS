// eslint-disable-next-line import/prefer-default-export
export const removeQueryStringFromUrl = url => {
  const partials = url.split('?');

  return partials[0];
};

export const createComponentName = routePath => {
  return routePath.split('/').join('');
};

const toCamel = (value = '') => {
  return value
    .replace(/([-_][a-z])/gi, key =>
      key
        .toUpperCase()
        .replace('-', ' ')
        .replace('_', ' ')
    )
    .toLowerCase();
};

export const generateComponents = ({
  paths = {},
  components = [],
  defaultConfig = {},
  customConfig = {}
}) => {
  let result = {};
  Object.entries(paths).forEach(([key, value]) => {
    result = {
      ...result,
      [value]: {
        fragment: components[value],
        fragmentName: toCamel(key),
        name: key,
        status: 'dev',
        ...defaultConfig,
        ...customConfig[value]
      }
    };
  });
  return result;
};

export function guid() {
  return `${s4()}${s4()}-${s4()}-4${s4().substr(0, 3)}-${s4()}-${s4()}${s4()}${s4()}`.toLowerCase();
}

export function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}
