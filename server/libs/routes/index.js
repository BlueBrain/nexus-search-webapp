
import express from "express";
import elasticSearch from "./elastic-search";
import config from "../config";

const router = express.Router();

console.log("Base Path: ", config.SEARCH_API_BASE_PATH);

export default function generateRoutes(app) {
  app.use(`${config.SEARCH_API_BASE_PATH}/`, router.get('/', (req, res) => res.send(200)));
  app.use(`${config.SEARCH_API_BASE_PATH}/search`, elasticSearch(router));
}
