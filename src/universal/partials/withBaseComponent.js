import React from 'react';
import ReactDOM from 'react-dom';

import ClientApp from '../components/ClientApp';
import { WINDOW_GLOBAL_PARAMS } from '../utils/constants';
import { createComponentName } from '../utils/helper';
import voltranConfig from '../../../voltran.config';

const getStaticProps = () => {
  const staticProps = {};

  if (voltranConfig.staticProps) {
    voltranConfig.staticProps.map(property => {
      staticProps[property.name] = property.value;
    });
  }

  return staticProps;
};

const withBaseComponent = (PageComponent, pathName) => {
  const componentName = createComponentName(pathName);
  const prefix = voltranConfig.prefix.toUpperCase();

  if (process.env.BROWSER && window[prefix] && window[prefix][componentName.toUpperCase()]) {
    const fragments = window[prefix][componentName.toUpperCase()];
    const history = window[WINDOW_GLOBAL_PARAMS.HISTORY];
    const staticProps = getStaticProps();

    Object.keys(fragments).forEach(id => {
      const componentEl = document.getElementById(`${componentName}_${id}`);
      const isHydrated = componentEl && !!componentEl.getAttribute('voltran-hydrated');

      if (isHydrated || !componentEl) return;

      const initialState = fragments[id].STATE;

      ReactDOM.hydrate(
        <ClientApp>
          <PageComponent {...staticProps} initialState={initialState} history={history} />
        </ClientApp>,
        componentEl,
        () => {
          componentEl.style.pointerEvents = 'auto';
          componentEl.setAttribute('voltran-hydrated', 'true');
        }
      );
    });
  }

  return props => {
    return <PageComponent {...props} />;
  };
};

export default withBaseComponent;
