
import morgan from "morgan";
import chalk from "chalk";

function logger (tokens, req, res) {
  let color, emoji;
  if (res.statusCode < 400 ) {
    emoji = '✅    ';
    color = chalk.green
  } else if (res.statusCode >= 400 && res.statusCode < 500) {
    emoji = '🚫    ';
    color = chalk.magentaBright
  } else if (res.statusCode >= 500) {
    emoji = '🔴    ';
    color = chalk.red
  }
  return color([
    emoji,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' '))
}


function loggerMiddleware (app) {
  app.use(morgan(logger));
};

export default loggerMiddleware;
