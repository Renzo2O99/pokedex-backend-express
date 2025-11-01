// src/features/auth/auth.routes.ts
import { Router } from "express";
import { registerUser, loginUser, getCurrentUser, changeUserPassword } from "./auth.controller";
import { catchAsync } from "../../core/utils/catchAsync";
import { authRateLimiter } from "../../core/middlewares/rate-limit.middleware";
import { validateRegister, validateLogin, validateChangePassword } from "./auth.middleware.validation";
import { authMiddleware } from "../../core/middlewares/auth.middleware";

/**
 * @constant {Router} router - Instancia del enrutador de Express para las rutas de autenticación.
 */
const router = Router();

// --- Rutas Públicas ---

/**
 * @description Registra un nuevo usuario.
 * @route POST /api/auth/register
 * @access Public
 * @param {string} path - Ruta del endpoint.
 * @param {Array<Function>} validateRegister - Middlewares de validación para el registro.
 * @param {Function} authRateLimiter - Middleware de limitación de peticiones.
 * @param {Function} handler - Controlador `AuthController.register`.
 * @throws {400} Bad Request - Si los datos de entrada son inválidos (username, email, password).
 * @throws {409} Conflict - Si el nombre de usuario o el email ya están en uso.
 */
router.post("/register", validateRegister, authRateLimiter, catchAsync(registerUser));

/**
 * @description Inicia sesión para un usuario existente.
 * @route POST /api/auth/login
 * @access Public
 * @param {string} path - Ruta del endpoint.
 * @param {Array<Function>} validateLogin - Middlewares de validación para el inicio de sesión.
 * @param {Function} authRateLimiter - Middleware de limitación de peticiones.
 * @param {Function} handler - Controlador `AuthController.login`.
 * @throws {400} Bad Request - Si los datos de entrada son inválidos (email, password).
 * @throws {401} Unauthorized - Si las credenciales son inválidas.
 */
router.post("/login", validateLogin, authRateLimiter, catchAsync(loginUser));

// --- Rutas Privadas (Gestión de Perfil) ---

/**
 * @description Obtiene el perfil del usuario autenticado.
 * @route GET /api/auth/me
 * @access Private
 * @throws {401} Unauthorized - Si el token no es válido o el usuario no existe.
 */
router.get("/me", authMiddleware, catchAsync(getCurrentUser));

/**
 * @description Cambia la contraseña del usuario autenticado.
 * @route PUT /api/auth/password
 * @access Private
 * @throws {400} Bad Request - Si los datos de entrada son inválidos (oldPassword, newPassword).
 * @throws {401} Unauthorized - Si la contraseña antigua es incorrecta o el usuario no existe.
 */
router.put("/password", authMiddleware, validateChangePassword, catchAsync(changeUserPassword));

/**
 * @exports authRoutes
 * @description Exporta el enrutador configurado para ser usado en `index.ts`.
 */
export const authRoutes = router;
