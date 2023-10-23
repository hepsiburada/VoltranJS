import {HTTP_STATUS_CODES} from "../../universal/utils/constants";

export const cors = async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(HTTP_STATUS_CODES.OK);
    res.end();

    return;
  }

  next();
};
