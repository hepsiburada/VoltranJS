import { useEffect } from 'react';

import withBaseComponent from '../../partials/withBaseComponent';
import { getEventBus } from '../../utils/helper';
import { isExitCondition } from './RequestDispatcher.utils';

const requestConfigs = require('__V_REQUEST_CONFIGS__');

const { effects = [] } = requestConfigs?.default || {};
const requestPrefix = 'RequestDispatcher.';
const responsePrefix = 'RequestDispatcher.Response.';

const RequestDispatcher = () => {
  const fragment = '';

  if (!process.env.BROWSER) {
    return fragment;
  }

  window.HBUS_LAZY = true;

  useEffect(() => {
    const eventBus = getEventBus();

    const broadcast = (effect, error, body) => {
      effect.Subscribers.forEach(responseName => {
        eventBus.emit(`${responsePrefix}${responseName}`, { error, body });
      });
    };

    const runEffect = (effect, data) => {
      effect
        .Request(data)
        .then(response => broadcast(effect, null, response))
        .catch(error => broadcast(effect, error, null));
    };

    const requestHandler = requestName => {
      return data => {
        if (!Object.prototype.hasOwnProperty.call(effects, requestName)) {
          return;
        }

        const conditions = effects[requestName];

        for (const condition in conditions) {
          if (isExitCondition(condition)) {
            runEffect(conditions[condition], data);
            break;
          }
        }
      };
    };

    Object.keys(effects).forEach(requestName => {
      eventBus.on(`${requestPrefix}${requestName}`, requestHandler(requestName));
    });
  }, []);

  return fragment;
};

export default withBaseComponent(RequestDispatcher, '/RequestDispatcher');
