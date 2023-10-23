import {addCustomAttrsToNewrelic} from "../../universal/tools/newrelic/newrelic";

export const utils = async (req, res, next) => {
  res.json = json => {
    addCustomAttrsToNewrelic(json.message);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(json));
  };

  res.html = html => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(html);
  };

  res.status = code => {
    res.statusCode = code;
    return res;
  };

  next();
};
