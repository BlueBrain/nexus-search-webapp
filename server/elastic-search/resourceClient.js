import fetch from "node-fetch";

// Because we want to use the Nexus v1 get resource API
// instead of the elastic Search client api behind Nexus Elastic Search Views
// we need to make a special client for getting resources by ID
export default class Client {
  constructor(options) {
    let { host } = options;
    this.host = host;
  }
  get(id, headers) {
    return new Promise((resolve, reject) => {
      let host = this.host;
      let url = host + id;
      let options = {
        method: "GET",
        headers: {
          Authorization: headers.authorization,
          "Content-Type": "application/json"
        },
      };
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
