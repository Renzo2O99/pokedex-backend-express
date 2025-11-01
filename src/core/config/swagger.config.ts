// src/core/config/swagger.config.ts

import swaggerJSDoc from "swagger-jsdoc";
import { swaggerDefinitionBase } from "../../swagger/index.swagger";
import { authPaths } from "../../swagger/auth.swagger";
import { favoritesPaths } from "../../swagger/favorites.swagger";
import { historyPaths } from "../../swagger/history.swagger";
import { customListsPaths } from "../../swagger/custom-lists.swagger";

/**
 * @fileoverview Configuración para generar la especificación OpenAPI usando swagger-jsdoc.
 * @module core/config/swagger
 */

/**
 * @description Combina la definición base con las rutas de las features.
 * @property {object} paths - Objeto que contiene todas las definiciones de rutas de la API.
 */
const swaggerDefinition = {
  ...swaggerDefinitionBase,
  paths: {
    ...authPaths,
    ...favoritesPaths,
    ...historyPaths,
    ...customListsPaths,
  },
};

/**
 * @description Opciones para swaggerJSDoc.
 * @property {object} swaggerDefinition - La definición completa de la API.
 * @property {string[]} apis - Rutas a los archivos que contienen anotaciones (no las usamos aquí).
 */
const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: [],
};

/**
 * @description La especificación OpenAPI completa generada.
 * Se usa con swagger-ui-express para mostrar la documentación interactiva.
 */
export const swaggerSpec = swaggerJSDoc(options);
