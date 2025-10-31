// backend-express/src/core/constants.ts

/**
 * @fileoverview Constantes centralizadas de la aplicación.
 * @module core/constants
 * @description Define mensajes de error comunes, prefijos y otros valores fijos
 * para mantener la consistencia y facilitar el mantenimiento.
 */

/**
 * @constant AUTH_TOKEN_PREFIX
 * @description Prefijo estándar utilizado en los encabezados de autorización para tokens JWT.
 * @type {string}
 * @default "Bearer "
 */
export const AUTH_TOKEN_PREFIX: string = "Bearer ";

/**
 * @constant ERROR_MESSAGES
 * @description Colección de mensajes de error estandarizados.
 * @property {string} USERNAME_IN_USE - Mensaje para username duplicado.
 * @property {string} EMAIL_IN_USE - Mensaje para email duplicado.
 * @property {string} INVALID_CREDENTIALS - Mensaje para login fallido.
 * @property {string} INVALID_INPUT - Mensaje genérico para datos de entrada inválidos.
 * @property {string} USER_NOT_FOUND - Mensaje para usuario no encontrado.
 * @property {string} TOKEN_REQUIRED - Mensaje cuando falta el token JWT.
 * @property {string} TOKEN_INVALID_FORMAT - Mensaje para formato de token incorrecto.
 * @property {string} TOKEN_INVALID_OR_EXPIRED - Mensaje para token inválido o expirado.
 * @property {string} INTERNAL_SERVER_ERROR - Mensaje genérico para errores 500.
 * @property {string} RESOURCE_NOT_FOUND - Mensaje genérico para errores 404.
 * @property {string} CONFLICT - Mensaje genérico para errores 409.
 * @property {string} BAD_REQUEST - Mensaje genérico para errores 400.
 * @property {string} UNAUTHORIZED - Mensaje genérico para errores 401.
 */
export const ERROR_MESSAGES = {
  // Errores específicos de Auth
  USERNAME_IN_USE: "El nombre de usuario ya está en uso",
  EMAIL_IN_USE: "El email ya está en uso",
  INVALID_CREDENTIALS: "Credenciales inválidas",
  USER_NOT_FOUND: "Usuario no encontrado",
  PASSWORD_INCORRECT: "Contraseña incorrecta",

  // Errores de Tokens (Middleware)
  TOKEN_REQUIRED: "Acceso denegado. No se proveyó token.",
  TOKEN_INVALID_FORMAT: "Formato de token inválido.",
  TOKEN_INVALID_OR_EXPIRED: "Token inválido o expirado.",

  // Errores de Validación (express-validator)
  VALIDATION_USERNAME_REQUIRED: "El nombre de usuario es requerido.",
  VALIDATION_USERNAME_MIN_LENGTH: "El nombre de usuario debe tener al menos 3 caracteres.",
  VALIDATION_EMAIL_INVALID: "Debe ser un email válido.",
  VALIDATION_PASSWORD_MIN_LENGTH: "La contraseña debe tener al menos 6 caracteres.",
  VALIDATION_PASSWORD_REQUIRED: "La contraseña es requerida.",

  // Errores Genéricos (Clases de Error y Validación)
  INVALID_INPUT: "Datos de entrada inválidos",
  INTERNAL_SERVER_ERROR: "Error interno del servidor.",
  RESOURCE_NOT_FOUND: "Recurso no encontrado.",
  CONFLICT: "El recurso ya existe.",
  BAD_REQUEST: "Petición inválida.",
  UNAUTHORIZED: "No autorizado.",
  TOO_MANY_REQUESTS: "Demasiadas peticiones desde esta IP, por favor intente de nuevo después de un minuto.",
  VALIDATION_POKEMON_ID_REQUIRED: "El pokemonId es requerido y debe ser un número.",
  FAVORITE_ALREADY_EXISTS: "Este Pokémon ya está en tus favoritos.",
  FAVORITE_NOT_FOUND: "Este Pokémon no se encontró en tus favoritos.",
};

/**
 * @constant SUCCESS_MESSAGES
 * @description Colección de mensajes de éxito estandarizados.
 */
export const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: "Usuario registrado exitosamente",
  LOGIN_SUCCESS: "Login exitoso",
  FAVORITE_ADDED: "Pokémon añadido a favoritos.",
  FAVORITE_REMOVED: "Pokémon eliminado de favoritos.",
  FAVORITES_FETCHED: "Lista de Favoritos obtenida exitosamente."
};