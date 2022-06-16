module.exports = {
  verbose: true,
  automock: false,
  bail: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!src/public/**',
    '!src/tools/**'
  ],
  env: {
    production: {
      plugins: ['transform-es2015-modules-commonjs']
    }
  },
  coverageDirectory: '<rootDir>/coverage',
  globals: {
    window: true,
    __DEV__: true
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  setupFiles: ['<rootDir>/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/fileMock.js',
    '^.+\\.(css|less|scss)$': 'babel-jest'
  },
  snapshotSerializers: ['enzyme-to-json/serializer']
};
