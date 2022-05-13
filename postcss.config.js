const autoprefixer = require('autoprefixer');
const postCssFilters = require('pleeease-filters');
const postCssPixrem = require('pixrem');
const postCssInlineSvg = require('postcss-inline-svg');

const voltranConfig = require('./voltran.config');

module.exports = {
  plugins: [
    postCssInlineSvg({ path: voltranConfig.svgFolder }),
    postCssPixrem(),
    postCssFilters(),
    autoprefixer
  ]
};
