import express from "express";
import middleware from "./middleware";
import config from "./config";
import routes from "./routes";

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
