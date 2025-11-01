// src/core/utils/request-method-colors.ts

/**
 * @fileoverview Utilidad para obtener un color de `chalk` basado en el método de la solicitud HTTP.
 * @module core/utils/request-method-colors
 */

import chalk from "chalk";

/**
 * @function getMethodColor
 * @description Devuelve una cadena de texto con el método HTTP coloreado según su tipo.
 * @param {string} method - El método HTTP (ej. "GET", "POST", "PUT", "DELETE").
 * @returns {string} El método HTTP coloreado.
 */
export const getMethodColor = (method: string): string => {
	switch (method.toUpperCase()) {
		case "GET":
			return chalk.hex("#1b970bff")(method);
		case "POST":
			return chalk.hex("#d1b921ff")(method);
		case "PUT":
			return chalk.hex("#082fb2ff")(method);
		case "PATCH":
			return chalk.hex("#5b3be9ff")(method);
		case "DELETE":
			return chalk.hex("#e51818ff")(method);
		default:
			return chalk.gray(method);
	}
};
