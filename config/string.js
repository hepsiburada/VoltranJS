const path = require('path');

const normalizeUrl = require('../lib/os.js');
const getStyles = require('./styles.js');

const voltranConfig = require('../voltran.config');

const prometheusFile = voltranConfig.monitoring.prometheus;

function replaceString() {
  const data = [
    {
      search: '__V_COMPONENTS__',
      replace: normalizeUrl(voltranConfig.routing.components),
      flags: 'g'
    },
    {
      search: '__APP_CONFIG__',
      replace: normalizeUrl(
        `${voltranConfig.appConfigFile.output.path}/${voltranConfig.appConfigFile.output.name}.js`
      ),
      flags: 'g'
    },
    {
      search: '__ASSETS_FILE_PATH__',
      replace: normalizeUrl(`${voltranConfig.inputFolder}/assets.json`),
      flags: 'g'
    },
    {
      search: '__V_DICTIONARY__',
      replace: normalizeUrl(voltranConfig.routing.dictionary),
      flags: 'g'
    },
    {
      search: '__V_REQUEST_CONFIGS__',
      replace: normalizeUrl(
        voltranConfig.routing.requestConfigs || path.resolve(__dirname, './emptyModule.js')
      ),
      flags: 'g'
    },
    {
      search: '__V_PREVIEW_PAGES__',
      replace: normalizeUrl(
        voltranConfig.routing.previewPages || path.resolve(__dirname, './emptyModule.js')
      ),
      flags: 'g'
    },
    {
      search: '@voltran/core',
      replace: normalizeUrl(path.resolve(__dirname, '../src/index')),
      flags: 'g'
    },
    {
      search: '@voltran/server',
      replace: normalizeUrl(path.resolve(__dirname, '../src/server')),
      flags: 'g'
    },
    {
      search: '__V_MAIN__',
      replace: normalizeUrl(
        voltranConfig.entry.main || path.resolve(__dirname, './emptyModule.js')
      ),
      flags: 'g'
    },
    {
      search: '__V_SERVER__',
      replace: normalizeUrl(
        voltranConfig.entry.server || path.resolve(__dirname, './emptyModule.js')
      ),
      flags: 'g'
    },
    { search: '"__V_styles__"', replace: getStyles() }
  ];

  data.push({
    search: '__V_PROMETHEUS__',
    replace: normalizeUrl(prometheusFile || '../lib/tools/prom.js'),
    flags: 'g'
  });

  return data;
}

module.exports = replaceString;
