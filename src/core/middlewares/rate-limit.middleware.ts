// backend-express/src/core/middlewares/rate-limit.middleware.ts
import rateLimit from "express-rate-limit";
import { ERROR_MESSAGES } from "../constants"; // Importa tus constantes

/**
 * @fileoverview Middleware para la limitación de peticiones (rate limiting).
 * @module core/middleware/rate-limit
 */

/**
 * @description Middleware para limitar la cantidad de peticiones a los endpoints de autenticación.
 * Limita a 5 peticiones cada minuto por IP para ayudar a prevenir ataques de fuerza bruta.
 */
export const authRateLimiter = rateLimit({
  /**
   * @property {number} windowMs - La ventana de tiempo en milisegundos durante la cual se cuentan las peticiones. (60 * 1000 ms = 1 minuto)
   */
  windowMs: 60 * 1000,

  /**
   * @property {number} max - El número máximo de peticiones permitidas por IP durante la ventana de tiempo.
   */
  max: 5,

  /**
   * @property {object} message - El mensaje de error que se enviará cuando se exceda el límite.
   */
  message: {
    "status": "error",
    "message": ERROR_MESSAGES.TOO_MANY_REQUESTS,
  },
  /**
   * @property {boolean} headers - Si se deben incluir las cabeceras `RateLimit-*` en la respuesta.
   */
  standardHeaders: true, // Envía las cabeceras estándar `RateLimit-*`
  legacyHeaders: false, // Deshabilita las cabeceras antiguas `X-RateLimit-*`
});

// Puedes añadir otros limitadores aquí si necesitas diferentes reglas para otras rutas
// export const generalRateLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 100 });
