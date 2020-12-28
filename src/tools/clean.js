/* istanbul ignore file */
const { cleanDir } = require('./lib/fs');
const voltranConfig = require('../../voltran.config');

function clean() {
  return Promise.all([cleanDir(`${voltranConfig.distFolder}/*`, { nosort: true, dot: true })]);
}

module.exports = clean;
