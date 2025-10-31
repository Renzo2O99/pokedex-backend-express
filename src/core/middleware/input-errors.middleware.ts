// backend-express/src/core/middleware/input-errors.middleware.ts
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ERROR_MESSAGES } from "../constants"; // Importa tus constantes

/**
 * @fileoverview Middleware para manejar los errores de validación de express-validator.
 * @module core/middleware/input-errors
 */

/**
 * @function handleInputErrors
 * @description Middleware que verifica si express-validator encontró errores.
 * Si hay errores, responde con un estado 400 y los errores formateados.
 * Si no hay errores, pasa el control al siguiente middleware.
 * @param {Request} req - El objeto de solicitud de Express.
 * @param {Response} res - El objeto de respuesta de Express.
 * @param {NextFunction} next - La función para pasar al siguiente middleware.
 */
export const handleInputErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().reduce((acc, error) => {
      if (error.type === "field") {
        if (!acc[error.path]) {
          acc[error.path] = [];
        }
        acc[error.path].push(error.msg);
      }
      return acc;
    }, {} as Record<string, string[]>);

    res.status(400).json({
      "message": ERROR_MESSAGES.INVALID_INPUT,
      "errors": formattedErrors
    });
    return;
  }

  // Si no hay errores, continúa
  next();
};
