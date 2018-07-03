import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const STAGE = process.env.NODE_ENV === "production" ? "prod" : "dev";

const envConfig = dotenv.parse(
  fs.readFileSync(
    path.resolve(__dirname, `./envs/${STAGE}.env`)))

if (envConfig) {
  let out = [];
  for (let k in envConfig) {
    if (envConfig[k]) {
      out.push(`${k}=${envConfig[k]}`);
    }
  }
  console.log(out.join(' '));
}
