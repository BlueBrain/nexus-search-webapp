import morgan from "morgan";
import messages from "./messages";

export const resolveMessages = function (statusCode, messageString) {
  if (statusCode < 400) {
    return messages.LOG_SUCCESS(messageString);
  } else if (statusCode >= 400 && statusCode < 500) {
    return messages.LOG_NOT_FOUND(messageString);
  } else if (statusCode >= 500) {
    return messages.LOG_SERVER_ERROR(messageString);
  }
}

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

  return resolveMessages(req.statusCode, statusString);
}

function loggerMiddleware(app) {
  app.use(morgan(logger));
}

export default loggerMiddleware;
