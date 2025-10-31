import { body, param } from "express-validator";
import { handleInputErrors } from "../../core/middleware/input-errors.middleware";
import { ERROR_MESSAGES } from "../../core/constants";

/**
 * Valida que el `pokemonId` exista en el body y sea un número.
 */
export const validateAddFavorite = [
  body("pokemonId")
    .notEmpty().withMessage(ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED)
    .isInt({ min: 1 }).withMessage(ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED),
  handleInputErrors,
];

/**
 * Valida que el `pokemonId` exista en los params (URL) y sea un número.
 */
export const validateRemoveFavorite = [
  param("pokemonId")
    .isInt({ min: 1 }).withMessage(ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED),
  handleInputErrors,
];