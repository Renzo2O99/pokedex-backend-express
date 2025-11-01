// src/core/utils/status-code-colors.ts

/**
 * @fileoverview Utilidad para obtener un color de `chalk` basado en el código de estado HTTP.
 * @module core/utils/status-code-colors
 */

import chalk from "chalk";

/**
 * @function getStatusCodeColor
 * @description Devuelve una cadena de texto con el código de estado HTTP coloreado según su rango.
 *   - 2xx (Éxito): Verde
 *   - 3xx (Redirección): Amarillo
 *   - 4xx (Error del cliente): Rojo
 *   - 5xx (Error del servidor): Rojo en negrita
 *   - Otros: Gris
 * @param {number} statusCode - El código de estado HTTP.
 * @returns {string} El código de estado HTTP coloreado.
 */
export const getStatusCodeColor = (statusCode: number): string => {
	if (statusCode >= 200 && statusCode < 300) {
		return chalk.green(statusCode);
	}
	if (statusCode >= 300 && statusCode < 400) {
		return chalk.yellow(statusCode);
	}
	if (statusCode >= 400 && statusCode < 500) {
		return chalk.red(statusCode);
	}
	if (statusCode >= 500) {
		return chalk.red.bold(statusCode);
	}
	return chalk.gray(statusCode);
};
