import React from 'react';
import structUtils from '../../utils/struct';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

import { List, ListItem, Name, Url, Footer, Label, Dot, Link, HeaderName } from './styled';
import partials from './partials';

const sheet = new ServerStyleSheet();

const Welcome = () => {
  const { live = [], dev = [], page = [],...others  } = structUtils.groupBy(partials, item => item.status);

  const renderItem = ({ item, status }) => (
    <ListItem status={item.status}>
      <Link href={item.previewUrl ? item.previewUrl : `${item.url}?preview`} target="_blank">
        <Name>{item.name}</Name>
        <Url>{item.url}</Url>
        <Footer status={status}>
          <Label status={status}>
            {item.status} <Dot status={status} />
          </Label>
        </Footer>
      </Link>
    </ListItem>
  );

  const renderGroup = ({ title, value, status }) => {
    return (
      <>
        <HeaderName>{title}</HeaderName>
        {value.map(item => renderItem({ item, status }))}
      </>
    );
  };

  return (
    <List>
      {page.length > 0 && renderGroup({ title: 'page', value: page, status: 'page' })}
      {live.length > 0 && renderGroup({ title: 'live', value: live, status: 'live' })}
      {dev.length > 0 && renderGroup({ title: 'dev', value: dev, status: 'dev' })}
      {Object.entries(others).map((entity, index) => {
        const [key, value] = entity;
        return renderGroup({ title: key, value, status: index + 1 });
      })}
    </List>
  );
};
export default ReactDOMServer.renderToString(sheet.collectStyles(<Welcome />));
const styleTags = sheet.getStyleTags();

export { styleTags };
