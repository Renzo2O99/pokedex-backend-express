import chalk from "chalk";

export const getStatusCodeColor = (statusCode: number): string => {
  if (statusCode >= 200 && statusCode < 300) {
    return chalk.green(statusCode);
  }
  if (statusCode >= 300 && statusCode < 400) {
    return chalk.yellow(statusCode);
  }
  if (statusCode >= 400 && statusCode < 500) {
    return chalk.red(statusCode);
  }
  if (statusCode >= 500) {
    return chalk.red.bold(statusCode);
  }
  return chalk.gray(statusCode);
};
