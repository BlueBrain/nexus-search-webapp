
import express from "express";
import elasticSearch from "./elastic-search";

const router = express.Router();

export default function generateRoutes(app) {
  app.use('/', router.get('/', (req, res) => res.send(200)));
  app.use('/search', elasticSearch(router));
}
