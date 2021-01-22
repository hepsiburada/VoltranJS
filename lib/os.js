const path = require('path');

function normalizeUrl(url) {
  const urlArray = url.split(path.sep);

  return urlArray.join('/');
}

module.exports = normalizeUrl;
