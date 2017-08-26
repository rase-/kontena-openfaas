// @flow
import type KontenaApi from './kontena-api';

const { json } = require('micro');

class ParamRequest extends http$IncomingMessage {
  params: { [string]: string };
}

module.exports = function(api: KontenaApi): (req: ParamRequest, http$ServerResponse) => Promise<void> {
  return async function(req, res): Promise<void> {
    const name = req.params.name;
    const body: ScaleServiceRequest = await json(req);

    const services = await api.listServices();
    const service = services.find((s) => s.name === name);
    if (!service) throw new Error('Service not found');

    await api.updateReplicas(service.id, body.replicas);
  }
}
