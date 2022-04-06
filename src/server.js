import http from 'http';

import voltranConfig from '../voltran.config';
import { hiddie, composedMiddlewares, prepareMiddlewares } from './middleware';

const launchServer = () => {
  prepareMiddlewares();
  http.createServer(hiddie.run).listen(voltranConfig.port);
};

if (process.env.NODE_ENV === 'production' && !voltranConfig.entry.server) {
  launchServer();
}

export default composedMiddlewares;
export { launchServer, hiddie };
