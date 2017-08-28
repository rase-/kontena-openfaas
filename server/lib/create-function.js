// @flow
import type KontenaApi from './kontena-api';

const { json } = require('micro');

function makeDeploymentSpec(body: CreateFunctionBody): Object {
  return {
    name: body.service,
    image: body.image,
    stateful: false,
    replicas: 1,
    env: (body.envProcess && body.envProcess.length > 0
        ? [`fprocess=${body.envProcess}`]
        : []).concat(body.envVars ? Object.keys(body.envVars).map((key) => {
      return `${key}=${body.envVars[key]}`;
    }) : []),
    strategy: 'ha'
  };
}

module.exports = function(api: KontenaApi): (req: http$IncomingMessage, http$ServerResponse) => Promise<void> {
  return async function(req, res): Promise<void> {
    const body: CreateFunctionBody = await json(req);
    const spec: Object = makeDeploymentSpec(body);
    await api.deployService(spec);
  }
}
