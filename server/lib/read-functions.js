// @flow
import type KontenaApi from './kontena-api';

module.exports = function(api: KontenaApi): (req: http$IncomingMessage, http$ServerResponse) => Promise<Array<Func>> {
  return async function(req, res): Promise<Array<Func>> {
    const services = await api.listServices();
    return services.map((service) => {
      return {
        name: service.name,
        image: service.image,
        invocationCount: 0,
        replicas: service.replicas,
        envProcess: ''
      }
    });
  }
}
