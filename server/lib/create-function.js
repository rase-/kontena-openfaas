// @flow
import type KontenaApi from './kontena-api';

const { json } = require('micro');

function makeDeploymentSpec(body: CreateFunctionBody) {
  // TODO
  return {};
}

module.exports = function(api: KontenaApi): (req: http$IncomingMessage, http$ServerResponse) => Promise<void> {
  return async function(req, res): Promise<void> {
    const body: CreateFunctionBody = await json(req);
    const spec: Object = makeDeploymentSpec(body);
    await api.deployService(spec);
  }
}
