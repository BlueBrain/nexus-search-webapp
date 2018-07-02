import cors from "cors";
import logger from "./logger";
import routes from "./routes";

function middleware (app) {
  logger(app);
  app.use(cors());
  routes(app);
};

export default middleware;