import xss from 'xss';

import { matchUrlInRouteConfigs } from './universal/core/route/routeUtils';
import Preview from './universal/components/Preview';
import { HTTP_STATUS_CODES } from './universal/utils/constants';
import metrics from './metrics';
import {
  renderComponent,
  renderLinksAndScripts,
  isPreview,
  isWithoutHTML
} from './universal/service/RenderService';
import Component from './universal/model/Component';
import logger from './universal/utils/logger';

// eslint-disable-next-line consistent-return
export default async (req, res) => {
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
      userAgent: xss(req.headers['user-agent'])
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
      seoState
    } = renderResponse;

    if (!isPreview(context.query)) {
      const html = renderLinksAndScripts(output, '', '');

      res.json({ html, scripts, style: links, activeComponent, seoState });

      metrics.fragmentRequestDurationMicroseconds
        .labels(componentName, isWithoutHTML(context.query) ? '1' : '0')
        .observe(Date.now() - res.locals.startEpoch);
    } else {
      res.html(Preview([fullHtml].join('\n')));
    }
  } else {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
      message: 'not found'
    });
  }
};
