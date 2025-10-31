// backend-express/src/core/middlewares/error.middleware.ts
// backend-express/src/core/middleware/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { GeneralError } from "../utils/errors";

import { logger } from "../utils/logger";

/**
 * @fileoverview Middleware para el manejo centralizado de errores.
 * @module core/middleware/error
 */

/**
 * @function errorHandler
 * @description Middleware de manejo de errores centralizado.
 * Captura todos los errores pasados por `next(error)`.
 * Si el error es una instancia de `GeneralError`, utiliza su `statusCode` y mensaje.
 * De lo contrario, loguea el error completo y responde con un error 500 genérico.
 * @param {Error} error - El objeto de error capturado.
 * @param {Request} req - El objeto de solicitud de Express.
 * @param {Response} res - El objeto de respuesta de Express.
 * @param {NextFunction} next - La función para pasar al siguiente middleware (requerida por Express para identificarlo como manejador de errores).
 * @returns {void} - No devuelve valor, envía la respuesta HTTP directamente.
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof GeneralError) {
    logger.warn(`Error controlado [${error.statusCode}]: ${error.message} (Ruta: ${req.method} ${req.originalUrl})`);
    res.status(error.statusCode).json({
      "status": "error",
      "message": error.message,
    });
    return;
  }
  logger.error(`Error no controlado en ${req.method} ${req.originalUrl}:`, error);
  // En producción, podrías querer loguear menos detalles o enviar a un servicio de monitoreo

  res.status(500).json({
    "status": "error",
    "message": "Error interno del servidor.", // Usar constante aquí también sería bueno
  });
};