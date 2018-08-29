import getConfig from "../config";
import { to } from "@libs/promise";
import {fetchWithToken} from "../helpers";
import projectPayload from "./project";
import contextPayload from "./context";

require("dns-cache")(100000);

const DEFAULT_PROJECT_NAME="search_test-3";

//must be curi
const DEFAULT_CONTEXT_NAME="base:neuroshapes";

const [, , stage, projectName=DEFAULT_PROJECT_NAME, contextName=DEFAULT_CONTEXT_NAME] = process.argv;
const config = getConfig(null,stage);

const {
  TOKEN: token,
  BASE: base,
  ORG: org,
  DOMAIN: domain,
  CONTEXT: context,
  SCHEMA: schema,
  VER: ver,
  V1_PROJECT: v1Project,
  V1_ORG: v1Org,
  V1_BASE: v1Base
} = config;

let easyConfig = {
  token,
  base,
  org,
  domain,
  context,
  schema,
  ver,
  v1: { project: v1Project, org: v1Org, base: v1Base }
};

async function createProject() {
  console.log(`creating project ${projectName}...`);
  let options = {
    method: "PUT",
    body: JSON.stringify(projectPayload)
  }
  let response = await fetchWithToken(`${v1Base}/projects/${v1Org}/${projectName}`, token, options);
  console.log(`${response.status} `, response.statusText)
}

async function createContext() {
  console.log(`creating context ${contextName}...`);
  let options = {
    method: "PUT",
    body: JSON.stringify(contextPayload)
  }
  let response = await fetchWithToken(`${v1Base}/resources/${v1Org}/${projectName}/resources/${contextName}`, token, options);
  console.log(`${response.status} `, response.statusText)
}

void (async function main() {
  try {
    await createProject();
    await createContext();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
