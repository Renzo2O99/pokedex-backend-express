// backend-express/src/swagger/index.swagger.ts

/**
 * @fileoverview Definición base de OpenAPI/Swagger para la API Pokédex.
 * @module swagger/index
 */

/**
 * @description Objeto base de configuración para Swagger JSDoc.
 * Define la información general de la API, servidores y esquemas de seguridad.
 */
export const swaggerDefinitionBase = {
  "openapi": "3.0.0",
  "info": {
    "title": "Pokédex API (Express Backend)",
    "version": "1.0.0",
    "description": "API para gestionar usuarios, Pokémon favoritos, historial y listas personalizadas.",
  },
  "servers": [
    {
      "url": `http://localhost:${process.env.PORT || 4000}/api`,
      "description": "Servidor de Desarrollo"
    }
  ],
  "tags": [
    {
      "name": "General",
      "description": "Rutas generales y de estado"
    },
    {
      "name": "Autenticación",
      "description": "Endpoints para registro y login de usuarios"
    },
    {
      "name": "Favoritos",
      "description": "Endpoints para gestionar los Pokémon favoritos del usuario."
    }
  ],
  /**
   * @property components
   * @description Define componentes reutilizables, como esquemas de seguridad.
   */
  "components": {
    /**
     * @property securitySchemes
     * @description Define cómo se maneja la autenticación. Usamos Bearer Token (JWT).
     */
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "Token JWT obtenido tras el login."
      }
    }
  },
};