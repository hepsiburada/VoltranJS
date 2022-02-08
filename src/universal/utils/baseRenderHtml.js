const appConfig = require('__APP_CONFIG__');
const assets = require('__ASSETS_FILE_PATH__');
const voltranConfig = require('../../../voltran.config');
import { QUERY_PARAMS } from './constants';

const assetsBaseUrl = !appConfig.mediaUrl ? appConfig.baseUrl : '';
const assetsPrefix = appConfig.mediaUrl.length ? appConfig.mediaUrl : appConfig.baseUrl;

const fs = require('fs');
const path = require('path');

const cssContentCache = {};

const cleanAssetsPrefixFromAssetURI = assetURI => {
  return assetURI.replace(assetsPrefix, '');
};

const readAsset = name => {
  return fs.readFileSync(
    path.resolve(
      process.cwd(),
      `${voltranConfig.publicDistFolder}/${cleanAssetsPrefixFromAssetURI(name)}`
    ),
    'utf8'
  );
};

if (process.env.NODE_ENV === 'production') {
  Object.keys(assets).forEach(name => {
    if (!assets[name].css) {
      return;
    }

    if (Array.isArray(assets[name].css)) {
      assets[name].css.map(cssItem => {
        cssContentCache[cssItem] = readAsset(cssItem);
      });
    } else {
      cssContentCache[name] = readAsset(assets[name].css);
    }
  });
}

const getScripts = (name, subComponentFiles) => {
  const subComponentFilesScripts = subComponentFiles?.scripts;
  const scripts = [
    {
      src: `${assetsBaseUrl}${assets?.client?.js}`,
      isAsync: false
    },
    {
      src: `${assetsBaseUrl}${assets?.[name]?.js}`,
      isAsync: false
    }
  ];
  const mergedScripts =
    subComponentFilesScripts?.length > 0 ? scripts.concat(subComponentFiles.scripts) : scripts;

  return mergedScripts;
};

const getStyles = async (name, subComponentFiles, predefinedInitialState) => {
  const links = [];
  const withCriticalCss = predefinedInitialState.query[QUERY_PARAMS.WITH_CRITICAL_STYLES];
  const subComponentFilesStyles = subComponentFiles?.styles;

  if (assets?.[name]?.css) {
    links.push({
      rel: 'stylesheet',
      href: `${assetsBaseUrl}${assets[name].css}`,
      criticalStyleComponent:
        process.env.NODE_ENV === 'production' &&
        !voltranConfig.criticalCssDisabled &&
        withCriticalCss
          ? cssContentCache[name]
          : null
    });
  }

  if (assets?.client?.css) {
    links.push({
      rel: 'stylesheet',
      href: `${assetsBaseUrl}${assets.client.css}`,
      criticalStyleComponent:
        process.env.NODE_ENV === 'production' &&
        !voltranConfig.criticalCssDisabled &&
        withCriticalCss
          ? cssContentCache.client
          : null
    });
  }

  const mergedLinks =
    subComponentFilesStyles?.length > 0 ? links.concat(subComponentFiles.styles) : links;

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

const createBaseRenderHtmlProps = async (name, subComponentFiles, predefinedInitialState) => {
  return {
    scripts: getScripts(name, subComponentFiles),
    links: await getStyles(name, subComponentFiles, predefinedInitialState),
    activeComponent: getActiveComponent(name)
  };
};

export default createBaseRenderHtmlProps;
