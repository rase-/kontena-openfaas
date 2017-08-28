// @flow
const fetch = require('node-fetch').default;

module.exports = class KontenaApi {
  masterUrl: string;
  authToken: string;
  gridId: string;

  constructor(masterUrl: string, authToken: string, gridId: string) {
    this.masterUrl = masterUrl;
    this.authToken = authToken;
    this.gridId = gridId;
  }

  async listServices(): Promise<Array<Object>> {
    const res = await fetch(this.masterUrl + `/v1/grids/${this.gridId}/services`, {
      method: 'GET',
      headers: {
        ['authorization']: `Bearer ${this.authToken}`
      }
    });

    if (res.status < 200 || res.status > 299) {
      const errBody = await res.text();
      throw new Error(`Non-OK status code (${res.status}) fetching services: ${errBody}`);
    }

    return (await res.json()).services;
  }

  async deployService(deployment: Object): Promise<void> {
    const res = await fetch(this.masterUrl + `/v1/grids/${this.gridId}/services`, {
      method: 'POST',
      body: JSON.stringify(deployment),
      headers: {
        ['authorization']: `Bearer ${this.authToken}`
      }
    });

    if (res.status < 200 || res.status > 299) {
      const errBody = await res.text();
      throw new Error(`Non-OK status code (${res.status}) fetching services: ${errBody}`);
    }

    const serviceId = (await res.json()).id;
    console.log('deploying', serviceId);
    const dres = await fetch(this.masterUrl + `/v1/grids/${this.gridId}/services/${serviceId}/deploy`, {
      method: 'POST',
      headers: {
        ['authorization']: `Bearer ${this.authToken}`
      }
    });

    if (dres.status < 200 || dres.status > 299) {
      const errBody = await dres.text();
      throw new Error(`Non-OK status code (${res.status}) fetching services: ${errBody}`);
    }
  }

  async removeService(id: string): Promise<void> {
    const res = await fetch(this.masterUrl + `/v1/grids/${this.gridId}/services/${id}`, {
      method: 'DELETE',
      headers: {
        ['authorization']: `Bearer ${this.authToken}`
      }
    });
  }

  async updateReplicas(id: string, instances: number): Promise<void> {
    const res = await fetch(this.masterUrl + `/v1/grids/${this.gridId}/services/${id}/scale`, {
      method: 'POST',
      body: JSON.stringify({ instances }),
      headers: {
        ['authorization']: `Bearer ${this.authToken}`
      }
    });

    if (res.status < 200 || res.status > 299) {
      const errBody = await res.text();
      throw new Error(`Non-OK status code (${res.status}) fetching services: ${errBody}`);
    }
  }
};
