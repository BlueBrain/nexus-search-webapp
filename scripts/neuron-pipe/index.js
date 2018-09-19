import inquirer from "inquirer";
import login from "./login";
import { resources } from "./consts";
import * as processResources from "./resources";
import config from "../../server/libs/config";

const whichEntity = {
  type: "list",
  name: "whichEntity",
  message: "Which entity do you want to process?",
  choices: Object.keys(resources).map(key => ({
    name: `${key}: ${resources[key].name}`,
    value: key
  }))
};

const shouldUpload = {
  type: "confirm",
  name: "shouldUpload",
  message: `Do you want to upload these to the v1 Project? \n url: ${
    config.RESOURCE_URL
  }`,
  default: false
};

void (async function main() {
  try {
    let token = await login();
    if (!token) {
      console.log("login failed");
      process.exit(0);
    }
    let answers = await inquirer.prompt([whichEntity, shouldUpload]);
    let {
      whichEntity: whichEntityAnswer,
      shouldUpload: shouldUploadAnswer
    } = answers;
    let process = processResources[whichEntityAnswer];
    await process(
      resources[whichEntityAnswer],
      token,
      shouldUploadAnswer,
      config.RESOURCE_URL
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
