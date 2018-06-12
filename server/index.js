import express from "express";
import dotenv from "dotenv";
import path from "path";
import middleware from "./middleware";
import routes from "./routes";

const DEFAULT_PORT = 8888;
const STAGE = process.env.NODE_ENV === "production" ? "prod" : "dev";

// load ENV variables from env stage configs
if (STAGE === "dev") {
  dotenv.config({ path: path.resolve(__dirname, `../envs/${STAGE}.env`) });
}

const app = express();

middleware(app);

routes(app);

const server = app.listen(
  process.env.SEARCH_PROXY_PORT || process.env.PORT || DEFAULT_PORT,
  () => {
    console.log(
      "Search Proxy Service running on port: ",
      server.address().port
    );
  }
);
