// @flow
import type KontenaApi from './kontena-api';

const { json } = require('micro');

module.exports = function(api: KontenaApi): (req: http$IncomingMessage, http$ServerResponse) => Promise<void> {
  return async function(req, res): Promise<void> {
    const body: DeleteFunctionBody = await json(req);

    const services = await api.listServices();
    const service = services.find((service) => service.name === body.functionName);
    if (!service) throw new Error('Deleted function name not found');
    await api.removeService(service.id);
  }
}
