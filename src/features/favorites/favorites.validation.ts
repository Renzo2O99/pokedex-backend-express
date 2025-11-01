// src/features/favorites/favorites.validation.ts

/**
 * @fileoverview Middlewares de validación para las rutas de favoritos usando express-validator.
 * @module features/favorites/favorites.validation
 */

import { body, param } from "express-validator";
import { handleInputErrors } from "../../core/middlewares/input-errors.middleware";
import { ERROR_MESSAGES } from "../../core/constants";

/**
 * @constant {Array<Function>} validateAddFavorite
 * @description Middleware de validación para la ruta de agregar favoritos.
 * Verifica que el campo `pokemonId` en el cuerpo de la solicitud sea un número entero mayor a 0.
 *
 * @example
 * // Uso en una ruta:
 * router.post('/favorites', validateAddFavorite, controller.addFavorite);
 */
export const validateAddFavorite = [
	body("pokemonId")
		.notEmpty()
		.withMessage(ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED)
		.isInt({ min: 1 })
		.withMessage(ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED),
	handleInputErrors,
];

/**
 * @constant {Array<Function>} validateFavoriteEntryId
 * @description Middleware de validación para la ruta de eliminar favoritos por su ID de entrada.
 * Verifica que el parámetro `id` en la URL sea un número entero mayor a 0.
 *
 * @example
 * // Uso en una ruta:
 * router.delete('/favorites/:id', validateFavoriteEntryId, controller.removeFavoriteById);
 */
export const validateFavoriteEntryId = [
	param("id").isInt({ min: 1 }).withMessage("El ID de la entrada de favorito debe ser un número."),
	handleInputErrors,
];
