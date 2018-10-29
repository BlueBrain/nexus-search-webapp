import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const STAGE = process.env.NODE_ENV === "production" ? "prod" : "dev";
let envConfig = {
  ELASTIC_SEARCH_INDEX: process.env.ELASTIC_SEARCH_INDEX || null,
  SEARCH_API_BASE_PATH: process.env.SEARCH_API_BASE_PATH || "",
  SEARCH_PROXY_PORT: process.env.SEARCH_PROXY_PORT || process.env.PORT || 8888,
  ELASTICSEARCH_CLIENT_URL: process.env.ELASTICSEARCH_CLIENT_URL || null,
  RESOURCE_URL: process.env.RESOURCE_URL || "",
  SEARCH_APP_SERVICE_TOKEN: process.env.SEARCH_APP_SERVICE_TOKEN || ""
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
