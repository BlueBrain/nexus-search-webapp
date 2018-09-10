import inquirer from "inquirer";
import fetch from "node-fetch";

const usernameQuestion = {
  type: "input",
  name: "username",
  message: "Username"
};

const passwordQuestion = {
  type: "password",
  name: "password",
  message: "Password"
};

function makeURLEncodedObject(data) {
  let formBody = [];
  for (let property in data) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(data[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return formBody;
}

async function login() {
  let answers = await inquirer.prompt([usernameQuestion, passwordQuestion]);
  let { username, password } = answers;
  const data = {
    grant_type: "password",
    username: username,
    password: password,
    client_id: "bbp-nexus-public",
    scope: "nexus"
  };
  let response = await fetch("https://bbpteam.epfl.ch/auth/realms/BBP/protocol/openid-connect/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: makeURLEncodedObject(data)
  });
  let payload = await response.json();
  return payload.access_token;
}

export default login;
