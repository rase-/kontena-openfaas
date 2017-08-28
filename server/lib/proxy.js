// @flow
import type KontenaApi from './kontena-api';

const { IncomingMessage } = require('http');
const request = require('request');
const streamToPromise = require('stream-to-promise');

class ParamRequest extends IncomingMessage {
  params: { [string]: string };
}

const WATCHDOG_PORT = 8080;

module.exports = function(api: KontenaApi): (req: ParamRequest, http$ServerResponse) => Promise<void> {
  return async function(req, res): Promise<void> {
    const name = req.params.name;
    req
      .pipe(request.post(`http://${name}.${api.gridId}.kontena.local:8080`))
      .pipe(res);

    await streamToPromise(res);
  }
}
