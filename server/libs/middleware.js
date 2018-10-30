import cors from "cors";
import logger from "./logger";
import routes from "./routes";
import ws from "express-ws";
function middleware (app) {
  logger(app);
  app.use(cors());
  ws(app);
  routes(app);
};

export default middleware;