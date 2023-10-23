import url from "url";
import xss from "xss";

export const locals = async (req, res, next) => {
  const parsedUrl = url.parse(req.url, true);

  req.query = JSON.parse(xss(JSON.stringify(parsedUrl.query)));
  req.path = xss(parsedUrl.pathname);
  req.url = xss(req.url);

  if (req.headers['set-cookie']) {
    req.headers.cookie = req.headers.cookie || req.headers['set-cookie']?.join();
    delete req.headers['set-cookie'];
  }

  res.locals = {};
  res.locals.startEpoch = new Date();

  next();
};
