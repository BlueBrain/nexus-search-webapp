import express from "express";
import middleware from "./libs/middleware";
import config from "./libs/config";
import messages from "./libs/messages";
import syncEvents from "./models/sync-events";

const app = express();

middleware(app);

const server = app.listen(
  config.SEARCH_PROXY_PORT,
  () => {
    messages.SERVER_STARTING(server.address().port);
    messages.CONFIGURED_WITH(config);
    syncEvents.listen();
  }
);
