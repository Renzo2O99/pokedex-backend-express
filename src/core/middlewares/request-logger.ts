// src/core/middlewares/request-logger.ts

/**
 * @fileoverview Middleware para registrar información sobre las solicitudes HTTP entrantes.
 * Utiliza `chalk` para colorear la salida de la consola y mejorar la legibilidad.
 * @module core/middlewares/request-logger
 */

import { NextFunction, Request, Response } from "express";
import chalk from "chalk";
import { getStatusCodeColor } from "../utils/status-code-colors";
import { getCurrentTimestamp } from "../utils/get-current-timestamp";
import { logger } from "../utils/logger";
import { getMethodColor } from "../utils/request-method-colors";

/**
 * @function requestLogger
 * @description Middleware que registra detalles de cada solicitud HTTP al finalizar la respuesta.
 * Incluye la marca de tiempo, el código de estado (coloreado), el método HTTP (coloreado) y la URL.
 * @param {Request} req - El objeto de solicitud de Express.
 * @param {Response} res - El objeto de respuesta de Express.
 * @param {NextFunction} next - La función para pasar al siguiente middleware.
 * @returns {void}
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    const statusCode = res.statusCode;
    logger.info(`[${getCurrentTimestamp()}] ${getStatusCodeColor(statusCode)} ${getMethodColor(req.method)} ${chalk.gray(req.url)}`);
  });
  next();
};
