import { body, param } from "express-validator";
import { handleInputErrors } from "../../core/middleware/input-errors.middleware";
import { ERROR_MESSAGES } from "../../core/constants";

export const validateAddTerm = [
  body("searchTerm")
    .trim()
    .notEmpty().withMessage(ERROR_MESSAGES.VALIDATION_SEARCH_TERM_REQUIRED)
    .isString().withMessage(ERROR_MESSAGES.VALIDATION_SEARCH_TERM_REQUIRED),
  handleInputErrors,
];

export const validateDeleteTerm = [
  param("id")
    .isInt({ min: 1 }).withMessage("El ID de la entrada debe ser un número válido."),
  handleInputErrors,
];