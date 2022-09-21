import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

import partials from './partials';
import groupBy from '../../utils/lodash/groupBy';

const sheet = new ServerStyleSheet();

const Welcome = () => {
  const { live = [], dev = [], page = [], ...others } = groupBy(partials, item => item.status);

  const renderItem = ({ item, status, title }) => (
    <a
      href={item.previewUrl ? item.previewUrl : `${item.url}?preview`}
      target="_blank"
      className="link"
    >
      <div className="card">
        <div className="ribbon-wrapper">
          <div className={`ribbon color-${status}`}> {title}</div>
        </div>
        <div className="card-title">{item.name}</div>
        <div className="card-subtitle">
          {status === 'page' ? 'Multiple partials' : 'Single partial'}
        </div>
        <button className="url-button detail-button">{item.previewUrl || item.url}</button>
      </div>
    </a>
  );

  const renderGroup = ({ title, data, status }) => {
    return (
      <div className="group">
        <div className="group-content">
          <div className="group-title">
            {title.toUpperCase()} ({data.length})
          </div>
        </div>
        <div className="cards">{data.map(item => renderItem({ item, status, title }))}</div>
      </div>
    );
  };

  return (
    <div>
      {page.length > 0 && renderGroup({ title: 'page', data: page, status: 'page' })}
      {live.length > 0 && renderGroup({ title: 'live', data: live, status: 'live' })}
      {dev.length > 0 && renderGroup({ title: 'dev', data: dev, status: 'dev' })}
      {Object.entries(others).map((entity, index) => {
        const [key, data] = entity;
        return renderGroup({ title: key, data, status: index + 1 });
      })}
    </div>
  );
};
export default ReactDOMServer.renderToString(sheet.collectStyles(<Welcome />));
const styleTags = sheet.getStyleTags();

export { styleTags };
