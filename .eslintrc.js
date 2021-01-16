module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier'],
  globals: {
    hwindow: true,
    document: true,
    window: true,
    hepsiBus: true,
    global: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/no-array-index-key': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'class-methods-use-this': 'warn',
    'import/no-extraneous-dependencies': ['off'],
    'import/no-unresolved': ['off'],
    'import/extensions': ['off'],
    'import/order': ['off'],
    'jsx-a11y/click-events-have-key-events': 'off',
    'react/no-children-prop': 'off',
    'react/no-unescaped-entities': 'off',
    'react/require-default-props': 'off',
    'react/forbid-prop-types': 'off',
    'react/prop-types': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'no-shadow': 'off',
    'no-use-before-define': 'off',
    'no-unused-expressions': 'off',
    'no-nested-ternary': 'off',
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
    'array-callback-return': 'off'
  },
  env: {
    jest: true,
    browser: true,
    node: true,
    es6: true
  }
};
