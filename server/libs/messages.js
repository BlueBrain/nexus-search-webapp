import chalk from "chalk";
import boxen from "boxen";

export default {
  SERVER_STARTING: port =>
    console.log(
      boxen(chalk.blue(`Search Service running on port: ${port}`), {
        padding: 1
      })
    ),
  CONFIGURED_WITH: config =>
    console.log("\n✏️   App Configured With: \n", config),
  LOG_SUCCESS: statusString => chalk.green(
    '✅    ' + statusString
  ),
  LOG_NOT_FOUND: statusString => chalk.magentaBright(
    '🚫    ' + statusString
  ),
  LOG_SERVER_ERROR: statusString => chalk.red(
    '🔴    ' + statusString
  ),
};
