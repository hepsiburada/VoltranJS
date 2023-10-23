import prom from "prom-client";

import newrelic from "../../universal/tools/newrelic/newrelic";
import Welcome from "../../universal/partials/Welcome/Welcome";

export const handleUrls = async (req, res, next) => {
  newrelic?.setTransactionName?.(req.path);

  if (req.url === '/' && req.method === 'GET') {
    res.html(Welcome());
  } else if (req.url === '/metrics' && req.method === 'GET' && !enablePrometheus) {
    res.setHeader('Content-Type', prom.register.contentType);
    res.end(prom.register.metrics());
  } else if (req.url === '/status' && req.method === 'GET') {
    res.json({ success: true, version: process.env.GO_PIPELINE_LABEL || '1.0.0', fragments });
  } else if ((req.url === '/statusCheck' || req.url === '/statuscheck') && req.method === 'GET') {
    res.json({ success: true, version: process.env.GO_PIPELINE_LABEL || '1.0.0', fragments });
  } else if (req.url === '/deleteallcache' && req.method === 'GET') {
    process.send({
      msg: {
        action: 'deleteallcache'
      },
      options: {
        forwardAllWorkers: true
      }
    });
    res.json({ success: true });
  } else if (req.path === '/deletecache' && req.method === 'GET') {
    if (req?.query?.key) {
      process.send({
        msg: {
          action: 'deletecache',
          key: req?.query?.key
        },
        options: {
          forwardAllWorkers: true
        }
      });
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } else {
    next();
  }
};
