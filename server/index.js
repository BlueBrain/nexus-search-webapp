import express from "express";
import middleware from "./libs/middleware";
import config from "./libs/config";
import routes from "./libs/routes";

const app = express();

middleware(app);
routes(app);

const server = app.listen(
  config.SEARCH_PROXY_PORT,
  () => {
    console.log(
      "\t🔍   Search Service running on port: ",
      server.address().port,
    );
  }
);
