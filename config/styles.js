const normalizeUrl = require('../lib/os.js');
const voltranConfig = require('../voltran.config');

function getStyles () {
	let styles = '';

  for(var i = 0; i < voltranConfig.styles.length; i++) {
    const style = normalizeUrl(voltranConfig.styles[i]);
    
    styles += `require('${style}');`;
  }

  return styles;
}

module.exports = getStyles;