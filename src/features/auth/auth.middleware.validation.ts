// src/features/auth/auth.middleware.validation.ts
import { body } from "express-validator";
import { handleInputErrors } from "../../core/middlewares/input-errors.middleware";
import { ERROR_MESSAGES } from "../../core/constants";

/**
 * @fileoverview Middlewares de validación para las rutas de autenticación usando express-validator.
 * @module features/auth/auth.middleware.validation
 */

/**
 * @description Array de middlewares para validar los datos del body en la ruta de registro (`POST /api/auth/register`).
 * Verifica `username`, `email` y `password`. Termina con `handleInputErrors`.
 * @type {Array<Function>}
 */
export const validateRegister = [
  body("username")
    .trim()
    .notEmpty().withMessage(ERROR_MESSAGES.VALIDATION_USERNAME_REQUIRED)
    .isLength({ min: 3 }).withMessage(ERROR_MESSAGES.VALIDATION_USERNAME_MIN_LENGTH),
    
  body("email")
    .trim()
    .isEmail().withMessage(ERROR_MESSAGES.VALIDATION_EMAIL_INVALID),
    
  body("password")
    .isLength({ min: 6 }).withMessage(ERROR_MESSAGES.VALIDATION_PASSWORD_MIN_LENGTH),
  
  handleInputErrors, 
];

/**
 * @description Array de middlewares para validar los datos del body en la ruta de login (`POST /api/auth/login`).
 * Verifica `email` y `password`. Termina con `handleInputErrors`.
 * @type {Array<Function>}
 */
export const validateLogin = [
  body("email")
    .trim()
    .isEmail().withMessage(ERROR_MESSAGES.VALIDATION_EMAIL_INVALID),
    
  body("password")
    .notEmpty().withMessage(ERROR_MESSAGES.VALIDATION_PASSWORD_REQUIRED),

  handleInputErrors,
];
