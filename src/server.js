import http from 'http';

import voltranConfig from '../voltran.config';
import { hiddie, composedMiddlewares, prepareMiddlewares } from './middleware';

const isDebug = voltranConfig.dev;
const customServer = voltranConfig.entry.server;
const canStartServer = process.env.NODE_ENV === 'production' && (!customServer || isDebug);

const launchServer = () => {
  prepareMiddlewares();
  http.createServer(hiddie.run).listen(voltranConfig.port);
};

if (canStartServer) {
  launchServer();
}

export default composedMiddlewares;
export { launchServer, hiddie };
