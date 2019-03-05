import projectPayload from "./project";
import contextPayload from "./context";
import esViewPayload from "./view";
import inquirer from "inquirer";
import Project from "../../v1/project";
import config from "../../../server/libs/config";

const { SEARCH_APP_SERVICE_TOKEN_PROD: token } = config;

const whatProjectName = {
  type: "input",
  name: "whatProjectName",
  message: "What is the name of the new project?",
  validate: value => !!value
};

const whatNexusBase = {
  type: "input",
  name: "whatNexusBase",
  message: "What is the base url of the nexus deployment?",
  default: "https://bbp.epfl.ch/nexus/v1"
};

const whichOrg = {
  type: "input",
  name: "whichOrg",
  message: "What is the name of the organization?",
  default: "webapps"
};

// must be curi
const contextName = "base:neuroshapes";
const esViewName = "search-view";

void (async function main() {
  try {
    let answers = await inquirer.prompt([
      whatProjectName,
      whatNexusBase,
      whichOrg
    ]);
    let {
      whatProjectName: whatProjectNameAnswer,
      whatNexusBase: whatNexusBaseAnswer,
      whichOrg: whichOrgAnswer
    } = answers;
    let myProject = new Project(whatProjectNameAnswer, {
      base: whatNexusBaseAnswer,
      org: whichOrgAnswer,
      token
    });
    await myProject.create(projectPayload);
    await myProject.createResource(contextPayload, contextName);
    await myProject.createESView(esViewPayload, esViewName);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
