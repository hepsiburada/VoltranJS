import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { StaticRouter } from 'react-router';
import ConnectedApp from '../components/App';
import Html from '../components/Html';
import PureHtml, { generateLinks, generateScripts } from '../components/PureHtml';
import ServerApiManagerCache from '../core/api/ServerApiManagerCache';
import createBaseRenderHtmlProps from '../utils/baseRenderHtml';
import { guid } from '../utils/helper';

const getStates = async (component, context, predefinedInitialState) => {
  const initialState = predefinedInitialState || { data: {} };
  let subComponentFiles = [];
  let seoState = {};
  let responseOptions = {};

  if (context.isWithoutState) {
    return { initialState, seoState, subComponentFiles, responseOptions };
  }

  if (!predefinedInitialState && component?.getInitialState) {
    const services = component.services.map(serviceName => ServerApiManagerCache[serviceName]);
    initialState.data = await component.getInitialState(...[...services, context]);
  }

  if (component?.getSeoState) {
    seoState = component.getSeoState(initialState.data);
  }

  if (initialState.data.subComponentFiles) {
    subComponentFiles = initialState.data.subComponentFiles;
  }

  if (initialState.data.responseOptions) {
    responseOptions = initialState.data.responseOptions;
  }

  return { initialState, seoState, subComponentFiles, responseOptions };
};

const renderLinksAndScripts = (html, links, scripts) => {
  return html
    .replace('<div>REPLACE_WITH_LINKS</div>', links)
    .replace('<div>REPLACE_WITH_SCRIPTS</div>', scripts);
};

const renderHtml = (component, initialState, context) => {
  // eslint-disable-next-line no-param-reassign
  component.id = guid();
  const initialStateWithLocation = { ...initialState, location: context, id: component.id };
  const sheet = new ServerStyleSheet();

  if (isWithoutHTML(context.query)) {
    return PureHtml(component.path, component.name, initialStateWithLocation);
  }

  const children = ReactDOMServer.renderToString(
    sheet.collectStyles(
      <StaticRouter location={component.path} context={context}>
        <ConnectedApp initialState={initialStateWithLocation} location={context} />
      </StaticRouter>
    )
  );

  const styleTags = sheet.getStyleTags();
  const resultPath = `'${component.path}'`;

  return Html({
    resultPath,
    componentName: component.name,
    children,
    styleTags,
    initialState: initialStateWithLocation,
    fullWidth: component.fullWidth,
    isMobileFragment: component.isMobileFragment,
    context
  });
};

const isWithoutHTML = query => {
  return query.withoutHTML === '';
};

const isPreview = query => {
  return query.preview === '';
};

const isWithoutState = query => {
  return query.withoutState === '';
};

const isRequestDispatcher = query => {
  return query.requestDispathcer === '' || query.requestDispathcer !== 'false';
};

const renderComponent = async (component, context, predefinedInitialState = null) => {
  const { initialState, seoState, subComponentFiles, responseOptions } = await getStates(
    component.object,
    context,
    predefinedInitialState
  );

  const { links, scripts, activeComponent } = await createBaseRenderHtmlProps(
    component.name,
    subComponentFiles,
    context
  );

  const output = renderHtml(component, initialState, context);
  const fullHtml = renderLinksAndScripts(output, generateLinks(links), generateScripts(scripts));

  return {
    output,
    fullHtml,
    links,
    scripts,
    activeComponent,
    componentName: component.name,
    seoState,
    fullWidth: component.fullWidth,
    isMobileComponent: component.isMobileComponent,
    isPreviewQuery: component.isPreviewQuery,
    responseOptions
  };
};

export {
  renderHtml,
  renderLinksAndScripts,
  getStates,
  isWithoutHTML,
  isPreview,
  isRequestDispatcher,
  isWithoutState,
  renderComponent
};
