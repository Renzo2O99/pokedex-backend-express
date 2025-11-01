// src/features/favorites/favorites.routes.ts

/**
 * @fileoverview Rutas para la gestión de Pokémon favoritos de los usuarios.
 * Proporciona endpoints para obtener, añadir y eliminar favoritos.
 * @module features/favorites/favorites.routes
 */

import { Router } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { FavoritesController } from "./favorites.controller";
import { authMiddleware } from "../../core/middlewares/auth.middleware";
import { validateAddFavorite, validateRemoveFavorite } from "./favorites.validation";

/**
 * @constant {Router} router - Instancia del enrutador de Express para las rutas de favoritos.
 */
const router = Router();

/**
 * @description Obtener todos los favoritos del usuario autenticado.
 * @route GET /api/favorites
 * @access Private (requiere token)
 */
router.get(
  "/",
  authMiddleware,
  catchAsync(FavoritesController.handleGetFavorites)
);

/**
 * @description Añadir un Pokémon a favoritos.
 * @route POST /api/favorites
 * @access Private (requiere token)
 * @body { "pokemonId": number }
 */
router.post(
  "/",
  authMiddleware,
  validateAddFavorite,
  catchAsync(FavoritesController.handleAddFavorite)
);

/**
 * @description Eliminar un Pokémon de favoritos.
 * @route DELETE /api/favorites/:pokemonId
 * @access Private (requiere token)
 */
router.delete(
  "/:pokemonId",
  authMiddleware,
  validateRemoveFavorite,
  catchAsync(FavoritesController.handleRemoveFavorite)
);

/**
 * @exports favoritesRoutes
 * @description Exporta el enrutador configurado para ser usado en `index.ts`.
 */
export const favoritesRoutes = router;