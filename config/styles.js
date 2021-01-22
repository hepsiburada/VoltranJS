const normalizeUrl = require('../lib/os.js');
const voltranConfig = require('../voltran.config');

function getStyles() {
  let styles = '';

  for (let i = 0; i < voltranConfig.styles.length; i += 1) {
    const style = normalizeUrl(voltranConfig.styles[i]);

    styles += `require('${style}');`;
  }

  return styles;
}

module.exports = getStyles;
