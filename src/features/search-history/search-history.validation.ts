// src/features/search-history/search-history.validation.ts

/**
 * @fileoverview Middlewares de validación para las rutas del historial de búsqueda usando express-validator.
 * @module features/search-history/search-history.validation
 */

import { body, param } from "express-validator";
import { handleInputErrors } from "../../core/middlewares/input-errors.middleware";
import { ERROR_MESSAGES } from "../../core/constants";

/**
 * @constant {Array<Function>} validateAddTerm
 * @description Middleware de validación para la ruta de añadir un término de búsqueda.
 * Verifica que el campo `searchTerm` en el cuerpo de la solicitud sea un string no vacío.
 */
export const validateAddTerm = [
	body("searchTerm")
		.trim()
		.notEmpty()
		.withMessage(ERROR_MESSAGES.VALIDATION_SEARCH_TERM_REQUIRED)
		.isString()
		.withMessage(ERROR_MESSAGES.VALIDATION_SEARCH_TERM_REQUIRED),
	handleInputErrors,
];

/**
 * @constant {Array<Function>} validateDeleteTerm
 * @description Middleware de validación para la ruta de eliminar un término de búsqueda.
 * Verifica que el parámetro `id` en la URL sea un número entero válido.
 */
export const validateDeleteTerm = [
	param("id").isInt({ min: 1 }).withMessage("El ID de la entrada debe ser un número válido."),
	handleInputErrors,
];
