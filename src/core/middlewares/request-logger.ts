// src/core/middlewares/request-logger.ts
import { NextFunction, Request, Response } from "express";
import chalk from "chalk";
import { getStatusCodeColor } from "../utils/status-code-colors";
import { getCurrentTimestamp } from "../utils/get-current-timestamp";
import { logger } from "../utils/logger";
import { getMethodColor } from "../utils/request-method-colors";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    const statusCode = res.statusCode;
    logger.info(`[${getCurrentTimestamp()}] ${getStatusCodeColor(statusCode)} ${getMethodColor(req.method)} ${chalk.gray(req.url)}`);
  });
  next();
};
