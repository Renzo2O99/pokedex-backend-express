// backend-express/drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL no está definido en el archivo .env");
}

export default defineConfig({
  schema: "./src/core/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
    dbCredentials: {
    url: process.env.NEON_DATABASE_URL!,
  },
});