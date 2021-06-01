module.exports = function() {
  const basePlugins = [
    'babel-plugin-styled-components',
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-proposal-optional-chaining'
  ];

  const basePresets = ['@babel/preset-react'];

  const presets = [...basePresets];
  const plugins = [...basePlugins];

  return {
    presets,
    plugins
  };
};
