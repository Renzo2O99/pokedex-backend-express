// src/features/auth/auth.routes.ts
import { Router } from "express";
import { AuthController } from "./auth.controller";
import { catchAsync } from "../../core/utils/catchAsync";
import { authRateLimiter } from "../../core/middlewares/rate-limit.middleware";
import { validateRegister, validateLogin } from "./auth.middleware.validation"; 

/**
 * @constant {Router} router - Instancia del enrutador de Express para las rutas de autenticación.
 */
const router = Router();

/**
 * @description Registra un nuevo usuario.
 * @route POST /api/auth/register
 * @access Public
 * @param {string} path - Ruta del endpoint.
 * @param {Array<Function>} validateRegister - Middlewares de validación para el registro.
 * @param {Function} authRateLimiter - Middleware de limitación de peticiones.
 * @param {Function} handler - Controlador `AuthController.register`.
 */
router.post(
  "/register", 
  validateRegister, 
  authRateLimiter, 
  catchAsync(AuthController.register)
);

/**
 * @description Inicia sesión para un usuario existente.
 * @route POST /api/auth/login
 * @access Public
 * @param {string} path - Ruta del endpoint.
 * @param {Array<Function>} validateLogin - Middlewares de validación para el inicio de sesión.
 * @param {Function} authRateLimiter - Middleware de limitación de peticiones.
 * @param {Function} handler - Controlador `AuthController.login`.
 */
router.post(
  "/login", 
  validateLogin, 
  authRateLimiter, 
  catchAsync(AuthController.login)
);

/**
 * @exports authRoutes
 * @description Exporta el enrutador configurado para ser usado en `index.ts`.
 */
export const authRoutes = router;