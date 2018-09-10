import inquirer from "inquirer";
import login from "./login";

const whichEntity = {
  type: "list",
  name: "whichEntity",
  message: "Which entity do you want to process?",
  choices: [
   "type 1",
   "type 2"
  ]
}

const shouldUpload = {
  type: "confirm",
  name: "shouldUpload",
  message: `Do you want to upload these to the v1 project $PROJECT`,
}

void (async function main() {
  try {
    let token = await login();
    console.log({token});
    let answers = await inquirer
      .prompt([
        whichEntity,
        shouldUpload
      ])
    console.log("answers are", answers);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();