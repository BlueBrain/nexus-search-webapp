import fs from "fs";
import path from "path";
import dotenv from "dotenv";

export default function getConfig (entityTypePath, configName="staging") {
  console.log(configName);
  return dotenv.parse(
    fs.readFileSync(
      path.resolve(__dirname, `./${entityTypePath || "get-data"}/${configName}.env`)))
}