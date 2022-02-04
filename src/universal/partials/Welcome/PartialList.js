import React from 'react';
import groupBy from 'lodash/groupBy';
import ReactDOMServer from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';

import { List, ListItem, Name, Url, Footer, Label, Dot, Link, HeaderName } from './styled';
import partials from './partials';

const sheet = new ServerStyleSheet();

const Welcome = () => {
  const { live = [], dev = [], page = [] } = groupBy(partials, item => item.status);

  const renderItem = item => (
    <ListItem status={item.status}>
      <Link href={item.previewUrl ? item.previewUrl : `${item.url}?preview`} target="_blank">
        <Name>{item.name}</Name>
        <Url>{item.url}</Url>
        <Footer status={item.status}>
          <Label status={item.status}>
            {item.status} <Dot status={item.status} />
          </Label>
        </Footer>
      </Link>
    </ListItem>
  );
  return (
    <List>
      {live.length > 0 && (
        <>
          <HeaderName>Live</HeaderName>
          {live.map(item => renderItem(item))}
        </>
      )}
      {page.length > 0 && (
        <>
          <HeaderName>Pages</HeaderName>
          {page.map(item => renderItem(item))}
        </>
      )}
      {dev.length > 0 && (
        <>
          <HeaderName>Development</HeaderName>
          {dev.map(item => renderItem(item))}
        </>
      )}
    </List>
  );
};
export default ReactDOMServer.renderToString(sheet.collectStyles(<Welcome />));
const styleTags = sheet.getStyleTags();

export { styleTags };
