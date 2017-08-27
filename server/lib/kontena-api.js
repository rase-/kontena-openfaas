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

    if (res.statusCode !== 200) {
      throw new Error('Non-OK status code fetching services');
    }

    return res.json();
  }

  async deployService(deployment: Object): Promise<void> {
    const res = await fetch(this.masterUrl + `/v1/grids/${this.gridId}/services`, {
      method: 'POST',
      body: JSON.stringify(deployment),
      headers: {
        ['authorization']: `Bearer ${this.authToken}`
      }
    });

    if (res.statusCode !== 200) {
      throw new Error('Non-OK status code fetching services');
    }

    const serviceId = (await res.json()).id;
    const dres = await fetch(this.masterUrl + `/v1/grids/${this.gridId}/services/${serviceId}/deploy`, {
      method: 'POST',
      headers: {
        ['authorization']: `Bearer ${this.authToken}`
      }
    });

    if (dres.statusCode !== 200) {
      throw new Error('Non-OK status code fetching services');
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

    if (res.statusCode !== 200) {
      throw new Error('Non-OK status code fetching services');
    }
  }
};
