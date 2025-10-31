import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { logger } from "../utils/logger";

const isDevelopment = process.env.NODE_ENV === "development";
const connectionString = isDevelopment
  ? process.env.DEVELOPMENT_DATABASE_URL
  : process.env.DATABASE_URL;

if (!connectionString) {
  const varName = isDevelopment ? "DEVELOPMENT_DATABASE_URL" : "DATABASE_URL";
  logger.fatal(new Error(`${varName} no está definida en .env`));
  throw new Error(`${varName} is not defined`);
}

const client = postgres(connectionString, { "ssl": "require" });

// Exportamos el cliente "db" con el esquema completo
export const db = drizzle(client, { "schema": schema });