import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Route } from 'react-router-dom';
import { renderMergedProps } from '../../core/route/routeUtils';

class HbRoute extends PureComponent {
  hbRouteProps = routeProps => {
    const { component, routingProps } = this.props;
    return renderMergedProps(component, routeProps, routingProps);
  };

  render() {
    const { component, routingProps, ...rest } = this.props;
    return <Route {...rest} render={this.hbRouteProps} />;
  }
}

HbRoute.propTypes = {
  component: PropTypes.func.isRequired,
  routeProps: PropTypes.shape(),
  routingProps: PropTypes.shape()
};

HbRoute.defaultProps = {
  routeProps: null,
  routingProps: null
};

export default HbRoute;
