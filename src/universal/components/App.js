import React, { PureComponent } from 'react';
import { withRouter } from 'react-router';
import { Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import PropTypes from 'prop-types';

import { renderRoutes } from '../routes/routes';
import { extractQueryParamsFromLocation } from '../core/route/routeUtils';
import ReactRenderContext from '../core/react/ReactRenderContext';

class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isHydratingCompleted: false
    };
  }

  componentDidMount() {
    this.setState({
      isHydratingCompleted: true
    });
  }

  componentWillUpdate(nextProps) {
    const { location } = this.props;

    const url = location.pathname + location.search;
    const nextUrl = nextProps.location.pathname + nextProps.location.search;

    if (url !== nextUrl && process.env.BROWSER) {
      window.ref = window.location.origin + url;
    }
  }

  generateRoutingProps() {
    const { initialState, location } = this.props;
    const query = extractQueryParamsFromLocation(location);
    return {
      query,
      initialState
    };
  }

  render() {
    const { isHydratingCompleted } = this.state;
    return (
      <ReactRenderContext.Provider value={isHydratingCompleted}>
        <Switch>{renderRoutes(this.generateRoutingProps())}</Switch>
      </ReactRenderContext.Provider>
    );
  }
}

App.propTypes = {
  initialState: PropTypes.shape(),
  location: PropTypes.shape()
};

App.defaultProps = {
  initialState: null,
  location: null
};

export { App };
export default hot(module)(withRouter(App));
