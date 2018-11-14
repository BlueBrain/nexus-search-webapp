import inquirer from "inquirer";
import { resources } from "./consts";
import processResources from "./process";
import file from "./file";
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


const whatProjectName = {
  type: "input",
  name: "whatProjectName",
  message: "What is the name of the project to upload them to?",
  validate: value => !!value
};

void (async function main() {
  try {
    let answers = await inquirer.prompt([whichEntity, shouldUpload, whatProjectName]);
    let {
      whichEntity: whichEntityAnswer,
      shouldUpload: shouldUploadAnswer,
      whatProjectName: whatProjectNameAnswer,
    } = answers;

    let resource = resources[whichEntityAnswer];
    let resourceURL = `https://bbp.epfl.ch/nexus/v1/resources/webapps/${whatProjectNameAnswer}/resource/`;

    let docs = await processResources(
      resource,
      resourceURL,
      shouldUploadAnswer,
    );

    file.write(whichEntityAnswer, docs);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
