// backend-express/src/swagger/auth.swagger.ts

/**
 * @fileoverview Definiciones de rutas OpenAPI/Swagger para la feature de Autenticación.
 * @module swagger/auth
 */

/**
 * @description Objeto que define las rutas y operaciones para la autenticación.
 */
export const authPaths = {
  "/auth/register": {
    "post": {
      "summary": "Registrar un nuevo usuario.",
      "description": "Crea una nueva cuenta de usuario con username, email y password.",
      "tags": ["Autenticación"],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": ["username", "email", "password"],
              "properties": {
                "username": {
                  "type": "string",
                  "description": "Nombre de usuario único.",
                  "example": "pikachu123"
                },
                "email": {
                  "type": "string",
                  "format": "email",
                  "description": "Correo electrónico único.",
                  "example": "ash@pokemon.com"
                },
                "password": {
                  "type": "string",
                  "format": "password",
                  "description": "Contraseña (mínimo 6 caracteres).",
                  "example": "pikachu123"
                }
              }
            }
          }
        }
      },
      "responses": {
        "201": {
          "description": "Usuario registrado exitosamente.",
           "content": {
             "application/json": {
               "schema": {
                 "type": "object",
                 "properties": {
                    "message": {"type": "string"},
                    "user": {
                        "type": "object",
                       "properties": {
                          "id": {"type": "integer"},
                          "username": {"type": "string"},
                          "email": {"type": "string"}
                       }
                    }
                 }
               }
             }
           }
        },
        "400": { "description": "Datos de entrada inválidos (ej. email no válido, contraseña corta)." },
        "409": { "description": "Conflicto (el username o email ya existen)." },
        "429": { "description": "Demasiadas peticiones (Rate Limit)." },
        "500": { "description": "Error interno del servidor." }
      }
    }
  },
  "/auth/login": {
    "post": {
      "summary": "Iniciar sesión.",
      "description": "Autentica a un usuario con email y password, devuelve un token JWT.",
      "tags": ["Autenticación"],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "required": ["email", "password"],
              "properties": {
                "email": {
                  "type": "string",
                  "format": "email",
                  "example": "ash@pokemon.com"
                },
                "password": {
                  "type": "string",
                  "format": "password",
                  "example": "contraseñaSegura123"
                }
              }
            }
          }
        }
      },
      "responses": {
        "200": {
          "description": "Login exitoso.",
          "content": {
            "application/json": {
              "schema": {
                 "type": "object",
                 "properties": {
                    "message": {"type": "string"},
                    "data": {
                       "type": "object",
                       "properties": {
                          "token": {"type": "string", "description": "Token JWT"},
                          "user": {
                            "type": "object",
                            "properties": {
                              "id": {"type": "integer"},
                              "username": {"type": "string"},
                              "email": {"type": "string"}
                            }
                          }
                       }
                    }
                 }
              }
            }
          }
        },
        "400": { "description": "Datos de entrada inválidos." },
        "401": { "description": "Credenciales inválidas." },
        "429": { "description": "Demasiadas peticiones (Rate Limit)." },
        "500": { "description": "Error interno del servidor." }
      }
    }
  }
};