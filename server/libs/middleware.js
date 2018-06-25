import cors from "cors";

function middleware (app) {
  app.use(cors());
};

export default middleware;