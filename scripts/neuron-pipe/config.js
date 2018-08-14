import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export default function getConfig (configName="staging") {
  console.log(configName);
  return dotenv.parse(
    fs.readFileSync(
      path.resolve(__dirname, `./${configName}.env`)))
}