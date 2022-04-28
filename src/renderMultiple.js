/* eslint-disable no-param-reassign */
import async from 'async';
import { matchUrlInRouteConfigs } from './universal/core/route/routeUtils';
import Component from './universal/model/Component';
import Renderer from './universal/model/Renderer';
import Preview from './universal/components/Preview';
import {
  isRequestDispatcher,
  isPreview,
  isWithoutHTML,
  isWithoutState,
  getPreviewLayout
} from './universal/service/RenderService';
import metrics from './metrics';
import { HTTP_STATUS_CODES } from './universal/utils/constants';
import logger from './universal/utils/logger';

const previewPages = require('__V_PREVIEW_PAGES__');

const getRenderOptions = req => {
  const isPreviewValue = isPreview(req.query) || false;
  const isWithoutHTMLValue = isWithoutHTML(req.query) || false;
  const isWithoutStateValue = isWithoutState(req.query) || false;

  return {
    isPreview: isPreviewValue,
    isWithoutHTML: isWithoutHTMLValue,
    isWithoutState: isWithoutStateValue
  };
};

function getRenderer(name, req) {
  const { query, cookies, url, headers, params } = req;
  const path = `/${params?.path || ''}`;
  const userAgent = headers['user-agent'];

  const componentPath = Component.getComponentPath(name);
  const routeInfo = matchUrlInRouteConfigs(componentPath);
  const renderOptions = getRenderOptions(req);

  if (routeInfo) {
    const urlWithPath = url.replace('/', path);
    const fullComponentPath = `/components/${req.params.components ?? ''}`;

    const context = {
      path,
      query,
      cookies,
      url: urlWithPath,
      userAgent,
      componentPath: fullComponentPath,
      ...renderOptions
    };

    if (Component.isExist(componentPath)) {
      return new Renderer(new Component(componentPath), context);
    }

    return null;
  }

  return null;
}

function iterateServicesMap(servicesMap, callback) {
  Object.getOwnPropertySymbols(servicesMap).forEach(serviceName => {
    const endPoints = servicesMap[serviceName];

    Object.keys(endPoints).forEach(endPointName => {
      callback(serviceName, endPointName);
    });
  });
}

function reduceServicesMap(servicesMap, callback, initialValue) {
  return Object.getOwnPropertySymbols(servicesMap).map(serviceName => {
    const endPoints = servicesMap[serviceName];

    return Object.keys(endPoints).reduce((obj, endPointName) => {
      return callback(serviceName, endPointName, obj);
    }, initialValue);
  });
}

function getHashes(renderers) {
  return renderers
    .filter(renderer => renderer.servicesMap)
    .reduce((hashes, renderer) => {
      iterateServicesMap(renderer.servicesMap, (serviceName, endPointName) => {
        const requests = renderer.servicesMap[serviceName][endPointName];

        requests.forEach(request => {
          if (hashes[request.hash]) {
            hashes[request.hash].occurrence += 1;
          } else {
            hashes[request.hash] = { occurrence: 1, score: 0, request };
          }
        });
      });

      return hashes;
    }, {});
}

function getWinner(requests, hashes) {
  return requests.sort((requestA, requestB) => {
    const a = requestA.hash;
    const b = requestB.hash;

    if (hashes[a].score < hashes[b].score) return 1;
    if (hashes[a].score > hashes[b].score) return -1;

    if (hashes[a].occurrence < hashes[b].occurrence) return 1;
    if (hashes[a].occurrence > hashes[b].occurrence) return -1;

    return 1;
  })[0];
}

function incWinnerScore(winner, hashes) {
  hashes[winner.hash].score += 1;
}

function putWinnerMap(serviceName, endPointName, winnerMap, winner) {
  if (winnerMap[serviceName]) {
    winnerMap[serviceName][endPointName] = winner;
  } else {
    winnerMap[serviceName] = { [endPointName]: winner };
  }
}

