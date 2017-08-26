// @flow
const { parse } = require('url');
const { router, get, post, del } = require('microrouter');
const UrlPattern = require('url-pattern');

const readFunctionsHandler = require('./lib/read-functions');

const getParamsAndQuery = (pattern, url) => {
  const { query, pathname } = parse(url, true);
  const route = pattern instanceof UrlPattern ? pattern : new UrlPattern(pattern);
  const params = route.match(pathname);

  return { query, params };
}

const catchall = (path, handler) => {
  if (!path) throw new Error('You need to set a valid path')
  if (!handler) throw new Error('You need to set a valid handler')

  const route = new UrlPattern(path)

  return (req, res) => {
    const { params, query } = getParamsAndQuery(route, req.url)

    if (params) {
      return handler(Object.assign(req, { params, query }), res)
    }
  }
}

module.exports = router(
  // Manage functions
  get('/system/functions', readFunctionsHandler),
  post('/system/functions', () => []),
  del('/system/functions', () => []),

  // Manage scale
  get('/system/function/:name', () => []),
  get('/system/scale-function/:name', () => []),

  // Proxy function invocation
  catchall('/function/:name', (req, res) => []),
  catchall('/function/:name/', (req, res) => [])
);
