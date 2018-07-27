import cors from "cors";
import logger from "./logger";
import routes from "./routes";
import express from "express";
import config from "./config";

function middleware (app) {
  logger(app);
  app.use(cors());
  app.use("/search/data", express.static(config.STATIC_DATA_FOLDER));
  routes(app);
};

export default middleware;