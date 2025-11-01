// src/features/favorites/favorites.routes.ts

/**
 * @fileoverview Rutas para la gestión de Pokémon favoritos de los usuarios.
 * Proporciona endpoints para obtener, añadir y eliminar favoritos.
 * @module features/favorites/favorites.routes
 */

import { Router } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { getFavorites, addFavorite, removeFavoriteById } from "./favorites.controller";
import { authMiddleware } from "../../core/middlewares/auth.middleware";
import { validateAddFavorite, validateFavoriteEntryId } from "./favorites.validation";

/**
 * @constant {Router} router - Instancia del enrutador de Express para las rutas de favoritos.
 */
const router = Router();

/**
 * @description Obtener todos los favoritos del usuario autenticado.
 * @route GET /api/favorites
 * @access Private (requiere token)
 * @throws {401} Unauthorized - Si el token no es válido.
 */
router.get("", authMiddleware, catchAsync(getFavorites));

/**
 * @description Añadir un Pokémon a favoritos.
 * @route POST /api/favorites
 * @access Private (requiere token)
 * @body { "pokemonId": number }
 * @throws {400} Bad Request - Si el \"pokemonId\" no es un número.
 * @throws {401} Unauthorized - Si el token no es válido.
 * @throws {409} Conflict - Si el Pokémon ya está en la lista de favoritos.
 */
router.post("", authMiddleware, validateAddFavorite, catchAsync(addFavorite));

/**
 * @description Eliminar una entrada de favorito por su ID único.
 * @route DELETE /api/favorites/:id
 * @access Private (requiere token)
 * @throws {400} Bad Request - Si el "id" no es un número.
 * @throws {401} Unauthorized - Si el token no es válido o el usuario no es el propietario del favorito.
 * @throws {404} Not Found - Si el favorito no se encuentra.
 */
router.delete("/:id", authMiddleware, validateFavoriteEntryId, catchAsync(removeFavoriteById));

/**
 * @exports favoritesRoutes
 * @description Exporta el enrutador configurado para ser usado en `index.ts`.
 */
export const favoritesRoutes = router;
