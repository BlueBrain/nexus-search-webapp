import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const STAGE = process.env.NODE_ENV === "production" ? "prod" : "dev";
let envConfig = {
  DEFAULT_PORT: 8888
};
// load ENV variables from env stage configs
if (STAGE === "dev") {
  envConfig = Object.assign(
    envConfig,
    dotenv.parse(
      fs.readFileSync(path.resolve(__dirname, `../../envs/${STAGE}.env`))
    )
  );
}

export default {
  ...envConfig
};
