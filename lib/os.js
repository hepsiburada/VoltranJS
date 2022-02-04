const path = require('path');

function normalizeUrl(url) {
  if (url) {
    const urlArray = url?.split(path.sep);

    return urlArray.join('/');
  }

  return '';
}

module.exports = normalizeUrl;
