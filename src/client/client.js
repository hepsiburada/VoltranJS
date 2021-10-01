import Eev from 'eev';

const appConfig = require('__APP_CONFIG__');

const defaultEventBusName = 'eventBus';
/* eslint-disable-next-line */
('__V_styles__');

if (!window.HbEventBus) {
  const name = appConfig.eventBusName || defaultEventBusName;

  window[name] = new Eev();
  window.voltran_project_version = process.env.APP_BUILD_VERSION || '1.0.0';
}
