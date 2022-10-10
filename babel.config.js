module.exports = api => {
  const env = api.env();

  const basePlugins = [
    'babel-plugin-styled-components',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    'dynamic-import-node'
  ];

  const basePresets = [];
  const presets = [...basePresets];
  const plugins = [...basePlugins];

  if (env === 'test') {
    presets.push([
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: '3.20.2'
      }
    ]);
  } else {
    if (env === 'production') {
      plugins.push([
        'transform-react-remove-prop-types',
        {
          mode: 'remove',
          removeImport: true,
          additionalLibraries: ['react-immutable-proptypes']
        }
      ]);
    } else {
      plugins.push('react-hot-loader/babel');
    }

    presets.push([
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: '3.20.2',
        targets: {
          esmodules: true,
          ie: '11',
          node: 'current'
        }
      }
    ]);
  }

  presets.push('@babel/preset-react');

  return {
    presets,
    plugins
  };
};
