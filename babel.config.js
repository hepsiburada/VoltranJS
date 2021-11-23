module.exports = api => {
  const env = api.env();

  const basePlugins = [
    'babel-plugin-styled-components',
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions'
  ];

  const basePresets = [];
  const presets = [...basePresets];
  const plugins = [...basePlugins];

  if (env === 'test') {
    presets.push([
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: '3.0.0'
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
      '@babel/env',
      {
        targets: {
          esmodules: true
        },
        corejs: '3',
        useBuiltIns: 'entry',
        bugfixes: true,
        modules: false
      }
    ]);
  }

  presets.push('@babel/preset-react');

  return {
    presets,
    plugins
  };
};
