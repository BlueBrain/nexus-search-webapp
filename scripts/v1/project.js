import {fetchWithToken} from "../neuron-pipe/helpers";

export default class Project {
  constructor (name, { base, org, token }) {
    this.name = name
    this.base = base
    this.org = org
    this.token = token
  }

  async create (payload) {
    let { name, base, org, token } = this;
    let response = await createProject(name, { payload, base, org, token })
    console.log(response.status);
    if (response.status >= 200 && response.status < 400) {
      console.log("succesfully created/updated project", response.body);
    }
    return this;
  }

  async createResource(payload, id) {
    let { name, base, org, token } = this;
    let response = await createResource(id, { projectName: name, payload, base, org, token })
    console.log(response.status);
    if (response.status >= 200 && response.status < 400) {
      console.log("succesfully created/updated resource");
    }
    return this;
  }

  async createESView(payload, id) {
    let { name, base, org, token } = this;
    let response = await createView(id, { projectName: name, payload, base, org, token })
    console.log(response.status);
    if (response.status >= 200 && response.status < 400) {
      console.log("succesfully created/updated ES View");
    }
    return this;
  }
}

async function createProject(projectName, { payload, base, org, token }) {
  let options = {
    method: "PUT",
    body: JSON.stringify(payload)
  }
  let response = await fetchWithToken(`${base}/projects/${org}/${projectName}`, token, options);
  return response;
}

async function createResource(id, { projectName, payload, base, org, token }) {
  // TODO change method based on id is-there-ness
  let options = {
    method: "PUT",
    body: JSON.stringify(payload)
  }
  let response = await fetchWithToken(`${base}/resources/${org}/${projectName}/resources/${id}`, token, options);
  return response;
}

async function createView(id, { projectName, payload, base, org, token }) {
  // TODO change method based on id is-there-ness
  let options = {
    method: "PUT",
    body: JSON.stringify(payload)
  }
  let response = await fetchWithToken(`${base}/views/${org}/${projectName}/${id}`, token, options);
  return response;
}