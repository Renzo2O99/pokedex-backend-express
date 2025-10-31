// backend-express/src/core/db/migrate.ts
import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { logger } from "../utils/logger";

const runMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    logger.fatal(new Error("DATABASE_URL no está definida en .env"));
    throw new Error("DATABASE_URL is not defined");
  }

  // Usamos logger.await para indicar que un proceso está en curso
  logger.await("Iniciando migración...");

  // Conexión especial para la migración
  const migrationClient = postgres(process.env.DATABASE_URL, {
    "ssl": "require",
    "max": 1,
  });

  const db = drizzle(migrationClient);

  await migrate(db, { "migrationsFolder": "drizzle" });

  // Usamos logger.success para indicar que un proceso ha terminado correctamente
  logger.success("¡Migración completada exitosamente!");
  await migrationClient.end();
  process.exit(0);
};

runMigrate().catch(err => {
  // Usamos logger.error para mostrar el error de forma clara
  logger.error("Error durante la migración:", err);
  process.exit(1);
});