async function setInitialStates(renderers) {
  const hashes = getHashes(renderers);

  const promises = renderers
    .filter(renderer => renderer.servicesMap)
    .reduce((promises, renderer) => {
      iterateServicesMap(renderer.servicesMap, (serviceName, endPointName) => {
        const requests = renderer.servicesMap[serviceName][endPointName];

        const winner = getWinner(requests, hashes);
        incWinnerScore(winner, hashes);
        putWinnerMap(serviceName, endPointName, renderer.winnerMap, winner);

        if (!promises[winner.hash]) {
          promises[winner.hash] = callback => {
            winner
              .execute()
              .then(response => callback(null, response))
              .catch(exception => {
                if (renderer.component.object.byPassWhenFailed) {
                  callback(null, { data: { isFailed: true } });
                } else {
                  callback(new Error(`${winner.uri} : ${exception.message}`), null);
                }
              });
          };
        }
      });

      return promises;
    }, {});

  const results = await new Promise((resolve, reject) => {
    async.parallel(promises, (err, results) => {
      if (err) {
        return reject(err);
      }

      resolve(results);
    });
  });

  renderers.forEach(renderer => {
    if (renderer.winnerMap) {
      renderer.setInitialState(
        reduceServicesMap(
          renderer.winnerMap,
          (serviceName, endPointName, obj) => {
            const request = renderer.winnerMap[serviceName][endPointName];
            obj[endPointName] = results[request.hash];
            return obj;
          },
          {}
        )
      );
    }
  });

  return Object.keys(results).length;
}

async function getResponses(renderers) {
  const responses = (await Promise.all(renderers.map(renderer => renderer.render())))
    .filter(result => result.value != null)
    .reduce((obj, item) => {
      const el = obj;
      const name = `${item.key}_${item.id}`;

      if (!el[name]) el[name] = item.value;

      return el;
    }, {});

  return responses;
}

async function getPreview(responses, requestCount, req) {
  const layoutName = getPreviewLayout(req.query);
  const { layouts = {} } = previewPages?.default || {};
  const componentNames = Object.keys(responses);
  let PreviewFile = Preview;

  if (layouts[layoutName]) {
    PreviewFile = layouts[layoutName];
  }

  const content = Object.keys(responses).map(name => {
    const componentName = responses?.[name]?.activeComponent?.componentName ?? '';
    return getLayoutWithClass(componentName, responses[name].fullHtml);
  });

  return PreviewFile([...content].join('\n'), `${requestCount} request!`, componentNames);
}

const DEFAULT_PARTIALS = ['RequestDispatcher'];

export const getPartials = req => {
  const useRequestDispatcher = isRequestDispatcher(req.query);

  const reqPartials = req.params.components
    .split(',')
    .filter((value, index, self) => self.indexOf(value) === index)
    .filter(item => !DEFAULT_PARTIALS.includes(item));

  const partials = [...(useRequestDispatcher ? DEFAULT_PARTIALS : []), ...reqPartials];

  return partials;
};

function cr(condition, ok, cancel) {
  return condition ? ok : cancel || '';
}

const getLayoutWithClass = (name, html, id = '', style = null) => {
  const idAttr = cr(id !== '', `id=${id}`);
  const styleAttr = cr(style !== null, `style=${style}`);

  return `<div class="${name}"  ${idAttr} ${styleAttr}>${html}</div>`;
};

const renderMultiple = async (req, res) => {
  const partials = getPartials(req);

  const renderers = partials
    .map(name => getRenderer(name, req))
    .filter(renderer => renderer != null);

  if (!renderers.length) {
    return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
      message: 'not found'
    });
  }

  const componentNames = renderers.map(renderer => renderer.component.name);

  let requestCount = null;

  try {
    requestCount = await setInitialStates(renderers);
  } catch (exception) {
    logger.exception(exception);
    return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: exception.message
    });
  }

  const responses = await getResponses(renderers);

  if (isPreview(req.query)) {
    const preview = await getPreview(responses, requestCount, req);
    res.html(preview);
  } else {
    res.json(responses);

    metrics.fragmentRequestDurationMicroseconds
      .labels(componentNames.sort().join(','), isWithoutHTML(req.query) ? '1' : '0')
      .observe(Date.now() - res.locals.startEpoch);
  }
};

export default renderMultiple;
