import React from 'react';

import { ROUTE_CONFIGS } from '../core/route/routeConstants';
import routesWithComponents from '../core/route/routesWithComponents';

import HbRoute from '../components/route/HbRoute';

export const renderRoutes = routingProps =>
  Object.entries(routesWithComponents).map(entity => (
    <HbRoute
      routingProps={routingProps}
      key={entity[0]}
      path={entity[0]}
      {...ROUTE_CONFIGS[entity[0]]}
      component={entity[1]}
    />
  ));

export default { renderRoutes };
