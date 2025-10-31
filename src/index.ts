import "dotenv/config";
import "./core/config/env";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./core/config/swagger.config";
import { authRoutes } from "./features/auth/auth.routes";
import { favoritesRoutes } from "./features/favorites/favorites.routes";
import { historyRoutes } from "./features/search-history/search-history.routes";
import { logger } from "./core/utils/logger";
import chalk from "chalk";

import { requestLogger } from "./core/middlewares/request-logger";
import { errorHandler } from "./core/middlewares/error.middleware";
import { ENVIRONMENT_MESSAGES } from "./core/constants";

const app = express();
const port = process.env.PORT || 4000;

app.set("trust proxy", 1);

//? --- Middlewares ---
app.use(cors({
  "origin": "http://localhost:3000"
}));
app.use(express.json());
//* Middleware para loguear todas las peticiones
app.use(requestLogger);

//? --- Rutas ---
app.get("/api", (req: Request, res: Response) => {
  res.json({ "message": "¡El backend de Express está funcionando!" });
});
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/search-history", historyRoutes);

// --- Ruta para Documentación Swagger ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});
logger.info(`Documentación Swagger disponible en http://localhost:${port}/api-docs`);

//! --- Middleware de Error ---
app.use(errorHandler);

//? --- Iniciar Servidor ---
app.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    logger.info(ENVIRONMENT_MESSAGES.PRODUCTION);
  } else {
    logger.info(ENVIRONMENT_MESSAGES.DEVELOPMENT);
  }
  logger.success(`\nBackend Express escuchando en el puerto ${port} 🚀\n`);
});