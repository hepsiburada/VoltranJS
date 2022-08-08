import xss from 'xss';

import { matchUrlInRouteConfigs } from './universal/core/route/routeUtils';
import { BLACKLIST_OUTPUT, HTTP_STATUS_CODES } from './universal/utils/constants';
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
import omit from './universal/utils/lodash/omit';

import { getPreviewFile } from './universal/utils/previewHelper';

const appConfig = require('__APP_CONFIG__');

const render = async (req, res) => {
  const isWithoutStateValue = isWithoutState(req.query);
  const pathParts = xss(req.path)
    .split('/')
    .filter(part => part);
  const componentPath = `/${pathParts?.[0]}`;
  const isPreviewValue = isPreview(req.query);

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
      userAgent: Buffer.from(req.headers['user-agent'] || [], 'utf-8').toString('base64'),
      headers: JSON.parse(xss(JSON.stringify(req.headers))),
      isWithoutState: isWithoutStateValue,
      isPreview: isPreviewValue,
      componentPath
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
      isPreviewQuery,
      responseOptions,
      ...responseData
    } = renderResponse;

    const statusCode = responseOptions?.isPartialContent
      ? HTTP_STATUS_CODES.PARTIAL_CONTENT
      : HTTP_STATUS_CODES.OK;

    if (!isPreview(context.query)) {
      const html = renderLinksAndScripts(output, '', '');
      const otherParams = omit(responseData, BLACKLIST_OUTPUT);
      res.status(statusCode).json({ html, scripts, style: links, activeComponent, ...otherParams });

      metrics.fragmentRequestDurationMicroseconds
        .labels(componentName, isWithoutHTML(context.query) ? '1' : '0')
        .observe(Date.now() - res.locals.startEpoch);
    } else {
      const voltranEnv = appConfig.voltranEnv || 'local';

      if (voltranEnv !== 'prod' && isPreviewQuery) {
        const requestDispatcherResponse = await renderComponent(
          new Component('/RequestDispatcher'),
          context
        );
        const requestDispatcherFullHtml = requestDispatcherResponse.fullHtml;
        const PreviewFile = getPreviewFile(context.query);
        const body = [requestDispatcherFullHtml, fullHtml].join('\n');

        const response = PreviewFile({ body, componentName });

        res.status(statusCode).html(response);
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
