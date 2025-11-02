// src/index.ts

/**
 * @fileoverview Archivo principal del servidor Express para la Pokédex API.
 * Configura middlewares, rutas y el manejo centralizado de errores.
 * @module index
 */

import "dotenv/config";
import "./core/config/env";
import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./core/config/swagger.config";
import { authRoutes } from "./features/auth/auth.routes";
import { favoritesRoutes } from "./features/favorites/favorites.routes";
import { historyRoutes } from "./features/search-history/search-history.routes";
import { customListsRoutes } from "./features/custom-lists/custom-lists.routes";
import { logger } from "./core/utils/logger";

import { requestLogger } from "./core/middlewares/request-logger";
import { errorHandler } from "./core/middlewares/error.middleware";
import { ENVIRONMENT_MESSAGES } from "./core/constants";

/**
 * @constant {express.Application} app - Instancia de la aplicación Express.
 */
const app = express();
/**
 * @constant {string | number} port - Puerto en el que el servidor escuchará. Por defecto es 4000.
 */
const port = process.env.PORT || 4000;

app.set("trust proxy", 1);

/**
 * @section Middlewares
 */
/**
 * @description Configura Helmet para la seguridad de las cabeceras HTTP, compatible con CORS.
 */
app.use(
	helmet({
		crossOriginEmbedderPolicy: false,
		crossOriginOpenerPolicy: false,
	}),
);
/**
 * @description Configura CORS para permitir solicitudes desde el frontend.
 */
app.use(
	cors({
		origin: "http://localhost:3000",
	}),
);
/**
 * @description Middleware para parsear el cuerpo de las solicitudes en formato JSON.
 */
app.use(express.json());
/**
 * @description Middleware para loguear todas las peticiones entrantes.
 */
if (process.env.NODE_ENV !== "production") {
  app.use(requestLogger);
}

/**
 * @section Rutas
 */
/**
 * @route GET /api
 * @description Ruta de prueba para verificar que el backend está funcionando.
 */
app.get("/api", (_req: Request, res: Response) => {
	res.json({ message: "¡El backend de Express está funcionando!" });
});
/**
 * @description Monta las rutas de autenticación bajo el prefijo /api/auth.
 */
app.use("/api/auth", authRoutes);
/**
 * @description Monta las rutas de favoritos bajo el prefijo /api/favorites.
 */
app.use("/api/favorites", favoritesRoutes);
/**
 * @description Monta las rutas del historial de búsqueda bajo el prefijo /api/search-history.
 */
app.use("/api/search-history", historyRoutes);
/**
 * @description Monta las rutas de listas personalizadas bajo el prefijo /api/lists.
 */
app.use("/api/lists", customListsRoutes);

/**
 * @section Documentación Swagger
 */
/**
 * @description Sirve la interfaz de usuario de Swagger en /api-docs.
 */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
/**
 * @route GET /api-docs.json
 * @description Sirve la especificación OpenAPI en formato JSON.
 */
app.get("/api-docs.json", (_req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.send(swaggerSpec);
});
logger.info(`Documentación Swagger disponible en http://localhost:${port}/api-docs`);

/**
 * @section Manejo de Errores
 * @description Middleware centralizado para el manejo de errores.
 */
app.use(errorHandler);

/**
 * @section Inicio del Servidor
 * @description Inicia el servidor Express y lo pone a escuchar en el puerto configurado.
 */
app.listen(port, () => {
	if (process.env.NODE_ENV === "production") {
		logger.info(ENVIRONMENT_MESSAGES.PRODUCTION);
	} else {
		logger.info(ENVIRONMENT_MESSAGES.DEVELOPMENT);
	}
	logger.success(`\nBackend Express escuchando en el puerto ${port} 🚀\n`);
});
