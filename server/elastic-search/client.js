import fetch from "node-fetch";

// Class that mimics the Elastic Search JS Client API but uses Nexus v1 Search
export default class Client {
  constructor(options) {
    let { host } = options;
    this.host = host;
    this.indices = {
      getMapping: this.getMapping.bind(this)
    };
  }
  getMapping(params, headers) {
    return new Promise((resolve, reject) => {
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
      console.log(url);
      fetch(url, options)
        .then(response => {
          console.log(response);
          if (response.status === 401) {
            return reject(new Error("unauthorized"));
          }
          if (response.status === 400) {
            console.log(response);
            return reject(new Error("not found"));
          }
          return response.json();
        })
        .then(result => {
          resolve(result.mapping);
        })
        .catch(reject);
    });
  }

  search(params, headers) {
    return new Promise((resolve, reject) => {
      console.log("\n\n")
      console.log({auth: headers.authorization})
      console.log("\n\n")
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
      console.log(url);
      fetch(url, options)
        .then(response => {
          console.log(response.status);
          if (response.status === 401) {
            return reject(new Error("unauthorized"));
          }
          return response.json();
        })
        .then(result => {
          resolve(result);
        })
        .catch(reject);
    });
  }
}
