// src/core/config/env.ts

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
const envSchema = z
	.object({
		/**
		 * @description URL de conexión a la base de datos de producción. Requerida si NODE_ENV no es "development".
		 * @example postgresql://user:password@prod-host:port/dbname?sslmode=require
		 */
		DATABASE_URL: z.string().optional(),

		/**
		 * @description URL de conexión a la base de datos de desarrollo. Requerida si NODE_ENV es "development".
		 * @example postgresql://user:password@dev-host:port/dbname?sslmode=require
		 */
		DEVELOPMENT_DATABASE_URL: z.string().optional(),

		/**
		 * @description Secreto utilizado para firmar y verificar los tokens JWT.
		 * Debe ser una cadena larga y aleatoria.
		 */
		JWT_SECRET: z.string().min(1, { message: "JWT_SECRET es requerida." }),

		/**
		 * @description Puerto en el que escuchará el servidor Express.
		 * @default "4000"
		 */
		PORT: z.string().optional().default("4000"),

		/**
		 * @description Entorno de ejecución de la aplicación.
		 * @default "development"
		 */
		NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	})
	.refine(
		(env) => {
			if (env.NODE_ENV === "development") {
				return !!env.DEVELOPMENT_DATABASE_URL;
			}
			return !!env.DATABASE_URL;
		},
		{
			message:
				"La variable de base de datos apropiada (DATABASE_URL o DEVELOPMENT_DATABASE_URL) no está configurada para el NODE_ENV actual.",
			path: ["DATABASE_URL", "DEVELOPMENT_DATABASE_URL"],
		},
	);

try {
	envSchema.parse(process.env);
	logger.info("Variables de entorno validadas correctamente.");
} catch (error) {
	if (error instanceof z.ZodError) {
		logger.fatal(
			new Error(`❌ Variables de entorno inválidas: ${JSON.stringify(error.flatten().fieldErrors, null, 2)}`),
		);
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
