// backend-express/src/core/db/index.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { logger } from "../utils/logger";

if (!process.env.DATABASE_URL) {
  logger.fatal(new Error("DATABASE_URL no está definida en .env"));
  throw new Error("DATABASE_URL is not defined");
}

const client = postgres(process.env.DATABASE_URL, { "ssl": "require" });

// Exportamos el cliente "db" con el esquema completo
export const db = drizzle(client, { "schema": schema });