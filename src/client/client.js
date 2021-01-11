import 'whatwg-fetch';
import Eev from 'eev';

('__V_styles__');

if (!window.HbEventBus) {
  window.HbEventBus = new Eev();
  window.voltran_project_version = process.env.APP_BUILD_VERSION || '1.0.0';
}
