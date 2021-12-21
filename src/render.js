import xss from 'xss';

import { matchUrlInRouteConfigs } from './universal/core/route/routeUtils';
import Preview from './universal/components/Preview';
import { HTTP_STATUS_CODES } from './universal/utils/constants';
import metrics from './metrics';
import {
  renderComponent,
  renderLinksAndScripts,
  isPreview,
  isWithoutHTML,
  isWithoutState
} from './universal/service/RenderService';
import Component from './universal/model/Component';
import logger from './universal/utils/logger';

const appConfig = require('__APP_CONFIG__');

const render = async (req, res) => {
  const isWithoutStateValue = isWithoutState(req.query);
  const pathParts = xss(req.path)
    .split('/')
    .filter(part => part);
  const componentPath = `/${pathParts.join('/')}`;

  const routeInfo = matchUrlInRouteConfigs(componentPath);

  if (routeInfo) {
    const path = `/${pathParts.slice(1, pathParts.length).join('/')}`;

    const context = {
      path: xss(path),
      query: JSON.parse(xss(JSON.stringify(req.query))),
      cookies: xss(JSON.stringify(req.cookies)),
      url: xss(req.url)
        .replace(componentPath, '/')
        .replace('//', '/'),
      userAgent: xss(req.headers['user-agent']),
      headers: JSON.parse(xss(JSON.stringify(req.headers))),
      isWithoutState: isWithoutStateValue
    };

    const component = new Component(routeInfo.path);

    let renderResponse = null;

    try {
      renderResponse = await renderComponent(component, context);
    } catch (exception) {
      logger.exception(exception);
      return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        message: exception.message
      });
    }

    const {
      output,
      fullHtml,
      links,
      scripts,
      activeComponent,
      componentName,
      seoState,
      isPreviewQuery,
      responseOptions
    } = renderResponse;

    const statusCode = responseOptions?.isPartialContent
      ? HTTP_STATUS_CODES.PARTIAL_CONTENT
      : HTTP_STATUS_CODES.OK;

    if (!isPreview(context.query)) {
      const html = renderLinksAndScripts(output, '', '');

      res.status(statusCode).json({ html, scripts, style: links, activeComponent, seoState });

      metrics.fragmentRequestDurationMicroseconds
        .labels(componentName, isWithoutHTML(context.query) ? '1' : '0')
        .observe(Date.now() - res.locals.startEpoch);
    } else {
      const voltranEnv = appConfig.voltranEnv || 'local';

      if (voltranEnv !== 'prod' && isPreviewQuery) {
        res.status(statusCode).html(Preview([fullHtml].join('\n')));
      } else {
        res
          .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
          .html('<h1>Aradığınız sayfa bulunamadı...</h1>');
      }
    }
  } else {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
      message: 'not found'
    });
  }
};

export default render;
