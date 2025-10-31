import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { logger } from "../utils/logger";

const isDevelopment = process.env.NODE_ENV === "development";
const devUrl = process.env.DEVELOPMENT_DATABASE_URL;
const prodUrl = process.env.DATABASE_URL;

let connectionString: string;

if (isDevelopment) {
  if (!devUrl) throw new Error("DEVELOPMENT_DATABASE_URL no está definida en .env");
  connectionString = devUrl;
  logger.info("Modo [Desarrollo] - Conectando a la base de datos de desarrollo para migración.");
} else {
  if (!prodUrl) throw new Error("DATABASE_URL no está definida en .env para producción");
  connectionString = prodUrl;
  logger.warn("Modo [Producción] - Conectando a la base de datos de PRODUCCIÓN para migración.");
}

const runMigrate = async () => {
  logger.await("Iniciando migración...");

  const migrationClient = postgres(connectionString, {
    "ssl": "require",
    "max": 1,
  });

  const db = drizzle(migrationClient);

  await migrate(db, { "migrationsFolder": "drizzle" });

  logger.success("¡Migración completada exitosamente!");
  await migrationClient.end();
  process.exit(0);
};

runMigrate().catch(err => {
  logger.error("Error durante la migración:", err);
  process.exit(1);
});
