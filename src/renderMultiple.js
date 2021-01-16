/* eslint-disable no-param-reassign */
import { matchUrlInRouteConfigs } from './universal/core/route/routeUtils';
import Component from './universal/model/Component';
import Renderer from './universal/model/Renderer';
import async from 'async';
import Preview from './universal/components/Preview';
import { isPreview, isWithoutHTML } from './universal/service/RenderService';
import metrics from './metrics';
import { HTTP_STATUS_CODES } from './universal/utils/constants';
import logger from './universal/utils/logger';

function getRenderer(name, query, cookies, url, path, userAgent) {
  const componentPath = Component.getComponentPath(name);
  const routeInfo = matchUrlInRouteConfigs(componentPath);

  if (routeInfo) {
    const urlWithPath = url.replace('/', path);

    const context = {
      path,
      query,
      cookies,
      url: urlWithPath,
      userAgent
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
              .catch(exception =>
                callback(new Error(`${winner.uri} : ${exception.message}`), null)
              );
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
  return (await Promise.all(renderers.map(renderer => renderer.render())))
    .filter(result => result.value != null)
    .reduce((obj, item) => {
      const el = obj;
      const name = `${item.key}_${item.id}`;

      if (!el[name]) el[name] = item.value;

      return el;
    }, {});
}

async function getPreview(responses, requestCount) {
  return Preview(
    [...Object.keys(responses).map(name => responses[name].fullHtml)].join('\n'),
    `${requestCount} request!`
  );
}

// eslint-disable-next-line consistent-return
export default async (req, res) => {
  const renderers = req.params.components
    .split(',')
    .filter((value, index, self) => self.indexOf(value) === index)
    .map(name =>
      getRenderer(
        name,
        req.query,
        req.cookies,
        req.url,
        `/${req.params.path || ''}`,
        req.headers['user-agent']
      )
    )
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
    const preview = await getPreview(responses, requestCount);
    res.html(preview);
  } else {
    res.json(responses);

    metrics.fragmentRequestDurationMicroseconds
      .labels(componentNames.sort().join(','), isWithoutHTML(req.query) ? '1' : '0')
      .observe(Date.now() - res.locals.startEpoch);
  }
};
