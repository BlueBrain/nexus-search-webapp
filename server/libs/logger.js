import morgan from "morgan";
import messages from "./messages";

function logger(tokens, req, res) {
  let statusString = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms"
  ].join(" ");

  if (res.statusCode < 400) {
    return messages.LOG_SUCCESS(statusString);
  } else if (res.statusCode >= 400 && res.statusCode < 500) {
    return messages.LOG_NOT_FOUND(statusString);
  } else if (res.statusCode >= 500) {
    return messages.LOG_SERVER_ERROR(statusString);
  }
}

function loggerMiddleware(app) {
  app.use(morgan(logger));
}

export default loggerMiddleware;
