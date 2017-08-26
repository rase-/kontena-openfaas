// @flow
import type KontenaApi from './kontena-api';

class ParamRequest extends http$IncomingMessage {
  params: { [string]: string };
}

module.exports = function(api: KontenaApi): (req: ParamRequest, http$ServerResponse) => Promise<Func> {
  return async function(req, res): Promise<Func> {
    const name = req.params.name;
    const services = await api.listServices();
    const service = services.find((s) => s.name === name);
    if (!service) throw new Error('Service not found');

    return {
      name: service.name,
      image: service.image,
      invocationCount: 0,
      replicas: service.replicas,
      envProcess: ''
    }
  }
}
