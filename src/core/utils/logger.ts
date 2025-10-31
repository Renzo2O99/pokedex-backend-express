import chalk from "chalk";

export const logger = {
  log: (message: string) => console.log(chalk.white(message)),
  info: (message: string) => console.log(chalk.hex("#cb6b11ff").bold(message)),
  success: (message: string) => console.log(chalk.hex("#127a20ff").bold(message)),
  warn: (message: string) => console.log(chalk.yellow(message)),
  error: (message: string, error?: any) => {
    console.log(chalk.bold.red(message));
    if (error) {
      console.log(chalk.red(error));
    }
  },
  fatal: (error: Error) => {
    console.log(chalk.bgRed.white("FATAL ERROR"));
    console.log(chalk.red(error.stack));
    process.exit(1);
  },
  await: (message: string) => console.log(chalk.cyan(message)),
};
