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
    return this;
  }

  async createResource(payload, id) {
    let { name, base, org, token } = this;
    let response = await createResource(id, { projectName: name, payload, base, org, token })
    return this;
  }

  async createESView(payload, id) {
    let { name, base, org, token } = this;
    let response = await createView(id, { projectName: name, payload, base, org, token })
    return this;
  }
}

async function createProject(projectName, { payload, base, org, token }) {
  return await createOrUpdateResouceWithID(`${base}/projects/${org}/${projectName}`, token, payload);
}

async function createResource(id, { projectName, payload, base, org, token }) {
  // TODO change method based on id is-there-ness
  return await createOrUpdateResouceWithID(`${base}/resources/${org}/${projectName}/resources/${id}`, token, payload);
}

async function createView(id, { projectName, payload, base, org, token }) {
  // TODO change method based on id is-there-ness
  return await createOrUpdateResouceWithID(`${base}/views/${org}/${projectName}/${id}`, token, payload)
}

async function createOrUpdateResouceWithID(url, token, payload) {
  let options = {
    method: "PUT",
    body: JSON.stringify(payload)
  }
  let response = await fetchWithToken(url, token, options);
  let { status, statusText } = response;
  console.log(status, statusText, url);

  if (status >= 200 && status < 400) {
    // everything is ok
    return response;
  }
  if (status >= 400 && status !== 409) {
    // there was a problem
    throw new Error(`createOrUpdateResouceWithID: ${statusText}`);
  }
  if (status === 409) {
    // resource already exists, let's update it
    let { _rev: rev } = await response.json();
    return await fetchWithToken(`${url}?rev=${rev}`, token, options);
  }
  // There is a problem if we reach this place;
  throw new Error(`createOrUpdateResouceWithID: unknown issue trying to update ${url}`)
}