/* eslint-disable no-param-reassign */
import async from 'async';
import { matchUrlInRouteConfigs } from './universal/core/route/routeUtils';
import Component from './universal/model/Component';
import Renderer from './universal/model/Renderer';
import {
  isRequestDispatcher,
  isPreview,
  isWithoutHTML,
  isWithoutState
} from './universal/service/RenderService';
import metrics from './metrics';
import { HTTP_STATUS_CODES } from './universal/utils/constants';
import logger from './universal/utils/logger';
import { getPreviewFile } from './universal/utils/previewHelper';

const appConfig = require('__APP_CONFIG__');

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
      headers,
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
  Object.getOwnPropertyNames(servicesMap).forEach(serviceName => {
    const requests = servicesMap[serviceName];

    callback(serviceName, requests);
  });
}

function reduceServicesMap(servicesMap, callback, obj) {
  return Object.getOwnPropertyNames(servicesMap).map(serviceName => {
    return callback(serviceName, obj);
  });
}

function getHashes(renderers) {
  return renderers
    .filter(renderer => renderer.servicesMap)
    .reduce((hashes, renderer) => {
      iterateServicesMap(renderer.servicesMap, (serviceName, requests) => {
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

function putWinnerMap(serviceName, winnerMap, winner) {
  winnerMap[serviceName] = winner;
}

async function setInitialStates(renderers) {
  const hashes = getHashes(renderers);

  const promises = renderers
    .filter(renderer => renderer.servicesMap)
    .reduce((promises, renderer) => {
      iterateServicesMap(renderer.servicesMap, (serviceName, requests) => {
        const winner = getWinner(requests, hashes);
        incWinnerScore(winner, hashes);
        putWinnerMap(serviceName, renderer.winnerMap, winner);

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
      const result = reduceServicesMap(
        renderer.winnerMap,
        (serviceName, obj) => {
          const request = renderer.winnerMap[serviceName];
          obj[serviceName] = results[request.hash];
          return obj;
        },
        {}
      );
      renderer.setInitialState(result);
    }
  });

  return Object.keys(results).length;
}

async function getResponses(renderers) {
  const responses = (await Promise.all(renderers.map(renderer => renderer.render())))
    .filter(result => result.value != null)
    .reduce((obj, item) => {
      const el = obj;
      const name = `${item.key}`;

      if (!el[name]) el[name] = item.value;

      return el;
    }, {});

  return responses;
}

async function getPreview(responses, requestCount, req) {
  const componentNames = Object.keys(responses);
  const PreviewFile = getPreviewFile(req.query);

  const content = Object.keys(responses).map(name => {
    const componentName = responses?.[name]?.activeComponent?.componentName ?? '';
    return getLayoutWithClass(componentName, responses[name].fullHtml);
  });
  const body = [...content].join('\n');

  return PreviewFile({
    body,
    requestCount,
    componentNames
  });
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

const getResponseHeaders = async components => {
  return components?.reduce((result, current) => {
    return {
      ...result,
      ...(current?.responseHeaders || {})
    };
  }, {});
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
  const headers = await getResponseHeaders(renderers);

  Object.keys(headers).forEach(key => {
    res.setHeader(key, headers[key]);
  });
  const voltranEnv = appConfig.voltranEnv || 'local';
  const previewEnvControl = voltranEnv !== 'prod' && voltranEnv !== 'production';

  if (previewEnvControl && isPreview(req.query)) {
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
