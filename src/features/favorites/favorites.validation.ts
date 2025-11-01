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
    .notEmpty().withMessage(ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED)
    .isInt({ min: 1 }).withMessage(ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED),
  handleInputErrors,
];

/**
 * @constant {Array<Function>} validateRemoveFavorite
 * @description Middleware de validación para la ruta de eliminar favoritos.
 * Verifica que el parámetro `pokemonId` en la URL sea un número entero mayor a 0.
 * 
 * @example
 * // Uso en una ruta:
 * router.delete('/favorites/:pokemonId', validateRemoveFavorite, controller.removeFavorite);
 */
export const validateRemoveFavorite = [
  param("pokemonId")
    .isInt({ min: 1 }).withMessage(ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED),
  handleInputErrors,
];