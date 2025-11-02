// src/core/utils/logger.ts

/**
 * @fileoverview Utilidad de registro (logging) para la aplicación, utilizando `chalk` para una salida coloreada en la consola.
 * Proporciona métodos para diferentes niveles de registro como información, éxito, advertencia, error y fatal.
 * Los logs no críticos (log, info, success, warn, await) se desactivan en producción para mejorar el rendimiento.
 * Los errores siempre se registran, independientemente del entorno.
 * @module core/utils/logger
 */

import chalk from "chalk";

// Comprueba el entorno UNA SOLA VEZ al iniciar
const isProduction = process.env.NODE_ENV === "production";

// Función vacía que no hace nada, usada para desactivar logs en producción
const noOp = () => {};

/**
 * @constant {object} logger - Objeto que contiene métodos para registrar mensajes en la consola con diferentes niveles de severidad y colores.
 * Los métodos no críticos (log, info, success, warn, await) están desactivados en producción.
 */
export const logger = {
	/**
	 * @method log
	 * @description Registra un mensaje general en blanco (solo en desarrollo).
	 * @param {string} message - El mensaje a registrar.
	 */
	log: isProduction ? noOp : (message: string) => console.log(chalk.white(message)),
	
	/**
	 * @method info
	 * @description Registra un mensaje informativo en color naranja/marrón (solo en desarrollo).
	 * @param {string} message - El mensaje a registrar.
	 */
	info: isProduction ? noOp : (message: string) => console.log(chalk.hex("#cb6b11ff").bold(message)),
	
	/**
	 * @method success
	 * @description Registra un mensaje de éxito en color verde (solo en desarrollo).
	 * @param {string} message - El mensaje a registrar.
	 */
	success: isProduction ? noOp : (message: string) => console.log(chalk.hex("#127a20ff").bold(message)),
	
	/**
	 * @method warn
	 * @description Registra un mensaje de advertencia en color amarillo (solo en desarrollo).
	 * @param {string} message - El mensaje a registrar.
	 */
	warn: isProduction ? noOp : (message: string) => console.log(chalk.yellow(message)),
	
	/**
	 * @method await
	 * @description Registra un mensaje de estado "esperando" en color cian (solo en desarrollo).
	 * @param {string} message - El mensaje a registrar.
	 */
	await: isProduction ? noOp : (message: string) => console.log(chalk.cyan(message)),
	
	/**
	 * @method error
	 * @description Registra un mensaje de error en color rojo. Opcionalmente, puede incluir un objeto de error.
	 * Este método SIEMPRE registra, incluso en producción.
	 * @param {string} message - El mensaje de error a registrar.
	 * @param {unknown} [error] - Objeto de error adicional para registrar.
	 */
	error: (message: string, error?: unknown) => {
		console.log(chalk.bold.red(message));
		if (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			console.log(chalk.red(errorMessage));
		}
	},
	
	/**
	 * @method fatal
	 * @description Registra un error fatal en un recuadro rojo y termina el proceso de la aplicación.
	 * Este método SIEMPRE registra, incluso en producción.
	 * @param {Error} error - El objeto de error fatal a registrar.
	 */
	fatal: (error: Error) => {
		console.log(chalk.bgRed.white("FATAL ERROR"));
		console.log(chalk.red(error.stack));
		process.exit(1);
	},
};
