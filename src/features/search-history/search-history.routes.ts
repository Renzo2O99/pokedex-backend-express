// src/features/search-history/search-history.routes.ts

/**
 * @fileoverview Rutas para la gestión del historial de búsqueda de los usuarios.
 * Proporciona endpoints para obtener, añadir y eliminar términos de búsqueda.
 * @module features/search-history/search-history.routes
 */

import { Router } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { SearchHistoryController } from "./search-history.controller";
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
 */
router.get(
  "/",
  authMiddleware,
  catchAsync(SearchHistoryController.handleGetHistory)
);

/**
 * @route POST /api/search-history
 * @description Añade un nuevo término de búsqueda al historial del usuario autenticado.
 * @access Private (requiere token)
 * @body {string} searchTerm - El término de búsqueda a añadir.
 */
router.post(
  "/",
  authMiddleware,
  validateAddTerm,
  catchAsync(SearchHistoryController.handleAddTerm)
);

/**
 * @route DELETE /api/search-history/:id
 * @description Elimina una entrada específica del historial de búsqueda del usuario autenticado.
 * @access Private (requiere token)
 * @param {number} id - El ID de la entrada del historial a eliminar.
 */
router.delete(
  "/:id",
  authMiddleware,
  validateDeleteTerm,
  catchAsync(SearchHistoryController.handleDeleteTerm)
);

/**
 * @exports historyRoutes
 * @description Exporta el enrutador configurado para ser usado en `index.ts`.
 */
export const historyRoutes = router;