import chalk from "chalk";

export const getMethodColor = (method: string): string => {
  switch (method.toUpperCase()) {
    case "GET":
      return chalk.hex("#1b970bff")(method);
    case "POST":
      return chalk.hex("#d1b921ff")(method);
    case "PUT":
      return chalk.hex("#082fb2ff")(method);
    case "PATCH":
      return chalk.hex("#5b3be9ff")(method);
    case "DELETE":
      return chalk.hex("#e51818ff")(method);
    default:
      return chalk.gray(method);
  }
};
