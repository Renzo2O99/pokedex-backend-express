// src/features/custom-lists/custom-lists.validation.ts

/**
 * @fileoverview Middlewares de validación para las rutas de listas personalizadas usando express-validator.
 * @module features/custom-lists/custom-lists.validation
 */

import { body, param } from "express-validator";
import { handleInputErrors } from "../../core/middlewares/input-errors.middleware";
import { ERROR_MESSAGES } from "../../core/constants";

/** Valida el cuerpo de la solicitud para crear una lista */
export const validateCreateList = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage(ERROR_MESSAGES.VALIDATION_LIST_NAME_REQUIRED)
		.isString()
		.withMessage(ERROR_MESSAGES.VALIDATION_LIST_NAME_REQUIRED),
	handleInputErrors,
];

/** Valida el ID de lista y el cuerpo para actualizar una lista */
export const validateUpdateList = [
	param("listId").isInt({ min: 1 }).withMessage(ERROR_MESSAGES.VALIDATION_LIST_ID_REQUIRED),
	body("name")
		.trim()
		.notEmpty()
		.withMessage(ERROR_MESSAGES.VALIDATION_LIST_NAME_REQUIRED)
		.isString()
		.withMessage(ERROR_MESSAGES.VALIDATION_LIST_NAME_REQUIRED),
	handleInputErrors,
];

/** Valida que el ID de lista sea un número entero positivo */
export const validateListIdParam = [
	param("listId").isInt({ min: 1 }).withMessage(ERROR_MESSAGES.VALIDATION_LIST_ID_REQUIRED),
	handleInputErrors,
];

/** Valida el ID de lista y el ID de Pokémon para añadir a una lista */
export const validateAddPokemon = [
	param("listId").isInt({ min: 1 }).withMessage(ERROR_MESSAGES.VALIDATION_LIST_ID_REQUIRED),
	body("pokemonId")
		.notEmpty()
		.withMessage(ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED)
		.isInt({ min: 1 })
		.withMessage(ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED),
	handleInputErrors,
];

/** Valida los IDs de lista y Pokémon para eliminar de una lista */
export const validateRemovePokemon = [
	param("listId").isInt({ min: 1 }).withMessage(ERROR_MESSAGES.VALIDATION_LIST_ID_REQUIRED),
	param("pokemonId").isInt({ min: 1 }).withMessage(ERROR_MESSAGES.VALIDATION_POKEMON_ID_REQUIRED),
	handleInputErrors,
];
