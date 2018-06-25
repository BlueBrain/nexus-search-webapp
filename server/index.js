import express from "express";
import middleware from "./libs/middleware";
import config from "./libs/config";
import routes from "./libs/routes";

const app = express();

middleware(app);
routes(app);

const server = app.listen(
  config.SEARCH_PROXY_PORT || process.env.PORT || config.DEFAULT_PORT,
  () => {
    console.log(
      "🔍 Search Service running on port: ",
      server.address().port
    );
  }
);
