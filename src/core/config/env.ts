// backend-express/src/core/config/env.ts
import { z } from "zod";
import { logger } from "../utils/logger";

/**
 * @fileoverview Configuración y validación de variables de entorno.
 * @module core/config/env
 * @description Utiliza Zod para definir y validar las variables de entorno requeridas
 * al iniciar la aplicación. Si alguna variable falta o es inválida,
 * la aplicación terminará con un error claro.
 * También extiende NodeJS.ProcessEnv para tipado global.
 */

const envSchema = z.object({
  /**
   * @description URL de conexión a la base de datos Neon.
   * @example postgresql://user:password@host:port/dbname?sslmode=require
   */
  DATABASE_URL: z.string().min(1, { "message": "DATABASE_URL es requerida." }),

  /**
   * @description Secreto utilizado para firmar y verificar los tokens JWT.
   * Debe ser una cadena larga y aleatoria.
   */
  JWT_SECRET: z.string().min(1, { "message": "JWT_SECRET es requerida." }),

  /**
   * @description Puerto en el que escuchará el servidor Express.
   * @default "4000"
   */
  PORT: z.string().optional().default("3001"),

  /**
   * @description Entorno de ejecución de la aplicación.
   * @default "development"
   */
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

try {
  envSchema.parse(process.env);
  logger.info("Variables de entorno validadas correctamente.");
} catch (error) {
  if (error instanceof z.ZodError) {
    logger.fatal(new Error(`❌ Variables de entorno inválidas: ${JSON.stringify(error.flatten().fieldErrors, null, 2)}`));
  } else {
    logger.fatal(new Error(`❌ Error inesperado validando variables de entorno: ${error}`));
  }
  process.exit(1);
}

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}