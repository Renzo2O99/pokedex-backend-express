// src/features/search-history/search-history.routes.ts

/**
 * @fileoverview Rutas para la gestión del historial de búsqueda de los usuarios.
 * Proporciona endpoints para obtener, añadir y eliminar términos de búsqueda.
 * @module features/search-history/search-history.routes
 */

import { Router } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { getSearchHistory, addSearchTerm, deleteSearchTerm } from "./search-history.controller";
import { authMiddleware } from "../../core/middlewares/auth.middleware";
import { validateAddTerm, validateDeleteTerm } from "./search-history.validation";

/**
 * @constant {Router} router - Instancia del enrutador de Express para las rutas del historial de búsqueda.
 */
const router = Router();

/**
 * @route GET /api/search-history
 * @description Obtiene el historial de búsqueda del usuario autenticado.
 * @access Private (requiere token)
 * @throws {401} Unauthorized - Si el token no es válido.
 */
router.get("/", authMiddleware, catchAsync(getSearchHistory));

/**
 * @route POST /api/search-history
 * @description Añade un nuevo término de búsqueda al historial del usuario autenticado.
 * @access Private (requiere token)
 * @body {string} searchTerm - El término de búsqueda a añadir.
 * @throws {400} Bad Request - Si el "searchTerm" no es un string o está vacío.
 * @throws {401} Unauthorized - Si el token no es válido.
 */
router.post("/", authMiddleware, validateAddTerm, catchAsync(addSearchTerm));

/**
 * @route DELETE /api/search-history/:id
 * @description Elimina una entrada específica del historial de búsqueda del usuario autenticado.
 * @access Private (requiere token)
 * @param {number} id - El ID de la entrada del historial a eliminar.
 * @throws {400} Bad Request - Si el "id" no es un número.
 * @throws {401} Unauthorized - Si el token no es válido o el usuario no es el propietario de la entrada del historial.
 * @throws {404} Not Found - Si la entrada del historial no se encuentra.
 */
router.delete("/:id", authMiddleware, validateDeleteTerm, catchAsync(deleteSearchTerm));

/**
 * @exports historyRoutes
 * @description Exporta el enrutador configurado para ser usado en `index.ts`.
 */
export const historyRoutes = router;
