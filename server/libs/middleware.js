import cors from "cors";
import logger from "./logger";

function middleware (app) {
  app.use(cors());
  app.use(logger)
};

export default middleware;