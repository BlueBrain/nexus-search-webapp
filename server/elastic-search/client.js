import fetchToJSON from "../libs/fetch";

// Class that mimics the Elastic Search JS Client API but uses Nexus v1 Search
export default class Client {
  constructor(options) {
    let { host } = options;
    this.host = host;
    this.indices = {
      getMapping: this.getMapping.bind(this)
    };
  }
  async getMapping(params, headers) {
    let host = this.host;
    let { index } = params;
    let url = host + index;
    let options = {
      method: "GET",
      headers: {
        Authorization: headers.authorization,
        "Content-Type": "application/json"
      }
    };
    let result = await fetchToJSON(url, options);
    return result.mapping
  }

  async search(params, headers) {
    let host = this.host;
    let { size = 20, from = 0, index, body } = params;
    let url = host + index + `/_search?from=${from}&size=${size}`;
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    };
    if (headers.authorization) {
      options.headers.Authorization = headers.authorization;
    }
    let results = await fetchToJSON(url, options);
    return results
  }
}
