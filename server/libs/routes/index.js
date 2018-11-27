import express from "express";
import elasticSearch from "./elastic-search";
import syncEvents from "./sync-events";
import config from "../config";

const router = express.Router();

export default function generateRoutes(app) {
  app.use("/", router.get("/", (req, res) => res.sendStatus(200)));
  app.use(
    `${config.SEARCH_API_BASE_PATH}/`,
    router.get("/", (req, res) => res.sendStatus(200))
  );

  // sync-events endpoint
  app.use(`${config.SEARCH_API_BASE_PATH}/search/syncs`, syncEvents(router));
  app.use(`${config.SEARCH_API_BASE_PATH}/syncs`, syncEvents(router));

  // Nexus v1 ESView endpoint
  app.use(`${config.SEARCH_API_BASE_PATH}/search`, elasticSearch(router));

  app.get("*", (req, res) => res.status(404).send("Nothing Here :("));
}
