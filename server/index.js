// @flow
const { parse } = require('url');
const { router, get, post, del } = require('microrouter');
const UrlPattern = require('url-pattern');

const KontenaApi = require('./lib/kontena-api');
const readFunctionsHandler = require('./lib/read-functions');
const createFunctionHandler = require('./lib/create-function');
const deleteFunctionHandler = require('./lib/delete-function');
const readReplicasHandler = require('./lib/read-replicas');
const updateReplicasHandler = require('./lib/update-replicas');
const proxyHandler = require('./lib/proxy');

const MASTER_URL: string = process.env.MASTER_URL || '';
const AUTH_TOKEN: string = process.env.AUTH_TOKEN || '';
const GRID_ID: string = process.env.GRID_ID || 'openfaas';

console.log('starting api with params', MASTER_URL, AUTH_TOKEN, GRID_ID);
const api = new KontenaApi(MASTER_URL, AUTH_TOKEN, GRID_ID);

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
  get('/system/functions', readFunctionsHandler(api)),
  post('/system/functions', createFunctionHandler(api)),
  del('/system/functions', deleteFunctionHandler(api)),

  // Manage scale
  get('/system/function/:name', readReplicasHandler(api)),
  get('/system/scale-function/:name', updateReplicasHandler(api)),

  // Proxy function invocation
  catchall('/function/:name', proxyHandler(api)),
  catchall('/function/:name/', proxyHandler(api))
);
