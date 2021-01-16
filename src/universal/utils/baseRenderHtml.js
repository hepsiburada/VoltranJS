const appConfig = require('__APP_CONFIG__');
const assets = require('__ASSETS_FILE_PATH__');
const voltranConfig = require('../../../voltran.config');

const assetsBaseUrl = !appConfig.mediaUrl ? appConfig.baseUrl : '';
const assetsPrefix = appConfig.mediaUrl.length ? appConfig.mediaUrl : appConfig.baseUrl;

const fs = require('fs');
const path = require('path');

const cleanAssetsPrefixFromAssetURI = assetURI => {
  return assetURI.replace(assetsPrefix, '');
};

const cssContentCache = {};

if (process.env.NODE_ENV === 'production') {
  Object.keys(assets).forEach(name => {
    if (assets[name].css) {
      cssContentCache[name] = fs.readFileSync(
        path.resolve(
          process.cwd(),
          `${voltranConfig.publicDistFolder}/${cleanAssetsPrefixFromAssetURI(assets[name].css)}`
        ),
        'utf8'
      );
    }
  });
}

const getScripts = (name, subComponentFiles) => {
  const subComponentFilesScripts = subComponentFiles.scripts;
  const scripts = [
    {
      src: `${assetsBaseUrl}${assets.client.js}`,
      isAsync: false
    },
    {
      src: `${assetsBaseUrl}${assets[name].js}`,
      isAsync: false
    }
  ];
  const mergedScripts =
    subComponentFilesScripts && subComponentFilesScripts.length > 0
      ? scripts.concat(subComponentFiles.scripts)
      : scripts;

  return mergedScripts;
};

const getStyles = async (name, subComponentFiles) => {
  const links = [];
  const subComponentFilesStyles = subComponentFiles.styles;

  if (assets[name].css) {
    links.push({
      rel: 'stylesheet',
      href: `${assetsBaseUrl}${assets[name].css}`,
      criticalStyleComponent:
        process.env.NODE_ENV === 'production' && !voltranConfig.criticalCssDisabled
          ? cssContentCache[name]
          : undefined
    });
  }

  if (assets.client.css) {
    links.push({
      rel: 'stylesheet',
      href: `${assetsBaseUrl}${assets.client.css}`,
      criticalStyleComponent:
        process.env.NODE_ENV === 'production' && !voltranConfig.criticalCssDisabled
          ? cssContentCache.client
          : undefined
    });
  }

  const mergedLinks =
    subComponentFilesStyles && subComponentFilesStyles.length > 0
      ? links.concat(subComponentFiles.styles)
      : links;

  return mergedLinks;
};

const getActiveComponent = name => {
  const path = `/${name}`;

  return {
    resultPath: path,
    componentName: name,
    url: path
  };
};

const createBaseRenderHtmlProps = async (name, subComponentFiles) => {
  return {
    scripts: getScripts(name, subComponentFiles),
    links: await getStyles(name, subComponentFiles),
    activeComponent: getActiveComponent(name)
  };
};

export default createBaseRenderHtmlProps;
